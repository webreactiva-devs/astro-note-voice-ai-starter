/**
 * Transcription service using Groq API
 *
 * This module provides transcription functionality for audio files using Groq's Whisper model.
 * It handles validation, API communication, and error handling separately from API routes.
 */

export interface TranscriptionResult {
  transcription: string;
  success: true;
}

export interface TranscriptionError {
  error: string;
  success: false;
}

export type TranscriptionResponse = TranscriptionResult | TranscriptionError;

export interface TranscriptionOptions {
  language?: string;
  model?: string;
  responseFormat?: string;
}

/**
 * Validates audio file before transcription
 */
export function validateAudioFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: "No se encontró archivo de audio" };
  }

  // Validate file type
  const supportedMimeTypes = [
    "audio/webm",
    "audio/ogg",
    "audio/wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
  ];

  if (
    !file.type.startsWith("audio/") &&
    !supportedMimeTypes.includes(file.type)
  ) {
    return {
      valid: false,
      error: `Tipo de archivo no soportado: ${file.type}. Formatos válidos: WebM, OGG, WAV, MP3, MP4, M4A`,
    };
  }

  // Max 10MB file size (reasonable for 2-minute audio)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo permitido: 10MB`,
    };
  }

  return { valid: true };
}

/**
 * Transcribes audio file using Groq API
 */
export async function transcribeAudio(
  audioFile: File,
  apiKey: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResponse> {
  try {
    // Validate input
    const validation = validateAudioFile(audioFile);
    if (!validation.valid) {
      return { error: validation.error!, success: false };
    }

    if (!apiKey) {
      return {
        error: "GROQ_API_KEY no configurada en variables de entorno",
        success: false,
      };
    }

    // Prepare FormData for Groq API
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile);
    groqFormData.append("model", options.model || "whisper-large-v3");
    groqFormData.append("language", options.language || "es");
    groqFormData.append("response_format", options.responseFormat || "json");

    // Call Groq API
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: groqFormData,
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      return {
        error: `Error de Groq API (${groqResponse.status}): ${errorText}`,
        success: false,
      };
    }

    const groqData = await groqResponse.json();

    // Validate response
    if (!groqData.text) {
      return {
        error: "La respuesta de Groq no contiene texto transcrito",
        success: false,
      };
    }

    return {
      transcription: groqData.text.trim(),
      success: true,
    };
  } catch (error) {
    console.error("Error in transcription service:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error interno durante la transcripción",
      success: false,
    };
  }
}

/**
 * Helper function to create a mock transcription for testing
 */
export function createMockTranscription(
  audioFile: File
): TranscriptionResponse {
  const validation = validateAudioFile(audioFile);
  if (!validation.valid) {
    return { error: validation.error!, success: false };
  }

  return {
    transcription: `Esta es una transcripción de prueba del archivo de audio "${audioFile.name}" (${(audioFile.size / 1024).toFixed(1)}KB).`,
    success: true,
  };
}
