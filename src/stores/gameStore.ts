import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface GameItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: "key" | "tool" | "clue" | "collectible";
}

export interface Room {
  id: string;
  name: string;
  description: string;
  theme: "mystery" | "horror" | "adventure" | "puzzle" | "sci-fi";
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number; // 분 단위
  thumbnail: string;
  isUnlocked: boolean;
  bestTime?: number;
  completedAt?: Date;
}

export interface GameProgress {
  roomId: string;
  currentStep: number;
  collectedItems: string[];
  solvedPuzzles: string[];
  hintsUsed: number;
  startTime: Date;
  lastSaveTime: Date;
}

interface GameState {
  // 현재 게임 상태
  currentRoom: Room | null;
  isGameActive: boolean;
  isPaused: boolean;
  gameProgress: GameProgress | null;

  // 플레이어 인벤토리
  inventory: GameItem[];

  // 게임 통계
  score: number;
  timeElapsed: number;
  hintsUsed: number;

  // 전체 게임 데이터
  availableRooms: Room[];
  completedRooms: string[];
  totalScore: number;
  totalPlayTime: number;

  // 설정
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;

  // 액션들
  setCurrentRoom: (room: Room | null) => void;
  startGame: (roomId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (completed: boolean) => void;

  // 인벤토리 관리
  addToInventory: (item: GameItem) => void;
  removeFromInventory: (itemId: string) => void;
  useItem: (itemId: string) => void;

  // 진행 상황 관리
  updateProgress: (step: number) => void;
  addSolvedPuzzle: (puzzleId: string) => void;
  useHint: () => void;
  updateScore: (points: number) => void;

  // 방 관리
  unlockRoom: (roomId: string) => void;
  completeRoom: (roomId: string, time: number) => void;

  // 설정 관리
  toggleSound: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;

  // 데이터 초기화
  resetGame: () => void;
  resetAllProgress: () => void;
}

const initialRooms: Room[] = [
  {
    id: "mystery-library",
    name: "미스터리 도서관",
    description: "오래된 도서관에 숨겨진 비밀을 찾아보세요.",
    theme: "mystery",
    difficulty: 2,
    estimatedTime: 15,
    thumbnail: "/images/rooms/library.jpg",
    isUnlocked: true,
  },
  {
    id: "haunted-mansion",
    name: "유령의 저택",
    description: "으스스한 저택에서 탈출하세요.",
    theme: "horror",
    difficulty: 4,
    estimatedTime: 25,
    thumbnail: "/images/rooms/mansion.jpg",
    isUnlocked: false,
  },
  {
    id: "pirate-ship",
    name: "해적선",
    description: "보물을 찾고 해적선에서 탈출하세요.",
    theme: "adventure",
    difficulty: 3,
    estimatedTime: 20,
    thumbnail: "/images/rooms/pirate-ship.jpg",
    isUnlocked: false,
  },
  {
    id: "space-station",
    name: "우주 정거장",
    description: "고장난 우주 정거장에서 지구로 돌아가세요.",
    theme: "sci-fi",
    difficulty: 5,
    estimatedTime: 30,
    thumbnail: "/images/rooms/space-station.jpg",
    isUnlocked: false,
  },
];

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        currentRoom: null,
        isGameActive: false,
        isPaused: false,
        gameProgress: null,
        inventory: [],
        score: 0,
        timeElapsed: 0,
        hintsUsed: 0,
        availableRooms: initialRooms,
        completedRooms: [],
        totalScore: 0,
        totalPlayTime: 0,
        soundEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 0.8,

        // 게임 제어
        setCurrentRoom: (room) => set({ currentRoom: room }),

        startGame: (roomId) => {
          const room = get().availableRooms.find((r) => r.id === roomId);
          if (!room) return;

          set({
            currentRoom: room,
            isGameActive: true,
            isPaused: false,
            gameProgress: {
              roomId,
              currentStep: 0,
              collectedItems: [],
              solvedPuzzles: [],
              hintsUsed: 0,
              startTime: new Date(),
              lastSaveTime: new Date(),
            },
            inventory: [],
            score: 0,
            timeElapsed: 0,
            hintsUsed: 0,
          });
        },

        pauseGame: () => set({ isPaused: true }),
        resumeGame: () => set({ isPaused: false }),

