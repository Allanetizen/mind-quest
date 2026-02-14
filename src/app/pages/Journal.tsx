import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { VirtualPet } from '../components/VirtualPet';
import { StatsBar } from '../components/StatsBar';
import { JournalCanvas } from '../components/JournalCanvas';
import { InsightCard } from '../components/InsightCard';
import { LevelUpModal } from '../components/LevelUpModal';
import { ArrowLeft } from 'lucide-react';

const dailyPrompts = [
  "What brought you peace today?",
  "Describe one small win from your day.",
  "What are you grateful for right now?",
  "How are you feeling in this moment?",
  "What's something you learned today?",
  "What would make tomorrow better?",
  "What emotion is strongest for you right now?"
];

interface EmotionAnalysis {
  mood: 'happy' | 'sad' | 'stressed' | 'calm' | 'excited' | 'neutral';
  confidence: number;
  keywords: string[];
}

export function Journal() {
  const { pet, addXP, updatePetMood, incrementStreak, user, streak } = useUser();
  const navigate = useNavigate();
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [emotion, setEmotion] = useState<EmotionAnalysis | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    // Set random daily prompt
    const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    setDailyPrompt(randomPrompt);
  }, []);

  const analyzeEmotion = (text: string): EmotionAnalysis => {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based emotion detection
    const emotionKeywords = {
      happy: ['happy', 'joy', 'great', 'wonderful', 'excited', 'love', 'amazing', 'good', 'smile', 'grateful'],
      sad: ['sad', 'down', 'upset', 'cry', 'hurt', 'lonely', 'miss', 'lost', 'empty'],
      stressed: ['stress', 'anxiety', 'worried', 'overwhelm', 'pressure', 'busy', 'exhausted', 'tired', 'difficult'],
      calm: ['calm', 'peace', 'relax', 'quiet', 'serene', 'still', 'gentle', 'soft', 'ease'],
      excited: ['excited', 'eager', 'thrilled', 'can\'t wait', 'looking forward', 'pumped', 'energized'],
      neutral: ['okay', 'fine', 'alright', 'normal', 'usual', 'same']
    };

    const scores: Record<string, number> = {
      happy: 0,
      sad: 0,
      stressed: 0,
      calm: 0,
      excited: 0,
      neutral: 0
    };

    const foundKeywords: string[] = [];

    // Count keyword matches
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[emotion]++;
          foundKeywords.push(keyword);
        }
      });
    });

    // Find dominant emotion
    let dominantEmotion: any = 'neutral';
    let maxScore = 0;

    Object.entries(scores).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    });

    // If no keywords found, default to neutral
    if (maxScore === 0) {
      dominantEmotion = 'neutral';
    }

    return {
      mood: dominantEmotion,
      confidence: Math.min(maxScore * 0.2, 1),
      keywords: foundKeywords
    };
  };

  const handleFinishJournal = () => {
    if (journalText.length < 10) return;

    // Analyze emotion
    const analysis = analyzeEmotion(journalText);
    setEmotion(analysis);
    updatePetMood(analysis.mood);

    // Calculate XP based on word count
    const wordCount = journalText.split(/\s+/).length;
    const earnedXP = Math.min(wordCount * 2, 100);
    setXpGained(earnedXP);
    
    // Check for level up
    const oldLevel = pet?.level || 1;
    addXP(earnedXP);
    const newPetLevel = Math.floor(((pet?.xp || 0) + earnedXP) / 100) + 1;
    
    if (newPetLevel > oldLevel) {
      setNewLevel(newPetLevel);
      setTimeout(() => setShowLevelUp(true), 1000);
    }
    
    incrementStreak();

    // Show insight
    setShowInsight(true);
  };

  const generateInsight = (): string => {
    if (!emotion) return '';

    const insights = {
      happy: [
        "Your positivity shines through! Keep nurturing these joyful moments.",
        "It's wonderful to see you celebrating the good things. Your gratitude is powerful.",
        "You're radiating positive energy today. This mindset will carry you far!"
      ],
      sad: [
        "It's okay to feel down. Acknowledging your feelings is a sign of strength.",
        "Remember, difficult emotions are temporary. You're doing great by expressing them.",
        "Being vulnerable takes courage. You're taking important steps toward healing."
      ],
      stressed: [
        "You're handling a lot right now. Remember to breathe and take small breaks.",
        "Stress is your body's way of saying you care. Let's find ways to lighten the load.",
        "You're stronger than you think. Breaking things down into smaller steps can help."
      ],
      calm: [
        "Your sense of peace is beautiful. This calm energy will serve you well.",
        "Finding stillness in your day is a gift. Keep cultivating these moments.",
        "Your balanced approach to life is admirable. Stay grounded in this feeling."
      ],
      excited: [
        "Your enthusiasm is contagious! Channel this energy into your goals.",
        "It's amazing to see you so motivated. Ride this wave of excitement!",
        "Your passion is clear. Keep that fire burning as you move forward!"
      ],
      neutral: [
        "Sometimes steady and calm is exactly what we need. You're doing well.",
        "Taking life one day at a time is perfectly okay. You're on your own path.",
        "Consistency matters more than intensity. You showed up today, and that counts."
      ]
    };

    const moodInsights = insights[emotion.mood];
    return moodInsights[Math.floor(Math.random() * moodInsights.length)];
  };

  const handleStartNew = () => {
    setJournalText('');
    setShowInsight(false);
    setEmotion(null);
    setXpGained(0);
    const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    setDailyPrompt(randomPrompt);
  };

  if (!pet || !user) {
    return (
      <div className="min-h-screen bg-[#DDD6F3] flex items-center justify-center">
        <p className="text-[#6B46C1] pixel-font">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DDD6F3] relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(#6B46C1 1px, transparent 1px),
          linear-gradient(90deg, #6B46C1 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10">
        {/* Stats Bar */}
        <StatsBar />

        {/* Home Button */}
        <div className="px-6 pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-[#B794F6] hover:border-[#9F7AEA] text-[#6B46C1] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Pet */}
            <div className="lg:col-span-1">
              <VirtualPet />
            </div>

            {/* Right Column - Journal */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {!showInsight ? (
                  <motion.div
                    key="journal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <JournalCanvas
                      prompt={dailyPrompt}
                      text={journalText}
                      onTextChange={setJournalText}
                      onFinish={handleFinishJournal}
                      isWriting={isWriting}
                      setIsWriting={setIsWriting}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="insight"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <InsightCard
                      emotion={emotion!}
                      insight={generateInsight()}
                      xpGained={xpGained}
                      streak={streak}
                      onContinue={handleStartNew}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      {pet && (
        <LevelUpModal
          isOpen={showLevelUp}
          level={newLevel}
          petName={pet.name}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  );
}