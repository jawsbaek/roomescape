import { FadeInUp, ScaleOnHover } from "@/components/animations";
import { useGameSound } from "@/hooks/useGameSound";
import { cn } from "@/lib/utils";
import { Room } from "@/stores/gameStore";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Lock, Star } from "lucide-react";

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  index: number;
}

const themeColors = {
  mystery: "from-purple-500 to-indigo-600",
  horror: "from-red-500 to-red-700",
  adventure: "from-green-500 to-emerald-600",
  puzzle: "from-blue-500 to-cyan-600",
  "sci-fi": "from-cyan-500 to-blue-600",
};

const difficultyStars = (difficulty: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        "h-4 w-4",
        i < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
      )}
    />
  ));
};

export function RoomCard({ room, onSelect, index }: RoomCardProps) {
  const { playClickSound, playErrorSound } = useGameSound();

  const handleClick = () => {
    if (room.isUnlocked) {
      playClickSound();
      onSelect(room);
    } else {
      playErrorSound();
    }
  };

  return (
    <FadeInUp delay={index * 0.1}>
      <ScaleOnHover className="relative h-full cursor-pointer" onClick={handleClick}>
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300",
            room.isUnlocked
              ? `${themeColors[room.theme]} hover:shadow-2xl`
              : "from-gray-400 to-gray-600 opacity-60",
          )}
          whileHover={room.isUnlocked ? { y: -4 } : {}}
        >
          {/* 배경 이미지 */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={room.thumbnail}
              alt={room.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 그라디언트 배경 사용
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* 잠금/완료 상태 표시 */}
            <div className="absolute top-3 right-3">
              {!room.isUnlocked ? (
                <div className="rounded-full bg-black/50 p-2">
                  <Lock className="h-5 w-5 text-white" />
                </div>
              ) : room.completedAt ? (
                <div className="rounded-full bg-green-500/90 p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : null}
            </div>

            {/* 난이도 표시 */}
            <div className="absolute top-3 left-3 flex space-x-1">
              {difficultyStars(room.difficulty)}
            </div>
          </div>

          {/* 카드 내용 */}
          <div className="p-6 text-white">
            <h3 className="mb-2 text-xl font-bold">{room.name}</h3>
            <p className="mb-4 line-clamp-2 text-sm text-gray-200">{room.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{room.estimatedTime}분</span>
              </div>

              {room.bestTime ? (
                <div className="text-sm font-medium text-yellow-300">
                  최고기록: {Math.floor(room.bestTime / 60)}:
                  {(room.bestTime % 60).toString().padStart(2, "0")}
                </div>
              ) : null}
            </div>

            {/* 테마 배지 */}
            <div className="absolute right-3 bottom-3">
              <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {room.theme}
              </span>
            </div>
          </div>

          {/* 호버 오버레이 */}
          {room.isUnlocked && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100"
              whileHover={{ opacity: 1 }}
            >
              <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
                <span className="font-medium text-white">게임 시작</span>
              </div>
            </motion.div>
          )}

          {/* 잠금 상태 오버레이 */}
          {!room.isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center text-white">
                <Lock className="mx-auto mb-3 h-12 w-12 opacity-60" />
                <p className="text-sm opacity-80">이전 방을 완료하세요</p>
              </div>
            </div>
          )}
        </motion.div>
      </ScaleOnHover>
    </FadeInUp>
  );
}
