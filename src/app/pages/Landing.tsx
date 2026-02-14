import logo from '../../assets/logo.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelCard } from '../components/PixelCard';
import { PixelButton } from '../components/PixelButton';
import { GameElement } from '../components/GameElement';
import { motion } from 'motion/react';

export function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const senderId = '384d9197486881';
    const win = window as Window & { sender?: ((...args: unknown[]) => void) & { q?: unknown[]; l?: number } };

    if (!win.sender) {
      win.sender = function (...args: unknown[]) {
        const senderFn = win.sender;
        if (!senderFn) {
          return;
        }
        senderFn.q = senderFn.q || [];
        senderFn.q.push(args);
      };
      win.sender.l = 1 * new Date();
    }

    const initSender = () => {
      if (typeof win.sender === 'function') {
        win.sender(senderId);
      }
    };

    const existingScript = document.querySelector(
      'script[src="https://cdn.sender.net/accounts_resources/universal.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.sender.net/accounts_resources/universal.js';
      script.onload = initSender;
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    } else {
      initSender();
    }
  }, []);

  const handleGetStarted = () => {
    navigate('/choose-pet');
  };

  return (
    <div className="min-h-screen bg-[#DDD6F3] relative overflow-hidden">
      {/* Pixel Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(#6B46C1 1px, transparent 1px),
          linear-gradient(90deg, #6B46C1 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Floating Pixel Elements */}
      <motion.div 
        className="absolute top-20 left-10 opacity-30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 bg-[#9F7AEA]" style={{ imageRendering: 'pixelated' }}></div>
      </motion.div>
      <motion.div 
        className="absolute top-40 right-20 opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-6 bg-[#B794F6]" style={{ imageRendering: 'pixelated' }}></div>
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-20 opacity-25"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-10 h-10 bg-[#E9D8FD]" style={{ imageRendering: 'pixelated' }}></div>
      </motion.div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="px-6 py-12 md:py-16 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.img 
            src={logo} 
            alt="MindQuest" 
            className="w-40 h-40 md:w-56 md:h-56 mb-8"
            style={{ imageRendering: 'pixelated' }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          <motion.h1 
            className="text-4xl md:text-6xl mb-4 text-[#553C9A] tracking-tight pixel-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Reflect a little.<br/>Grow a lot.
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-[#6B46C1] max-w-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Guided reflections. Zero stress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full max-w-lg"
          >
            <div className="mb-4 text-[#6B46C1] text-sm">
              Enter your email to begin ✨
            </div>
            <div
              style={{ textAlign: 'left' }}
              className="sender-form-field sender-embed"
              data-sender-form-id="dR6JzL"
            ></div>
          </motion.div>

          {/* Visual Game Elements */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GameElement
                emoji="🎯"
                label="Daily Quest"
                value="2 min"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <GameElement
                emoji="🔥"
                label="Streak"
                value="7 days"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <GameElement
                emoji="✨"
                label="Insights"
                value="AI-guided"
              />
            </motion.div>
          </div>
        </section>

        {/* Visual Problem/Solution Flow */}
        <section className="px-6 py-12 md:py-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Problem Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <PixelCard interactive color="purple" className="text-center p-8">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">Before</h3>
                <p className="text-[#6B46C1] text-sm leading-relaxed">
                  Journaling feels like a chore.<br/>
                  Too long. Too hard. Too easy to forget.
                </p>
              </PixelCard>
            </motion.div>

            {/* Solution Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <PixelCard interactive color="light" className="text-center p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">After</h3>
                <p className="text-[#6B46C1] text-sm leading-relaxed">
                  Quick, guided prompts.<br/>
                  Gamified. Rewarding. Insightful.
                </p>
              </PixelCard>
            </motion.div>
          </div>

          {/* Feature Showcase */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['📝 AI Prompts', '🎮 Gamified', '💡 Insights', '⏱️ 2-Min Daily'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm hover:bg-white/80 hover:scale-105 transition-all cursor-pointer"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 text-center">
          <p className="text-sm text-[#9F7AEA] pixel-font">
            © 2026 MindQuest
          </p>
        </footer>
      </div>
    </div>
  );
}