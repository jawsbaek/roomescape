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
  // 추가 UI 속성들
  title?: string;
  image?: string;
  rating?: number;
  color?: string;
  mazePattern?: string;
  icon?: React.ReactNode;
  locked?: boolean;
  duration?: string;
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
  consumeItem: (itemId: string) => void;

  // 진행 상황 관리
  updateProgress: (step: number) => void;
  addSolvedPuzzle: (puzzleId: string) => void;
  consumeHint: () => void;
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
    id: "samsung-sds",
    name: "잠실의 별 삼성 SDS",
    title: "잠실의 별 삼성 SDS",
    description: "삼성 SDS 타워에서 벌어진 미스터리를 해결하라",
    theme: "sci-fi",
    difficulty: 1,
    estimatedTime: 30,
    thumbnail: "/images/samsung-sds/1.png",
    image: "/images/samsung-sds/1.png",
    isUnlocked: true,
    rating: 4.5,
    color: "from-blue-500 to-cyan-500",
    mazePattern: "M2,2 L14,2 L14,6 L6,6 L6,10 L14,10 L14,14 L2,14 Z",
    locked: false,
    duration: "30분",
  },
  {
    id: "mystery-library",
    name: "미스터리 도서관",
    title: "사이버 랩",
    description: "해킹된 연구소에서 탈출하라",
    theme: "mystery",
    difficulty: 2,
    estimatedTime: 45,
    thumbnail: "/placeholder.svg?height=200&width=300",
    image: "/placeholder.svg?height=200&width=300",
    isUnlocked: false,
    rating: 4.8,
    color: "from-cyan-500 to-blue-500",
    mazePattern: "M1,1 L15,1 L15,5 L9,5 L9,9 L15,9 L15,15 L1,15 L1,11 L7,11 L7,7 L1,7 Z",
    locked: true,
    duration: "45분",
  },
  {
    id: "haunted-mansion",
    name: "유령의 저택",
    title: "고대 신전",
    description: "잃어버린 보물을 찾아 신전을 탈출하라",
    theme: "horror",
    difficulty: 3,
    estimatedTime: 50,
    thumbnail: "/placeholder.svg?height=200&width=300",
    image: "/placeholder.svg?height=200&width=300",
    isUnlocked: false,
    rating: 4.3,
    color: "from-amber-500 to-orange-500",
    mazePattern: "M3,3 L13,3 L13,7 L7,7 L7,11 L13,11 L13,13 L3,13 L3,9 L9,9 L9,5 L3,5 Z",
    locked: true,
    duration: "50분",
  },
  {
    id: "pirate-ship",
    name: "해적선",
    title: "좀비 아포칼립스",
    description: "좀비들로부터 살아남아 안전지대로 탈출하라",
    theme: "adventure",
    difficulty: 4,
    estimatedTime: 60,
    thumbnail: "/placeholder.svg?height=200&width=300",
    image: "/placeholder.svg?height=200&width=300",
    isUnlocked: false,
    rating: 4.9,
    color: "from-red-500 to-rose-500",
    mazePattern:
      "M1,3 L5,3 L5,1 L11,1 L11,5 L15,5 L15,9 L11,9 L11,13 L5,13 L5,15 L1,15 L1,11 L3,11 L3,7 L1,7 Z",
    locked: true,
    duration: "60분",
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

        consumeItem: (itemId: string) => {
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

        consumeHint: () => {
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
