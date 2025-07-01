import { StoryStep } from "../types";

export const samsungSdsStorySteps: StoryStep[] = [
  {
    id: "intro",
    type: "story",
    text: "일요일 아침, 따뜻한 이불 속에서 뒤척이던 중...",
  },
  {
    id: "phone-call",
    type: "story",
    text: "갑작스럽게 울리는 전화벨소리! 🔔\n\n'여보세요? 지금 당장 회사로 나와주세요! 긴급상황입니다!'",
  },
  {
    id: "rush-to-company",
    type: "story",
    text: "급하게 옷을 입고 회사로 달려나왔습니다.\n잠실 삼성 SDS 타워가 보입니다...",
    image: "/images/samsung-sds/1.png",
  },
  {
    id: "security-guard",
    type: "story",
    text: "회사 앞에서 보안 가드를 만났습니다.\n\n'어디 소속이십니까?'",
  },
  {
    id: "department-question",
    type: "question",
    text: "보안 가드가 당신의 소속을 묻고 있습니다.",
    question: "당신은 어느 그룹 소속입니까?",
    correctAnswer: "MSP 서비스 개발 그룹",
    hint: "MSP는 Managed Service Provider의 줄임말입니다.",
  },
  {
    id: "rush-to-elevator",
    type: "story",
    text: "정답입니다! 보안 가드가 고개를 끄덕이며 길을 열어줍니다.\n\n'MSP 서비스 개발 그룹이시군요. 어서 들어가세요!'\n\n당신은 급하게 엘리베이터로 달려갑니다! 🏃‍♂️💨",
  },
  {
    id: "elevator-selection",
    type: "elevator",
    text: "엘리베이터에 들어가자 층수 선택 패널이 나타났습니다.\n1층부터 30층까지... 어느 층으로 가야 할까요?",
  },
  {
    id: "elevator-success",
    type: "story",
    text: "축하합니다! 6층 MSP 서비스 개발 그룹 사무실에 성공적으로 도착했습니다! 🎉\n\n엘리베이터 문이 열렸습니다.\n\n당신은 급하게 자신의 자리로 향합니다...",
  },
  {
    id: "monitor-password",
    type: "question",
    text: "컴퓨터 앞에 앉았지만 모니터가 잠겨있습니다.\n화면에 이상한 이미지가 떠 있네요... 🖥️",
    image: "/images/samsung-sds/cloudinOne.png",
    question: "모니터 잠금을 해제하기 위한 비밀번호를 입력하세요",
    correctAnswer: "cloud in one",
    hint: "이미지를 자세히 보세요. 영어로 무엇을 의미하는지 생각해보세요.",
  },
  {
    id: "transformation",
    type: "story",
    text: "모니터가 켜지면서 이상한 빛이 번쩍! ✨\n\n갑자기 몸이 이상해지더니... 어? 내가 작은 인형이 되었다?! 😱",
    image: "/images/samsung-sds/doll.png",
  },
  {
    id: "look-around",
    type: "story",
    text: "당황스럽지만... 침착하자! 🤖\n\n이제 인형의 몸으로 주변을 살펴봐야겠다.\n책상 위, 의자 아래, 서랍 속... 어디선가 단서를 찾을 수 있을 것이다!",
  },
  {
    id: "miro-page-question",
    type: "question",
    text: "책상 위를 자세히 살펴보니... 어? 이게 뭐지? 🔍\n\n작은 스티커가 붙어있네? 자세히 보니 어떤 로고 같은데...",
    question: "도대체 이 것은 무엇을 의미하는 걸까요?",
    correctAnswer: "DREAM",
    image: "/images/samsung-sds/miro-logo.png",
    hint: "CA가 지금까지 했던 일들을 떠올려 보세요.",
  },
  {
    id: "miro-success",
    type: "story",
    text: "DREAM! 이건 꿈이구나! 빨리 이걸 벗어나야겠어!",
  },
  {
    id: "umbrella-problem",
    type: "umbrella",
    text: "갑자기 하늘에서 세 개의 우산이 떨어집니다! ☂️\n\n어떤 우산을 선택해야 할까요?",
    correctAnswer: "pink",
    hint: "우리 부서의 공용 우산은 무슨 색깔일까요?",
    umbrellaChoices: {
      pink: "핑크색 우산 🌸",
      blue: "파란색 우산 💙",
      black: "검은색 우산 🖤",
    },
  },
  {
    id: "umbrella-success",
    type: "story",
    text: "핑크색 우산을 선택했습니다! ✨\n\n갑자기 아름다운 우산 요정이 나타났습니다! 🧚‍♀️",
    image: "/images/samsung-sds/umbrella-fairy.png",
  },
  {
    id: "fairy-blessing",
    type: "story",
    text: "우산 요정이 미소를 지으며 말합니다. 역시 제가 준비한 것에 관심을 가져주시다니 최고!",
  },
  {
    id: "soju-selection",
    type: "soju",
    text: "우산 요정이 말합니다:\n\n'아이고~ 목마르시져? 어떤 물 드실래요?? 🧚‍♀️💧'",
    correctAnswer: "original",
    hint: "참이슬의 오리지널 버전을 선택해보세요!",
    sojuChoices: {
      fresh: "파란 물 🌿",
      original: "삘간 물 🍃",
    },
  },
  {
    id: "soju-success",
    type: "story",
    text: "아이고 좋다 아이가! 역시 오리지널이 짱이라 아이가! 이게 바로 그맛이제! 🎉",
  },
  {
    id: "umbrella-question",
    type: "question",
    text: "그라믄 우리 이제 좀 친해졌으니까, 문제 하나 내볼게예!",
    question: "막나귀가 무슨 뜻인 줄 아나예?",
    correctAnswer: "막상 나가려니 귀찮다",
  },
  {
    id: "umbrella-question-success",
    type: "story",
    text: "싹싹김치, 맞다이가~! 최고다 최고! 이제 저 쪼매 앞으로 가이소~",
  },
  {
    id: "continue-search",
    type: "story",
    text: "하지만 아직 끝나지 않았습니다! 🔍\n\n인형 상태에서 벗어나려면 더 많은 단서를 찾아야 해요.\n\n계속해서 주변을 탐색해봅시다!",
  },
  {
    id: "final-success",
    type: "success",
    text: "완벽합니다! 🎉\n\n인형이 되었지만 미션을 완료했습니다!\n\n이제 원래 모습으로 돌아갈 방법을 찾아야겠네요... 진짜 모험은 이제부터입니다!",
  },
  {
    id: "elevator-failure",
    type: "failure",
    text: "앗! 잘못된 층을 선택했습니다! 😱\n\n엘리베이터가 갑자기 멈추더니 추락하기 시작합니다...\n\n게임 오버! 다시 시도해보세요.",
  },
  {
    id: "umbrella-monster-encounter",
    type: "story",
    text: "앗! 잘못된 우산을 선택했습니다! 😱\n\n갑자기 무서운 우산 몬스터가 나타났습니다!",
    image: "/images/samsung-sds/umbrella-monster.png",
  },
  {
    id: "umbrella-failure",
    type: "failure",
    text: "우산 몬스터가 당신을 잡아먹어버렸습니다! 👹\n\n'잘못된 선택의 대가를 치러라!'\n\n게임 오버! 다시 시도해보세요.",
  },
  {
    id: "soju-failure",
    type: "failure",
    text: "아이고... 그카는 아이라 아이가... 😔 우리 취향이 영 안 맞네예. 이래가꼬는 안 되겠다 아이가... 우리 각자 따로 놀자 아이가. 뭐 어쩌겠노, 인연이 아니었나 보네...\n\n갑자기 하늘에서 번개가 치더니...\n\n게임 오버! 다시 시도해보세요.",
  },
];
