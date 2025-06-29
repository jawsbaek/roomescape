import { useGameStore } from "@/stores/gameStore";
import { useEffect, useRef, useState } from "react";

export function useGameTimer() {
  const { isGameActive, isPaused, updateScore } = useGameStore();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  // 타이머 시작
  const startTimer = () => {
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setTimeElapsed(0);
  };

  // 타이머 정지
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      pausedTimeRef.current = Date.now();
    }
  };

  // 타이머 재개
  const resumeTimer = () => {
    if (pausedTimeRef.current > 0) {
      const pausedDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pausedDuration;
      pausedTimeRef.current = 0;
    }
  };

  // 게임 상태에 따른 타이머 제어
  useEffect(() => {
    if (isGameActive && !isPaused) {
      if (!intervalRef.current) {
        resumeTimer();
        intervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimeElapsed(elapsed);
        }, 1000);
      }
    } else if (isPaused) {
      pauseTimer();
    } else if (!isGameActive) {
      stopTimer();
      setTimeElapsed(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isGameActive, isPaused]);

  // 게임 시작 시 타이머 초기화
  useEffect(() => {
    if (isGameActive && timeElapsed === 0) {
      startTimer();
    }
  }, [isGameActive]);

  // 시간 포맷팅 함수들
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDetailedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${mins}분 ${secs}초`;
    } else if (mins > 0) {
      return `${mins}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

  // 시간 기반 점수 계산
  const calculateTimeBonus = (targetTime: number) => {
    if (timeElapsed === 0) return 0;

    const timeDiff = targetTime - timeElapsed;
    if (timeDiff > 0) {
      // 목표 시간보다 빨리 완료한 경우 보너스 점수
      return Math.max(0, Math.floor(timeDiff * 10));
    } else {
      // 목표 시간을 초과한 경우 점수 감점 없음 (0점)
      return 0;
    }
  };

  // 시간대별 힌트 제공 여부 판단
  const shouldShowTimeHint = (hintTimes: number[]) => {
    return hintTimes.some((time) => timeElapsed >= time);
  };

  return {
    timeElapsed,
    formattedTime: formatTime(timeElapsed),
    detailedTime: formatDetailedTime(timeElapsed),
    isRunning: isGameActive && !isPaused,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    calculateTimeBonus,
    shouldShowTimeHint,
  };
}
