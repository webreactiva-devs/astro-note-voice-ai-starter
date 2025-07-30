import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Pause, Download } from "lucide-react";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { AudioPlayer } from "./AudioPlayer";
import { TimerDisplay } from "./TimerDisplay";

type RecordingState = "idle" | "recording" | "paused" | "stopped";

export function VoiceRecorder() {
  const [state, setState] = useState<RecordingState>("idle");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos en segundos
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up resources
  const cleanupResources = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Set up Web Audio API for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        cleanupResources();
      };

      mediaRecorder.start();
      setState("recording");

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Error al acceder al micrófono. Por favor, asegúrate de dar permisos."
      );
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.pause();
      setState("paused");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && state === "paused") {
      mediaRecorderRef.current.resume();
      setState("recording");

      // Resume timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setState("stopped");
      cleanupResources();
    }
  };

  // Download audio file
  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nota-voz-${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Start new recording
  const newRecording = () => {
    setState("idle");
    setTimeLeft(120);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {state === "idle" && "Listo para grabar"}
          {state === "recording" && "Grabando..."}
          {state === "paused" && "Grabación pausada"}
          {state === "stopped" && "Grabación completada"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer display */}
        <TimerDisplay
          timeLeft={timeLeft}
          isRecordingFinished={state === "stopped"}
        />

        {/* Waveform visualizer - only show during recording */}
        {state !== "stopped" && (
          <WaveformVisualizer
            analyser={analyserRef.current}
            isRecording={state === "recording"}
          />
        )}

        {/* Recording controls */}
        {state !== "stopped" && (
          <div className="flex justify-center gap-4">
            {state === "idle" && (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Mic className="mr-2 h-5 w-5" />
                Grabar
              </Button>
            )}

            {state === "recording" && (
              <>
                <Button onClick={pauseRecording} size="lg" variant="outline">
                  <Pause className="mr-2 h-5 w-5" />
                  Pausar
                </Button>
                <Button onClick={stopRecording} size="lg" variant="destructive">
                  <Square className="mr-2 h-5 w-5" />
                  Parar
                </Button>
              </>
            )}

            {state === "paused" && (
              <>
                <Button
                  onClick={resumeRecording}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Continuar
                </Button>
                <Button onClick={stopRecording} size="lg" variant="destructive">
                  <Square className="mr-2 h-5 w-5" />
                  Parar
                </Button>
              </>
            )}
          </div>
        )}

        {/* Playback controls (when recording is finished) */}
        {state === "stopped" && audioBlob && audioUrl && (
          <div className="space-y-4">
            {/* Audio player with visualizer */}
            <AudioPlayer audioUrl={audioUrl} />

            {/* Action buttons row */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button onClick={downloadAudio} size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Descargar
              </Button>
              <Button
                onClick={() => {
                  // TODO: Implement transcription
                  alert("Función de transcripción próximamente...");
                }}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Transcribir
              </Button>
            </div>

            {/* New recording button */}
            <div className="flex justify-center">
              <Button onClick={newRecording} size="lg" variant="outline">
                Nueva Grabación
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
