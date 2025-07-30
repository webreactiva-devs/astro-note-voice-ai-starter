# Astro Note Voice AI - Copilot Instructions

## Arquitectura General

Este es un proyecto **Astro + TypeScript** que crea una aplicación de notas de voz con transcripción automática mediante IA. La app permite grabar audio (max 2 min), transcribirlo con Groq API, editarlo y almacenarlo con metadatos generados por IA.

**Stack principal:**

- **Astro 5** con React integration para componentes interactivos
- **TypeScript** configurado con paths alias (`@/*` → `./src/*`)
- **Tailwind CSS 4** + **shadcn/ui** para UI components
- **Turso (SQLite)** para base de datos
- **Groq API** para transcripción y generación de metadatos

## Patrones de Desarrollo Específicos

### Estado del Proyecto

**⚠️ IMPORTANTE:** Antes de cualquier desarrollo, consultar `documents/project-plan.md` para verificar qué funcionalidades están ✅ completadas y cuáles ❌ faltan por implementar.

### Estándares de Código

- **Comentarios**: Todos los comentarios en el código deben escribirse en **inglés**
- **Componentes**: Crear componentes **pequeños y manejables**, aplicando principio de responsabilidad única
- **Funciones**: Preferir funciones específicas sobre funciones monolíticas

### Estructura de Componentes

- **Componentes Astro**: `.astro` files en `src/components/` para elementos estáticos/server-side
- **Componentes React**: `.tsx` files en `src/components/ui/` para interactividad (ej: `badge.tsx`)
- Usa `@/` alias consistentemente: `import { Badge } from "@/components/ui/badge"`

### API Routes Pattern

- API endpoints en `src/pages/api/` siguiendo convención Astro
- Ejemplo: `src/pages/api/db-health.ts` exporta `GET: APIRoute`
- Siempre importar types: `import type { APIRoute } from "astro"`

### Base de Datos

- Cliente Turso configurado en `src/lib/turso.ts`
- Usa `import.meta.env` para variables de entorno: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Pattern: `await turso.execute("SELECT 1;")` para queries

### Configuración Shadcn/ui

- `components.json` configura aliases y paths
- Style: "new-york", sin RSC, con CSS variables
- Base CSS en `src/styles/global.css`
- Usa `cn()` utility de `@/lib/utils` para class merging

## Testing Strategy & Standards

### Stack de Testing

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast Vite-native test runner
- **Testing Library**: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - Component testing utilities
- **Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/) - API mocking for integration tests
- **Environment**: [jsdom](https://github.com/jsdom/jsdom) - DOM environment for browser simulation
- **Coverage**: Built-in Vitest coverage with v8 provider

### Estructura de Tests

```
tests/
├── setup.ts                    # Test setup global
├── mocks/
│   ├── handlers.ts             # MSW API handlers
│   └── server.ts              # MSW server setup
├── unit/                      # Tests unitarios
│   ├── components/
│   │   ├── TimerDisplay.test.tsx
│   │   └── VoiceRecorder.test.tsx
│   └── lib/
│       ├── transcription.test.ts
│       └── utils.test.ts
└── integration/               # Tests de integración
    └── api/
        ├── db-health.test.ts
        └── transcribe.test.ts
```

### Comandos de Testing

```bash
npm test                # Watch mode para desarrollo
npm run test:run        # Ejecutar todos los tests una vez
npm run test:ui         # Interface gráfica de Vitest
npm run test:coverage   # Generar reporte de cobertura
```

### Patrones de Testing

#### 1. Unit Tests - Componentes React

```typescript
// tests/unit/components/TimerDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimerDisplay } from '@/components/TimerDisplay';

describe('TimerDisplay', () => {
  it('displays formatted time correctly', () => {
    render(<TimerDisplay seconds={75} />);
    expect(screen.getByText('01:15')).toBeInTheDocument();
  });

  it('shows recording state indicator', () => {
    render(<TimerDisplay seconds={30} isRecording={true} />);
    expect(screen.getByTestId('recording-indicator')).toBeInTheDocument();
  });
});
```

#### 2. Unit Tests - Servicios/Librerías

```typescript
// tests/unit/lib/transcription.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { transcribeAudio, validateAudioFile } from "@/lib/transcription";

describe("Transcription Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe("validateAudioFile", () => {
    it("accepts valid audio file", () => {
      const file = new File([""], "test.webm", { type: "audio/webm" });
      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
    });

    it("rejects invalid file type", () => {
      const file = new File([""], "test.txt", { type: "text/plain" });
      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Tipo de archivo no válido");
    });
  });

  describe("transcribeAudio", () => {
    it("returns transcription on success", async () => {
      const mockResponse = { text: "Hello world" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const file = new File([""], "test.webm", { type: "audio/webm" });
      const result = await transcribeAudio(file, "fake-key");

      expect(result.success).toBe(true);
      expect(result.transcription).toBe("Hello world");
    });
  });
});
```

#### 3. Integration Tests - API Routes

```typescript
// tests/integration/api/transcribe.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "../../mocks/server";

describe("/api/transcribe", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("transcribes audio file successfully", async () => {
    const formData = new FormData();
    const audioFile = new File(["fake audio"], "test.webm", {
      type: "audio/webm",
    });
    formData.append("audio", audioFile);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.transcription).toBeDefined();
  });
});
```

#### 4. MSW API Mocking

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock Groq API
  http.post("https://api.groq.com/openai/v1/audio/transcriptions", () => {
    return HttpResponse.json({
      text: "This is a mocked transcription",
    });
  }),

  // Mock database health check
  http.get("/api/db-health", () => {
    return HttpResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  }),
];
```

### Requisitos de Coverage

**🎯 OBLIGATORIO: 80% de cobertura mínima en cada ciclo de desarrollo**

- **Unit Tests**: 90%+ coverage para funciones puras y servicios
- **Component Tests**: 85%+ coverage para componentes React
- **Integration Tests**: 75%+ coverage para API routes
- **Overall Project**: Mínimo 80% de cobertura global

### Test-Driven Development (TDD) Pattern

**Para cada feature nueva:**

1. **Red**: Escribir test que falle describiendo la funcionalidad deseada
2. **Green**: Implementar código mínimo para que el test pase
3. **Refactor**: Mejorar el código manteniendo los tests verdes
4. **Coverage**: Verificar que se alcance el 80% de cobertura antes del commit

```bash
# Verificar coverage antes de commit
npm run test:coverage
# Debe mostrar >= 80% en todas las métricas
```

### Debugging Tests

```bash
# Debug mode con breakpoints
npm test -- --inspect-brk

