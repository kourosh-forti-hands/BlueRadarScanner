import { useState, useCallback, useRef } from "react";

export function useAudioNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Audio context not supported:', error);
        setIsSupported(false);
        return false;
      }
    }
    return true;
  }, []);

  const playNotificationSound = useCallback(async () => {
    if (!isEnabled || !isSupported) return;

    if (!initAudioContext() || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create a simple notification sound using Web Audio API
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a pleasant notification sound (two tones)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }, [isEnabled, isSupported, initAudioContext]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const enable = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  return {
    isEnabled,
    isSupported,
    playNotificationSound,
    toggle,
    enable,
    disable,
  };
}
