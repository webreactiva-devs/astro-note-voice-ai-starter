# Transcripción de Audio Local

Esta documentación describe cómo usar el script de transcripción de audio local que utiliza la misma lógica de transcripción que la aplicación web.

## Configuración Inicial

### 1. Variables de Entorno

Necesitas configurar tu API key de Groq:

```bash
# Opción 1: Variable de entorno temporal
export GROQ_API_KEY="tu-api-key-de-groq"

# Opción 2: Agregar al archivo .env
echo "GROQ_API_KEY=tu-api-key-de-groq" >> .env
```

### 2. Obtener API Key de Groq

1. Visita [console.groq.com](https://console.groq.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el panel lateral
4. Crea una nueva API key
5. Copia la key y configúrala como se muestra arriba

## Uso del Script

### Comandos Básicos

```bash
# Usando npm script (recomendado)
npm run transcribe ./path/to/audio.wav

# Usando node directamente
node scripts/transcribe-audio.js ./path/to/audio.wav

# Ver ayuda completa
npm run transcribe:help
```

### Opciones Disponibles

| Opción | Alias | Descripción | Valor por defecto |
|--------|-------|-------------|-------------------|
| `--verbose` | `-v` | Información detallada del proceso | `false` |
| `--language` | `-l` | Idioma del audio | `es` (español) |
| `--model` | `-m` | Modelo de Whisper | `whisper-large-v3` |
| `--format` | `-f` | Formato de respuesta | `json` |
| `--output` | `-o` | Archivo de salida | No guardar |
| `--help` | `-h` | Mostrar ayuda | |

### Ejemplos de Uso

```bash
# Transcripción básica
npm run transcribe ./examples/audio.wav

# Con información detallada
npm run transcribe ./examples/audio.mp3 -- --verbose

# Especificar idioma inglés
npm run transcribe ./examples/english-audio.wav -- --language en

# Guardar transcripción en archivo
npm run transcribe ./examples/meeting.webm -- --output ./transcriptions/meeting.txt

# Transcripción completa con todas las opciones
npm run transcribe ./examples/interview.m4a -- \
  --verbose \
  --language en \
  --model whisper-large-v3 \
  --format verbose_json \
  --output ./transcriptions/interview.json
```

## Formatos de Audio Soportados

| Extensión | Tipo MIME | Descripción |
|-----------|-----------|-------------|
| `.webm` | `audio/webm` | Formato web moderno (recomendado) |
| `.wav` | `audio/wav` | Sin compresión, alta calidad |
| `.mp3` | `audio/mp3` | Comprimido, ampliamente compatible |
| `.mpeg` | `audio/mpeg` | Formato MPEG audio |
| `.mp4` | `audio/mp4` | Contenedor MP4 con audio |
| `.m4a` | `audio/m4a` | Formato de Apple |
| `.ogg` | `audio/ogg` | Formato libre de patentes |
| `.flac` | `audio/flac` | Sin pérdida, alta calidad |

## Limitaciones

- **Tamaño máximo**: 10MB por archivo
- **Solo audio**: No se procesan archivos de video
- **Conexión requerida**: Necesita internet para la API de Groq
- **Rate limits**: Sujeto a los límites de la API de Groq

## Códigos de Idioma Soportados

| Código | Idioma | Código | Idioma |
|--------|--------|--------|--------|
| `es` | Español | `en` | Inglés |
| `fr` | Francés | `de` | Alemán |
| `it` | Italiano | `pt` | Portugués |
| `ru` | Ruso | `ja` | Japonés |
| `ko` | Coreano | `zh` | Chino |
| `ar` | Árabe | `hi` | Hindi |

## Formatos de Salida

### Texto Plano (`.txt`)
```
Esta es la transcripción del audio...
```

### JSON Completo (`.json`)
```json
{
  "audioFile": "/path/to/audio.wav",
  "transcription": "Esta es la transcripción del audio...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "generatedBy": "Astro Voice AI Transcription Script"
}
```

## Solución de Problemas

### Error: "GROQ_API_KEY no configurada"
- Verifica que la variable de entorno esté configurada
- Si usas `.env`, asegúrate de que esté en la raíz del proyecto

### Error: "Archivo no encontrado"
- Verifica que la ruta del archivo sea correcta
- Usa rutas absolutas o relativas desde la raíz del proyecto

### Error: "Extensión de archivo no soportada"
- Verifica que el archivo tenga una extensión válida
- Convierte el archivo a un formato soportado

### Error: "Archivo demasiado grande"
- Reduce el tamaño del archivo a menos de 10MB
- Comprime el audio o reduce la calidad

### Error de API de Groq
- Verifica tu API key
- Comprueba tu conexión a internet
- Verifica que no hayas excedido los límites de rate

## Rendimiento

### Factores que Afectan la Velocidad
- **Tamaño del archivo**: Archivos más grandes tardan más
- **Calidad del audio**: Audio con ruido puede ser más lento
- **Conexión a internet**: Velocidad de subida afecta el proceso
- **Carga de la API**: Los servidores de Groq pueden variar en velocidad

### Optimización
- Usa archivos comprimidos (MP3, M4A) para velocidad
- Usa archivos sin comprimir (WAV, FLAC) para precisión
- Procesa archivos en lotes durante horas de menor carga

## Integración con la Aplicación

El script usa exactamente la misma lógica que la aplicación web:

- **Validación**: Mismo sistema de validación de archivos
- **API**: Mismas llamadas a la API de Groq
- **Manejo de errores**: Misma lógica de manejo de errores
- **Formatos**: Mismos formatos de audio soportados

Esto garantiza consistencia entre el script de línea de comandos y la aplicación web.

## Ejemplos de Casos de Uso

### 1. Transcripción de Reuniones
```bash
npm run transcribe ./meetings/daily-standup-2024-01-15.webm -- \
  --verbose \
  --output ./transcriptions/daily-standup-2024-01-15.txt
```

### 2. Procesamiento de Entrevistas
```bash
npm run transcribe ./interviews/user-research-session-01.mp3 -- \
  --language en \
  --format verbose_json \
  --output ./transcriptions/user-research-session-01.json
```

### 3. Notas de Voz Personales
```bash
npm run transcribe ./voice-notes/ideas-producto-2024.m4a -- \
  --output ./notes/ideas-producto-2024.md
```

### 4. Contenido de Podcast
```bash
npm run transcribe ./podcast/episode-15-segment.wav -- \
  --verbose \
  --language es \
  --output ./transcriptions/episode-15-segment.txt
```
