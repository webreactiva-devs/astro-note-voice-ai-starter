import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceRecorder } from "@/components/VoiceRecorder";

describe("VoiceRecorder", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("renderiza correctamente en estado inicial", () => {
    render(<VoiceRecorder />);

    expect(screen.getByText("Listo para grabar")).toBeInTheDocument();
    expect(screen.getByText("Grabar")).toBeInTheDocument();
    expect(screen.getByText("02:00")).toBeInTheDocument();
    expect(screen.getByText("Tiempo restante")).toBeInTheDocument();
  });

  it("muestra el botón de grabar en estado inicial", () => {
    render(<VoiceRecorder />);

    const recordButton = screen.getByRole("button", { name: /grabar/i });
    expect(recordButton).toBeInTheDocument();
    expect(recordButton).not.toBeDisabled();
  });

  it("tiene un canvas para el visualizador de onda", () => {
    render(<VoiceRecorder />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe("CANVAS");
  });

  it("inicia grabación cuando se hace click en grabar", async () => {
    const user = userEvent.setup();
    render(<VoiceRecorder />);

    const recordButton = screen.getByRole("button", { name: /grabar/i });

    // Mock getUserMedia to succeed
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
      getAudioTracks: () => [{ stop: vi.fn() }],
    });
    navigator.mediaDevices.getUserMedia = mockGetUserMedia;

    await user.click(recordButton);

    // Verificar que se llamó getUserMedia
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });
  });

  it("maneja errores de getUserMedia mostrando el botón original", async () => {
    const user = userEvent.setup();
    render(<VoiceRecorder />);

    // Mock getUserMedia to fail
    const mockGetUserMedia = vi
      .fn()
      .mockRejectedValue(new Error("Permiso denegado"));
    navigator.mediaDevices.getUserMedia = mockGetUserMedia;

    const recordButton = screen.getByRole("button", { name: /grabar/i });
    await user.click(recordButton);

    // El botón debería seguir siendo "Grabar" después del error
    expect(screen.getByText("Grabar")).toBeInTheDocument();
    expect(mockGetUserMedia).toHaveBeenCalled();
  });

  it("muestra el timer en formato MM:SS", () => {
    render(<VoiceRecorder />);

    const timer = screen.getByText("02:00");
    expect(timer).toHaveClass("text-4xl", "font-mono", "font-bold");
  });

  it("renderiza el componente sin errores", () => {
    // Simple smoke test
    const { container } = render(<VoiceRecorder />);
    expect(container.firstChild).toBeTruthy();
  });

  it("tiene la estructura de card correcta", () => {
    render(<VoiceRecorder />);

    // Verificar que tiene la estructura esperada de card
    expect(screen.getByText("Listo para grabar")).toBeInTheDocument();
    expect(screen.getByText("Tiempo restante")).toBeInTheDocument();

    // Verificar que el botón está presente
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
