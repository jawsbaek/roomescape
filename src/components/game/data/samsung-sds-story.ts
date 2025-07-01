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
    id: "final-success",
    type: "success",
    text: "완벽합니다! 🎉\n\n인형이 되었지만 미션을 완료했습니다!\n\n이제 원래 모습으로 돌아갈 방법을 찾아야겠네요... 진짜 모험은 이제부터입니다!",
  },
  {
    id: "elevator-failure",
    type: "failure",
    text: "앗! 잘못된 층을 선택했습니다! 😱\n\n엘리베이터가 갑자기 멈추더니 추락하기 시작합니다...\n\n게임 오버! 다시 시도해보세요.",
  },
];
