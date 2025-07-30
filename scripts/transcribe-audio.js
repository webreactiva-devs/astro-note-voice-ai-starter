#!/usr/bin/env node

/**
 * Script de Transcripción de Audio Local
 *
 * Este script permite transcribir archivos de audio locales usando
 * la misma lógica de transcripción que la aplicación web.
 *
 * Uso:
 *   node scripts/transcribe-audio.js <ruta-del-archivo> [opciones]
 *
 * Ejemplos:
 *   node scripts/transcribe-audio.js ./recordings/audio.webm
 *   node scripts/transcribe-audio.js ./audio.mp3 --verbose
 *   node scripts/transcribe-audio.js ./audio.wav --language en --model whisper-large-v3
 *
 * Opciones:
 *   --verbose, -v      Mostrar información detallada del proceso
 *   --language, -l     Idioma del audio (por defecto: es)
 *   --model, -m        Modelo de Whisper a usar (por defecto: whisper-large-v3)
 *   --format, -f       Formato de respuesta (json, text, verbose_json)
 *   --output, -o       Archivo de salida para guardar la transcripción
 *   --help, -h         Mostrar esta ayuda
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

// Re-implement transcription functions for the script
// (copying the logic from src/lib/transcription.ts to avoid TypeScript imports)

/**
 * Validate audio file according to the same rules as the app
 */
function validateAudioFile(file) {
  const validTypes = [
    "audio/webm",
    "audio/wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
    "audio/ogg",
    "audio/flac",
  ];

  // Check file type
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido. Tipos permitidos: ${validTypes.join(", ")}`,
    };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Archivo demasiado grande. Tamaño máximo: 10MB, tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Transcribe audio using Groq API
 */
async function transcribeAudio(file, apiKey, options = {}) {
  const {
    model = "whisper-large-v3",
    language = "es",
    responseFormat = "json",
  } = options;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);
    formData.append("language", language);
    formData.append("response_format", responseFormat);

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // If not JSON, use the text response
        errorMessage = errorText || errorMessage;
      }

      return {
        success: false,
        error: `Error de API de Groq: ${errorMessage}`,
      };
    }

    const result = await response.json();

    if (!result.text) {
      return {
        success: false,
        error: "La respuesta de la API no contiene transcripción",
      };
    }

    return {
      success: true,
      transcription: result.text.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: `Error de red: ${error.message}`,
    };
  }
}

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

/**
 * Log message with color
 */
function log(message, color = "") {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Show progress indicator
 */
function showProgress(message) {
  process.stdout.write(`${colors.yellow}⏳ ${message}...${colors.reset}`);
}

/**
 * Clear progress and show result
 */
function clearProgress(success = true) {
  process.stdout.write("\r\x1b[K"); // Clear line
  if (success) {
    process.stdout.write(`${colors.green}✅${colors.reset} `);
  } else {
    process.stdout.write(`${colors.red}❌${colors.reset} `);
  }
}

/**
 * Load audio file from local path
 */
async function loadAudioFile(filePath) {
  try {
    // Resolve absolute path
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Archivo no encontrado: ${absolutePath}`);
    }

    const stats = fs.statSync(absolutePath);

    if (!stats.isFile()) {
      throw new Error(`La ruta especificada no es un archivo: ${absolutePath}`);
    }

    const buffer = fs.readFileSync(absolutePath);

    // Determine MIME type based on file extension
    const ext = path.extname(absolutePath).toLowerCase();
    const mimeTypes = {
      ".webm": "audio/webm",
      ".wav": "audio/wav",
      ".mp3": "audio/mp3",
      ".mpeg": "audio/mpeg",
      ".mp4": "audio/mp4",
      ".m4a": "audio/m4a",
      ".ogg": "audio/ogg",
      ".flac": "audio/flac",
    };

    const mimeType = mimeTypes[ext];
    if (!mimeType) {
      throw new Error(
        `Extensión de archivo no soportada: ${ext}. Formatos válidos: ${Object.keys(mimeTypes).join(", ")}`
      );
    }

    const fileName = path.basename(absolutePath);

    return {
      file: new File([buffer], fileName, { type: mimeType }),
      path: absolutePath,
      size: stats.size,
      extension: ext,
      mimeType: mimeType,
    };
  } catch (error) {
    throw new Error(`Error cargando archivo: ${error.message}`);
  }
}

/**
 * Save transcription to file
 */
