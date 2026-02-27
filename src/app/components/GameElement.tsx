import React from 'react';

interface GameElementProps {
  emoji: string;
  label: string;
  value: string;
}

export function GameElement({ emoji, label, value }: GameElementProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border-4 border-[#B794F6] p-4 md:p-6 hover:border-[#9F7AEA] hover:bg-white/90 transition-all hover:scale-105 overflow-hidden min-w-0 flex flex-col items-center text-center">
      <div className="text-3xl md:text-4xl mb-2 shrink-0">{emoji}</div>
      <div className="text-xs md:text-sm text-[#9F7AEA] mb-1 pixel-font break-words w-full">{label}</div>
      <div className="text-sm md:text-base text-[#553C9A] pixel-font font-bold break-words w-full">{value}</div>
    </div>
  );
}
