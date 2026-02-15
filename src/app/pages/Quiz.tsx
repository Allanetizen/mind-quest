import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCard } from '../components/PixelCard';
import { useUser } from '../context/UserContext';

const QUESTIONS = [
  {
    id: 'mood',
    question: 'How are you feeling right now?',
    options: [
      { label: 'Stressed or overwhelmed', value: 'stressed', pet: 'sage' },
      { label: 'Calm but want to go deeper', value: 'calm', pet: 'luna' },
      { label: 'Energetic and ready for action', value: 'energetic', pet: 'buddy' },
      { label: 'Creative and curious', value: 'creative', pet: 'spark' },
    ],
  },
  {
    id: 'need',
    question: 'What do you need most right now?',
    options: [
      { label: 'Peace and quiet reflection', value: 'peace', pet: 'luna' },
      { label: 'A boost of joy and motivation', value: 'joy', pet: 'buddy' },
      { label: 'Clarity and wisdom', value: 'clarity', pet: 'sage' },
      { label: 'Playfulness and new ideas', value: 'play', pet: 'spark' },
    ],
  },
  {
    id: 'style',
    question: 'How do you like to reflect?',
    options: [
      { label: 'Quick daily check-ins', value: 'quick', pet: 'buddy' },
      { label: 'Deep, thoughtful journaling', value: 'deep', pet: 'luna' },
      { label: 'Guided prompts and questions', value: 'guided', pet: 'sage' },
      { label: 'Creative and free-form', value: 'creative', pet: 'spark' },
    ],
  },
];

const COMPANIONS = [
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🐱',
    personality: 'Calm & Reflective',
    description: 'Luna loves quiet moments and deep thoughts. She’s your companion for gentle, mindful reflection.',
    color: '#9F7AEA',
  },
  {
    id: 'buddy',
    name: 'Buddy',
    emoji: '🐶',
    personality: 'Energetic & Cheerful',
    description: 'Buddy brings joy and excitement to your day. He keeps you motivated and celebrates every win.',
    color: '#F6AD55',
  },
  {
    id: 'sage',
    name: 'Sage',
    emoji: '🦉',
    personality: 'Wise & Insightful',
    description: 'Sage offers wisdom and thoughtful perspectives. He helps you see clearly when things feel heavy.',
    color: '#4299E1',
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '🐰',
    personality: 'Creative & Playful',
    description: 'Spark inspires creativity and fun exploration. She turns reflection into play.',
    color: '#F687B3',
  },
];

function getAssignedCompanion(answers: string[]): (typeof COMPANIONS)[0] {
  const counts: Record<string, number> = { luna: 0, buddy: 0, sage: 0, spark: 0 };
  QUESTIONS.forEach((q, i) => {
    const chosen = q.options.find((o) => o.value === answers[i]);
    if (chosen) counts[chosen.pet]++;
  });
  const max = Math.max(...Object.values(counts));
  const id = (Object.entries(counts).find(([, c]) => c === max) ?? ['luna'])[0];
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[0];
}

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<(typeof COMPANIONS)[0] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setPet } = useUser();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const isQuestionStep = step < QUESTIONS.length;
  const currentQuestion = QUESTIONS[step];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step + 1 >= QUESTIONS.length) {
      setResult(getAssignedCompanion(newAnswers));
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handleStartQuest = () => {
    if (result) {
      setPet({
        id: result.id,
        name: result.name,
        personality: result.personality,
        level: 1,
        xp: 0,
        mood: 'happy',
      });
      if (email) setUser({ email });
      navigate('/first-journal');
    }
  };

  return (
    <div className="min-h-screen bg-[#DDD6F3] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#6B46C1 1px, transparent 1px), linear-gradient(90deg, #6B46C1 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 px-6 py-10 max-w-xl mx-auto">
        {/* Progress */}
        {isQuestionStep && (
          <div className="mb-8">
            <div className="flex gap-1" style={{ imageRendering: 'pixelated' }}>
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 border-2 transition-colors ${
                    i <= step ? 'bg-[#6B46C1] border-[#553C9A]' : 'bg-[#E9D8FD] border-[#B794F6]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[#9F7AEA] text-xs pixel-font mt-2 text-center">
              Question {step + 1} of {QUESTIONS.length}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isQuestionStep && currentQuestion && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8">
                <h2 className="text-[#553C9A] pixel-font text-sm md:text-base mb-6 text-center">
                  {currentQuestion.question}
                </h2>
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAnswer(opt.value)}
                      className="w-full px-4 py-3 text-left bg-white/80 hover:bg-white border-4 border-[#B794F6] hover:border-[#6B46C1] text-[#553C9A] pixel-font text-xs transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(107,70,193,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(107,70,193,0.25)]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </PixelCard>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8 text-center">
                <p className="text-[#9F7AEA] pixel-font text-xs mb-2">Your companion</p>
                <div className="text-6xl mb-4" style={{ imageRendering: 'pixelated' }}>{result.emoji}</div>
                <h2 className="text-2xl text-[#553C9A] pixel-font mb-2">{result.name}</h2>
                <p className="text-sm pixel-font mb-4 px-4 py-2 inline-block border-4 border-[#9F7AEA] bg-[#E9D8FD]/80 text-[#553C9A]">
                  {result.personality}
                </p>
                <p className="text-[#6B46C1] text-sm mb-6">{result.description}</p>
                <button
                  type="button"
                  onClick={handleStartQuest}
                  className="px-6 py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] hover:border-[#44337A] pixel-font text-xs transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none"
                >
                  Start your quest →
                </button>
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
