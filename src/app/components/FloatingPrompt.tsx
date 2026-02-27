import { useState } from 'react';
import { motion } from 'motion/react';

interface FloatingPromptProps {
  text: string;
  delay?: number;
}

export function FloatingPrompt({ text, delay = 0 }: FloatingPromptProps) {
  const [left] = useState(() => `${20 + Math.random() * 60}%`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, -50] }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 5
      }}
      className="absolute text-sm text-[#9F7AEA] pointer-events-none"
      style={{
        left,
        top: '50%'
      }}
    >
      {text}
    </motion.div>
  );
}
