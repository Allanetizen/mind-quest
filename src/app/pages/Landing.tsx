import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { PixelCard } from '../components/PixelCard';
import { QUIZ_PATH } from '../routes';
import { GameElement } from '../components/GameElement';
import { motion } from 'motion/react';
import { trackEvent } from '../utils/analytics';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#DDD6F3] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#6B46C1 1px, transparent 1px), linear-gradient(90deg, #6B46C1 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10">
        <section className="px-6 pt-10 pb-12 md:pt-14 md:pb-16 flex flex-col items-center text-center max-w-2xl mx-auto">
          <motion.img
            src={logo}
            alt="MindQuest"
            className="w-32 h-32 md:w-40 md:h-40 mb-6"
            style={{ imageRendering: 'pixelated' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-3xl md:text-5xl mb-2 text-[#553C9A] tracking-tight pixel-font"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Reflect a little.<br />Grow a lot.
          </motion.h1>
          <motion.p
            className="text-[#6B46C1] mb-4 text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Guided reflections. Zero stress.
          </motion.p>

          {/* Value proposition */}
          <motion.div
            className="w-full max-w-md mx-auto mb-8 text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PixelCard color="light" className="p-5 md:p-6 min-w-0">
              <p className="text-[#553C9A] pixel-font text-xs mb-3">Why MindQuest</p>
              <ul className="text-[#6B46C1] text-sm space-y-2 list-none">
                <li className="flex gap-2">
                  <span aria-hidden>✨</span>
                  <span>Quick emotional check-ins that meet you where you are—no long journaling homework.</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>🎯</span>
                  <span>A gentle companion and prompts so reflection feels light, not like a chore.</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>💜</span>
                  <span>Built for calm: small steps, real progress, at your pace.</span>
                </li>
              </ul>
            </PixelCard>
          </motion.div>

          {/* Feature cards – above CTA */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl mb-8 min-w-0">
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <GameElement emoji="🎯" label="Daily Quest" value="2 min" />
            </motion.div>
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <GameElement emoji="🔥" label="Streak" value="7 days" />
            </motion.div>
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <GameElement emoji="✨" label="Insights" value="AI-guided" />
            </motion.div>
          </div>

          {/* Start your quest → quiz */}
          <motion.div
            className="w-full max-w-md mx-auto min-w-0 mb-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <PixelCard color="gradient" className="p-6 md:p-8 text-center min-w-0">
              <p className="text-[#553C9A] pixel-font text-sm mb-5">
                Ready when you are—take a short check-in and meet your companion.
              </p>
              <Link
                to={QUIZ_PATH}
                onClick={() => trackEvent('landing_start_quest')}
                className="inline-block px-8 py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] pixel-font text-xs transition-all duration-150 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(68,51,122,1)]"
              >
                Start your quest →
              </Link>
            </PixelCard>
          </motion.div>
        </section>

        <section className="px-6 py-12 md:py-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
              <PixelCard interactive color="purple" className="text-center p-8">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">Before</h3>
                <p className="text-[#6B46C1] text-sm leading-relaxed">
                  Journaling feels like a chore.<br />
                  Too long. Too hard. Too easy to forget.
                </p>
              </PixelCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
              <PixelCard interactive color="light" className="text-center p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">After</h3>
                <p className="text-[#6B46C1] text-sm leading-relaxed">
                  Quick, guided prompts.<br />
                  Gamified. Rewarding. Insightful.
                </p>
              </PixelCard>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['📝 AI Prompts', '🎮 Gamified', '💡 Insights', '⏱️ 2-Min Daily'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm hover:bg-white/80 hover:scale-105 transition-all cursor-pointer"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="px-6 py-8 text-center">
          <p className="text-sm text-[#9F7AEA] pixel-font">© 2026 MindQuest</p>
        </footer>
      </div>
    </div>
  );
}
