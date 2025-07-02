import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface GameProgressData {
  roomId: string;
  currentStep: number;
  collectedItems?: string[];
  solvedPuzzles?: string[];
  hintsUsed?: number;
  score?: number;
  timeElapsed?: number;
}

interface CompleteGameData {
  roomId: string;
  finalScore: number;
  totalTime: number;
  hintsUsed: number;
}

export function useGameProgress(roomId: string) {
  const queryClient = useQueryClient();

  // 진행상황 불러오기
  const {
    data: progress,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gameProgress", roomId],
    queryFn: async () => {
      const response = await fetch(`/api/game/progress?roomId=${roomId}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }
        throw new Error("진행상황을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      return data.progress;
    },
    enabled: !!roomId,
  });

  // 진행상황 저장
  const saveProgressMutation = useMutation({
    mutationFn: async (progressData: GameProgressData) => {
      const response = await fetch("/api/game/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }
        throw new Error("진행상황 저장에 실패했습니다.");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["gameProgress", roomId], data.progress);
    },
  });

  // 게임 완료 처리
  const completeGameMutation = useMutation({
    mutationFn: async (completeData: CompleteGameData) => {
      const response = await fetch("/api/game/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }
        throw new Error("게임 완료 처리에 실패했습니다.");
      }

      return response.json();
    },
    onSuccess: () => {
      // 진행상황 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["gameProgress", roomId] });
      // 완료 기록 쿼리도 무효화 (있다면)
      queryClient.invalidateQueries({ queryKey: ["roomCompletion"] });
    },
  });

  // 진행상황 삭제 (게임 재시작)
  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/game/progress?roomId=${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }
        throw new Error("진행상황 삭제에 실패했습니다.");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["gameProgress", roomId], null);
    },
  });

  // 편의 함수들
  const handleSaveProgress = useCallback(
    (progressData: Omit<GameProgressData, "roomId">) => {
      return saveProgressMutation.mutate({ ...progressData, roomId });
    },
    [saveProgressMutation.mutate, roomId],
  );

  const handleCompleteGame = useCallback(
    (completeData: Omit<CompleteGameData, "roomId">) => {
      return completeGameMutation.mutate({ ...completeData, roomId });
    },
    [completeGameMutation.mutate, roomId],
  );

  const resetProgress = useCallback(() => {
    return resetProgressMutation.mutate();
  }, [resetProgressMutation.mutate]);

  return {
    // 데이터
    progress,
    isLoading,
    error,

    // 상태
    isSaving: saveProgressMutation.isPending,
    isCompleting: completeGameMutation.isPending,
    isResetting: resetProgressMutation.isPending,

    // 함수들
    saveProgress: handleSaveProgress,
    completeGame: handleCompleteGame,
    resetProgress,

    // 에러
    saveError: saveProgressMutation.error,
    completeError: completeGameMutation.error,
    resetError: resetProgressMutation.error,
  };
}