function saveTranscription(transcription, outputPath, audioPath) {
  try {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const content = {
      audioFile: audioPath,
      transcription: transcription,
      timestamp: new Date().toISOString(),
      generatedBy: "Astro Voice AI Transcription Script",
    };

    const ext = path.extname(outputPath).toLowerCase();

    if (ext === ".json") {
      fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), "utf8");
    } else {
      // Save as plain text
      fs.writeFileSync(outputPath, transcription, "utf8");
    }

    return outputPath;
  } catch (error) {
    throw new Error(`Error guardando transcripción: ${error.message}`);
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Main transcription function
 */
async function transcribeLocalAudio(filePath, options = {}) {
  const {
    verbose = false,
    language = "es",
    model = "whisper-large-v3",
    responseFormat = "json",
    outputFile = null,
  } = options;

  try {
    log(`\n${colors.bold}🎤 Transcriptor de Audio Local${colors.reset}`);
    log(
      `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
    );

    // Step 1: Load audio file
    showProgress("Cargando archivo de audio");
    const audioData = await loadAudioFile(filePath);
    clearProgress(true);
    log(`Archivo cargado: ${colors.cyan}${audioData.file.name}${colors.reset}`);

    if (verbose) {
      log(`${colors.dim}  Ruta: ${audioData.path}${colors.reset}`);
      log(
        `${colors.dim}  Tamaño: ${formatFileSize(audioData.size)}${colors.reset}`
      );
      log(`${colors.dim}  Tipo: ${audioData.mimeType}${colors.reset}`);
    }

    // Step 2: Validate file
    showProgress("Validando archivo");
    const validation = validateAudioFile(audioData.file);

    if (!validation.valid) {
      clearProgress(false);
      log(`Validación falló: ${colors.red}${validation.error}${colors.reset}`);
      return { success: false, error: validation.error };
    }

    clearProgress(true);
    log(`Archivo válido`);

    // Step 3: Check API key
    if (!GROQ_API_KEY) {
      log(`${colors.red}❌ Error: GROQ_API_KEY no configurada${colors.reset}`);
      log(`\n${colors.yellow}Configura tu API key de Groq:${colors.reset}`);
      log(`${colors.blue}export GROQ_API_KEY="tu-api-key-aqui"${colors.reset}`);
      log(`\n${colors.yellow}O crea un archivo .env con:${colors.reset}`);
      log(`${colors.blue}GROQ_API_KEY=tu-api-key-aqui${colors.reset}`);
      return { success: false, error: "API key no configurada" };
    }

    if (verbose) {
      log(
        `${colors.dim}  API Key: ${GROQ_API_KEY.substring(0, 8)}...${colors.reset}`
      );
      log(`${colors.dim}  Modelo: ${model}${colors.reset}`);
      log(`${colors.dim}  Idioma: ${language}${colors.reset}`);
    }

    // Step 4: Transcribe
    const startTime = Date.now();
    showProgress("Transcribiendo con Groq API");

    const result = await transcribeAudio(audioData.file, GROQ_API_KEY, {
      model: model,
      language: language,
      responseFormat: responseFormat,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (result.success) {
      clearProgress(true);
      log(
        `Transcripción completada en ${colors.magenta}${(duration / 1000).toFixed(2)}s${colors.reset}`
      );

      // Display result
      log(`\n${colors.bold}📝 TRANSCRIPCIÓN:${colors.reset}`);
      log(
        `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
      );
      log(`${colors.green}"${result.transcription}"${colors.reset}`);
      log(
        `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
      );

      // Save to file if requested
      if (outputFile) {
        showProgress("Guardando transcripción");
        try {
          const savedPath = saveTranscription(
            result.transcription,
            outputFile,
            audioData.path
          );
          clearProgress(true);
          log(
            `Transcripción guardada en: ${colors.cyan}${savedPath}${colors.reset}`
          );
        } catch (error) {
          clearProgress(false);
          log(
            `Error guardando archivo: ${colors.red}${error.message}${colors.reset}`
          );
        }
      }

      if (verbose) {
        log(`\n${colors.bold}📊 ESTADÍSTICAS:${colors.reset}`);
        log(`${colors.dim}  Archivo: ${audioData.file.name}${colors.reset}`);
        log(
          `${colors.dim}  Tamaño: ${formatFileSize(audioData.size)}${colors.reset}`
        );
        log(
          `${colors.dim}  Duración de proceso: ${(duration / 1000).toFixed(2)}s${colors.reset}`
        );
        log(
          `${colors.dim}  Caracteres transcritos: ${result.transcription.length}${colors.reset}`
        );
        log(
          `${colors.dim}  Palabras aproximadas: ${result.transcription.split(/\s+/).length}${colors.reset}`
        );
      }

      return {
        success: true,
        transcription: result.transcription,
        duration,
        stats: {
          fileSize: audioData.size,
          characters: result.transcription.length,
          words: result.transcription.split(/\s+/).length,
        },
      };
    } else {
      clearProgress(false);
      log(`Transcripción falló: ${colors.red}${result.error}${colors.reset}`);
      return { success: false, error: result.error, duration };
    }
  } catch (error) {
    if (process.stdout.isTTY) {
      clearProgress(false);
    }
    log(`${colors.red}💥 Error inesperado: ${error.message}${colors.reset}`);
    return { success: false, error: error.message, duration: 0 };
  }
}

/**
 * Parse command line arguments
 */
function parseArguments(args) {
  const options = {
    verbose: false,
    language: "es",
    model: "whisper-large-v3",
    responseFormat: "json",
    outputFile: null,
    help: false,
    filePath: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--language":
      case "-l":
        options.language = args[++i];
        break;
      case "--model":
      case "-m":
        options.model = args[++i];
        break;
      case "--format":
      case "-f":
        options.responseFormat = args[++i];
        break;
      case "--output":
      case "-o":
        options.outputFile = args[++i];
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        if (
          !arg.startsWith("--") &&
          !arg.startsWith("-") &&
          !options.filePath
        ) {
          options.filePath = arg;
        }
        break;
    }
  }

  return options;
}

/**
 * Show help information
 */
function showHelp() {
  log(
    `\n${colors.bold}🎤 Script de Transcripción de Audio Local${colors.reset}`
  );
  log(`\n${colors.bold}Uso:${colors.reset}`);
  log(`  node scripts/transcribe-audio.js <archivo-audio> [opciones]`);
  log(`\n${colors.bold}Ejemplos:${colors.reset}`);
  log(`  node scripts/transcribe-audio.js ./recordings/audio.webm`);
  log(`  node scripts/transcribe-audio.js ./audio.mp3 --verbose`);
  log(
    `  node scripts/transcribe-audio.js ./audio.wav --language en --output transcription.txt`
  );
  log(
    `  node scripts/transcribe-audio.js ./recording.m4a --model whisper-large-v3 --format verbose_json`
  );
  log(`\n${colors.bold}Opciones:${colors.reset}`);
  log(`  --verbose, -v          Mostrar información detallada del proceso`);
  log(`  --language, -l <lang>  Idioma del audio (por defecto: es)`);
  log(`                         Ejemplos: es, en, fr, de, it, pt, etc.`);
  log(
    `  --model, -m <model>    Modelo de Whisper a usar (por defecto: whisper-large-v3)`
  );
  log(`                         Opciones: whisper-large-v3, whisper-large-v2`);
  log(`  --format, -f <format>  Formato de respuesta (por defecto: json)`);
  log(`                         Opciones: json, text, verbose_json`);
  log(`  --output, -o <archivo> Archivo donde guardar la transcripción`);
  log(
    `                         (.txt para texto plano, .json para formato completo)`
  );
  log(`  --help, -h             Mostrar esta ayuda`);
  log(`\n${colors.bold}Formatos de audio soportados:${colors.reset}`);
  log(`  WebM, WAV, MP3, MPEG, MP4, M4A, OGG, FLAC`);
  log(`\n${colors.bold}Variables de entorno requeridas:${colors.reset}`);
  log(`  ${colors.yellow}GROQ_API_KEY${colors.reset}     Tu API key de Groq`);
  log(`\n${colors.bold}Configuración:${colors.reset}`);
  log(`  export GROQ_API_KEY="tu-api-key-de-groq"`);
  log(`  # O crear archivo .env con: GROQ_API_KEY=tu-api-key-de-groq`);
  log(`\n${colors.bold}Notas:${colors.reset}`);
  log(`  • Tamaño máximo de archivo: 10MB`);
  log(`  • El proceso puede tardar dependiendo del tamaño del audio`);
  log(`  • Asegúrate de tener conexión a internet para usar la API de Groq`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const options = parseArguments(args);

  if (options.help) {
    showHelp();
    return;
  }

  if (!options.filePath) {
    log(
      `${colors.red}❌ Error: Debes especificar un archivo de audio${colors.reset}`
    );
    log(
      `\n${colors.yellow}Uso:${colors.reset} node scripts/transcribe-audio.js <archivo-audio>`
    );
    log(
      `${colors.yellow}Ayuda:${colors.reset} node scripts/transcribe-audio.js --help`
    );
    process.exit(1);
  }

  const result = await transcribeLocalAudio(options.filePath, options);

  if (!result.success) {
    process.exit(1);
  }

  log(
    `\n${colors.bold}🎉 ¡Transcripción completada exitosamente!${colors.reset}`
  );
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    log(`${colors.red}💥 Error fatal: ${error.message}${colors.reset}`);
    if (error.stack && process.env.NODE_ENV === "development") {
      log(`${colors.dim}Stack trace: ${error.stack}${colors.reset}`);
    }
    process.exit(1);
  });
}
