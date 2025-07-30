import React from "react";

interface TimerDisplayProps {
  timeLeft: number;
  isRecordingFinished?: boolean;
}

export function TimerDisplay({
  timeLeft,
  isRecordingFinished = false,
}: TimerDisplayProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate recorded duration when finished
  const displayTime = isRecordingFinished ? 120 - timeLeft : timeLeft;
  const labelText = isRecordingFinished
    ? "Duración grabada"
    : "Tiempo restante";

  return (
    <div className="text-center">
      <div
        className={`text-4xl font-mono font-bold ${
          !isRecordingFinished && timeLeft <= 10
            ? "text-red-500"
            : "text-foreground"
        }`}
      >
        {formatTime(displayTime)}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{labelText}</p>
    </div>
  );
}
