import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { PlaybackVisualizer } from "./PlaybackVisualizer";

interface AudioPlayerProps {
  audioUrl: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.play();
      setIsPlaying(true);
    }
  };

  // Pause audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Stop audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Playback Visualizer */}
      <PlaybackVisualizer
        audioElement={audioRef.current}
        isPlaying={isPlaying}
      />

      {/* Audio Controls */}
      <div className="flex justify-center gap-2">
        {!isPlaying ? (
          <Button onClick={playAudio} size="lg" variant="outline">
            <Play className="mr-2 h-5 w-5" />
            Reproducir
          </Button>
        ) : (
          <>
            <Button onClick={pauseAudio} size="lg" variant="outline">
              <Pause className="mr-2 h-5 w-5" />
              Pausar
            </Button>
            <Button onClick={stopAudio} size="lg" variant="outline">
              <Square className="mr-2 h-5 w-5" />
              Parar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
