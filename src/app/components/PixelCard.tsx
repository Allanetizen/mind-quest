interface PixelCardProps {
  children: React.ReactNode;
  color?: 'purple' | 'light' | 'gradient';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function PixelCard({ children, color = 'light', className = '', interactive = false, onClick }: PixelCardProps) {
  const colorClasses = {
    purple: 'bg-[#E9D8FD] border-[#9F7AEA]',
    light: 'bg-white/80 border-[#B794F6]',
    gradient: 'bg-gradient-to-br from-[#FAF5FF] to-[#E9D8FD] border-[#9F7AEA]'
  };

  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]' 
    : '';

  return (
    <div 
      className={`border-4 ${colorClasses[color]} backdrop-blur-sm ${interactiveClasses} ${className}`}
      style={{ imageRendering: 'pixelated' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}