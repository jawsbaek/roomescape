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
import { useGameStore } from "@/stores/gameStore";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Clock, Eye, Lock, Skull, Star, User, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const rooms = [
  {
    id: "1",
    title: "잠실의 별 삼성 SDS",
    description: "삼성 SDS 타워에서 벌어진 미스터리를 해결하라",
    difficulty: "초급",
    duration: "30분",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    icon: <Eye className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
    mazePattern: "M2,2 L14,2 L14,6 L6,6 L6,10 L14,10 L14,14 L2,14 Z",
  },
  {
    id: "2",
    title: "사이버 랩",
    description: "해킹된 연구소에서 탈출하라",
    difficulty: "중급",
    duration: "45분",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    icon: <Zap className="h-5 w-5" />,
    color: "from-cyan-500 to-blue-500",
    mazePattern: "M1,1 L15,1 L15,5 L9,5 L9,9 L15,9 L15,15 L1,15 L1,11 L7,11 L7,7 L1,7 Z",
  },
  {
    id: "3",
    title: "고대 신전",
    description: "잃어버린 보물을 찾아 신전을 탈출하라",
    difficulty: "중급",
    duration: "50분",
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=300",
    icon: <Brain className="h-5 w-5" />,
    color: "from-amber-500 to-orange-500",
    mazePattern: "M3,3 L13,3 L13,7 L7,7 L7,11 L13,11 L13,13 L3,13 L3,9 L9,9 L9,5 L3,5 Z",
  },
  {
    id: "4",
    title: "좀비 아포칼립스",
    description: "좀비들로부터 살아남아 안전지대로 탈출하라",
    difficulty: "고급",
    duration: "60분",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    icon: <Skull className="h-5 w-5" />,
    color: "from-red-500 to-rose-500",
    mazePattern:
      "M1,3 L5,3 L5,1 L11,1 L11,5 L15,5 L15,9 L11,9 L11,13 L5,13 L5,15 L1,15 L1,11 L3,11 L3,7 L1,7 Z",
    locked: true,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "초급":
      return "bg-green-500";
    case "중급":
      return "bg-yellow-500";
    case "고급":
      return "bg-red-500";
    default:
      return "bg-gray-500";
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
  const { availableRooms, totalScore, totalPlayTime, startGame } = useGameStore();
  const { playBackgroundMusic, playClickSound } = useGameSound();

  const handleRoomSelect = (roomId: string) => {
    const room = availableRooms.find((r) => r.id === roomId);
    if (room) {
      startGame(room.id);
      navigate({ to: `/game/${room.id}` });
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
              혼자서도 충분히 스릴 넘치는 개인 방탈출 게임으로 당신의 한계에 도전하세요
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
                  }}
                >
                  게임 시작하기
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
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
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
                    <MazePattern pattern={room.mazePattern} className="text-white" />
                  </div>

                  <div className="relative">
                    <motion.img
                      src={room.image || "/placeholder.svg"}
                      alt={room.title}
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
                          {room.icon}
                        </motion.div>
                        {room.title}
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
                        {room.duration}
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
                key={index}
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
