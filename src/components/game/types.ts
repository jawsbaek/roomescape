export interface StoryStep {
  id: string;
  type: "story" | "question" | "success" | "failure" | "elevator" | "umbrella" | "soju";
  text: string;
  image?: string;
  question?: string;
  correctAnswer?: string;
  hint?: string;
  umbrellaChoices?: {
    pink: string;
    blue: string;
    black: string;
  };
  sojuChoices?: {
    fresh: string;
    original: string;
  };
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
  selectedUmbrella: string | null;
  showUmbrellaSelection: boolean;
  isUmbrellaSelecting: boolean;
  selectedSoju: string | null;
  showSojuSelection: boolean;
  isSojuSelecting: boolean;
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
  handleUmbrellaSelection: (color: string) => void;
  handleSojuSelection: (type: string) => void;
}
