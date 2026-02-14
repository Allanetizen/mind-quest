import { motion, AnimatePresence } from 'motion/react';
import { PixelCard } from './PixelCard';
import { Trophy, Sparkles } from 'lucide-react';
import { Confetti } from './Confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  petName: string;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, level, petName, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="pointer-events-auto max-w-md w-full"
            >
              <PixelCard color="gradient" className="p-8 text-center relative overflow-hidden">
                {/* Sparkle animations */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl"
                    initial={{ 
                      x: '50%', 
                      y: '50%',
                      scale: 0,
                      rotate: 0
                    }}
                    animate={{
                      x: `${Math.cos(i * 60 * Math.PI / 180) * 200}%`,
                      y: `${Math.sin(i * 60 * Math.PI / 180) * 200}%`,
                      scale: [0, 1, 0],
                      rotate: 360
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="text-7xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl text-[#553C9A] pixel-font mb-2">
                  Level Up!
                </h2>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-8 h-8 text-[#F6AD55]" />
                  <span className="text-5xl pixel-font text-[#6B46C1]">{level}</span>
                  <Trophy className="w-8 h-8 text-[#F6AD55]" />
                </div>

                <p className="text-[#6B46C1] mb-6">
                  {petName} grew stronger! Keep up the amazing work!
                </p>

                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] transition-all pixel-font shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none"
                >
                  Continue ✨
                </button>
              </PixelCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}