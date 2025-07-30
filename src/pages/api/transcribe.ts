import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";
import { transcribeAudio } from "@/lib/transcription";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get audio file from FormData
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    // Get Groq API key from environment
    const groqApiKey = import.meta.env.GROQ_API_KEY;

    // Use transcription service
    const result = await transcribeAudio(audioFile, groqApiKey, {
      model: "whisper-large-v3",
      language: "es",
      responseFormat: "json",
    });

    if (result.success) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Determine status code based on error type
      const status = result.error.includes("no configurada")
        ? 500
        : result.error.includes("no soportado") ||
            result.error.includes("grande") ||
            result.error.includes("No se encontró")
          ? 400
          : 500;

      return new Response(JSON.stringify(result), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in transcribe endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor durante la transcripción",
        success: false,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
