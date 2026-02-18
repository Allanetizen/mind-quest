import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { PixelCard } from './PixelCard';
import { useState, useEffect } from 'react';

const moodExpressions = {
  happy: { emoji: '😊', color: '#F6AD55', dialogue: ['I love spending time with you!', 'Your positivity makes me happy!', 'What a wonderful day!'] },
  sad: { emoji: '😢', color: '#63B3ED', dialogue: ['I\'m here for you...', 'It\'s okay to feel sad.', 'Let\'s take it slow together.'] },
  stressed: { emoji: '😰', color: '#FC8181', dialogue: ['Take a deep breath...', 'You\'ve got this!', 'One step at a time.'] },
  calm: { emoji: '😌', color: '#9AE6B4', dialogue: ['This peace feels nice.', 'Let\'s enjoy this moment.', 'So serene...'] },
  excited: { emoji: '🤩', color: '#F6E05E', dialogue: ['This is amazing!', 'I\'m so excited!', 'Let\'s go!'] },
  neutral: { emoji: '😐', color: '#CBD5E0', dialogue: ['How are you today?', 'Ready when you are.', 'Let\'s reflect together.'] }
};

export function VirtualPet() {
  const { pet } = useUser();
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (pet) {
      const dialogues = moodExpressions[pet.mood].dialogue;
      const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
      setCurrentDialogue(randomDialogue);
    }
  }, [pet?.mood]);

  useEffect(() => {
    // Blinking animation
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  if (!pet) return null;

  const petEmoji: Record<string, string> = {
    luna: '🐱',
    buddy: '🐶',
    sage: '🦉',
    spark: '🐰',
    rabbit: '🐇',
    bear: '🐻',
    turtle: '🐢',
    fox: '🦊',
  };
  const emoji = petEmoji[pet.id] ?? '✨';

  const moodData = moodExpressions[pet.mood];

  return (
    <PixelCard interactive color="gradient" className="p-6 sticky top-4">
      {/* Pet Display */}
      <div className="text-center mb-6">
        <motion.div
          className="relative inline-block cursor-pointer"
          animate={{
            y: [0, -10, 0],
          }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0]
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-8xl md:text-9xl mb-2 relative">
            {emoji}
            
            {/* Mood expression overlay */}
            <motion.div
              className="absolute -top-2 -right-2 text-4xl"
              initial={{ scale: 0 }}
              animate={{ scale: isBlinking ? 0.8 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {moodData.emoji}
            </motion.div>
          </div>
        </motion.div>

        <h3 className="text-2xl text-[#553C9A] pixel-font mb-2">{pet.name}</h3>
        <motion.div 
          className="inline-block px-4 py-2 border-2 text-sm pixel-font mb-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          style={{ 
            backgroundColor: `${moodData.color}40`,
            borderColor: moodData.color,
            color: moodData.color
          }}
        >
          {pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}
        </motion.div>
      </div>

      {/* Dialogue Bubble */}
      <motion.div
        key={currentDialogue}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-4 border-[#B794F6] p-4 relative mb-6"
      >
        {/* Speech bubble tail */}
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid #B794F6'
          }}
        />
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid white'
          }}
        />
        
        <p className="text-[#553C9A] text-sm text-center">
          "{currentDialogue}"
        </p>
      </motion.div>

      {/* Pet Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9F7AEA]">Level</span>
          <span className="pixel-font text-[#553C9A]">{pet.level}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9F7AEA]">XP</span>
          <span className="pixel-font text-[#553C9A]">{pet.xp}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9F7AEA]">Personality</span>
          <span className="text-xs text-[#6B46C1]">{pet.personality}</span>
        </div>
      </div>

      {/* Particle effects */}
      {pet.mood === 'happy' && (
        <div className="absolute top-10 left-10 right-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ y: 0, opacity: 1, x: Math.random() * 100 }}
              animate={{ 
                y: -100, 
                opacity: 0,
                x: Math.random() * 100 + (i * 30)
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </PixelCard>
  );
}