import { AnimatePresence, motion } from "framer-motion";

interface ElevatorAnimationProps {
  showElevatorAnimation: boolean;
  currentFloor: number;
  selectedFloor: number | null;
}

export function ElevatorAnimation({
  showElevatorAnimation,
  currentFloor,
  selectedFloor,
}: ElevatorAnimationProps) {
  return (
    <AnimatePresence>
      {showElevatorAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="relative rounded-lg border border-yellow-500/30 bg-gradient-to-b from-gray-900 to-gray-800 p-8 shadow-2xl">
            {/* 엘리베이터 외관 */}
            <div className="mb-6 text-center">
              <h3 className="mb-4 text-2xl font-bold text-yellow-300">
                🛗 엘리베이터 이동 중...
              </h3>
              <div className="relative mx-auto h-32 w-24 overflow-hidden rounded-lg border-4 border-gray-600 bg-gradient-to-b from-gray-700 to-gray-900">
                {/* 엘리베이터 내부 */}
                <div className="absolute inset-2 rounded bg-gradient-to-b from-blue-900/50 to-blue-800/50">
                  {/* 움직임 효과 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
                    animate={{
                      y: [0, -100, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* 층수 표시 */}
                <div className="absolute top-1/2 -right-12 -translate-y-1/2 rounded-lg bg-red-900 px-3 py-2 text-center">
                  <div className="text-xs text-red-300">현재 층</div>
                  <motion.div
                    key={currentFloor}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-red-100"
                  >
                    {currentFloor}F
                  </motion.div>
                </div>
              </div>

              {/* 목표 층수 */}
              <div className="mt-4 text-lg text-gray-300">
                목표: <span className="font-bold text-yellow-300">{selectedFloor}층</span>
              </div>

              {/* 로딩 애니메이션 */}
              <div className="mt-4 flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-yellow-400"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
