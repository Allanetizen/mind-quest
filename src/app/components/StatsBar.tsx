import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { Flame, Zap, Trophy } from 'lucide-react';

export function StatsBar() {
  const { pet, streak } = useUser();

  if (!pet) return null;

  const xpToNextLevel = 100;
  const xpProgress = (pet.xp % 100) / xpToNextLevel * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b-4 border-[#B794F6] px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Pet Info */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {({ luna: '🐱', buddy: '🐶', sage: '🦉', spark: '🐰', rabbit: '🐇', bear: '🐻', turtle: '🐢', fox: '🦊' } as Record<string, string>)[pet.id] ?? '✨'}
          </div>
          <div>
            <p className="text-[#553C9A] pixel-font text-sm">{pet.name}</p>
            <p className="text-[#9F7AEA] text-xs">Level {pet.level}</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[#F6AD55]" />
            <span className="text-xs text-[#9F7AEA]">{pet.xp % 100} / 100 XP</span>
          </div>
          <div className="h-3 bg-[#E9D8FD] border-2 border-[#B794F6] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9F7AEA] to-[#6B46C1]"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Streak */}
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FED7D7] to-[#FEB2B2] border-2 border-[#FC8181] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Flame className="w-5 h-5 text-[#E53E3E]" />
          <span className="pixel-font text-sm text-[#C53030]">{streak}</span>
        </motion.div>

        {/* Level Badge */}
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FAF089] to-[#F6E05E] border-2 border-[#D69E2E] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy className="w-5 h-5 text-[#B7791F]" />
          <span className="pixel-font text-sm text-[#975A16]">Lv {pet.level}</span>
        </motion.div>
      </div>
    </div>
  );
}