import { createContext, useContext, useState, ReactNode } from 'react';

interface Pet {
  id: string;
  name: string;
  personality: string;
  level: number;
  xp: number;
  mood: 'happy' | 'sad' | 'stressed' | 'calm' | 'excited' | 'neutral';
}

interface UserContextType {
  user: { email: string } | null;
  pet: Pet | null;
  streak: number;
  totalXP: number;
  setUser: (user: { email: string } | null) => void;
  setPet: (pet: Pet | null) => void;
  addXP: (amount: number) => void;
  updatePetMood: (mood: Pet['mood']) => void;
  incrementStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [pet, setPetState] = useState<Pet | null>(null);
  const [streak, setStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(0);

  const setPet = (newPet: Pet | null) => {
    setPetState(newPet);
  };

  const addXP = (amount: number) => {
    setTotalXP(prev => prev + amount);
    if (pet) {
      const newXP = pet.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      setPetState({
        ...pet,
        xp: newXP,
        level: newLevel
      });
    }
  };

  const updatePetMood = (mood: Pet['mood']) => {
    if (pet) {
      setPetState({ ...pet, mood });
    }
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        pet,
        streak,
        totalXP,
        setUser,
        setPet,
        addXP,
        updatePetMood,
        incrementStreak
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
