import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, User, XCircle } from "lucide-react";
import { StoryStep } from "../types";

interface QuestionInputProps {
  currentStep: StoryStep;
  showInput: boolean;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  isAnswering: boolean;
  answerResult: "correct" | "incorrect" | null;
  onAnswerSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function QuestionInput({
  currentStep,
  showInput,
  userAnswer,
  setUserAnswer,
  isAnswering,
  answerResult,
  onAnswerSubmit,
  onKeyPress,
}: QuestionInputProps) {
  return (
    <>
      {/* 질문 및 입력 */}
      <AnimatePresence>
        {currentStep.type === "question" && showInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="rounded-lg border border-blue-500/30 bg-blue-900/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-300">{currentStep.question}</span>
              </div>

              <div className="flex gap-3">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder="답변을 입력하세요..."
                  className="border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                  disabled={isAnswering}
                />
                <Button
                  onClick={onAnswerSubmit}
                  disabled={!userAnswer.trim() || isAnswering}
                  className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  {isAnswering ? "확인 중..." : "제출"}
                </Button>
              </div>

              {currentStep.hint && (
                <p className="mt-2 text-sm text-gray-400">💡 힌트: {currentStep.hint}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 답변 결과 */}
      <AnimatePresence>
        {answerResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`mt-4 flex items-center gap-3 rounded-lg p-4 ${
              answerResult === "correct"
                ? "border border-green-500/30 bg-green-900/30 text-green-300"
                : "border border-red-500/30 bg-red-900/30 text-red-300"
            }`}
          >
            {answerResult === "correct" ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
            <span className="font-medium">
              {answerResult === "correct"
                ? "정답입니다!"
                : "틀렸습니다. 다시 시도해보세요."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
