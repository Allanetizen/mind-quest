import { motion } from 'motion/react';

export function Confetti() {
  const colors = ['#F6AD55', '#9F7AEA', '#63B3ED', '#F687B3', '#F6E05E', '#9AE6B4'];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(confettiCount)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 50;
        const size = 4 + Math.random() * 8;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${startX}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}
