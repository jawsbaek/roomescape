import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { StoryStep } from "../types";

interface GameFailureProps {
  currentStep: StoryStep;
  onRetry: () => void;
  onGoBack: () => void;
}

export function GameFailure({ currentStep, onRetry, onGoBack }: GameFailureProps) {
  if (currentStep.type !== "failure") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 text-center"
    >
      <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">게임 오버!</h2>
        <p className="mb-4 text-gray-300">잘못된 층을 선택했습니다.</p>

        <div className="flex justify-center gap-3">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
          >
            다시 시도
          </Button>
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface GameSuccessProps {
  currentStep: StoryStep;
  formattedTime: string;
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  isCompleting: boolean;
  onGameComplete: () => void;
  onGoBack: () => void;
}

export function GameSuccess({
  currentStep,
  formattedTime,
  score,
  timeElapsed,
  hintsUsed,
  isCompleting,
  onGameComplete,
  onGoBack,
}: GameSuccessProps) {
  if (currentStep.id !== "final-success") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 text-center"
    >
      <div className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">게임 완료!</h2>
        <p className="mb-4 text-gray-300">모든 미션을 성공적으로 완료했습니다! 🎉</p>

        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="text-lg font-bold text-white">{formattedTime}</div>
            <div className="text-sm text-gray-300">완료 시간</div>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="text-lg font-bold text-yellow-400">
              {score + (timeElapsed < 300 ? 100 : 50)}
            </div>
            <div className="text-sm text-gray-300">최종 점수</div>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="text-lg font-bold text-blue-400">{hintsUsed}</div>
            <div className="text-sm text-gray-300">힌트 사용</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={onGameComplete}
            disabled={isCompleting}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
          >
            {isCompleting ? "완료 처리 중..." : "게임 완료"}
          </Button>
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
