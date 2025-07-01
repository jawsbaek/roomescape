import { AnimatePresence, motion } from "framer-motion";
import { StoryStep } from "../types";

interface ElevatorSelectorProps {
  currentStep: StoryStep;
  showElevatorButtons: boolean;
  selectedFloor: number | null;
  isFloorSelecting: boolean;
  onFloorSelection: (floor: number) => void;
}

export function ElevatorSelector({
  currentStep,
  showElevatorButtons,
  selectedFloor,
  isFloorSelecting,
  onFloorSelection,
}: ElevatorSelectorProps) {
  return (
    <AnimatePresence>
      {currentStep.type === "elevator" && showElevatorButtons && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8"
        >
          <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-6">
            <div className="mb-6 text-center">
              <div className="mb-4 text-xl font-bold text-yellow-300">
                🏢 엘리베이터 층 선택
              </div>
              <p className="text-gray-300">올바른 층을 선택하세요. 틀리면 추락합니다!</p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((floor) => (
                  <motion.button
                    key={floor}
                    onClick={() => onFloorSelection(floor)}
                    disabled={isFloorSelecting}
                    className={`relative h-12 w-12 rounded-lg border-2 font-bold transition-all duration-200 ${
                      selectedFloor === floor
                        ? "border-yellow-400 bg-yellow-500 text-black shadow-lg"
                        : "border-gray-600 bg-gray-800 text-white hover:border-yellow-500 hover:bg-gray-700 hover:text-yellow-300"
                    } ${isFloorSelecting && selectedFloor !== floor ? "opacity-50" : ""}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {floor}
                    {selectedFloor === floor && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-yellow-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              💡 힌트: 우리 위치가 어디죠?
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
