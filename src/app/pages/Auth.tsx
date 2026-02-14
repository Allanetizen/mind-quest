import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PixelCard } from '../components/PixelCard';
import { useUser } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

export function Auth() {
  const navigate = useNavigate();
  const { pet } = useUser();

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

    if (!document.querySelector('script[src="https://cdn.sender.net/accounts_resources/universal.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.sender.net/accounts_resources/universal.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }

    win.sender(senderId);
  }, []);

  return (
    <div className="min-h-screen bg-[#DDD6F3] relative overflow-hidden flex items-center justify-center">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(#6B46C1 1px, transparent 1px),
          linear-gradient(90deg, #6B46C1 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Back Button - Positioned Absolutely */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-20"
      >
        <button
          onClick={() => navigate('/choose-pet')}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-[#B794F6] hover:border-[#9F7AEA] text-[#6B46C1] transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </motion.div>

      <div className="relative z-10 px-6 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <PixelCard color="gradient" className="p-8 md:p-12">
            <div className="text-center mb-8">
              {pet && (
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {pet.id === 'luna' && '🐱'}
                  {pet.id === 'buddy' && '🐶'}
                  {pet.id === 'sage' && '🦉'}
                  {pet.id === 'spark' && '🐰'}
                </motion.div>
              )}
              <h1 className="text-2xl md:text-3xl text-[#553C9A] pixel-font mb-2">
                Start Your Journey
              </h1>
              <p className="text-[#6B46C1] text-sm">
                {pet?.name || 'Your pet'} is ready to meet you!
              </p>
            </div>

            <div
              style={{ textAlign: 'left' }}
              className="sender-form-field sender-embed"
              data-sender-form-id="dR6JzL"
            ></div>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}