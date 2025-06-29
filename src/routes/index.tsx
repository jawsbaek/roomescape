import { FadeInUp } from "@/components/animations";
import { RoomCard } from "@/components/game/RoomCard";
import { Button } from "@/components/ui/button";
import { useGameSound } from "@/hooks/useGameSound";
import { Room, useGameStore } from "@/stores/gameStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Settings, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { availableRooms, totalScore, totalPlayTime, startGame } = useGameStore();
  const { playBackgroundMusic, playClickSound } = useGameSound();

  const handleRoomSelect = (room: Room) => {
    startGame(room.id);
    navigate({ to: `/game/${room.id}` });
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative container mx-auto px-6 py-12">
          <FadeInUp>
            <div className="text-center">
              <motion.h1
                className="mb-4 text-6xl font-bold text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                🏠 방탈출 게임
              </motion.h1>
              <motion.p
                className="mb-8 text-xl text-gray-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                다양한 방을 탐험하고 퍼즐을 풀어 탈출하세요!
              </motion.p>

              {/* 통계 */}
              <motion.div
                className="mb-8 flex justify-center space-x-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{totalScore}</div>
                  <div className="text-sm text-gray-400">총 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatPlayTime(totalPlayTime)}
                  </div>
                  <div className="text-sm text-gray-400">플레이 시간</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {availableRooms.filter((room) => room.completedAt).length}/
                    {availableRooms.length}
                  </div>
                  <div className="text-sm text-gray-400">완료한 방</div>
                </div>
              </motion.div>

              {/* 액션 버튼들 */}
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700"
                  onClick={() => {
                    playClickSound();
                    playBackgroundMusic();
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  게임 시작
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-400 px-8 py-3 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => {
                    playClickSound();
                    navigate({ to: "/leaderboard" });
                  }}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  랭킹
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-400 px-8 py-3 text-gray-400 hover:bg-gray-400 hover:text-white"
                  onClick={() => {
                    playClickSound();
                    navigate({ to: "/settings" });
                  }}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  설정
                </Button>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </header>

      {/* 방 선택 섹션 */}
      <main className="container mx-auto px-6 py-12">
        <FadeInUp delay={0.3}>
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            방을 선택하세요
          </h2>
        </FadeInUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {availableRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={handleRoomSelect}
              index={index}
            />
          ))}
        </div>

        {/* 게임 소개 */}
        <FadeInUp delay={0.8}>
          <div className="mt-16 text-center">
            <h3 className="mb-6 text-2xl font-bold text-white">게임 방법</h3>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 text-4xl">🔍</div>
                <h4 className="mb-2 text-lg font-semibold text-white">탐색하기</h4>
                <p className="text-sm text-gray-300">
                  방 안의 모든 곳을 클릭하여 숨겨진 아이템과 단서를 찾아보세요.
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 text-4xl">🧩</div>
                <h4 className="mb-2 text-lg font-semibold text-white">퍼즐 풀기</h4>
                <p className="text-sm text-gray-300">
                  수집한 아이템들을 조합하여 복잡한 퍼즐을 해결하세요.
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 text-4xl">🚪</div>
                <h4 className="mb-2 text-lg font-semibold text-white">탈출하기</h4>
                <p className="text-sm text-gray-300">
                  모든 단서를 모아 방의 비밀을 풀고 성공적으로 탈출하세요!
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </main>
    </div>
  );
}
