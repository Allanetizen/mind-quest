import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MINDQUEST_APP_URL } from '../routes';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCard } from '../components/PixelCard';
import { trackEvent } from '../utils/analytics';

const SUBSCRIBE_API = import.meta.env.VITE_SUBSCRIBE_API_URL || '/api/subscribe';
const GUMROAD_PRODUCT_URL = 'https://mindquestapp.gumroad.com/l/MindQuestApp';

type FunnelPhase = 'companion' | 'save_journey' | 'reflection' | 'donation' | 'ready';

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

const MOOD_CHIPS = [
  { emoji: '😌', label: 'Calm' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😐', label: 'Mixed' },
  { emoji: '😟', label: 'Heavy' },
  { emoji: '😢', label: 'Low' },
];

export function Quiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1..5 = questions, 6 = result
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<(typeof COMPANIONS)[0] | null>(null);
  const [funnelPhase, setFunnelPhase] = useState<FunnelPhase | null>(null);
  const [saveEmail, setSaveEmail] = useState('');
  const [saveFirstname, setSaveFirstname] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [reflectionMood, setReflectionMood] = useState<string | null>(null);

  const isIntro = step === 0;
  const isQuestionStep = step >= 1 && step <= QUESTIONS.length;
  const questionIndex = step - 1;
  const currentQuestion = isQuestionStep ? QUESTIONS[questionIndex] : null;
  const isResultStep = result !== null;
  const progressPercent = step === 0 ? 0 : step > QUESTIONS.length ? 100 : Math.round((step / QUESTIONS.length) * 100);

  const postQuizStep =
    funnelPhase === 'save_journey'
      ? 1
      : funnelPhase === 'reflection'
        ? 2
        : funnelPhase === 'donation'
          ? 3
          : funnelPhase === 'ready'
            ? 4
            : 0;

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
      setFunnelPhase('companion');
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
    setFunnelPhase(null);
    setSaveEmail('');
    setSaveFirstname('');
    setSaveError(null);
    setReflectionNote('');
    setReflectionMood(null);
  };

  const handleSaveJourneyContinue = async () => {
    const emailValue = saveEmail.trim();
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setSaveError('Please add a valid email to save your journey.');
      return;
    }
    setSaveError(null);
    setSaveLoading(true);
    try {
      const res = await fetch(SUBSCRIBE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          ...(saveFirstname.trim() && { firstname: saveFirstname.trim() }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error || 'Something went wrong. Try again.');
        setSaveLoading(false);
        return;
      }
      trackEvent('quiz_journey_saved', { companion: result?.id ?? '' });
      setFunnelPhase('reflection');
    } catch {
      setSaveError('Connection error. Try again.');
    }
    setSaveLoading(false);
  };

  const handleSaveJourneySkip = () => {
    trackEvent('quiz_journey_skipped', { companion: result?.id ?? '' });
    setFunnelPhase('reflection');
  };

  const handleReflectionContinue = () => {
    trackEvent('quiz_reflection_completed', { companion: result?.id ?? '' });
    setFunnelPhase('donation');
  };

  const handleDonationContinue = () => {
    trackEvent('quiz_continue_to_app', { companion: result?.id ?? '' });
    setFunnelPhase('ready');
  };

  const handleGumroadClick = () => {
    trackEvent('quiz_gumroad_support_click', { companion: result?.id ?? '' });
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
        {/* Progress: quiz questions + companion result */}
        {(isQuestionStep || (isResultStep && funnelPhase === 'companion')) && (
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
        {postQuizStep > 0 && (
          <p className="text-[#6B46C1] pixel-font text-xs mb-4 text-center">
            Step {postQuizStep} of 4
            {postQuizStep >= 3 ? ' · Almost there' : ''}
          </p>
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

          {isResultStep && result && funnelPhase === 'companion' && (
            <motion.div
              key="funnel-companion"
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

                <button
                  type="button"
                  onClick={() => setFunnelPhase('save_journey')}
                  className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] mb-3"
                >
                  Continue →
                </button>
                <p className="text-[#6B46C1] text-xs text-center mb-2">Want to discover a different companion?</p>
                <button
                  type="button"
                  onClick={handleTakeAgain}
                  className="w-full py-2 border-4 border-[#B794F6] bg-white/80 hover:bg-[#E9D8FD] text-[#553C9A] pixel-font text-xs transition-all duration-150 mb-2"
                >
                  Take quiz again ↻
                </button>
                <Link to="/" className="block text-center text-[#9F7AEA] hover:text-[#6B46C1] pixel-font text-[10px]">
                  ← MindQuest home
                </Link>
              </PixelCard>
            </motion.div>
          )}

          {isResultStep && result && funnelPhase === 'save_journey' && (
            <motion.div
              key="funnel-save"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8 text-center">
                <h2 className="text-lg text-[#553C9A] pixel-font mb-2">Save your reflection journey</h2>
                <p className="text-[#6B46C1] text-sm mb-6">
                  Get your companion + future insights delivered to you.
                </p>
                <div className="flex flex-col gap-3 items-center w-full max-w-sm mx-auto mb-4">
                  <input
                    type="text"
                    value={saveFirstname}
                    onChange={(e) => { setSaveFirstname(e.target.value); setSaveError(null); }}
                    placeholder="First name (optional)"
                    disabled={saveLoading}
                    className="w-full box-border px-4 py-3 border-4 border-[#9F7AEA] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:outline-none focus:border-[#6B46C1] pixel-font text-sm min-w-0"
                  />
                  <input
                    type="email"
                    value={saveEmail}
                    onChange={(e) => { setSaveEmail(e.target.value); setSaveError(null); }}
                    placeholder="Email"
                    disabled={saveLoading}
                    className="w-full box-border px-4 py-3 border-4 border-[#9F7AEA] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:outline-none focus:border-[#6B46C1] pixel-font text-sm min-w-0"
                  />
                </div>
                {saveError && <p className="text-red-600 text-xs pixel-font mb-3">{saveError}</p>}
                <button
                  type="button"
                  onClick={handleSaveJourneyContinue}
                  disabled={saveLoading}
                  className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] disabled:opacity-70 text-white border-4 border-[#553C9A] pixel-font text-xs mb-3"
                >
                  {saveLoading ? 'Saving…' : 'Continue'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveJourneySkip}
                  disabled={saveLoading}
                  className="w-full py-2 border-4 border-[#B794F6] bg-white/80 hover:bg-[#E9D8FD] text-[#553C9A] pixel-font text-xs"
                >
                  Skip for now
                </button>
              </PixelCard>
            </motion.div>
          )}

          {isResultStep && result && funnelPhase === 'reflection' && (
            <motion.div
              key="funnel-reflect"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8">
                <p className="text-[#553C9A] pixel-font text-xs mb-2 text-center">Your prompt</p>
                <p className="text-[#6B46C1] text-sm mb-4 text-center">{result.gentlePrompt}</p>
                <p className="text-[#9F7AEA] text-xs mb-3 pixel-font">How are you right now? (tap one)</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {MOOD_CHIPS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setReflectionMood(m.label)}
                      className={`px-3 py-2 border-4 pixel-font text-xs transition-all ${
                        reflectionMood === m.label
                          ? 'border-[#6B46C1] bg-[#E9D8FD]'
                          : 'border-[#B794F6] bg-white/80 hover:border-[#9F7AEA]'
                      }`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="One line is enough (optional)"
                  rows={3}
                  className="w-full box-border px-4 py-3 border-4 border-[#E9D8FD] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:border-[#B794F6] focus:outline-none text-sm mb-4 resize-none"
                />
                <button
                  type="button"
                  onClick={handleReflectionContinue}
                  className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs"
                >
                  Continue →
                </button>
              </PixelCard>
            </motion.div>
          )}

          {isResultStep && result && funnelPhase === 'donation' && (
            <motion.div
              key="funnel-donate"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8 text-center">
                <p className="text-[#553C9A] pixel-font text-xs mb-4">You’ve completed your first moment. ✨</p>
                <h2 className="text-lg text-[#553C9A] pixel-font mb-3">Help us build MindQuest</h2>
                <p className="text-[#6B46C1] text-sm mb-6 leading-relaxed">
                  If this moment helped you, you can support us. Even $5 helps us build a calmer space for more people.
                </p>
                <a
                  href={GUMROAD_PRODUCT_URL}
                  className="gumroad-button mindquest-gumroad block w-full py-3 mb-3 text-center pixel-font text-xs border-4 border-[#553C9A] bg-[#6B46C1] text-white hover:bg-[#553C9A] transition-colors no-underline"
                  data-gumroad-overlay-checkout="true"
                  onClick={handleGumroadClick}
                >
                  Unlock my full journey
                </a>
                <button
                  type="button"
                  onClick={handleDonationContinue}
                  className="w-full py-3 border-4 border-[#553C9A] bg-white/90 hover:bg-[#E9D8FD] text-[#553C9A] pixel-font text-xs transition-colors"
                >
                  Continue to app
                </button>
              </PixelCard>
            </motion.div>
          )}

          {isResultStep && result && funnelPhase === 'ready' && (
            <motion.div
              key="funnel-ready"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PixelCard color="gradient" className="p-6 md:p-8 text-center">
                <div className="text-4xl mb-4">✨</div>
                <h2 className="text-xl text-[#553C9A] pixel-font mb-6">Your space is ready</h2>
                <a
                  href={MINDQUEST_APP_URL}
                  className="inline-block w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs transition-all shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] mb-3 text-center"
                >
                  Enter MindQuest →
                </a>
                <button type="button" onClick={handleTakeAgain} className="text-[#9F7AEA] pixel-font text-[10px] underline">
                  Start the quiz again
                </button>
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
