# Plan de proyecto: Aplicación de notas de voz con IA

## Estado del Proyecto 📊

**Progreso General: ~75% Completado**

- ✅ **Setup Inicial**: 100% - Proyecto configurado con stack completo
- ✅ **Autenticación**: 100% - Better-Auth integrado y funcional  
- ✅ **Pantalla de Grabación**: 100% - Componentes React con visualizer
- ✅ **Transcripción**: 100% - API + servicio + CLI tool completados
- ✅ **Testing**: 95% - 51 tests con 80%+ coverage implementados
- ✅ **Base de Datos**: 80% - Turso integrado, falta tabla notes
- 🚧 **Edición/Guardado**: 25% - Modal editable listo, falta API de notas
- 🚧 **Dashboard**: 50% - Estructura básica, faltan filtros y búsqueda
- ❌ **API Completa**: 30% - Transcribe listo, falta CRUD de notas
- ❌ **Deployment**: 0% - Pendiente configuración de producción

**Funcionalidades Core Completadas:**
- Grabación de audio con límite de 2 minutos ✅
- Transcripción automática con Groq API ✅  
- Autenticación y protección de rutas ✅
- Testing completo de funcionalidades implementadas ✅
- Herramientas CLI para desarrollo ✅

**Próximos Hitos:**
1. Completar API de notas con generación de metadatos
2. Implementar dashboard con filtros y búsqueda
3. Finalizar testing end-to-end
4. Configurar deployment a producción

## Objetivo

Esta aplicación web permite a usuarios grabar notas de voz, transcribirlas automáticamente mediante IA, editarlas y almacenarlas con título y tags generados también por IA. Resuelve la necesidad de capturar ideas por voz de forma estructurada y consultable. La solución se basa en una SPA construida con Astro y TypeScript. Utiliza la API de Groq para transcripción y generación de metadatos, y almacena los datos en SQLite (Turso). El diseño se apoya en Tailwind CSS y componentes Shadcn/ui, con autenticación vía Better-Auth.

## Todo items

### 1. Setup inicial
- [x] Inicializar proyecto con Astro y TypeScript
- [x] Configurar Tailwind CSS
- [x] Integrar shadcn/ui para los componentes
- [x] Configurar entorno local y de desarrollo con SQLite (Turso)
- [x] Añadir variables de entorno para claves de API (Groq, Turso, auth)

### 2. Autenticación
- [x] Instalar e integrar Better-Auth (o equivalente)
- [x] Configurar autenticación por email
- [x] Proteger rutas privadas (grabación, dashboard, API)

### 3. Pantalla de grabación
- [x] Crear página de grabación accesible tras login
- [x] Implementar botón de grabar, pausar y parar
- [x] Implementar contador de 2 minutos en cuenta atrás
- [x] Mostrar visualizador de onda en tiempo real
- [x] Almacenar audio en memoria temporalmente

### 3.1. Testing de Grabación
- [x] Crear tests unitarios para componente TimerDisplay (8 tests, 100% coverage)
- [x] Crear tests unitarios para componente VoiceRecorder (8 tests)
- [x] Implementar mocks para APIs del navegador (MediaRecorder, getUserMedia)
- [x] Verificar funcionalidad de grabación y manejo de errores

### 4. Transcripción
- [x] Permitir reproducción y descarga del audio grabado
- [x] Crear endpoint POST `/api/transcribe`
  - [x] Recibir FormData con audio
  - [x] Enviar audio a Groq y devolver texto
- [x] Mostrar estado de carga durante la transcripción
- [x] Mostrar resultado en modal editable
- [x] Crear servicio de transcripción reutilizable en `src/lib/transcription.ts`
- [x] Implementar validación completa de archivos de audio
- [x] Crear script CLI para transcripción de archivos locales

### 4.1. Testing de Transcripción
- [x] Configurar stack de testing (Vitest + Testing Library + MSW)
- [x] Crear tests unitarios para servicio de transcripción (13 tests, 91.42% coverage)
- [x] Crear tests de integración para API route `/api/transcribe` (9 tests)
- [x] Implementar mocks de Groq API con MSW
- [x] Verificar cobertura >= 80% en funcionalidad de transcripción

### 5. Edición y guardado de nota
- [x] Habilitar edición del texto transcrito en modal
- [ ] Crear endpoint POST `/api/notes`
  - [ ] Enviar texto final a Groq para título y tags
  - [ ] Guardar nota en la tabla `notes`
- [ ] Mostrar feedback visual al usuario

