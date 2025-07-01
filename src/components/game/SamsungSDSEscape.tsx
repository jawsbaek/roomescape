import { Card, CardContent } from "@/components/ui/card";
import { useSamsungSDSGame } from "@/hooks/useSamsungSDSGame";
import { samsungSdsStorySteps } from "./data/samsung-sds-story";
import {
  ElevatorAnimation,
  ElevatorSelector,
  GameFailure,
  GameHeader,
  GameSuccess,
  QuestionInput,
  StoryDisplay,
} from "./ui";

export function SamsungSDSEscape() {
  const gameState = useSamsungSDSGame();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-white/20 bg-black/40 shadow-2xl backdrop-blur-lg">
          <CardContent className="p-8">
            <GameHeader
              onGoBack={gameState.handleGoBack}
              formattedTime={gameState.formattedTime}
              score={gameState.score}
              isSaving={gameState.isSaving}
              currentStepIndex={gameState.currentStepIndex}
              totalSteps={samsungSdsStorySteps.length}
            />

            <StoryDisplay
              currentStep={gameState.currentStep}
              onTextComplete={gameState.handleTextComplete}
            />

            <QuestionInput
              currentStep={gameState.currentStep}
              showInput={gameState.showInput}
              userAnswer={gameState.userAnswer}
              setUserAnswer={gameState.setUserAnswer}
              isAnswering={gameState.isAnswering}
              answerResult={gameState.answerResult}
              onAnswerSubmit={gameState.handleAnswerSubmit}
              onKeyPress={gameState.handleKeyPress}
            />

            <ElevatorSelector
              currentStep={gameState.currentStep}
              showElevatorButtons={gameState.showElevatorButtons}
              selectedFloor={gameState.selectedFloor}
              isFloorSelecting={gameState.isFloorSelecting}
              onFloorSelection={gameState.handleFloorSelection}
            />

            <ElevatorAnimation
              showElevatorAnimation={gameState.showElevatorAnimation}
              currentFloor={gameState.currentFloor}
              selectedFloor={gameState.selectedFloor}
            />

            <GameFailure
              currentStep={gameState.currentStep}
              onRetry={gameState.handleRetryFromFailure}
              onGoBack={gameState.handleGoBack}
            />

            <GameSuccess
              currentStep={gameState.currentStep}
              formattedTime={gameState.formattedTime}
              score={gameState.score}
              timeElapsed={gameState.timeElapsed}
              hintsUsed={gameState.hintsUsed}
              isCompleting={gameState.isCompleting}
              onGameComplete={gameState.handleGameComplete}
              onGoBack={gameState.handleGoBack}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
