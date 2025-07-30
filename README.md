# 🎙️ Astro Note Voice AI Starter

**Astro Note Voice AI Starter** es un template completo para crear aplicaciones modernas de notas con inteligencia artificial y reconocimiento de voz. Este proyecto utiliza **Astro**, **React**, **Better Auth**, **Turso** y **shadcn/ui** como base tecnológica.

Este starter es lo que aprendemos a crear en el **reto Estrategas de la IA** en la comunidad de suscriptores de **[Web Reactiva](https://webreactiva.com)**, donde exploramos cómo integrar tecnologías modernas para construir aplicaciones web potentes y escalables.

> Tienes la versión sin autenticación en la rama ["start-without-auth"](https://github.com/webreactiva-devs/astro-note-voice-ai-starter/tree/start-without-auth)

> 💡 **Nota sobre los commits**: En el historial del proyecto verás commits marcados como `(manual)` para código escrito por humanos y `(AI {model})` para código generado por inteligencia artificial, lo que te permite aprender de ambos enfoques. [Ver commits en el repositorio remoto](https://github.com/webreactiva-devs/astro-note-voice-ai-starter/commits/main/)

## ✨ Características

- 🔐 **Sistema de autenticación completo** con Better Auth
- 📝 **Interface moderna** con shadcn/ui y Tailwind CSS
- 🗄️ **Base de datos Turso/LibSQL** para almacenamiento
- 🎨 **Componentes reutilizables** con TypeScript
- 🔄 **Middleware de sesiones** integrado
- 📱 **Diseño responsivo** y accesible
- 🚀 **Rendimiento optimizado** con Astro
- 🧪 **Testing completo** con Vitest, Testing Library y MSW
- 📊 **Cobertura de tests** del 80%+ en todas las funcionalidades
- 🎤 **Transcripción de audio** con Groq API y Whisper

## 🗺️ Roadmap del Proyecto

### ✅ **Completado**

- **🔐 Autenticación**: Sistema completo con Better Auth (registro, login, sesiones)
- **🎨 UI/UX**: Interface moderna con shadcn/ui y Tailwind CSS responsivo
- **🎤 Grabación de Audio**: Componentes React con visualizador de ondas y timer
- **🔊 Transcripción**: API completa con Groq/Whisper + servicio reutilizable
- **🧪 Testing**: 51 tests con 80%+ cobertura (Vitest + Testing Library + MSW)
- **🛠️ Herramientas**: Script CLI para transcripción local de archivos
- **📚 Documentación**: Guías completas de desarrollo y testing

### 🚧 **En Desarrollo**

- **💾 Gestión de Notas**: CRUD completo con metadatos generados por IA
- **📊 Dashboard Avanzado**: Filtros por fecha, tags y búsqueda inteligente
- **🏷️ Sistema de Tags**: Generación automática y normalización

### 📋 **Planificado**

- **🔍 Búsqueda Avanzada**: Filtros combinados y búsqueda semántica
- **📱 PWA**: Funcionalidades de aplicación nativa
- **🌐 Deployment**: Configuración para producción y CI/CD
- **⚡ Optimizaciones**: Performance y experiencia de usuario

> 📖 **Plan detallado**: Ver [`documents/project-plan.md`](./documents/project-plan.md) para información completa de cada funcionalidad, incluyendo tasks específicas, tests implementados y preguntas técnicas resueltas.

### 📊 **Estado Actual**

```
Progreso General: ████████████████████████░░░░ 75%

✅ Funcionalidades Core Implementadas:
   • Autenticación con Better Auth
   • Grabación de audio (2 min límite)
   • Transcripción con Groq API
   • Testing robusto (51 tests)
   • Herramientas CLI

🧪 Coverage de Tests: 80%+ en módulos core
🔧 Comandos disponibles: 12 scripts npm
📁 Estructura: 6 test suites, 51 tests total
```

## 🛠️ Stack Tecnológico

- **Runtime**: [Node.js](https://nodejs.org/) - v18.20.8, v20.3.0, v22.0.0 o superior *(v19 y v21 no son compatibles)*
- **Framework**: [Astro](https://astro.build/) - Generador de sitios web moderno
- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Autenticación**: [Better Auth](https://better-auth.com/) - Autenticación moderna para aplicaciones web
- **Base de datos**: [Turso](https://turso.tech/) - Base de datos SQLite distribuida
- **Query Builder**: [Kysely](https://kysely.dev/) - Constructor de consultas SQL type-safe
- **Testing**: [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) + [MSW](https://mswjs.io/)
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/) - Biblioteca de toast notifications

## 🚀 Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/webreactiva-devs/astro-note-voice-ai-starter.git
cd astro-note-voice-ai-starter
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos Turso

1. **Crear cuenta en [Turso](https://turso.tech)**
2. **Crear una nueva base de datos**:
   ```bash
   turso db create tu-proyecto-notes
   ```
3. **Obtener la URL de conexión**:
   ```bash
   turso db show tu-proyecto-notes
   ```
4. **Crear token de autenticación**:
   ```bash
   turso db tokens create tu-proyecto-notes
   ```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=tu-clave-secreta-aqui
BETTER_AUTH_URL=http://localhost:4321
PUBLIC_BETTER_AUTH_URL=http://localhost:4321

# Turso Database Configuration
TURSO_DATABASE_URL=libsql://tu-database-url.turso.io
TURSO_AUTH_TOKEN=tu-token-de-turso
```

**💡 Generar clave secreta segura:**
```bash
npx @better-auth/cli@latest secret
```

### 5. Configurar esquema de base de datos

```bash
# Generar y aplicar migraciones
npx @better-auth/cli@latest migrate
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

🎉 **¡Listo!** La aplicación estará disponible en `http://localhost:4321`

## 📁 Estructura del Proyecto

```
📦 astro-note-voice-ai-starter/
├── 📂 src/
│   ├── 📂 components/           # Componentes React
│   │   ├── 📂 ui/              # Componentes shadcn/ui
│   │   ├── 📄 LoginForm.tsx    # Formulario de login
│   │   ├── 📄 RegisterForm.tsx # Formulario de registro
│   │   └── 📄 DashboardContent.tsx # Dashboard del usuario
│   ├── 📂 layouts/
│   │   └── 📄 main.astro       # Layout principal
│   ├── 📂 lib/
│   │   ├── 📄 auth.ts          # Configuración Better Auth (servidor)
│   │   ├── 📄 auth-client.ts   # Cliente Better Auth (frontend)
│   │   ├── 📄 turso.ts         # Configuración Turso
│   │   └── 📄 utils.ts         # Utilidades
│   ├── 📂 pages/
│   │   ├── 📂 api/auth/
│   │   │   └── 📄 [...all].ts  # API routes Better Auth
│   │   ├── 📄 index.astro      # Página principal
│   │   ├── 📄 login.astro      # Página de login
│   │   ├── 📄 register.astro   # Página de registro
│   │   ├── 📄 dashboard.astro  # Dashboard protegido
│   │   └── 📄 logout.astro     # Logout
│   ├── 📂 styles/
│   │   └── 📄 global.css       # Estilos globales
│   ├── 📄 middleware.ts        # Middleware de sesiones
│   └── 📄 env.d.ts            # Tipos TypeScript
├── 📄 astro.config.mjs         # Configuración Astro
├── 📄 tailwind.config.js       # Configuración Tailwind
├── 📄 components.json          # Configuración shadcn/ui
└── 📄 package.json
```

## 🌐 Rutas Disponibles

| Ruta         | Descripción                     | Acceso                 |
| ------------ | ------------------------------- | ---------------------- |
| `/`          | Página principal con navegación | 🌍 Público              |
| `/login`     | Iniciar sesión                  | 🔐 Solo no autenticados |
| `/register`  | Crear cuenta nueva              | 🔐 Solo no autenticados |
| `/dashboard` | Panel del usuario               | 🔒 Solo autenticados    |
| `/logout`    | Cerrar sesión                   | 🔒 Solo autenticados    |

## 🔐 Sistema de Autenticación

### Funcionalidades

- ✅ **Registro** con email, contraseña y nombre
- ✅ **Login** con email y contraseña
- ✅ **Auto-login** después del registro
- ✅ **Logout** con limpieza de sesión
- ✅ **Protección de rutas** automática
- ✅ **Middleware de sesiones** transparente

### Uso Programático

```tsx
import { authClient } from "../lib/auth-client";

// Registrar usuario
await authClient.signUp.email({
  email: "usuario@ejemplo.com",
  password: "miPassword123",
  name: "Mi Nombre"
});

// Iniciar sesión
await authClient.signIn.email({
  email: "usuario@ejemplo.com",
  password: "miPassword123"
});

// Obtener sesión actual
const { data: session } = authClient.useSession();

// Cerrar sesión
await authClient.signOut();
```

### Proteger Rutas en Astro

```astro
---
// En cualquier página .astro
const user = Astro.locals.user;

if (!user) {
  return Astro.redirect("/login");
}
---
```

## 🧪 Testing

### Stack de Testing

El proyecto utiliza un stack de testing moderno y completo:

- **[Vitest](https://vitest.dev/)**: Test runner rápido y nativo de Vite
- **[@testing-library/react](https://testing-library.com/)**: Utilities para testing de componentes React
- **[MSW (Mock Service Worker)](https://mswjs.io/)**: Mocking de APIs para tests de integración
- **[jsdom](https://github.com/jsdom/jsdom)**: Entorno DOM para simulación de navegador

### Comandos de Testing

```bash
# Desarrollo con tests
npm test                # Ejecutar tests en modo watch
npm run test:run        # Ejecutar todos los tests una vez
npm run test:ui         # Interface gráfica de Vitest
npm run test:coverage   # Generar reporte de cobertura
```

### Estructura de Tests

```
tests/
├── setup.ts                    # Configuración global de tests
├── mocks/
│   ├── handlers.ts             # Handlers de MSW para APIs
│   └── server.ts              # Servidor MSW
├── unit/                      # Tests unitarios
│   ├── components/            # Tests de componentes React
│   └── lib/                   # Tests de servicios y utilidades
└── integration/               # Tests de integración
    └── api/                   # Tests de API routes
```

### Ejemplos de Tests

#### Test de Componente React

```tsx
// tests/unit/components/TimerDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimerDisplay } from '@/components/TimerDisplay';

describe('TimerDisplay', () => {
  it('displays formatted time correctly', () => {
    render(<TimerDisplay seconds={75} />);
    expect(screen.getByText('01:15')).toBeInTheDocument();
  });

  it('shows recording indicator when recording', () => {
    render(<TimerDisplay seconds={30} isRecording={true} />);
    expect(screen.getByTestId('recording-indicator')).toBeInTheDocument();
  });
});
```

#### Test de Servicio/Librería

```typescript
// tests/unit/lib/transcription.test.ts
import { describe, it, expect, vi } from 'vitest';
import { transcribeAudio, validateAudioFile } from '@/lib/transcription';

describe('Transcription Service', () => {
  describe('validateAudioFile', () => {
    it('accepts valid audio file', () => {
      const file = new File([''], 'test.webm', { type: 'audio/webm' });
      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
    });

    it('rejects files that are too large', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.wav', 
        { type: 'audio/wav' });
      const result = validateAudioFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('demasiado grande');
    });
  });
});
```

#### Test de API Route (Integración)

```typescript
// tests/integration/api/transcribe.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { server } from '../../mocks/server';

describe('/api/transcribe', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('transcribes audio file successfully', async () => {
    const formData = new FormData();
    const audioFile = new File(['fake audio'], 'test.webm', 
      { type: 'audio/webm' });
    formData.append('audio', audioFile);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.transcription).toBeDefined();
  });
});
```

### Cobertura de Tests

El proyecto mantiene un **mínimo del 80% de cobertura** en todas las funcionalidades:

```bash
# Verificar cobertura actual
npm run test:coverage

# Ejemplo de output esperado:
# ✓ Statements: 85.2% (145/170)
# ✓ Branches: 82.1% (23/28)  
# ✓ Functions: 88.9% (16/18)
# ✓ Lines: 84.7% (138/163)
```

### Test-Driven Development (TDD)

**Cada nueva funcionalidad sigue el ciclo TDD:**

1. 🔴 **Red**: Escribir test que falle
2. 🟢 **Green**: Implementar código mínimo
3. 🔄 **Refactor**: Mejorar manteniendo tests verdes
4. 📊 **Coverage**: Verificar >= 80% cobertura

### Debugging Tests

```bash
# Ejecutar test específico
npm test -- TimerDisplay.test.tsx

# Modo debug con breakpoints
npm test -- --inspect-brk

# Ver output detallado
npm test -- --reporter=verbose
```

## 🎨 Personalización

### Añadir Nuevos Componentes shadcn/ui

```bash
npx shadcn@latest add [componente]
```

### Modificar Tema

Edita `src/styles/global.css` para personalizar colores y variables CSS.

### Añadir Proveedores Sociales

En `src/lib/auth.ts`:

```ts
export const auth = betterAuth({
  // ... configuración existente
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  }
});
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Construcción
npm run build           # Build para producción
npm run preview         # Preview del build

# Base de datos
npx @better-auth/cli generate    # Generar esquema
npx @better-auth/cli migrate     # Aplicar migraciones

# Testing
npm test                # Ejecutar tests en modo watch
npm run test:run        # Ejecutar todos los tests una vez
npm run test:coverage   # Ejecutar tests con coverage

# Transcripción de Audio
npm run transcribe <archivo>     # Transcribir archivo de audio local
npm run transcribe:help          # Ver ayuda de transcripción
npm run test:transcription       # Script de prueba de transcripción

# Utilidades
npx @better-auth/cli secret      # Generar clave secreta
npx shadcn@latest add [comp]     # Añadir componente UI
```

## 🎤 Transcripción de Audio Local

El proyecto incluye un script completo para transcribir archivos de audio locales usando la misma lógica que la aplicación web.

### Configuración Rápida

1. **Configurar API Key de Groq**:
   ```bash
   export GROQ_API_KEY="tu-api-key-de-groq"
   ```

2. **Transcribir un archivo**:
   ```bash
   npm run transcribe ./path/to/audio.wav
   ```

### Ejemplos de Uso

```bash
# Transcripción básica
npm run transcribe ./examples/audio.wav

# Con información detallada
npm run transcribe ./examples/audio.mp3 -- --verbose

# Especificar idioma y guardar resultado
npm run transcribe ./examples/meeting.webm -- \
  --language en \
  --output ./transcriptions/meeting.txt

# Ver todas las opciones disponibles
npm run transcribe:help
```

### Formatos Soportados
- WebM, WAV, MP3, MPEG, MP4, M4A, OGG, FLAC
- Tamaño máximo: 10MB por archivo

📖 **Documentación completa**: Ver [`documents/local-transcription.md`](./documents/local-transcription.md)

## 🔧 Solución de Problemas

### ❌ Error: "Cannot find module"

**Solución**: Verificar que todas las dependencias estén instaladas:
```bash
npm install
```

### ❌ Error: "Database connection failed"

**Solución**: Verificar variables de entorno en `.env`:
```bash
# Verificar que TURSO_DATABASE_URL y TURSO_AUTH_TOKEN estén correctos
```

### ❌ Error: "Headers not available"

**Solución**: Asegurar que Astro esté en modo servidor:
```js
// astro.config.mjs
export default defineConfig({
  output: 'server', // ← Importante
  // ...
});
```

### ❌ Error: "Schema not found"

**Solución**: Ejecutar migraciones:
```bash
npx @better-auth/cli@latest migrate
```

## 🚀 Despliegue

### Preparar para Producción

1. **Instalar adaptador** (ejemplo para Vercel):
   ```bash
   npx astro add vercel
   ```

2. **Configurar variables de entorno** en tu plataforma de despliegue

3. **Actualizar URLs** en `.env`:
   ```bash
   BETTER_AUTH_URL=https://tu-dominio.com
   PUBLIC_BETTER_AUTH_URL=https://tu-dominio.com
   ```

4. **Build y desplegar**:
   ```bash
   npm run build
   ```

## 📚 Recursos Adicionales

- [📖 Documentación de Astro](https://docs.astro.build)
- [🔐 Better Auth Docs](https://better-auth.com)
- [🎨 shadcn/ui Components](https://ui.shadcn.com)
- [🗄️ Turso Documentation](https://docs.turso.tech)
- [⚡ Kysely Query Builder](https://kysely.dev)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**🎯 ¡Proyecto listo para desarrollar!** Si tienes alguna pregunta o problema, no dudes en abrir un issue.
