import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gameProgress, NewGameProgress } from "@/lib/db/schema";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { and, eq } from "drizzle-orm";

export const APIRoute = createAPIFileRoute("/api/game/progress")({
  GET: async ({ request }) => {
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

  POST: async ({ request }) => {
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

      if (!roomId) {
        return new Response("Room ID is required", { status: 400 });
      }

      // 기존 진행상황 확인
      const existingProgress = await db.query.gameProgress.findFirst({
        where: and(
          eq(gameProgress.userId, session.user.id),
          eq(gameProgress.roomId, roomId),
          eq(gameProgress.isCompleted, false),
        ),
      });

      let result;
      if (existingProgress) {
        // 업데이트
        result = await db
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
        // 새로 생성
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
        result = await db.insert(gameProgress).values(newProgress).returning();
      }

      return json({ progress: result[0] });
    } catch (error) {
      console.error("[POST /api/game/progress] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  DELETE: async ({ request }) => {
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
