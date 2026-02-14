import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { PixelCard } from '../components/PixelCard';
import { useUser } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

const pets = [
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🐱',
    personality: 'Calm & Reflective',
    description: 'Luna loves quiet moments and deep thoughts',
    color: '#9F7AEA'
  },
  {
    id: 'buddy',
    name: 'Buddy',
    emoji: '🐶',
    personality: 'Energetic & Cheerful',
    description: 'Buddy brings joy and excitement to your day',
    color: '#F6AD55'
  },
  {
    id: 'sage',
    name: 'Sage',
    emoji: '🦉',
    personality: 'Wise & Insightful',
    description: 'Sage offers wisdom and thoughtful perspectives',
    color: '#4299E1'
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '🐰',
    personality: 'Creative & Playful',
    description: 'Spark inspires creativity and fun exploration',
    color: '#F687B3'
  }
];

export function PetSelection() {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [hoveredPet, setHoveredPet] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { setPet, setUser } = useUser();

  const handleSelectPet = (petId: string) => {
    setSelectedPet(petId);
  };

  const handleStartQuest = () => {
    if (selectedPet && email.trim()) {
      const pet = pets.find(p => p.id === selectedPet);
      if (pet) {
        setPet({
          id: pet.id,
          name: pet.name,
          personality: pet.personality,
          level: 1,
          xp: 0,
          mood: 'happy'
        });
        setUser({ email: email.trim() });
        navigate('/first-journal');
      }
    }
  };

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

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-[#B794F6] hover:border-[#9F7AEA] text-[#6B46C1] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl text-[#553C9A] pixel-font mb-4">
            Choose Your Companion
          </h1>
          <p className="text-lg text-[#6B46C1]">
            Pick a pet to join you on your reflection journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredPet(pet.id)}
              onHoverEnd={() => setHoveredPet(null)}
            >
              <PixelCard
                interactive
                color={selectedPet === pet.id ? 'gradient' : 'light'}
                className={`p-8 relative overflow-hidden transition-all duration-300 ${
                  selectedPet === pet.id 
                    ? 'border-[#6B46C1] shadow-[8px_8px_0px_0px_rgba(107,70,193,0.3)]' 
                    : hoveredPet === pet.id 
                    ? 'border-[#9F7AEA] shadow-[4px_4px_0px_0px_rgba(159,122,234,0.3)]' 
                    : 'shadow-none'
                }`}
                onClick={() => handleSelectPet(pet.id)}
              >
                {/* Selected Glow Effect */}
                {selectedPet === pet.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#9F7AEA]/20 to-[#6B46C1]/20 pointer-events-none"
                  />
                )}

                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    className="text-7xl mb-4"
                    animate={
                      selectedPet === pet.id || hoveredPet === pet.id
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {pet.emoji}
                  </motion.div>
                  
                  <h3 className="text-2xl text-[#553C9A] mb-2 pixel-font">
                    {pet.name}
                  </h3>
                  
                  <div
                    className="px-4 py-2 mb-3 text-sm pixel-font transition-all duration-200"
                    style={{ 
                      backgroundColor: `${pet.color}40`,
                      color: pet.color,
                      border: `2px solid ${pet.color}`,
                      transform: hoveredPet === pet.id || selectedPet === pet.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {pet.personality}
                  </div>
                  
                  <p className="text-[#6B46C1] text-sm">
                    {pet.description}
                  </p>

                  {selectedPet === pet.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="mt-4 w-10 h-10 bg-[#6B46C1] text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>

        {/* Email Input Section */}
        {selectedPet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <PixelCard color="light" className="max-w-xl mx-auto p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">
                  {pets.find(p => p.id === selectedPet)?.emoji}
                </div>
                <h2 className="text-2xl text-[#553C9A] pixel-font mb-2">
                  Ready to Begin with {pets.find(p => p.id === selectedPet)?.name}? ✨
                </h2>
                <p className="text-[#6B46C1] text-sm">
                  Enter your email to start your mindful journey
                </p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white border-4 border-[#B794F6] focus:border-[#6B46C1] focus:outline-none text-[#553C9A] placeholder:text-[#B794F6] transition-colors"
                />
                
                <button
                  onClick={handleStartQuest}
                  disabled={!email.trim()}
                  className="w-full px-8 py-4 bg-[#6B46C1] hover:bg-[#553C9A] text-white border-4 border-[#553C9A] hover:border-[#44337A] transition-all duration-150 active:translate-y-1 pixel-font shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6B46C1] disabled:shadow-[4px_4px_0px_0px_rgba(68,51,122,1)]"
                >
                  Start Your Quest 🚀
                </button>
              </div>
            </PixelCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}