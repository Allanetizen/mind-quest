interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function PixelButton({ children, onClick, type = 'button' }: PixelButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full px-8 py-4 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] hover:border-[#44337A] transition-all duration-150 active:translate-y-1 pixel-font shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none"
      style={{ imageRendering: 'pixelated' }}
    >
      {children}
    </button>
  );
}
