/**
 * 인증 관련 리다이렉트 정책을 관리하는 유틸리티 함수들
 */

// 허용된 리다이렉트 경로 목록
const ALLOWED_REDIRECT_PATHS = [
  "/",
  "/game/samsung-sds",
  // 필요에 따라 추가 경로를 여기에 추가
] as const;

// 기본 리다이렉트 URL
const DEFAULT_REDIRECT_URL = "/";

/**
 * 안전한 리다이렉트 URL인지 검증
 * @param url 검증할 URL
 * @returns 안전한 URL인지 여부
 */
export function isValidRedirectUrl(url: string | undefined): boolean {
  if (!url) return false;

  // 빈 문자열이나 외부 URL 방지
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  // 허용된 경로만 리다이렉트 허용
  return ALLOWED_REDIRECT_PATHS.some((path) => url.startsWith(path)) || url === "/";
}

/**
 * 최종 리다이렉트 URL 결정
 * @param searchRedirectTo 쿼리 파라미터의 redirectTo 값
 * @param contextRedirectUrl 컨텍스트에서 제공된 redirectUrl 값
 * @returns 최종 리다이렉트 URL
 */
export function getFinalRedirectUrl(
  searchRedirectTo: string | undefined,
  contextRedirectUrl: string,
): string {
  // 1. 쿼리 파라미터의 redirectTo가 있고 유효한 경우 (최우선)
  if (isValidRedirectUrl(searchRedirectTo)) {
    return searchRedirectTo!; // 이미 isValidRedirectUrl에서 undefined가 아님을 확인했으므로 안전
  }

  // 2. context에서 제공된 redirectUrl 사용
  if (isValidRedirectUrl(contextRedirectUrl)) {
    return contextRedirectUrl;
  }

  // 3. 기본값: 대시보드
  return DEFAULT_REDIRECT_URL;
}

/**
 * 게임 경로인지 확인
 * @param path 확인할 경로
 * @returns 게임 경로인지 여부
 */
export function isGamePath(path: string | undefined): boolean {
  return path ? path.startsWith("/game/") : false;
}

/**
 * 리다이렉트가 필요한 상황에 대한 메시지 생성
 * @param redirectTo 리다이렉트 대상 경로
 * @param isLogin 로그인 페이지인지 여부 (true: 로그인, false: 회원가입)
 * @returns 사용자에게 표시할 메시지
 */
export function getRedirectMessage(
  redirectTo: string | undefined,
  isLogin: boolean = true,
): string {
  if (!redirectTo) return "";

  const action = isLogin ? "로그인이" : "계정이";

  if (isGamePath(redirectTo)) {
    return `게임을 플레이하려면 ${action} 필요합니다`;
  }

  return `계속하려면 ${action} 필요합니다`;
}

/**
 * 허용된 리다이렉트 경로 목록을 반환
 * @returns 허용된 경로 배열
 */
export function getAllowedRedirectPaths(): readonly string[] {
  return ALLOWED_REDIRECT_PATHS;
}
