
import React, { useCallback } from 'react';

// This hook uses the Web Audio API to create a simple sound without needing an audio file.
export const useAudio = () => {
  const play = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Sound settings
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  }, []);

  return play;
};
