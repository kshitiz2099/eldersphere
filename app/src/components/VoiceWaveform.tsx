import { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive?: boolean;
  color?: string;
}

export function VoiceWaveform({ isActive = false, color = "#7FA5B8" }: VoiceWaveformProps) {
  const [heights, setHeights] = useState([20, 40, 60, 40, 20]);

  useEffect(() => {
    if (!isActive) {
      setHeights([20, 40, 60, 40, 20]);
      return;
    }

    const interval = setInterval(() => {
      setHeights([
        Math.random() * 60 + 20,
        Math.random() * 80 + 30,
        Math.random() * 100 + 40,
        Math.random() * 80 + 30,
        Math.random() * 60 + 20,
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-2 h-32">
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-3 rounded-full transition-all duration-150 ease-in-out"
          style={{
            height: `${height}px`,
            backgroundColor: color,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
