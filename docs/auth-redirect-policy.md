# 인증 리다이렉트 정책

EscapeVerse 애플리케이션의 로그인/회원가입 후 리다이렉트 정책을 정의합니다.

## 개요

사용자가 로그인 또는 회원가입을 완료한 후 어디로 리다이렉트할지를 결정하는 정책입니다. 보안성과 사용자 경험을 모두 고려하여 설계되었습니다.

## 리다이렉트 우선순위

리다이렉트 URL은 다음 우선순위에 따라 결정됩니다:

1. **쿼리 파라미터의 `redirectTo`** (최우선)
   - URL의 `?redirectTo=/game/samsung-sds` 형태
   - 사용자가 보호된 페이지에 접근 시 자동으로 설정

2. **라우트 컨텍스트의 `redirectUrl`**
   - auth 라우트에서 제공하는 기본값
   - 현재 `/dashboard`로 설정

3. **기본값: `/dashboard`**
   - 위 조건들이 모두 실패한 경우의 fallback

## 허용 가능한 리다이렉트 경로

보안상의 이유로 다음 경로들만 리다이렉트가 허용됩니다:

- `/` (홈페이지)
- `/dashboard` (대시보드)
- `/game/samsung-sds` (삼성SDS 게임)

### 보안 규칙

- 외부 URL로의 리다이렉트 금지 (`//` 또는 `http://` 시작 불가)
- 상대 경로만 허용 (`/`로 시작해야 함)
- 허용 목록에 없는 경로는 기본값으로 리다이렉트

## 사용자 메시지

리다이렉트 상황에 따라 적절한 메시지를 표시합니다:

### 로그인 페이지

- 게임 경로 (`/game/*`): "게임을 플레이하려면 로그인이 필요합니다"
- 기타 경로: "계속하려면 로그인이 필요합니다"

### 회원가입 페이지

- 게임 경로 (`/game/*`): "게임을 플레이하려면 계정이 필요합니다"
- 기타 경로: "계속하려면 계정이 필요합니다"

## 구현 세부사항

### 핵심 파일

1. **`src/lib/auth/redirect-utils.ts`**
   - 리다이렉트 정책의 핵심 로직
   - 재사용 가능한 유틸리티 함수들

2. **`src/routes/(auth)/login.tsx`**
   - 로그인 페이지 구현
   - 타입 안전한 search params 처리

3. **`src/routes/(auth)/signup.tsx`**
   - 회원가입 페이지 구현
   - 동일한 리다이렉트 정책 적용

### 주요 함수

#### `isValidRedirectUrl(url: string | undefined): boolean`

- 리다이렉트 URL의 안전성을 검증
- 허용 목록과 보안 규칙을 적용

#### `getFinalRedirectUrl(searchRedirectTo: string | undefined, contextRedirectUrl: string): string`

- 최종 리다이렉트 URL을 우선순위에 따라 결정
- 모든 입력에 대해 안전한 URL을 반환

#### `getRedirectMessage(redirectTo: string | undefined, isLogin: boolean): string`

- 상황에 맞는 사용자 메시지 생성
- 로그인/회원가입 및 대상 경로에 따라 메시지 결정

## 사용 예시

### 보호된 게임 페이지 접근

```typescript
// 사용자가 /game/samsung-sds에 비로그인 상태로 접근
export const Route = createFileRoute("/game/samsung-sds")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: "/game/samsung-sds", // 로그인 후 이 페이지로 돌아감
        },
      });
    }
  },
});
```

### 로그인 페이지에서 리다이렉트 처리

```typescript
// search params 타입 안전성
const search = useSearch({ from: "/(auth)/login" });

// 최종 리다이렉트 URL 결정
const finalRedirectUrl = getFinalRedirectUrl(search.redirectTo, redirectUrl);

// 로그인 성공 후 리다이렉트
authClient.signIn.email({
  email,
  password,
  callbackURL: finalRedirectUrl,
});
```

## 확장 방법

새로운 보호된 페이지를 추가할 때:

1. **허용 경로 추가**

   ```typescript
   // src/lib/auth/redirect-utils.ts
   const ALLOWED_REDIRECT_PATHS = [
     "/dashboard",
     "/game/samsung-sds",
     "/new-protected-page", // 새 경로 추가
   ] as const;
   ```

2. **라우트에서 인증 체크 추가**
   ```typescript
   export const Route = createFileRoute("/new-protected-page")({
     beforeLoad: async ({ context }) => {
       if (!context.user) {
         throw redirect({
           to: "/login",
           search: { redirectTo: "/new-protected-page" },
         });
       }
     },
   });
   ```

## 테스트 시나리오

다음 시나리오들을 테스트하여 정책이 올바르게 작동하는지 확인합니다:

1. **정상적인 리다이렉트**
   - 게임 페이지 → 로그인 → 게임 페이지 복귀
   - 대시보드 → 로그인 → 대시보드 복귀

2. **보안 테스트**
   - 외부 URL 시도 → 기본값으로 리다이렉트
   - 비허용 경로 시도 → 기본값으로 리다이렉트

3. **타입 안전성**
   - 잘못된 타입의 search params → 무시하고 기본값 사용

## 주의사항

- 허용 경로 목록을 수정할 때는 보안 검토가 필요합니다
- 외부 URL 허용은 Open Redirect 취약점으로 이어질 수 있습니다
- 새로운 경로 추가 시 테스트 케이스도 함께 추가해야 합니다
