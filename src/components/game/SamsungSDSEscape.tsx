import { TypewriterText } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useGameSound } from "@/hooks/useGameSound";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle, User, XCircle } from "lucide-react";
import { useCallback, useState } from "react";

interface StoryStep {
  id: string;
  type: "story" | "question" | "success" | "failure";
  text: string;
  image?: string;
  question?: string;
  correctAnswer?: string;
  hint?: string;
}

const storySteps: StoryStep[] = [
  {
    id: "intro",
    type: "story",
    text: "일요일 아침, 따뜻한 이불 속에서 뒤척이던 중...",
  },
  {
    id: "phone-call",
    type: "story",
    text: "갑작스럽게 울리는 전화벨소리! 🔔\n\n'여보세요? 지금 당장 회사로 나와주세요! 긴급상황입니다!'",
  },
  {
    id: "rush-to-company",
    type: "story",
    text: "급하게 옷을 입고 회사로 달려나왔습니다.\n잠실 삼성 SDS 타워가 보입니다...",
    image: "/images/samsung-sds/1.png",
  },
  {
    id: "security-guard",
    type: "story",
    text: "회사 앞에서 보안 가드를 만났습니다.\n\n'어디 소속이십니까?'",
  },
  {
    id: "department-question",
    type: "question",
    text: "보안 가드가 당신의 소속을 묻고 있습니다.",
    question: "당신은 어느 그룹 소속입니까?",
    correctAnswer: "MSP 서비스 개발 그룹",
    hint: "MSP는 Managed Service Provider의 줄임말입니다.",
  },
  {
    id: "success-entry",
    type: "success",
    text: "정답입니다! 보안 가드가 고개를 끄덕이며 길을 열어줍니다.\n\n'MSP 서비스 개발 그룹이시군요. 어서 들어가세요!'",
  },
];

export function SamsungSDSEscape() {
  const navigate = useNavigate();
  const roomId = "samsung-sds";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerResult, setAnswerResult] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const { playClickSound, playSuccessSound, playErrorSound } = useGameSound();
  const { timeElapsed, formattedTime, startTimer, stopTimer, pauseTimer } =
    useGameTimer();
  const {
    progress,
    isLoading,
    saveProgress,
    completeGame,
    resetProgress,
    isSaving,
    isCompleting,
  } = useGameProgress(roomId);

  const currentStep = storySteps[currentStepIndex];

  // 게임 시작 시 진행상황 불러오기
  useEffect(() => {
    if (progress && !isLoading) {
      setCurrentStepIndex(progress.currentStep);
      setScore(progress.score);
      setHintsUsed(progress.hintsUsed);
      // 타이머는 저장된 시간부터 재개
      startTimer();
    } else if (!progress && !isLoading) {
      // 새 게임 시작
      startTimer();
    }
  }, [progress, isLoading, startTimer]);

  // 진행상황 자동 저장 (스텝 변경 시)
  useEffect(() => {
    if (currentStepIndex > 0 && !isLoading) {
      saveProgress({
        currentStep: currentStepIndex,
        score,
        hintsUsed,
        timeElapsed,
      });
    }
  }, [currentStepIndex, score, hintsUsed, timeElapsed, saveProgress, isLoading]);

  // 뒤로가기 핸들러
  const handleGoBack = useCallback(() => {
    // 진행상황 저장 후 홈으로 이동
    if (currentStepIndex > 0) {
      saveProgress({
        currentStep: currentStepIndex,
        score,
        hintsUsed,
        timeElapsed,
      });
    }
    navigate({ to: "/" });
  }, [currentStepIndex, score, hintsUsed, timeElapsed, saveProgress, navigate]);

  // 게임 완료 핸들러
  const handleGameComplete = useCallback(() => {
    const finalScore = score + (timeElapsed < 300 ? 100 : 50); // 시간 보너스
    completeGame({
      finalScore,
      totalTime: timeElapsed,
      hintsUsed,
    });
  }, [score, timeElapsed, hintsUsed, completeGame]);

  const handleTextComplete = useCallback(() => {
    if (currentStep.type === "question") {
      setShowInput(true);
    } else if (currentStep.type === "story") {
      // 자동으로 다음 스텝으로 진행 (3초 후)
      setTimeout(() => {
        if (currentStepIndex < storySteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 2000);
    }
  }, [currentStep.type, currentStepIndex]);

  const handleAnswerSubmit = useCallback(() => {
    if (!userAnswer.trim()) return;

    setIsAnswering(true);
    playClickSound();

    // 정답 체크 (대소문자 구분 없이, 공백 제거)
    const normalizedAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, "");
    const normalizedCorrect =
      currentStep.correctAnswer?.toLowerCase().replace(/\s+/g, "") || "";

    setTimeout(() => {
      if (normalizedAnswer === normalizedCorrect) {
        setAnswerResult("correct");
        playSuccessSound();
        setScore((prev) => prev + 10); // 정답 점수 추가
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          setShowInput(false);
          setUserAnswer("");
          setAnswerResult(null);
          setIsAnswering(false);
        }, 2000);
      } else {
        setAnswerResult("incorrect");
        playErrorSound();
        setTimeout(() => {
          setAnswerResult(null);
          setIsAnswering(false);
        }, 2000);
      }
    }, 1000);
  }, [
    userAnswer,
    currentStep.correctAnswer,
    playClickSound,
    playSuccessSound,
    playErrorSound,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAnswering) {
      handleAnswerSubmit();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-white/20 bg-black/40 shadow-2xl backdrop-blur-lg">
          <CardContent className="p-8">
            {/* 상단 컨트롤 바 */}
            <div className="mb-6 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
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
                  {currentStepIndex + 1} / {storySteps.length}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-700">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStepIndex + 1) / storySteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

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
                  onComplete={handleTextComplete}
                  className="text-lg leading-relaxed whitespace-pre-line text-white"
                />
              </div>
            </div>

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
                      <span className="font-medium text-blue-300">
                        {currentStep.question}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="답변을 입력하세요..."
                        className="border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                        disabled={isAnswering}
                      />
                      <Button
                        onClick={handleAnswerSubmit}
                        disabled={!userAnswer.trim() || isAnswering}
                        className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                      >
                        {isAnswering ? "확인 중..." : "제출"}
                      </Button>
                    </div>

                    {currentStep.hint && (
                      <p className="mt-2 text-sm text-gray-400">
                        💡 힌트: {currentStep.hint}
                      </p>
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

            {/* 게임 완료 */}
            {currentStep.type === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <div className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6">
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
                  <h2 className="mb-2 text-2xl font-bold text-white">1단계 완료!</h2>
                  <p className="mb-4 text-gray-300">성공적으로 회사에 입장했습니다.</p>

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
                      onClick={handleGameComplete}
                      disabled={isCompleting}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                    >
                      {isCompleting ? "완료 처리 중..." : "게임 완료"}
                    </Button>
                    <Button
                      onClick={handleGoBack}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      홈으로 가기
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
