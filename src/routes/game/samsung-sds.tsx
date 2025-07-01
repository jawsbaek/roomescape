import { SamsungSDSEscape } from "@/components/game/SamsungSDSEscape";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/game/samsung-sds")({
  component: SamsungSDSEscape,
  beforeLoad: async ({ context }) => {
    // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: "/game/samsung-sds",
        },
      });
    }
  },
});
