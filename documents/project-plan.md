# Plan de proyecto: Aplicación de notas de voz con IA

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

### 4. Transcripción
- [x] Permitir reproducción y descarga del audio grabado
- [x] Crear endpoint POST `/api/transcribe`
  - [x] Recibir FormData con audio
  - [x] Enviar audio a Groq y devolver texto
- [x] Mostrar estado de carga durante la transcripción
- [x] Mostrar resultado en modal editable

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
- [ ] Crear tabla `notes` con los campos especificados
- [x] Integrar con Turso y conectar desde Astro API
- [ ] Añadir migraciones si se usan herramientas auxiliares

### 9. Testing y feedback
- [ ] Verificar flujo completo: grabación > transcripción > edición > guardado
- [ ] Probar límites de grabación y flujos de error
- [ ] Asegurar experiencia fluida con indicadores de estado
- [ ] Validar que no se guarda el audio en ningún punto del servidor

### 10. Deployment
- [ ] Configurar build para entorno de producción
- [ ] Asegurar persistencia en Turso para entorno productivo
- [ ] Asegurar que las claves de API están seguras
- [ ] Hacer pruebas end-to-end en producción

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

- [ ] ¿Es necesario normalizar los tags para facilitar el filtrado posterior?
- [ ] ¿Cómo manejar el almacenamiento de notas si se superan los límites del plan gratuito de Turso?
