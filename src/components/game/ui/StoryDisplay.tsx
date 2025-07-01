import { TypewriterText } from "@/components/animations";
import { AnimatePresence, motion } from "framer-motion";
import { StoryStep } from "../types";

interface StoryDisplayProps {
  currentStep: StoryStep;
  onTextComplete: () => void;
}

export function StoryDisplay({ currentStep, onTextComplete }: StoryDisplayProps) {
  return (
    <>
      {/* 이미지 표시 */}
      <AnimatePresence>
        {currentStep.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-8 text-center"
          >
            <img
              src={currentStep.image}
              alt="게임 이미지"
              className="mx-auto h-auto max-w-full rounded-lg shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스토리 텍스트 */}
      <div className="mb-8 flex min-h-[120px] items-center">
        <div className="w-full">
          <TypewriterText
            key={currentStep.id}
            text={currentStep.text}
            speed={30}
            onComplete={onTextComplete}
            className="text-lg leading-relaxed whitespace-pre-line text-white"
          />
        </div>
      </div>
    </>
  );
}