# Ejecutar test específico
npm test -- TimerDisplay.test.tsx

# Watch mode para un archivo específico
npm test -- transcription.test.ts --watch
```

## Flujos de Desarrollo Críticos

### Desarrollo Local

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm test             # Tests en modo watch
npm run test:coverage # Verificar cobertura
```

### Ciclo de Desarrollo con TDD (OBLIGATORIO)

**🎯 REGLA FUNDAMENTAL: Cada funcionalidad nueva DEBE tener >= 80% de cobertura de tests antes de considerarse completada.**

#### Para cada feature/paso del plan:

1. **📋 Planning**: Leer `documents/project-plan.md` y identificar el scope exacto
2. **🔴 Red Phase**: Escribir tests que fallen para la funcionalidad deseada
3. **🟢 Green Phase**: Implementar código mínimo para pasar los tests
4. **🔄 Refactor Phase**: Mejorar código manteniendo tests verdes
5. **📊 Coverage Check**: Verificar >= 80% cobertura con `npm run test:coverage`
6. **✅ Validation**: Todos los tests pasan + cobertura alcanzada = feature completa

#### Ejemplo de Flujo TDD:

```bash
# 1. Crear test que falle
echo "// TODO: implement transcription service" > src/lib/transcription.ts
npm test -- transcription.test.ts  # ❌ Debe fallar

# 2. Implementar funcionalidad mínima
# ... escribir código ...
npm test -- transcription.test.ts  # ✅ Debe pasar

# 3. Verificar cobertura
npm run test:coverage              # ✅ >= 80%

# 4. Solo entonces: commit y continuar
git add . && git commit -m "feat: add transcription service (80% coverage)"
```

### Estructura Esperada de Features

**Cada feature debe incluir:**

1. **Código fuente** (`src/`)
2. **Tests unitarios** (`tests/unit/`)
3. **Tests de integración** (`tests/integration/`) si aplica
4. **Mocks necesarios** (`tests/mocks/`) si usa APIs externas
5. **Documentación** actualizada

**Features del proyecto:**

1. **✅ Autenticación**: Better-Auth integration (completado con 85% coverage)
2. **✅ Transcripción**: API route + service (completado con 92% coverage)
3. **❌ Grabación**: Componentes React para audio recording con visualizer
4. **❌ Dashboard**: Listado de notas con filtros y búsqueda
5. **❌ Notas**: CRUD completo con metadatos de IA

### Variables de Entorno Requeridas

- `TURSO_DATABASE_URL`: URL de base de datos Turso
- `TURSO_AUTH_TOKEN`: Token de autenticación Turso
- Variables Groq API (pendiente configuración)

## Consideraciones Específicas del Proyecto

### Limitaciones Técnicas

- Grabaciones limitadas a **2 minutos máximo**
- Audio procesado **solo en memoria** (no persistir en servidor)
- Autenticación requerida para todas las funcionalidades principales

### Integración con IA

- Groq API para: transcripción audio → texto, generación de títulos/tags
- Pattern esperado: FormData con audio → endpoint → Groq → respuesta JSON

### Esquema de Base de Datos (Referencia)

- Tabla `notes`: texto transcrito, título, tags, user_id, timestamps
- Conexión vía `@libsql/client` configurada en `src/lib/turso.ts`

## Referencias de Documentación

**📋 DOCUMENTOS DE REFERENCIA PRINCIPALES:**

- **`documents/project-plan.md`**: Plan de desarrollo con TODO items marcados ✅/❌ - **REVISAR SIEMPRE** para saber qué está implementado y qué falta
- **`documents/project-specs.md`**: Especificaciones técnicas completas del proyecto - **CONSULTAR** para entender requisitos funcionales y no funcionales

### Otras Referencias

- Configuración Astro: `astro.config.mjs` (React + Tailwind Vite plugin)
- Arquitectura del proyecto: `documents/project-architecture.md`
