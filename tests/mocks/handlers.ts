import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock Groq API transcription
  http.post("https://api.groq.com/openai/v1/audio/transcriptions", () => {
    return HttpResponse.json({
      text: "Esta es una transcripción de prueba del audio enviado.",
    });
  }),

  // Mock transcribe API endpoint
  http.post("/api/transcribe", async ({ request }) => {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return HttpResponse.json(
        { error: "No se encontró archivo de audio" },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      text: "Transcripción de prueba: Esta es una prueba del sistema de transcripción.",
    });
  }),

  // Mock database health endpoint
  http.get("/api/db-health", () => {
    return HttpResponse.json({
      status: "ok",
      message: "Base de datos conectada correctamente",
      timestamp: new Date().toISOString(),
    });
  }),

  // Mock auth endpoints
  http.post("/api/auth/sign-in", () => {
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
      },
      session: {
        token: "mock-session-token",
      },
    });
  }),

  http.get("/api/auth/session", () => {
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
      },
    });
  }),
];
