
import React, { type ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  color?: 'purple' | 'light' | 'gradient';
  className?: string;
}

export function PixelCard({ children, color = 'light', className = '' }: PixelCardProps) {
  const colorClasses = {
    purple: 'bg-[#E9D8FD] border-[#9F7AEA]',
    light: 'bg-white/80 border-[#B794F6]',
    gradient: 'bg-gradient-to-br from-[#FAF5FF] to-[#E9D8FD] border-[#9F7AEA]'
  };

  return (
    <div 
      className={`border-4 ${colorClasses[color]} backdrop-blur-sm ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {children}
    </div>
  );
}
