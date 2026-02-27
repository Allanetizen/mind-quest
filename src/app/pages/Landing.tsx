import logo from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PixelCard } from '../components/PixelCard';
import { QUIZ_PATH } from '../routes';
import { GameElement } from '../components/GameElement';
import { motion } from 'motion/react';
import { trackEvent } from '../utils/analytics';

const SUBSCRIBE_API = import.meta.env.VITE_SUBSCRIBE_API_URL || '/api/subscribe';

export function Landing() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        {/* Hero: form is the entrance */}
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
            className="text-[#6B46C1] mb-8 text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Guided reflections. Zero stress.
          </motion.p>

          {/* Email form – main entrance, built within box */}
          <motion.div
            className="w-full max-w-md mx-auto min-w-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PixelCard color="gradient" className="p-6 md:p-8 text-center min-w-0">
              <div className="min-w-0">
                <p className="text-[#553C9A] pixel-font text-sm md:text-base mb-4 break-words">
                  Enter your email to begin ✨
                </p>
              </div>
              {!submitted ? (
                <form
                  className="flex flex-col gap-3 items-center min-w-0 w-full"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    setLoading(true);
                    const emailValue = email.trim();
                    try {
                      const res = await fetch(SUBSCRIBE_API, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Accept: 'application/json',
                        },
                        body: JSON.stringify({
                          email: emailValue,
                          ...(firstname.trim() && { firstname: firstname.trim() }),
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setError(data.error || 'Something went wrong. Try again.');
                        setLoading(false);
                        return;
                      }
                      trackEvent('email_submitted');
                      setSubmitted(true);
                      navigate(QUIZ_PATH, { state: { email: emailValue } });
                    } catch {
                      setError('Connection error. Try again.');
                    }
                    setLoading(false);
                  }}
                >
                  <div className="w-full max-w-sm min-w-0 flex flex-col items-center">
                    <input
                      type="text"
                      value={firstname}
                      onChange={(e) => { setFirstname(e.target.value); setError(null); }}
                      placeholder="First name (optional)"
                      disabled={loading}
                      className="w-full box-border px-4 py-3 border-4 border-[#9F7AEA] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:outline-none focus:border-[#6B46C1] pixel-font text-sm disabled:opacity-70 min-w-0"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="your.email@example.com"
                      required
                      disabled={loading}
                      className="w-full box-border px-4 py-3 border-4 border-[#9F7AEA] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:outline-none focus:border-[#6B46C1] pixel-font text-sm disabled:opacity-70 min-w-0"
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-xs pixel-font break-words text-center max-w-sm w-full">{error}</p>
                  )}
                  <div className="w-full flex flex-col items-center min-w-0">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-2 border-[#553C9A] pixel-font text-xs transition-colors disabled:opacity-70 shrink-0"
                    >
                      {loading ? 'Sending…' : 'Start your quest →'}
                    </button>
                    <p className="text-[#9F7AEA] text-[10px] leading-tight max-w-xs mt-2 break-words text-center px-1">
                      By signing up you agree to receive MindQuest updates and newsletters.
                    </p>
                  </div>
                </form>
              ) : (
                <p className="text-[#553C9A] pixel-font text-sm mb-2">You’re in! ✨</p>
              )}
              {submitted && (
                <p className="mt-4 text-[#9F7AEA] text-xs">
                  Then take a short quiz to find your companion.
                </p>
              )}
            </PixelCard>
            <p className="mt-3 text-center">
              <Link to={QUIZ_PATH} className="text-[#9F7AEA] hover:text-[#6B46C1] pixel-font text-xs underline">
                Or take the quiz first (shareable link)
              </Link>
            </p>
          </motion.div>

          {/* Game elements – each card built within its own box */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl mt-12 mb-12 min-w-0">
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <GameElement
                emoji="🎯"
                label="Daily Quest"
                value="2 min"
              />
            </motion.div>
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <GameElement
                emoji="🔥"
                label="Streak"
                value="7 days"
              />
            </motion.div>
            <motion.div className="min-w-0 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
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