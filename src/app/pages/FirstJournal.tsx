import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const welcomePrompts = [
  "What brings you to MindQuest today?",
  "How are you feeling in this moment?",
  "What's on your mind right now?",
  "What would you like to explore today?",
  "Take a moment - what do you notice about how you're feeling?",
  "What's something you've been carrying that you'd like to set down?",
];

export function FirstJournal() {
  const { pet, user } = useUser();
  const navigate = useNavigate();
  const [journalText, setJournalText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Set random welcome prompt
    const randomPrompt = welcomePrompts[Math.floor(Math.random() * welcomePrompts.length)];
    setPrompt(randomPrompt);
  }, []);

  const handleContinue = () => {
    if (journalText.trim().length >= 10) {
      navigate('/journal');
    }
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

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/choose-pet')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-[#B794F6] hover:border-[#9F7AEA] text-[#6B46C1] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#6B46C1]" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl text-[#553C9A] pixel-font">
              Welcome to Your Journey
            </h1>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#6B46C1]" />
            </motion.div>
          </div>
          
          <p className="text-lg text-[#6B46C1] mb-2">
            {pet.name} is excited to be your companion! 
          </p>
          <p className="text-sm text-[#9F7AEA]">
            Let's start with a simple reflection...
          </p>
        </motion.div>

        {/* Pet Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              {({ luna: '🐱', buddy: '🐶', sage: '🦉', spark: '🐰', rabbit: '🐇', bear: '🐻', turtle: '🐢', fox: '🦊' } as Record<string, string>)[pet.id] ?? '✨'}
            </motion.div>
            
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-32 top-0 bg-white px-4 py-2 border-4 border-[#B794F6] shadow-lg"
              style={{ width: '180px' }}
            >
              <div className="text-sm text-[#6B46C1] pixel-font">
                I'm here for you! 💜
              </div>
              <div 
                className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#B794F6]"
              ></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Journal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          {/* Scroll Paper Effect */}
          <div className="bg-[#FAF5E4] border-4 border-[#D4C5A9] shadow-2xl relative overflow-hidden">
            {/* Paper Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  #8B7355 0px,
                  transparent 1px,
                  transparent 2px,
                  #8B7355 3px
                )`
              }}
            ></div>

            {/* Scroll Content */}
            <div className="relative p-8 md:p-12">
              {/* Prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8 text-center"
              >
                <div className="inline-block bg-[#6B46C1]/10 px-6 py-3 border-2 border-[#B794F6]">
                  <p className="text-xl md:text-2xl text-[#553C9A] pixel-font">
                    {prompt}
                  </p>
                </div>
              </motion.div>

              {/* Decorative Line */}
              <div className="h-px bg-[#D4C5A9] mb-6"></div>

              {/* Text Area */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Begin writing your thoughts here..."
                  className="w-full min-h-[300px] bg-transparent border-none outline-none resize-none text-lg text-[#553C9A] placeholder:text-[#B794F6]/50 leading-relaxed"
                  style={{
                    fontFamily: 'Georgia, serif',
                  }}
                />
              </motion.div>

              {/* Word Count */}
              <div className="text-right mt-4">
                <span className="text-sm text-[#9F7AEA] pixel-font">
                  {journalText.split(/\s+/).filter(w => w.length > 0).length} words
                </span>
              </div>
            </div>

            {/* Scroll Decorative Edges */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#D4C5A9]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-[#D4C5A9]/30 to-transparent"></div>
          </div>

          {/* Animated Border Glow on Focus */}
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 border-4 border-[#9F7AEA] pointer-events-none"
              style={{
                boxShadow: '0 0 20px rgba(159, 122, 234, 0.5)'
              }}
            />
          )}
        </motion.div>

        {/* Continue Button */}
        {journalText.trim().length >= 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] hover:border-[#44337A] transition-all duration-150 active:translate-y-1 pixel-font shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none"
            >
              <span>Continue to Your Journal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Encouragement Message */}
        {journalText.trim().length < 10 && journalText.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-[#9F7AEA]">
              Keep going... {pet.name} is listening 💜
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}