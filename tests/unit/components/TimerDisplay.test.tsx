import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerDisplay } from "@/components/TimerDisplay";

describe("TimerDisplay", () => {
  it("muestra el tiempo restante correctamente", () => {
    render(<TimerDisplay timeLeft={75} />);

    expect(screen.getByText("01:15")).toBeInTheDocument();
    expect(screen.getByText("Tiempo restante")).toBeInTheDocument();
  });

  it("formatea correctamente los segundos con ceros a la izquierda", () => {
    render(<TimerDisplay timeLeft={5} />);

    expect(screen.getByText("00:05")).toBeInTheDocument();
  });

  it("muestra texto en rojo cuando quedan 10 segundos o menos", () => {
    render(<TimerDisplay timeLeft={8} />);

    const timerElement = screen.getByText("00:08");
    expect(timerElement).toHaveClass("text-red-500");
  });

  it("no muestra texto en rojo cuando quedan más de 10 segundos", () => {
    render(<TimerDisplay timeLeft={15} />);

    const timerElement = screen.getByText("00:15");
    expect(timerElement).not.toHaveClass("text-red-500");
    expect(timerElement).toHaveClass("text-foreground");
  });

  it("muestra duración grabada cuando isRecordingFinished es true", () => {
    render(<TimerDisplay timeLeft={30} isRecordingFinished={true} />);

    // 120 - 30 = 90 segundos = 1:30
    expect(screen.getByText("01:30")).toBeInTheDocument();
    expect(screen.getByText("Duración grabada")).toBeInTheDocument();
  });

  it("no aplica estilo rojo cuando está en modo finished", () => {
    render(<TimerDisplay timeLeft={115} isRecordingFinished={true} />);

    const timerElement = screen.getByText("00:05"); // 120 - 115 = 5
    expect(timerElement).not.toHaveClass("text-red-500");
    expect(timerElement).toHaveClass("text-foreground");
  });

  it("formatea correctamente tiempos de 2 minutos completos", () => {
    render(<TimerDisplay timeLeft={120} />);

    expect(screen.getByText("02:00")).toBeInTheDocument();
  });

  it("maneja correctamente el tiempo cero", () => {
    render(<TimerDisplay timeLeft={0} />);

    expect(screen.getByText("00:00")).toBeInTheDocument();
  });
});
