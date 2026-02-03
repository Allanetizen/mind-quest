import React, { useState } from 'react';
import { PixelCard } from './components/PixelCard';
import { PixelButton } from './components/PixelButton';
import { GameElement } from './components/GameElement';

const logo = new URL('../assets/mindquest.png', import.meta.url).href;

export default function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
      <div className="absolute top-20 left-10 opacity-30">
        <div className="w-8 h-8 bg-[#9F7AEA]" style={{ imageRendering: 'pixelated' }}></div>
      </div>
      <div className="absolute top-40 right-20 opacity-20">
        <div className="w-6 h-6 bg-[#B794F6]" style={{ imageRendering: 'pixelated' }}></div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-25">
        <div className="w-10 h-10 bg-[#E9D8FD]" style={{ imageRendering: 'pixelated' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="px-6 py-12 md:py-16 flex flex-col items-center text-center max-w-5xl mx-auto">
          <img 
            src={logo} 
            alt="MindQuest" 
            className="w-40 h-40 md:w-56 md:h-56 mb-8"
            style={{ imageRendering: 'pixelated' }}
          />
          
          <h1 className="text-4xl md:text-6xl mb-4 text-[#553C9A] tracking-tight pixel-font">
            Reflect a little.<br/>Grow a lot.
          </h1>
          
          <p className="text-lg md:text-xl text-[#6B46C1] max-w-xl mb-12">
            Guided reflections. Zero stress.
          </p>

          {/* Visual Game Elements */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl mb-16">
            <GameElement
              emoji="🎯"
              label="Daily Quest"
              value="2 min"
            />
            <GameElement
              emoji="🔥"
              label="Streak"
              value="7 days"
            />
            <GameElement
              emoji="✨"
              label="Insights"
              value="AI-guided"
            />
          </div>
        </section>

        {/* Visual Problem/Solution Flow */}
        <section className="px-6 py-12 md:py-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Problem Card */}
            <PixelCard color="purple" className="text-center p-8">
              <div className="text-4xl mb-4">😔</div>
              <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">Before</h3>
              <p className="text-[#6B46C1] text-sm leading-relaxed">
                Journaling feels like a chore.<br/>
                Too long. Too hard. Too easy to forget.
              </p>
            </PixelCard>

            {/* Solution Card */}
            <PixelCard color="light" className="text-center p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl text-[#553C9A] mb-3 pixel-font">After</h3>
              <p className="text-[#6B46C1] text-sm leading-relaxed">
                Quick, guided prompts.<br/>
                Gamified. Rewarding. Insightful.
              </p>
            </PixelCard>
          </div>

          {/* Feature Showcase */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm">
              📝 AI Prompts
            </div>
            <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm">
              🎮 Gamified
            </div>
            <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm">
              💡 Insights
            </div>
            <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-4 border-[#B794F6] text-[#553C9A] pixel-font text-sm">
              ⏱️ 2-Min Daily
            </div>
          </div>
        </section>

        {/* Signup */}
        <section className="px-6 py-12 md:py-16">
          <div className="max-w-lg mx-auto">
            <PixelCard color="gradient" className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl mb-3 text-[#553C9A] pixel-font">
                Join the Quest
              </h2>
              <p className="text-[#6B46C1] mb-8 text-sm">
                Be first in line ✨
              </p>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-6 py-4 border-4 border-[#9F7AEA] bg-white text-[#553C9A] placeholder:text-[#B794F6] focus:outline-none focus:border-[#6B46C1] pixel-font"
                  />
                  
                  <PixelButton type="submit">
                    Join Waitlist
                  </PixelButton>
                  
                  <p className="text-xs text-[#9F7AEA] mt-4">
                    Don't worry — we don't spam. We protect your mental peace.
                  </p>
                </form>
              ) : (
                <div className="py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <p className="text-xl text-[#553C9A] pixel-font">You're in!</p>
                  <p className="text-[#6B46C1] text-sm mt-2">Talk soon ✨</p>
                </div>
              )}
            </PixelCard>
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