### 6. Dashboard de notas
- [x] Crear página de dashboard con listado de notas del usuario
- [ ] Ordenar notas por fecha descendente
- [ ] Implementar buscador por título
- [ ] Implementar filtro por fecha
- [ ] Implementar filtro por tag

### 7. API
- [ ] Crear endpoint GET `/api/notes`
  - [ ] Soportar parámetros `?q=`, `?tag=`
  - [ ] Devolver notas del usuario autenticado
- [x] Validar acceso autenticado en todos los endpoints

### 8. Base de datos
- [x] Crear tabla `notes` con los campos especificados
- [x] Integrar con Turso y conectar desde Astro API
- [x] Crear endpoint GET `/api/db-health` para verificar conectividad
- [ ] Añadir migraciones si se usan herramientas auxiliares

### 8.1. Testing de Base de Datos
- [x] Crear tests de integración para endpoint `/api/db-health` (5 tests)
- [x] Verificar conectividad y respuesta de base de datos
- [x] Implementar mocks para tests sin dependencia de DB real

### 9. Testing y feedback
- [x] Configurar entorno de testing completo (Vitest + Testing Library + MSW + jsdom)
- [x] Implementar tests unitarios para componentes React (TimerDisplay, VoiceRecorder)
- [x] Implementar tests de servicios y utilidades (transcription, utils)
- [x] Implementar tests de integración para API routes
- [x] Configurar coverage reporting con objetivo del 80%
- [x] Crear 51 tests total con cobertura >= 80% en funcionalidades core
- [ ] Verificar flujo completo: grabación > transcripción > edición > guardado
- [ ] Probar límites de grabación y flujos de error
- [ ] Asegurar experiencia fluida con indicadores de estado
- [x] Validar que no se guarda el audio en ningún punto del servidor

### 10. Deployment
- [ ] Configurar build para entorno de producción
- [ ] Asegurar persistencia en Turso para entorno productivo
- [ ] Asegurar que las claves de API están seguras
- [ ] Hacer pruebas end-to-end en producción

### 11. Herramientas de Desarrollo
- [x] Crear script de transcripción local (`scripts/transcribe-audio.js`)
- [x] Configurar comandos npm para testing y transcripción
- [x] Documentar stack de testing y patrones de desarrollo
- [x] Crear documentación completa en `documents/local-transcription.md`
- [x] Implementar CLI con opciones avanzadas (idioma, modelo, output)

### 11.1. Testing de Herramientas
- [x] Validar funcionamiento del script de transcripción CLI
- [x] Verificar manejo de argumentos y opciones
- [x] Probar validación de archivos y formatos soportados
- [x] Confirmar integración con la misma lógica de la aplicación web

## Preguntas clave a responder

- ✅ **¿Cómo se puede limitar correctamente el tiempo de grabación y detenerla automáticamente al llegar a los 2 minutos?**
  *Respuesta: Implementado con `setInterval` y `clearInterval`, auto-stop en `timeLeft <= 1`*

- ✅ **¿La autenticación Better-Auth permite roles o claims necesarios para asociar notas a usuarios?**
  *Respuesta: Sí, Better-Auth provee `session.user.id` para asociar notas a usuarios*

- ✅ **¿Groq tiene límite de tamaño o formato específico en archivos de audio recibidos?**
  *Respuesta: Soporta múltiples formatos (WebM, WAV, MP3, etc.), límite 10MB implementado*

- ✅ **¿Qué fallback hay si la API de Groq no responde o devuelve un error inesperado?**
  *Respuesta: Manejo completo de errores con try/catch y mensajes informativos al usuario*

- ✅ **¿Cómo asegurar que el endpoint de transcripción no guarde el audio y que se procese solo en memoria?**
  *Respuesta: Audio se procesa directamente desde FormData a Groq API, sin almacenamiento en servidor*

- ✅ **¿Cómo implementar un sistema de testing robusto que garantice calidad del código?**
  *Respuesta: Stack completo con Vitest + Testing Library + MSW, 51 tests con 80%+ coverage, TDD obligatorio*

- ✅ **¿Es posible reutilizar la lógica de transcripción fuera de la aplicación web?**
  *Respuesta: Sí, servicio extraído a `src/lib/transcription.ts` + script CLI funcional para uso local*

- [ ] ¿Es necesario normalizar los tags para facilitar el filtrado posterior?
- [ ] ¿Cómo manejar el almacenamiento de notas si se superan los límites del plan gratuito de Turso?
