import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCard } from '../components/PixelCard';
import { trackEvent } from '../utils/analytics';

const QUESTIONS = [
  {
    id: 'today',
    question: 'When I think about today...',
    options: [
      { label: 'I feel hopeful', value: 'hopeful', pet: 'buddy' },
      { label: 'I feel calm', value: 'calm', pet: 'luna' },
      { label: 'I feel overwhelmed', value: 'overwhelmed', pet: 'rabbit' },
      { label: 'I feel distracted', value: 'distracted', pet: 'fox' },
      { label: 'I just want to rest', value: 'rest', pet: 'bear' },
    ],
  },
  {
    id: 'people',
    question: 'Right now, being around people sounds...',
    options: [
      { label: 'Exciting!', value: 'exciting', pet: 'buddy' },
      { label: 'Nice but quiet', value: 'nice-quiet', pet: 'luna' },
      { label: 'Depends on the vibe', value: 'vibe', pet: 'fox' },
      { label: 'A bit much', value: 'bit-much', pet: 'sage' },
      { label: 'Exhausting', value: 'exhausting', pet: 'bear' },
    ],
  },
  {
    id: 'feel',
    question: 'Right now, I feel...',
    options: [
      { label: 'Quiet and reflective', value: 'quiet-reflective', pet: 'luna' },
      { label: 'Energized and ready', value: 'energized', pet: 'buddy' },
      { label: 'Scattered and restless', value: 'scattered', pet: 'spark' },
      { label: 'Tender and sensitive', value: 'tender', pet: 'rabbit' },
      { label: 'Drained and heavy', value: 'drained', pet: 'turtle' },
    ],
  },
  {
    id: 'mind',
    question: 'My mind is...',
    options: [
      { label: 'Clear and focused', value: 'clear', pet: 'sage' },
      { label: 'Thoughtful and slow', value: 'thoughtful', pet: 'turtle' },
      { label: 'Racing with worries', value: 'racing', pet: 'sage' },
      { label: 'Jumping around', value: 'jumping', pet: 'spark' },
      { label: 'Foggy or numb', value: 'foggy', pet: 'luna' },
    ],
  },
  {
    id: 'battery',
    question: 'My emotional battery is at...',
    options: [
      { label: '0-20% (empty)', value: 'empty', pet: 'bear' },
      { label: '21-40% (low)', value: 'low', pet: 'rabbit' },
      { label: '41-60% (moderate)', value: 'moderate', pet: 'turtle' },
      { label: '61-80% (good)', value: 'good', pet: 'buddy' },
      { label: '81-100% (full)', value: 'full', pet: 'fox' },
    ],
  },
];

const COMPANIONS = [
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🐱',
    personality: 'Calm & Reflective',
    traits: 'Quiet • Thoughtful • Gentle',
    description: 'Luna loves quiet moments and deep thoughts. She’s your companion for gentle, mindful reflection.',
    gentlePrompt: 'What would help you feel 10% more at peace right now?',
  },
  {
    id: 'buddy',
    name: 'Buddy',
    emoji: '🐶',
    personality: 'Energetic & Cheerful',
    traits: 'Joyful • Motivated • Upbeat',
    description: 'Buddy brings joy and excitement to your day. He keeps you motivated and celebrates every win.',
    gentlePrompt: 'What’s one small win you can celebrate today?',
  },
  {
    id: 'sage',
    name: 'Sage',
    emoji: '🦉',
    personality: 'Wise & Insightful',
    traits: 'Wise • Clear • Grounded',
    description: 'Sage offers wisdom and thoughtful perspectives. He helps you see clearly when things feel heavy.',
    gentlePrompt: 'What would clarity look like for you in this moment?',
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '🐰',
    personality: 'Creative & Playful',
    traits: 'Playful • Curious • Light',
    description: 'Spark inspires creativity and fun exploration. She turns reflection into play.',
    gentlePrompt: 'What would feel like play instead of work right now?',
  },
  {
    id: 'rabbit',
    name: 'The Tender Rabbit',
    emoji: '🐇',
    personality: 'Sensitive & Gentle',
    traits: 'Sensitive • Overwhelmed • Gentle',
    description: "You're feeling things deeply, and the world feels a bit loud. Rabbits know when to retreat and protect their soft hearts. Move slowly.",
    gentlePrompt: 'What would help you feel just 10% safer or calmer right now?',
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    personality: 'Cozy & Grounded',
    traits: 'Restful • Nurturing • Steady',
    description: 'Bear reminds you that rest is not laziness. Sometimes the bravest thing is to slow down and recharge.',
    gentlePrompt: "What's one small way you could be gentler with yourself today?",
  },
  {
    id: 'turtle',
    name: 'Turtle',
    emoji: '🐢',
    personality: 'Steady & Patient',
    traits: 'Patient • Thoughtful • Steady',
    description: "Turtle takes things one step at a time. When you feel drained, she's your reminder that slow progress is still progress.",
    gentlePrompt: "What's one tiny step you could take without pushing yourself?",
  },
  {
    id: 'fox',
    name: 'Fox',
    emoji: '🦊',
    personality: 'Curious & Adaptable',
    traits: 'Curious • Adaptable • Playful',
    description: "Fox goes with the flow and finds wonder in the in-between. She's your companion when your mind is jumping and that's okay.",
    gentlePrompt: 'What would feel like curiosity instead of pressure right now?',
  },
];

