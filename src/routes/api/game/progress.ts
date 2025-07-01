import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gameProgress, NewGameProgress } from "@/lib/db/schema";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";

export const ServerRoute = createServerFileRoute("/api/game/progress").methods({
  GET: async ({ request }: { request: Request }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
      }

      const url = new URL(request.url);
      const roomId = url.searchParams.get("roomId");

      if (!roomId) {
        return new Response("Room ID is required", { status: 400 });
      }

      const progress = await db.query.gameProgress.findFirst({
        where: and(
          eq(gameProgress.userId, session.user.id),
          eq(gameProgress.roomId, roomId),
          eq(gameProgress.isCompleted, false),
        ),
      });

      return json({ progress });
    } catch (error) {
      console.error("[GET /api/game/progress] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  POST: async ({ request }: { request: Request }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
      }

      const body = await request.json();
      const {
        roomId,
        currentStep,
        collectedItems = [],
        solvedPuzzles = [],
        hintsUsed = 0,
        score = 0,
        timeElapsed = 0,
      } = body;

      if (!roomId || typeof currentStep !== "number") {
        return new Response("Room ID and current step are required", { status: 400 });
      }

      // 기존 진행상황 확인
      const existingProgress = await db.query.gameProgress.findFirst({
        where: and(
          eq(gameProgress.userId, session.user.id),
          eq(gameProgress.roomId, roomId),
          eq(gameProgress.isCompleted, false),
        ),
      });

      let savedProgress;

      if (existingProgress) {
        // 기존 진행상황 업데이트
        savedProgress = await db
          .update(gameProgress)
          .set({
            currentStep,
            collectedItems,
            solvedPuzzles,
            hintsUsed,
            score,
            timeElapsed,
            lastSaveTime: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(gameProgress.id, existingProgress.id))
          .returning();
      } else {
        // 새 진행상황 생성
        const newProgress: NewGameProgress = {
          userId: session.user.id,
          roomId,
          currentStep,
          collectedItems,
          solvedPuzzles,
          hintsUsed,
          score,
          timeElapsed,
        };
        savedProgress = await db.insert(gameProgress).values(newProgress).returning();
      }

      return json({ progress: savedProgress[0] });
    } catch (error) {
      console.error("[POST /api/game/progress] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  DELETE: async ({ request }: { request: Request }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
      }

      const url = new URL(request.url);
      const roomId = url.searchParams.get("roomId");

      if (!roomId) {
        return new Response("Room ID is required", { status: 400 });
      }

      // 미완료 진행상황 삭제
      await db
        .delete(gameProgress)
        .where(
          and(
            eq(gameProgress.userId, session.user.id),
            eq(gameProgress.roomId, roomId),
            eq(gameProgress.isCompleted, false),
          ),
        );

      return json({ success: true });
    } catch (error) {
      console.error("[DELETE /api/game/progress] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
