export interface StoryStep {
  id: string;
  type: "story" | "question" | "success" | "failure" | "elevator";
  text: string;
  image?: string;
  question?: string;
  correctAnswer?: string;
  hint?: string;
}

export interface GameState {
  currentStepIndex: number;
  userAnswer: string;
  showInput: boolean;
  isAnswering: boolean;
  answerResult: "correct" | "incorrect" | null;
  score: number;
  hintsUsed: number;
  selectedFloor: number | null;
  showElevatorButtons: boolean;
  isFloorSelecting: boolean;
  showElevatorAnimation: boolean;
  currentFloor: number;
}

export interface GameActions {
  handleTextComplete: () => void;
  handleFloorSelection: (floor: number) => void;
  handleRetryFromFailure: () => void;
  handleAnswerSubmit: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleGoBack: () => void;
  handleGameComplete: () => void;
  setUserAnswer: (value: string) => void;
}
