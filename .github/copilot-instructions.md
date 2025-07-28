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

## Flujos de Desarrollo Críticos

### Desarrollo Local
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```

### Estructura Esperada de Features
1. **Autenticación**: Better-Auth integration (pendiente)
2. **Grabación**: Componentes React para audio recording con visualizer
3. **Transcripción**: API route que conecta con Groq
4. **Dashboard**: Listado de notas con filtros y búsqueda

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
- Especificaciones completas: `documents/project-specs.md`
- Plan de desarrollo: `documents/project-plan.md`
- Configuración Astro: `astro.config.mjs` (React + Tailwind Vite plugin)
