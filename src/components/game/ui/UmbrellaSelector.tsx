import { Button } from "@/components/ui/button";
import { StoryStep } from "../types";

interface UmbrellaSelectorProps {
  currentStep: StoryStep;
  showUmbrellaSelection: boolean;
  selectedUmbrella: string | null;
  isUmbrellaSelecting: boolean;
  onUmbrellaSelection: (color: string) => void;
}

export function UmbrellaSelector({
  currentStep,
  showUmbrellaSelection,
  selectedUmbrella,
  isUmbrellaSelecting,
  onUmbrellaSelection,
}: UmbrellaSelectorProps) {
  if (currentStep.type !== "umbrella" || !showUmbrellaSelection) {
    return null;
  }

  const umbrellaChoices = currentStep.umbrellaChoices;
  if (!umbrellaChoices) return null;

  const getUmbrellaEmoji = (color: string) => {
    switch (color) {
      case "pink":
        return "🌸☂️";
      case "blue":
        return "💙☂️";
      case "black":
        return "🖤☂️";
      default:
        return "☂️";
    }
  };

  const getUmbrellaGradient = (color: string) => {
    switch (color) {
      case "pink":
        return "bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700";
      case "blue":
        return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700";
      case "black":
        return "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black";
      default:
        return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h3 className="mb-4 text-xl font-semibold text-white">우산을 선택하세요 ☂️</h3>
        {currentStep.hint && (
          <p className="mb-6 text-sm text-gray-300 italic">💡 힌트: {currentStep.hint}</p>
        )}
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {Object.entries(umbrellaChoices).map(([color, label]) => (
          <div key={color} className="flex flex-col items-center space-y-3">
            <Button
              onClick={() => onUmbrellaSelection(color)}
              disabled={isUmbrellaSelecting}
              className={` ${getUmbrellaGradient(color)} h-32 w-full max-w-xs transform border-2 border-white/20 text-lg font-bold text-white transition-all duration-300 ${selectedUmbrella === color ? "scale-105 ring-4 ring-white/50" : ""} ${isUmbrellaSelecting ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:shadow-2xl"} group relative overflow-hidden shadow-xl`}
            >
              <div className="absolute inset-0 bg-white/10 transition-colors duration-300 group-hover:bg-white/20" />
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <div className="text-4xl">{getUmbrellaEmoji(color)}</div>
                <div className="text-sm font-medium">{label}</div>
              </div>

              {/* 반짝이는 효과 */}
              <div className="absolute top-0 right-0 left-0 h-1 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </Button>

            {selectedUmbrella === color && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1">
                  <span className="text-yellow-400">✨</span>
                  <span className="text-sm font-medium text-white">선택됨</span>
                  <span className="text-yellow-400">✨</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isUmbrellaSelecting && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-white">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            <span>우산을 확인하는 중...</span>
          </div>
        </div>
      )}
    </div>
  );
}
