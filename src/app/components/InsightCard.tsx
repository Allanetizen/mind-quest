import { motion } from 'motion/react';
import { PixelCard } from './PixelCard';
import { Sparkles, Award, Flame, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  emotion: {
    mood: 'happy' | 'sad' | 'stressed' | 'calm' | 'excited' | 'neutral';
    confidence: number;
    keywords: string[];
  };
  insight: string;
  xpGained: number;
  streak: number;
  onContinue: () => void;
}

const moodColors = {
  happy: '#F6AD55',
  sad: '#63B3ED',
  stressed: '#FC8181',
  calm: '#9AE6B4',
  excited: '#F6E05E',
  neutral: '#CBD5E0'
};

export function InsightCard({ emotion, insight, xpGained, streak, onContinue }: InsightCardProps) {
  return (
    <div className="space-y-6">
      {/* Emotion Detection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PixelCard color="light" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[#9F7AEA]" />
            <h3 className="text-lg text-[#553C9A] pixel-font">Mood Detected</h3>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="px-6 py-3 border-4 text-lg pixel-font"
              style={{
                backgroundColor: `${moodColors[emotion.mood]}40`,
                borderColor: moodColors[emotion.mood],
                color: moodColors[emotion.mood]
              }}
            >
              {emotion.mood.charAt(0).toUpperCase() + emotion.mood.slice(1)}
            </div>
          </div>

          {emotion.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emotion.keywords.slice(0, 5).map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-[#E9D8FD] text-[#6B46C1] text-xs border-2 border-[#B794F6]"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          )}
        </PixelCard>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <PixelCard color="gradient" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-[#9F7AEA]" />
            <h3 className="text-lg text-[#553C9A] pixel-font">AI Insight</h3>
          </div>
          
          <p className="text-[#553C9A] leading-relaxed">
            {insight}
          </p>
        </PixelCard>
      </motion.div>

      {/* Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PixelCard color="light" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-[#F6AD55]" />
            <h3 className="text-lg text-[#553C9A] pixel-font">Rewards</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* XP Gained */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#FAF089] to-[#F6E05E] border-4 border-[#D69E2E] p-4 text-center cursor-pointer transition-shadow hover:shadow-lg"
            >
              <div className="text-3xl mb-2">✨</div>
              <div className="pixel-font text-2xl text-[#975A16] mb-1">+{xpGained}</div>
              <div className="text-xs text-[#B7791F]">XP Earned</div>
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#FED7D7] to-[#FEB2B2] border-4 border-[#FC8181] p-4 text-center cursor-pointer transition-shadow hover:shadow-lg"
            >
              <div className="text-3xl mb-2">
                <Flame className="w-8 h-8 text-[#E53E3E] inline-block" />
              </div>
              <div className="pixel-font text-2xl text-[#C53030] mb-1">{streak}</div>
              <div className="text-xs text-[#E53E3E]">Day Streak</div>
            </motion.div>
          </div>
        </PixelCard>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onContinue}
          className="px-12 py-4 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] hover:border-[#44337A] transition-all duration-150 active:translate-y-1 pixel-font shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none"
        >
          Reflect Again ✨
        </button>
      </motion.div>
    </div>
  );
}