        endGame: (completed) => {
          const state = get();
          if (completed && state.currentRoom) {
            const newCompletedRooms = [...state.completedRooms];
            if (!newCompletedRooms.includes(state.currentRoom.id)) {
              newCompletedRooms.push(state.currentRoom.id);
            }

            // 다음 방 잠금 해제 로직
            const roomIndex = state.availableRooms.findIndex(
              (r) => r.id === state.currentRoom!.id,
            );
            const updatedRooms = [...state.availableRooms];
            if (roomIndex < updatedRooms.length - 1) {
              updatedRooms[roomIndex + 1].isUnlocked = true;
            }

            set({
              completedRooms: newCompletedRooms,
              availableRooms: updatedRooms,
              totalScore: state.totalScore + state.score,
              totalPlayTime: state.totalPlayTime + state.timeElapsed,
            });
          }

          set({
            isGameActive: false,
            isPaused: false,
            currentRoom: null,
            gameProgress: null,
          });
        },

        // 인벤토리 관리
        addToInventory: (item) => {
          const currentInventory = get().inventory;
          if (!currentInventory.find((i) => i.id === item.id)) {
            set({ inventory: [...currentInventory, item] });
          }
        },

        removeFromInventory: (itemId) => {
          set({
            inventory: get().inventory.filter((item) => item.id !== itemId),
          });
        },

        useItem: (itemId) => {
          // 아이템 사용 로직은 게임별로 구현
          console.log(`Item ${itemId} used`);
        },

        // 진행 상황 관리
        updateProgress: (step) => {
          const progress = get().gameProgress;
          if (progress) {
            set({
              gameProgress: {
                ...progress,
                currentStep: step,
                lastSaveTime: new Date(),
              },
            });
          }
        },

        addSolvedPuzzle: (puzzleId) => {
          const progress = get().gameProgress;
          if (progress && !progress.solvedPuzzles.includes(puzzleId)) {
            set({
              gameProgress: {
                ...progress,
                solvedPuzzles: [...progress.solvedPuzzles, puzzleId],
              },
            });
          }
        },

        useHint: () => {
          const state = get();
          const progress = state.gameProgress;
          if (progress) {
            set({
              hintsUsed: state.hintsUsed + 1,
              gameProgress: {
                ...progress,
                hintsUsed: progress.hintsUsed + 1,
              },
            });
          }
        },

        updateScore: (points) => {
          set({ score: get().score + points });
        },

        // 방 관리
        unlockRoom: (roomId) => {
          const rooms = get().availableRooms.map((room) =>
            room.id === roomId ? { ...room, isUnlocked: true } : room,
          );
          set({ availableRooms: rooms });
        },

        completeRoom: (roomId, time) => {
          const rooms = get().availableRooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  bestTime: room.bestTime ? Math.min(room.bestTime, time) : time,
                  completedAt: new Date(),
                }
              : room,
          );
          set({ availableRooms: rooms });
        },

        // 설정 관리
        toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
        setMusicVolume: (volume) => set({ musicVolume: volume }),
        setSfxVolume: (volume) => set({ sfxVolume: volume }),

        // 초기화
        resetGame: () => {
          set({
            currentRoom: null,
            isGameActive: false,
            isPaused: false,
            gameProgress: null,
            inventory: [],
            score: 0,
            timeElapsed: 0,
            hintsUsed: 0,
          });
        },

        resetAllProgress: () => {
          set({
            currentRoom: null,
            isGameActive: false,
            isPaused: false,
            gameProgress: null,
            inventory: [],
            score: 0,
            timeElapsed: 0,
            hintsUsed: 0,
            availableRooms: initialRooms,
            completedRooms: [],
            totalScore: 0,
            totalPlayTime: 0,
          });
        },
      }),
      {
        name: "room-escape-game",
        partialize: (state) => ({
          availableRooms: state.availableRooms,
          completedRooms: state.completedRooms,
          totalScore: state.totalScore,
          totalPlayTime: state.totalPlayTime,
          soundEnabled: state.soundEnabled,
          musicVolume: state.musicVolume,
          sfxVolume: state.sfxVolume,
        }),
      },
    ),
    { name: "game-store" },
  ),
);
