import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoryStep } from "../types";

interface SojuSelectorProps {
  currentStep: StoryStep;
  showSojuSelection: boolean;
  selectedSoju: string | null;
  isSojuSelecting: boolean;
  onSojuSelection: (type: string) => void;
}

export function SojuSelector({
  currentStep,
  showSojuSelection,
  selectedSoju,
  isSojuSelecting,
  onSojuSelection,
}: SojuSelectorProps) {
  if (currentStep.type !== "soju" || !showSojuSelection || !currentStep.sojuChoices) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="text-center text-lg font-semibold">
        어떤 물을 선택하시겠습니까? 🥃
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Card className="p-4 transition-shadow hover:shadow-lg">
          <Button
            onClick={() => onSojuSelection("fresh")}
            disabled={isSojuSelecting}
            variant="outline"
            className="flex h-24 w-full flex-col items-center gap-2 text-lg"
          >
            <img
              src="/images/samsung-sds/fresh.png"
              alt="후레쉬"
              className="h-12 w-12 object-contain"
            />
            {currentStep.sojuChoices.fresh}
          </Button>
        </Card>
        <Card className="p-4 transition-shadow hover:shadow-lg">
          <Button
            onClick={() => onSojuSelection("original")}
            disabled={isSojuSelecting}
            variant="outline"
            className="flex h-24 w-full flex-col items-center gap-2 text-lg"
          >
            <img
              src="/images/samsung-sds/original.png"
              alt="오리지널"
              className="h-12 w-12 object-contain"
            />
            {currentStep.sojuChoices.original}
          </Button>
        </Card>
      </div>
      {selectedSoju && (
        <div className="text-center text-sm text-gray-400">
          선택한 물: {selectedSoju === "fresh" ? "후레쉬" : "오리지널"}
        </div>
      )}
    </div>
  );
}
