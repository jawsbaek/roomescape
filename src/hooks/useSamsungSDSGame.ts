import { useGameProgress } from "@/hooks/useGameProgress";
import { useGameSound } from "@/hooks/useGameSound";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { samsungSdsStorySteps } from "../components/game/data/samsung-sds-story";
import { GameActions, GameState, StoryStep } from "../components/game/types";

const ROOM_ID = "samsung-sds";
const CORRECT_FLOOR = 6;

export function useSamsungSDSGame(): GameState &
  GameActions & {
    currentStep: StoryStep;
    formattedTime: string;
    timeElapsed: number;
    isSaving: boolean;
    isCompleting: boolean;
  } {
  const navigate = useNavigate();

  // 게임 상태
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerResult, setAnswerResult] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [showElevatorButtons, setShowElevatorButtons] = useState(false);
  const [isFloorSelecting, setIsFloorSelecting] = useState(false);
  const [showElevatorAnimation, setShowElevatorAnimation] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [isGameInitialized, setIsGameInitialized] = useState(false);

  // 우산 선택 관련 상태
  const [selectedUmbrella, setSelectedUmbrella] = useState<string | null>(null);
  const [showUmbrellaSelection, setShowUmbrellaSelection] = useState(false);
  const [isUmbrellaSelecting, setIsUmbrellaSelecting] = useState(false);

  // 소주 선택 관련 상태
  const [selectedSoju, setSelectedSoju] = useState<string | null>(null);
  const [showSojuSelection, setShowSojuSelection] = useState(false);
  const [isSojuSelecting, setIsSojuSelecting] = useState(false);

  // 훅들
  const { playClickSound, playSuccessSound, playErrorSound } = useGameSound();
  const { timeElapsed, formattedTime, startTimer } = useGameTimer();
  const { progress, isLoading, saveProgress, completeGame, isSaving, isCompleting } =
    useGameProgress(ROOM_ID);

  const currentStep = useMemo(() => {
    return samsungSdsStorySteps[currentStepIndex] || samsungSdsStorySteps[0];
  }, [currentStepIndex]);

  // 게임 시작 시 진행상황 불러오기 - 한 번만 실행
  useEffect(() => {
    if (!isLoading && !isGameInitialized) {
      if (progress) {
        console.log("기존 진행상황 불러오기:", progress);
        setCurrentStepIndex(progress.currentStep || 0);
        setScore(progress.score || 0);
        setHintsUsed(progress.hintsUsed || 0);
      }
      startTimer();
      setIsGameInitialized(true);
    }
  }, [progress, isLoading, startTimer, isGameInitialized]);

  // 진행상황 자동 저장 - 디바운스된 저장
  useEffect(() => {
    if (!isGameInitialized || isLoading || currentStepIndex === 0) return;

    const saveTimeout = setTimeout(() => {
      console.log("진행상황 자동 저장:", {
        currentStep: currentStepIndex,
        score,
        hintsUsed,
        timeElapsed,
      });

      saveProgress({
        currentStep: currentStepIndex,
        score,
        hintsUsed,
        timeElapsed,
      });
    }, 1000); // 1초 지연하여 너무 자주 저장되지 않도록

    return () => clearTimeout(saveTimeout);
  }, [
    currentStepIndex,
    score,
    hintsUsed,
    timeElapsed,
    saveProgress,
    isLoading,
    isGameInitialized,
  ]);

  // 뒤로가기 핸들러
  const handleGoBack = useCallback(() => {
    // 최종 저장 후 이동
    if (currentStepIndex > 0 && isGameInitialized) {
      saveProgress({
        currentStep: currentStepIndex,
        score,
        hintsUsed,
        timeElapsed,
      });
    }
    navigate({ to: "/" });
  }, [
    currentStepIndex,
    score,
    hintsUsed,
    timeElapsed,
    saveProgress,
    navigate,
    isGameInitialized,
  ]);

  // 게임 완료 핸들러
  const handleGameComplete = useCallback(async () => {
    try {
      const finalScore = score + (timeElapsed < 300 ? 100 : 50);
      console.log("게임 완료 처리:", {
        finalScore,
        totalTime: timeElapsed,
        hintsUsed,
      });

      await completeGame({
        finalScore,
        totalTime: timeElapsed,
        hintsUsed,
      });

      // 완료 후 메인 페이지로 이동
      setTimeout(() => {
        navigate({ to: "/" });
      }, 3000);
    } catch (error) {
      console.error("게임 완료 처리 오류:", error);
    }
  }, [score, timeElapsed, hintsUsed, completeGame, navigate]);

  // 텍스트 완료 핸들러
  const handleTextComplete = useCallback(() => {
    if (currentStep.type === "question") {
      setShowInput(true);
    } else if (currentStep.type === "elevator") {
      setShowElevatorButtons(true);
    } else if (currentStep.type === "umbrella") {
      setShowUmbrellaSelection(true);
    } else if (currentStep.type === "soju") {
      setShowSojuSelection(true);
    } else if (currentStep.type === "story") {
      // 우산 몬스터 만남 후 자동으로 실패로 이동
      if (currentStep.id === "umbrella-monster-encounter") {
        const failureStepIndex = samsungSdsStorySteps.findIndex(
          (step) => step.id === "umbrella-failure",
        );
        if (failureStepIndex !== -1) {
          const failureTimeout = setTimeout(() => {
            setCurrentStepIndex(failureStepIndex);
          }, 3000); // 3초 후 실패 화면으로
          return () => clearTimeout(failureTimeout);
        }
      }

      const nextStepTimeout = setTimeout(() => {
        if (currentStepIndex < samsungSdsStorySteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 2000);

      return () => clearTimeout(nextStepTimeout);
    }
  }, [currentStep.type, currentStep.id, currentStepIndex]);

  // 우산 선택 핸들러
  const handleUmbrellaSelection = useCallback(
    (color: string) => {
      if (isUmbrellaSelecting) return;

      setIsUmbrellaSelecting(true);
      setSelectedUmbrella(color);
      setShowUmbrellaSelection(false);
      playClickSound();

      const selectionTimeout = setTimeout(() => {
        if (color === currentStep.correctAnswer) {
          // 정답 - 핑크색 우산
          playSuccessSound();
          setScore((prev) => prev + 15);

          const successStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "umbrella-success",
          );
          if (successStepIndex !== -1) {
            setCurrentStepIndex(successStepIndex);
          }
        } else {
          // 오답 - 파란색/검은색 우산
          playErrorSound();

          const monsterStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "umbrella-monster-encounter",
          );
          if (monsterStepIndex !== -1) {
            setCurrentStepIndex(monsterStepIndex);
          }
        }

        setIsUmbrellaSelecting(false);
        setSelectedUmbrella(null);
      }, 2000);

      return () => clearTimeout(selectionTimeout);
    },
    [
      isUmbrellaSelecting,
      currentStep.correctAnswer,
      playClickSound,
      playSuccessSound,
      playErrorSound,
    ],
  );

  // 소주 선택 핸들러
  const handleSojuSelection = useCallback(
    (type: string) => {
      if (isSojuSelecting) return;

      setIsSojuSelecting(true);
      setSelectedSoju(type);
      setShowSojuSelection(false);
      playClickSound();

      const selectionTimeout = setTimeout(() => {
        if (type === currentStep.correctAnswer) {
          // 정답 - 오리지널
          playSuccessSound();
          setScore((prev) => prev + 15);

          const successStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "soju-success",
          );
          if (successStepIndex !== -1) {
            setCurrentStepIndex(successStepIndex);
          }
        } else {
          // 오답 - 후레쉬
          playErrorSound();

          const failureStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "soju-failure",
          );
          if (failureStepIndex !== -1) {
            setCurrentStepIndex(failureStepIndex);
          }
        }

        setIsSojuSelecting(false);
        setSelectedSoju(null);
      }, 2000);

      return () => clearTimeout(selectionTimeout);
    },
    [
      isSojuSelecting,
      currentStep.correctAnswer,
      playClickSound,
      playSuccessSound,
      playErrorSound,
    ],
  );

  // 층 선택 핸들러
  const handleFloorSelection = useCallback(
    (floor: number) => {
      if (isFloorSelecting) return;

      setIsFloorSelecting(true);
      setSelectedFloor(floor);
      setShowElevatorButtons(false);
      setShowElevatorAnimation(true);
      playClickSound();

      const animationDuration = Math.abs(floor - 1) * 200 + 1000;

      // 층수 카운터 애니메이션
      const floorInterval = setInterval(() => {
        setCurrentFloor((prevFloor) => {
          if (prevFloor < floor) {
            return prevFloor + 1;
          } else if (prevFloor > floor) {
            return prevFloor - 1;
          } else {
            clearInterval(floorInterval);
            return prevFloor;
          }
        });
      }, 200);

      const animationTimeout = setTimeout(() => {
        clearInterval(floorInterval);
        setShowElevatorAnimation(false);

        if (floor === CORRECT_FLOOR) {
          playSuccessSound();
          setScore((prev) => prev + 20);
          const successStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "elevator-success",
          );
          if (successStepIndex !== -1) {
            setCurrentStepIndex(successStepIndex);
          }
        } else {
          playErrorSound();
          const failureStepIndex = samsungSdsStorySteps.findIndex(
            (step) => step.id === "elevator-failure",
          );
          if (failureStepIndex !== -1) {
            setCurrentStepIndex(failureStepIndex);
          }
        }

        setIsFloorSelecting(false);
        setSelectedFloor(null);
        setCurrentFloor(1);
      }, animationDuration);

      return () => {
        clearInterval(floorInterval);
        clearTimeout(animationTimeout);
      };
    },
    [isFloorSelecting, playClickSound, playSuccessSound, playErrorSound],
  );

  // 실패 후 재시도 핸들러
  const handleRetryFromFailure = useCallback(() => {
    // 엘리베이터 실패인 경우
    if (currentStep.id === "elevator-failure") {
      const elevatorStepIndex = samsungSdsStorySteps.findIndex(
        (step) => step.id === "elevator-selection",
      );
      if (elevatorStepIndex !== -1) {
        setCurrentStepIndex(elevatorStepIndex);
      }
      setShowElevatorButtons(false);
      setSelectedFloor(null);
      setIsFloorSelecting(false);
      setShowElevatorAnimation(false);
      setCurrentFloor(1);
    }

    // 우산 실패인 경우
    if (currentStep.id === "umbrella-failure") {
      const umbrellaStepIndex = samsungSdsStorySteps.findIndex(
        (step) => step.id === "umbrella-problem",
      );
      if (umbrellaStepIndex !== -1) {
        setCurrentStepIndex(umbrellaStepIndex);
      }
      setShowUmbrellaSelection(false);
      setSelectedUmbrella(null);
      setIsUmbrellaSelecting(false);
    }

    // 소주 실패인 경우
    if (currentStep.id === "soju-failure") {
      const sojuStepIndex = samsungSdsStorySteps.findIndex(
        (step) => step.id === "soju-selection",
      );
      if (sojuStepIndex !== -1) {
        setCurrentStepIndex(sojuStepIndex);
      }
      setShowSojuSelection(false);
      setSelectedSoju(null);
      setIsSojuSelecting(false);
    }
  }, [currentStep.id]);

  // 답변 제출 핸들러
  const handleAnswerSubmit = useCallback(() => {
    if (!userAnswer.trim() || isAnswering) return;

    setIsAnswering(true);
    playClickSound();

    const normalizedAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, "");
    const normalizedCorrect =
      currentStep.correctAnswer?.toLowerCase().replace(/\s+/g, "") || "";

    const alternativeAnswers =
      currentStep.correctAnswer === "cloud in one"
        ? ["cloudinone", "cloud in one", "cloudInOne"]
        : [normalizedCorrect];

    const isCorrect = alternativeAnswers.some(
      (answer) => normalizedAnswer === answer.toLowerCase().replace(/\s+/g, ""),
    );

    const responseTimeout = setTimeout(() => {
      if (isCorrect) {
        setAnswerResult("correct");
        playSuccessSound();
        setScore((prev) => prev + 10);

        const successTimeout = setTimeout(() => {
          if (currentStep.id === "monitor-password") {
            const transformationStepIndex = samsungSdsStorySteps.findIndex(
              (step) => step.id === "transformation",
            );
            if (transformationStepIndex !== -1) {
              setCurrentStepIndex(transformationStepIndex);
            }
          } else {
            setCurrentStepIndex((prev) =>
              Math.min(prev + 1, samsungSdsStorySteps.length - 1),
            );
          }
          setShowInput(false);
          setUserAnswer("");
          setAnswerResult(null);
          setIsAnswering(false);
        }, 2000);

        return () => clearTimeout(successTimeout);
      } else {
        setAnswerResult("incorrect");
        playErrorSound();
        const errorTimeout = setTimeout(() => {
          setAnswerResult(null);
          setIsAnswering(false);
        }, 2000);

        return () => clearTimeout(errorTimeout);
      }
    }, 1000);

    return () => clearTimeout(responseTimeout);
  }, [
    userAnswer,
    currentStep,
    playClickSound,
    playSuccessSound,
    playErrorSound,
    isAnswering,
  ]);

  // 키 입력 핸들러
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isAnswering && userAnswer.trim()) {
        handleAnswerSubmit();
      }
    },
    [isAnswering, handleAnswerSubmit, userAnswer],
  );

  return {
    // 상태
    currentStepIndex,
    userAnswer,
    showInput,
    isAnswering,
    answerResult,
    score,
    hintsUsed,
    selectedFloor,
    showElevatorButtons,
    isFloorSelecting,
    showElevatorAnimation,
    currentFloor,
    selectedUmbrella,
    showUmbrellaSelection,
    isUmbrellaSelecting,
    selectedSoju,
    showSojuSelection,
    isSojuSelecting,

    // 계산된 값들
    currentStep,
    formattedTime,
    timeElapsed,
    isSaving,
    isCompleting,

    // 액션들
    handleTextComplete,
    handleFloorSelection,
    handleRetryFromFailure,
    handleAnswerSubmit,
    handleKeyPress,
    handleGoBack,
    handleGameComplete,
    setUserAnswer,
    handleUmbrellaSelection,
    handleSojuSelection,
  };
}
