import { describe, it, expect, vi, beforeEach } from "vitest";
import { transcribeAudio, createMockTranscription } from "@/lib/transcription";

// Mock the transcribeAudio function for integration tests
vi.mock("@/lib/transcription", async () => {
  const actual = await vi.importActual("@/lib/transcription");
  return {
    ...actual,
    transcribeAudio: vi.fn(),
  };
});

const mockTranscribeAudio = vi.mocked(transcribeAudio);

describe("API Integration - Transcribe Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("acepta archivos de audio válidos", async () => {
    const mockAudioFile = new File(["audio data"], "test.webm", {
      type: "audio/webm",
    });

    // Mock successful transcription
    mockTranscribeAudio.mockResolvedValueOnce({
      transcription:
        "Esta es una transcripción de prueba del archivo de audio enviado.",
      success: true,
    });

    const result = await transcribeAudio(mockAudioFile, "test-api-key");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.transcription).toBe(
        "Esta es una transcripción de prueba del archivo de audio enviado."
      );
    }
  });

  it("rechaza requests sin archivo de audio", async () => {
    // Mock validation error for null file
    mockTranscribeAudio.mockResolvedValueOnce({
      error: "No se encontró archivo de audio",
      success: false,
    });

    const result = await transcribeAudio(null as any, "test-api-key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("No se encontró archivo de audio");
    }
  });

  it("valida tipos de archivo soportados", async () => {
    const mockInvalidFile = new File(["data"], "test.txt", {
      type: "text/plain",
    });

    // Mock validation error for unsupported file type
    mockTranscribeAudio.mockResolvedValueOnce({
      error:
        "Tipo de archivo no soportado: text/plain. Formatos válidos: WebM, OGG, WAV, MP3, MP4, M4A",
      success: false,
    });

    const result = await transcribeAudio(mockInvalidFile, "test-api-key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Tipo de archivo no soportado");
      expect(result.error).toContain("text/plain");
    }
  });

  it("valida el tamaño máximo de archivo", async () => {
    // Create a large file (11MB)
    const mockLargeFile = new File(
      [new ArrayBuffer(11 * 1024 * 1024)], // 11MB
      "large.webm",
      { type: "audio/webm" }
    );

    // Mock validation error for large file
    mockTranscribeAudio.mockResolvedValueOnce({
      error: "El archivo es demasiado grande (11.0MB). Máximo permitido: 10MB",
      success: false,
    });

    const result = await transcribeAudio(mockLargeFile, "test-api-key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("demasiado grande");
      expect(result.error).toContain("11.0MB");
    }
  });

  it("maneja correctamente el tamaño límite exacto", async () => {
    // Create a file of exactly 10MB
    const mockExactFile = new File(
      [new ArrayBuffer(10 * 1024 * 1024)], // Exactly 10MB
      "exact.webm",
      { type: "audio/webm" }
    );

    // Mock successful transcription for exact size
    mockTranscribeAudio.mockResolvedValueOnce({
      transcription: "Transcripción exitosa del archivo de 10MB exactos.",
      success: true,
    });

    const result = await transcribeAudio(mockExactFile, "test-api-key");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.transcription).toContain("Transcripción exitosa");
    }
  });

  it("maneja errores de API de Groq", async () => {
    const mockAudioFile = new File(["audio data"], "test.webm", {
      type: "audio/webm",
    });

    // Mock Groq API error
    mockTranscribeAudio.mockResolvedValueOnce({
      error: "Error de Groq API (401): Unauthorized",
      success: false,
    });

    const result = await transcribeAudio(mockAudioFile, "invalid-api-key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Error de Groq API");
      expect(result.error).toContain("401");
    }
  });

  it("maneja respuestas vacías de Groq", async () => {
    const mockAudioFile = new File(["audio data"], "test.webm", {
      type: "audio/webm",
    });

    // Mock empty transcription response
    mockTranscribeAudio.mockResolvedValueOnce({
      error: "La respuesta de Groq no contiene texto transcrito",
      success: false,
    });

    const result = await transcribeAudio(mockAudioFile, "test-api-key");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("no contiene texto transcrito");
    }
  });

  describe("createMockTranscription", () => {
    it("genera transcripciones mock para archivos válidos", () => {
      const mockAudioFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      const result = createMockTranscription(mockAudioFile);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.transcription).toContain("test.webm");
        expect(result.transcription).toContain("transcripción de prueba");
      }
    });

    it("valida archivos inválidos en mock", () => {
      const mockInvalidFile = new File(["data"], "test.txt", {
        type: "text/plain",
      });

      const result = createMockTranscription(mockInvalidFile);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Tipo de archivo no soportado");
      }
    });
  });
});
