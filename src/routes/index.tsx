import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGameSound } from "@/hooks/useGameSound";
import authClient from "@/lib/auth/auth-client";
import { useGameStore } from "@/stores/gameStore";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Clock, Eye, Lock, LogOut, Skull, Star, User, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// 기존 rooms 배열은 이제 gameStore의 availableRooms를 사용합니다

const getDifficultyColor = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "bg-green-500";
    case 2:
    case 3:
      return "bg-yellow-500";
    case 4:
    case 5:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getThemeIcon = (theme: string) => {
  switch (theme) {
    case "sci-fi":
      return <Eye className="h-5 w-5" />;
    case "mystery":
      return <Zap className="h-5 w-5" />;
    case "horror":
      return <Brain className="h-5 w-5" />;
    case "adventure":
      return <Skull className="h-5 w-5" />;
    default:
      return <Eye className="h-5 w-5" />;
  }
};

// 미로 패턴 컴포넌트
const MazePattern = ({ pattern, className }: { pattern: string; className?: string }) => (
  <svg
    className={`absolute inset-0 h-full w-full opacity-10 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path d={pattern} stroke="currentColor" strokeWidth="0.5" fill="none" />
  </svg>
);

// 움직이는 점 컴포넌트
const MovingDot = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute h-1 w-1 rounded-full bg-white"
    animate={{
      x: [0, 100, 100, 0, 0],
      y: [0, 0, 100, 100, 0],
    }}
    transition={{
      duration: 8,
      repeat: Number.POSITIVE_INFINITY,
      delay,
      ease: "linear",
    }}
  />
);

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { availableRooms, totalScore, totalPlayTime, startGame } = useGameStore();
  const { playBackgroundMusic, playClickSound } = useGameSound();

  // 현재 로그인된 사용자 정보 가져오기
  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  const handleLogout = async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    // 게임 상태도 초기화할 수 있습니다
  };

  const handleRoomSelect = (roomId: string) => {
    const room = availableRooms.find((r) => r.id === roomId);
    if (room) {
      startGame(room.id);
      if (roomId === "samsung-sds") {
        navigate({ to: "/game/samsung-sds" });
      } else {
        navigate({ to: `/game/${room.id}` });
      }
    }
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 배경 미로 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern
              id="maze"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,0 L10,0 L10,4 L6,4 L6,6 L10,6 L10,10 L0,10 L0,6 L4,6 L4,4 L0,4 Z"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#maze)" />
        </svg>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Lock className="z-10 h-5 w-5 text-white" />
              <MazePattern pattern="M0,0 L8,0 L8,3 L3,3 L3,5 L8,5 L8,8 L0,8 Z" />
            </div>
            <h1 className="text-2xl font-bold text-white">EscapeVerse</h1>
          </motion.div>

          {/* 사용자 프로필 영역 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-white">
                    {user.name || user.email}
                  </span>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 bg-transparent text-red-300 hover:bg-red-500 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-purple-500 bg-transparent text-purple-300 hover:bg-purple-500 hover:text-white"
                    >
                      로그인
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                      회원가입
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent text-white md:text-7xl"
            >
              미로를 탈출하라
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto mb-8 max-w-2xl text-xl text-gray-300"
            >
              {user
                ? `안녕하세요, ${user.name || user.email}님! 스릴 넘치는 개인 방탈출 게임으로 당신의 한계에 도전하세요`
                : "혼자서도 충분히 스릴 넘치는 개인 방탈출 게임으로 당신의 한계에 도전하세요"}
            </motion.p>

            {/* 사용자별 통계 */}
            {user && (
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
            )}

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-white hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    playClickSound();
                    playBackgroundMusic();
                    if (user) {
                      navigate({ to: "/game/samsung-sds" });
                    } else {
                      navigate({ to: "/login" });
                    }
                  }}
                >
                  {user ? "삼성 SDS 방탈출 시작" : "로그인하고 게임 시작"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  게임 방법 보기
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 움직이는 점들 */}
        <div className="absolute top-20 left-20 h-32 w-32">
          <MovingDot delay={0} />
        </div>
        <div className="absolute top-40 right-32 h-32 w-32">
          <MovingDot delay={2} />
        </div>
        <div className="absolute bottom-20 left-1/3 h-32 w-32">
          <MovingDot delay={4} />
        </div>
      </section>

      {/* Rooms Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h3 className="mb-4 text-3xl font-bold text-white">방 선택하기</h3>
            <p className="mx-auto max-w-2xl text-gray-400">
              각기 다른 테마와 난이도의 방에서 혼자만의 실력을 시험해보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {availableRooms.map((room, index) => (
              <motion.div
                key={`room-${room.id}`}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                <Card className="group relative overflow-hidden border-white/10 bg-black/40 transition-all duration-300 hover:border-white/20">
                  {/* 미로 패턴 배경 */}
                  <div className="absolute inset-0 opacity-5">
                    <MazePattern
                      pattern={room.mazePattern || ""}
                      className="text-white"
                    />
                  </div>

                  <div className="relative">
                    <motion.img
                      src={room.image || "/placeholder.svg"}
                      alt={room.title || room.name}
                      className="h-48 w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-t ${room.color} opacity-20`}
                      whileHover={{ opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                    {room.locked && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/60"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 0.9 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Lock className="h-8 w-8 text-white" />
                        </motion.div>
                      </motion.div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${getDifficultyColor(room.difficulty)} text-white`}
                      >
                        {room.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          {getThemeIcon(room.theme)}
                        </motion.div>
                        {room.title || room.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                        </motion.div>
                        <span className="text-sm text-gray-300">{room.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {room.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {room.duration || `${room.estimatedTime}분`}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        개인 플레이
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className={`w-full ${
                          room.locked
                            ? "cursor-not-allowed bg-gray-600"
                            : `bg-gradient-to-r ${room.color} hover:opacity-90`
                        } relative overflow-hidden text-white`}
                        disabled={room.locked}
                        onClick={() => !room.locked && handleRoomSelect(room.id)}
                      >
                        {!room.locked && (
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10">
                          {room.locked ? "잠금됨" : "입장하기"}
                        </span>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative border-t border-white/10 py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { value: "1,000+", label: "플레이어" },
              { value: "50+", label: "방" },
              { value: "95%", label: "탈출 성공률" },
              { value: "24/7", label: "운영시간" },
            ].map((stat, index) => (
              <motion.div
                key={`stat-${stat.label}-${stat.value}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="mb-2 text-3xl font-bold text-white"
                  animate={{
                    textShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
