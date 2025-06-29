# 🏠 방탈출 웹 게임 (Room Escape Game)

TanStack Start 기반의 몰입감 넘치는 방탈출 웹 게임입니다. 다양한 방을 탐험하고 퍼즐을 풀어 탈출하세요!

## ✨ 주요 기능

- 🎮 **다양한 방탈출 시나리오**: 여러 테마의 방 중에서 선택하여 플레이
- 🎨 **풍부한 애니메이션**: Framer Motion과 React Spring을 활용한 부드러운 모션
- 🔊 **몰입감 있는 사운드**: 배경음악과 효과음으로 게임 경험 향상
- 🎯 **인터랙티브 요소**: 드래그 앤 드롭, 제스처 인식 등 다양한 상호작용
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 게임 경험
- 🔐 **사용자 계정**: 게임 진행 상황 저장 및 랭킹 시스템

## 🛠️ 기술 스택

### 프론트엔드

- **React 19** - 최신 React 기능 활용
- **TanStack Start** - 풀스택 React 프레임워크
- **TanStack Router** - 타입 안전한 라우팅
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### 애니메이션 & 모션

- **Framer Motion** - 고급 애니메이션 라이브러리
- **React Spring** - 물리 기반 애니메이션
- **Lottie React** - 벡터 애니메이션
- **React Use Gesture** - 제스처 인식

### 사운드 & 인터랙션

- **Howler.js** - 오디오 재생 및 관리
- **use-sound** - React 사운드 훅
- **React Hotkeys Hook** - 키보드 단축키

### UI & 스타일링

- **Tailwind CSS v4** - 유틸리티 퍼스트 CSS
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 백엔드 & 데이터베이스

- **Drizzle ORM** - 타입 안전한 ORM
- **PostgreSQL** - 관계형 데이터베이스
- **Better Auth** - 인증 시스템

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd roomescape
```

### 2. 의존성 설치

```bash
bun install
```

### 3. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

필요한 환경 변수들:

- `DATABASE_URL` - PostgreSQL 데이터베이스 URL
- `BETTER_AUTH_SECRET` - 인증 시크릿 키
- `BETTER_AUTH_URL` - 인증 URL (개발 환경: http://localhost:3000)

### 4. 데이터베이스 설정

```bash
# 데이터베이스 스키마 푸시
bun run db push

# 또는 마이그레이션 생성 및 실행
bun run db generate
bun run db migrate
```

### 5. 개발 서버 실행

```bash
bun run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📦 주요 스크립트

```bash
# 개발 서버 실행
bun run dev

# 프로덕션 빌드
bun run build

# 프로덕션 서버 실행
bun run start

# 데이터베이스 관련
bun run db              # Drizzle Kit 명령어 실행
bun run db push         # 스키마를 데이터베이스에 푸시
bun run db generate     # 마이그레이션 파일 생성

# 인증 관련
bun run auth:secret     # 새로운 인증 시크릿 생성
bun run auth:generate   # 인증 스키마 재생성

# UI 컴포넌트
bun run ui              # shadcn/ui 컴포넌트 추가

# 코드 품질
bun run lint            # ESLint 실행
bun run format          # Prettier 실행
bun run check-types     # TypeScript 타입 체크

# 의존성 관리
bun run deps            # 의존성 업데이트 (대화형)
```

## 🎮 게임 구조

### 방 선택 화면

- 다양한 테마의 방탈출 게임 목록
- 각 방의 난이도와 예상 플레이 시간 표시
- 진행 상황 및 최고 기록 확인

### 게임 플레이

- 방 내부 탐색 및 아이템 수집
- 퍼즐 해결 및 단서 조합
- 힌트 시스템 및 진행 상황 저장
- 실시간 타이머 및 점수 시스템

### 사용자 계정

- 회원가입 및 로그인
- 게임 진행 상황 자동 저장
- 개인 기록 및 통계 확인
- 랭킹 시스템

## 🎨 애니메이션 가이드

### Framer Motion 사용 예시

```typescript
import { motion } from 'framer-motion'

const RoomItem = ({ room }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* 방 내용 */}
  </motion.div>
)
```

### React Spring 사용 예시

```typescript
import { useSpring, animated } from '@react-spring/web'

const GameItem = ({ isVisible }) => {
  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-20px)',
  })

  return <animated.div style={styles}>게임 아이템</animated.div>
}
```

## 🔊 사운드 시스템

### 배경음악 및 효과음

```typescript
import useSound from "use-sound";

const GameRoom = () => {
  const [playBgm] = useSound("/sounds/background.mp3", { loop: true });
  const [playClick] = useSound("/sounds/click.mp3");
  const [playSuccess] = useSound("/sounds/success.mp3");

  // 사운드 재생 로직
};
```

## 🎯 상태 관리

### Zustand 스토어 예시

```typescript
import { create } from "zustand";

interface GameState {
  currentRoom: string | null;
  inventory: Item[];
  score: number;
  timeElapsed: number;
  isGameActive: boolean;

  // 액션들
  setCurrentRoom: (roomId: string) => void;
  addToInventory: (item: Item) => void;
  updateScore: (points: number) => void;
  startGame: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // 상태 및 액션 구현
}));
```

## 📱 반응형 디자인

모든 화면 크기에서 최적화된 경험을 제공합니다:

- **모바일** (320px~768px): 터치 친화적 인터페이스
- **태블릿** (768px~1024px): 적응형 레이아웃
- **데스크톱** (1024px+): 풀 기능 경험

## 🔐 보안 고려사항

- Better Auth를 통한 안전한 인증
- 게임 진행 상황의 서버 사이드 검증
- XSS 및 CSRF 공격 방지
- 민감한 데이터의 암호화 저장

## 🚀 배포

TanStack Start의 [호스팅 문서](https://tanstack.com/start/latest/docs/framework/react/hosting)를 참고하여 배포하세요.

### 추천 호스팅 플랫폼

- **Vercel** - 간편한 배포 및 자동 스케일링
- **Netlify** - JAMstack 최적화
- **Railway** - 데이터베이스 포함 풀스택 배포

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

## 🎉 즐거운 게임 되세요!

방탈출 게임을 즐기시고, 버그나 개선사항이 있으시면 언제든 이슈를 등록해주세요! 🎮✨
