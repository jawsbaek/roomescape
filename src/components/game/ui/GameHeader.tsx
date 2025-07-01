import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Save } from "lucide-react";

interface GameHeaderProps {
  onGoBack: () => void;
  formattedTime: string;
  score: number;
  isSaving: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

export function GameHeader({
  onGoBack,
  formattedTime,
  score,
  isSaving,
  currentStepIndex,
  totalSteps,
}: GameHeaderProps) {
  return (
    <>
      {/* 상단 컨트롤 바 */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          className="text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Button>

        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span>시간:</span>
            <span className="font-mono text-white">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>점수:</span>
            <span className="font-bold text-yellow-400">{score}</span>
          </div>
          {isSaving && (
            <div className="flex items-center gap-1 text-blue-400">
              <Save className="h-4 w-4 animate-pulse" />
              <span>저장중...</span>
            </div>
          )}
        </div>
      </div>

      {/* 게임 제목 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 flex items-center justify-center gap-3 text-3xl font-bold text-white">
          <Building2 className="h-8 w-8 text-blue-400" />
          잠실의 별 삼성 SDS
        </h1>
        <p className="text-gray-300">방탈출 게임</p>
      </motion.div>

      {/* 진행률 표시 */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>진행률</span>
          <span>
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-700">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </>
  );
}
