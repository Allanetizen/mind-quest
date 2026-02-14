import { motion } from 'motion/react';
import { PixelCard } from './PixelCard';
import { Sparkles } from 'lucide-react';

interface JournalCanvasProps {
  prompt: string;
  text: string;
  onTextChange: (text: string) => void;
  onFinish: () => void;
  isWriting: boolean;
  setIsWriting: (writing: boolean) => void;
}

export function JournalCanvas({ 
  prompt, 
  text, 
  onTextChange, 
  onFinish,
  isWriting,
  setIsWriting
}: JournalCanvasProps) {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const canFinish = wordCount >= 5;

  return (
    <PixelCard color="light" className="p-8">
      {/* Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-5 h-5 text-[#9F7AEA]" />
          <h2 className="text-lg text-[#553C9A] pixel-font">Daily Quest</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#E9D8FD] to-[#FAF5FF] p-4 border-4 border-[#B794F6] mb-6"
        >
          <p className="text-[#553C9A] text-sm md:text-base">
            💭 {prompt}
          </p>
        </motion.div>
      </div>

      {/* Journal Textarea */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <textarea
          value={text}
          onChange={(e) => {
            onTextChange(e.target.value);
            if (!isWriting && e.target.value.length > 0) {
              setIsWriting(true);
            }
          }}
          placeholder="Start writing... Let your thoughts flow freely."
          className="w-full h-64 md:h-80 p-6 bg-white border-4 border-[#E9D8FD] focus:border-[#B794F6] focus:outline-none text-[#4A5568] resize-none overflow-y-auto"
          style={{
            lineHeight: '1.8',
            fontSize: '16px'
          }}
        />
      </motion.div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[#9F7AEA]">
          {wordCount > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {wordCount} {wordCount === 1 ? 'word' : 'words'} ✨
            </motion.span>
          )}
        </div>

        <button
          onClick={onFinish}
          disabled={!canFinish}
          className={`px-8 py-3 border-4 transition-all pixel-font text-sm ${
            canFinish
              ? 'bg-[#6B46C1] hover:bg-[#553C9A] text-white border-[#553C9A] hover:border-[#44337A] shadow-[4px_4px_0px_0px_rgba(68,51,122,1)] hover:shadow-[2px_2px_0px_0px_rgba(68,51,122,1)] active:shadow-none active:translate-y-1 cursor-pointer'
              : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          {canFinish ? 'Complete Quest ✓' : 'Keep writing...'}
        </button>
      </div>

      {/* Floating prompt hints */}
      {text.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-[#B794F6]">
            💡 Tip: There's no right or wrong answer. Just be honest with yourself.
          </p>
        </motion.div>
      )}
    </PixelCard>
  );
}