function getAssignedCompanion(answers: string[]): (typeof COMPANIONS)[0] {
  const allPetIds = [...new Set(QUESTIONS.flatMap((q) => q.options.map((o) => o.pet)))];
  const counts: Record<string, number> = Object.fromEntries(allPetIds.map((id) => [id, 0]));
  QUESTIONS.forEach((q, i) => {
    const chosen = q.options.find((o) => o.value === answers[i]);
    if (chosen) counts[chosen.pet] = (counts[chosen.pet] ?? 0) + 1;
  });
  const max = Math.max(...Object.values(counts));
  const id = (Object.entries(counts).find(([, c]) => c === max) ?? [allPetIds[0]])[0];
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[0];
}

const TOTAL_STEPS = 1 + QUESTIONS.length; // intro + questions

export function Quiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1..5 = questions, 6 = result
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<(typeof COMPANIONS)[0] | null>(null);

  const isIntro = step === 0;
  const isQuestionStep = step >= 1 && step <= QUESTIONS.length;
  const questionIndex = step - 1;
  const currentQuestion = isQuestionStep ? QUESTIONS[questionIndex] : null;
  const isResultStep = result !== null;
  const progressPercent = step === 0 ? 0 : step > QUESTIONS.length ? 100 : Math.round((step / QUESTIONS.length) * 100);

  useEffect(() => {
    trackEvent('quiz_started');
  }, []);

  useEffect(() => {
    if (result) {
      trackEvent('quiz_completed', { companion: result.id });
    }
  }, [result]);

  const handleBegin = () => {
    setStep(1);
  };

  const handleContinue = () => {
    if (selectedOption === null || !currentQuestion) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (questionIndex + 1 >= QUESTIONS.length) {
      setResult(getAssignedCompanion(newAnswers));
      setStep(TOTAL_STEPS);
    } else {
      setStep(step + 1);
    }
  };

  const handleTakeAgain = () => {
    trackEvent('quiz_retake');
    setStep(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
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
        {/* Shareable quiz: back link so anyone opening the link can get to the main site */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#6B46C1] hover:text-[#553C9A] pixel-font text-xs transition-colors"
          >
            ← MindQuest
          </Link>
        </div>
        {/* Progress: "Growing your companion..." (questions + result only) */}
        {(isQuestionStep || isResultStep) && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#553C9A] pixel-font text-xs">Growing your companion...</span>
              <span className="text-[#553C9A] pixel-font text-xs">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full border-2 border-[#B794F6] bg-[#E9D8FD]/50 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
              <motion.div
                className="h-full bg-gradient-to-r from-[#9F7AEA] to-[#6B46C1] border-r-2 border-[#553C9A]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2 w-full">
                  <span className="text-2xl">🌙</span>
                  <h1 className="text-xl md:text-2xl text-[#553C9A] pixel-font text-center">Your MindQuest Companion</h1>
                </div>
                <p className="text-[#6B46C1] text-sm mb-6">A quick emotional check-in.</p>
                <div className="text-4xl mb-6">✨</div>
                <p className="text-[#553C9A] pixel-font text-sm mb-2">Quick pause. How are you <em>really</em> feeling right now?</p>
                <p className="text-[#6B46C1] text-xs mb-8">Meet your companion in a few questions.</p>
                <button
                  type="button"
                  onClick={handleBegin}
                  className="px-8 py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)]"
                >
                  Let's Begin ✨
                </button>
              </PixelCard>
            </motion.div>
          )}

          {isQuestionStep && currentQuestion && (
            <motion.div
              key={`q-${questionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8">
                <h2 className="text-[#553C9A] pixel-font text-sm md:text-base mb-6 text-center">
                  {currentQuestion.question}
                </h2>
                <div className="flex flex-col gap-3 mb-6">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedOption(opt.value)}
                      className={`w-full px-4 py-3 text-left pixel-font text-xs transition-all flex items-center justify-between ${
                        selectedOption === opt.value
                          ? 'bg-[#E9D8FD] border-4 border-[#6B46C1] text-[#553C9A] shadow-[2px_2px_0px_0px_rgba(107,70,193,0.4)]'
                          : 'bg-white/80 border-4 border-[#B794F6] hover:border-[#9F7AEA] text-[#553C9A]'
                      }`}
                    >
                      {opt.label}
                      {selectedOption === opt.value && <span className="text-sm">✨</span>}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={selectedOption === null}
                  className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] disabled:opacity-50 disabled:cursor-not-allowed text-white border-4 border-[#553C9A] pixel-font text-xs transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)]"
                >
                  Continue →
                </button>
              </PixelCard>
            </motion.div>
          )}

          {isResultStep && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8">
                <div className="flex items-center justify-center gap-2 mb-2 w-full">
                  <span className="text-2xl">🌙</span>
                  <h1 className="text-lg text-[#553C9A] pixel-font text-center">Your MindQuest Companion</h1>
                </div>
                <p className="text-[#6B46C1] text-xs mb-4 text-center">A quick emotional check-in.</p>

                <div className="text-6xl mb-3 text-center" style={{ imageRendering: 'pixelated' }}>{result.emoji}</div>
                <h2 className="text-2xl text-[#553C9A] pixel-font mb-1 text-center">{result.name}</h2>
                <p className="text-[#9F7AEA] text-xs pixel-font mb-4 text-center">{result.traits}</p>
                <p className="text-sm pixel-font mb-4 px-4 py-2 inline-block border-4 border-[#9F7AEA] bg-[#E9D8FD]/80 text-[#553C9A] w-full text-center">
                  {result.personality}
                </p>
                <p className="text-[#6B46C1] text-sm mb-6">{result.description}</p>

                <div className="bg-[#FAF5FF] border-4 border-[#E9D8FD] rounded p-4 mb-6 text-left">
                  <p className="text-[#553C9A] pixel-font text-xs mb-2">One prompt for you</p>
                  <p className="text-[#6B46C1] text-sm italic">Based on how you're feeling, try this:</p>
                  <p className="text-[#553C9A] pixel-font text-sm mt-2">{result.gentlePrompt}</p>
                </div>

                <Link
                  to="/"
                  className="w-full block py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs text-center transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] mb-4"
                >
                  Go to MindQuest →
                </Link>
                <p className="text-[#6B46C1] text-xs text-center mb-2">Want to discover a different companion?</p>
                <button
                  type="button"
                  onClick={handleTakeAgain}
                  className="w-full py-2 border-4 border-[#B794F6] bg-white/80 hover:bg-[#E9D8FD] text-[#553C9A] pixel-font text-xs transition-all duration-150"
                >
                  Take quiz again ↻
                </button>
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
