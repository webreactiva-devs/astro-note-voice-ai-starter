import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }), 
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get audio file from FormData
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "No se encontró archivo de audio" }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file type and size
    const supportedMimeTypes = [
      "audio/webm", 
      "audio/ogg", 
      "audio/wav", 
      "audio/mp3", 
      "audio/mpeg",
      "audio/mp4",
      "audio/m4a"
    ];
    
    if (!audioFile.type.startsWith("audio/") && !supportedMimeTypes.includes(audioFile.type)) {
      return new Response(
        JSON.stringify({ 
          error: `Tipo de archivo no soportado: ${audioFile.type}. Formatos válidos: WebM, OGG, WAV, MP3, MP4, M4A` 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Max 10MB file size (reasonable for 2-minute audio)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audioFile.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "El archivo es demasiado grande (máx. 10MB)" }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Integrate with Groq API for transcription
    const groqApiKey = import.meta.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY no configurada en variables de entorno");
    }

    // Prepare FormData for Groq API
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile);
    groqFormData.append("model", "whisper-large-v3"); // Groq's Whisper model
    groqFormData.append("language", "es"); // Spanish language
    groqFormData.append("response_format", "json");

    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: groqFormData,
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      throw new Error(`Error de Groq API (${groqResponse.status}): ${errorText}`);
    }

    const groqData = await groqResponse.json();
    
    // Validate response
    if (!groqData.text) {
      throw new Error("La respuesta de Groq no contiene texto transcrito");
    }
    
    return new Response(
      JSON.stringify({ 
        transcription: groqData.text.trim(),
        success: true 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in transcribe endpoint:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error interno del servidor durante la transcripción",
        success: false 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};