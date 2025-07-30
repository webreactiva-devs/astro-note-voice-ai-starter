import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateAudioFile,
  transcribeAudio,
  createMockTranscription,
} from "@/lib/transcription";

// Mock global fetch directly
const mockFetch = vi.fn();

describe("Transcription Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Override global fetch for unit tests
    global.fetch = mockFetch;
  });

  describe("validateAudioFile", () => {
    it("accepts valid audio files", () => {
      const mockAudioFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      const result = validateAudioFile(mockAudioFile);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects missing files", () => {
      const result = validateAudioFile(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("No se encontró archivo de audio");
    });

    it("rejects unsupported file types", () => {
      const mockInvalidFile = new File(["data"], "test.txt", {
        type: "text/plain",
      });

      const result = validateAudioFile(mockInvalidFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Tipo de archivo no soportado");
      expect(result.error).toContain("text/plain");
    });

    it("rejects files that are too large", () => {
      // Create a mock file larger than 10MB
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)], // 11MB
        "large.webm",
        { type: "audio/webm" }
      );

      const result = validateAudioFile(largeFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("demasiado grande");
      expect(result.error).toContain("11.0MB");
    });

    it("accepts all supported audio formats", () => {
      const supportedTypes = [
        "audio/webm",
        "audio/ogg",
        "audio/wav",
        "audio/mp3",
        "audio/mpeg",
        "audio/mp4",
        "audio/m4a",
      ];

      supportedTypes.forEach((type) => {
        const mockFile = new File(
          ["audio data"],
          `test.${type.split("/")[1]}`,
          { type }
        );
        const result = validateAudioFile(mockFile);

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });
  });

  describe("transcribeAudio", () => {
    it("successfully transcribes audio", async () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      const mockApiResponse = {
        text: "This is a test transcription",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await transcribeAudio(mockFile, "test-api-key");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.transcription).toBe("This is a test transcription");
      }

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test-api-key",
          },
        })
      );
    });

    it("returns error for invalid file", async () => {
      const invalidFile = new File(["data"], "test.txt", {
        type: "text/plain",
      });

      const result = await transcribeAudio(invalidFile, "test-api-key");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Tipo de archivo no soportado");
      }

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns error for missing API key", async () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      const result = await transcribeAudio(mockFile, "");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("GROQ_API_KEY no configurada");
      }

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("handles Groq API errors", async () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      });

      const result = await transcribeAudio(mockFile, "invalid-key");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Error de Groq API (401)");
        expect(result.error).toContain("Unauthorized");
      }
    });

    it("handles empty transcription response", async () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // No text property
      });

      const result = await transcribeAudio(mockFile, "test-api-key");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("no contiene texto transcrito");
      }
    });

    it("uses custom options", async () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ text: "Test" }),
      });

      await transcribeAudio(mockFile, "test-api-key", {
        model: "whisper-large-v2",
        language: "en",
        responseFormat: "verbose_json",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test-api-key",
          },
        })
      );

      // Check FormData was constructed with custom options
      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1].body;
      expect(formData).toBeInstanceOf(FormData);
    });
  });

  describe("createMockTranscription", () => {
    it("creates mock transcription for valid file", () => {
      const mockFile = new File(["audio data"], "test.webm", {
        type: "audio/webm",
      });

      const result = createMockTranscription(mockFile);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.transcription).toContain("test.webm");
        expect(result.transcription).toContain("transcripción de prueba");
      }
    });

    it("returns error for invalid file", () => {
      const invalidFile = new File(["data"], "test.txt", {
        type: "text/plain",
      });

      const result = createMockTranscription(invalidFile);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Tipo de archivo no soportado");
      }
    });
  });
});
