import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gameProgress, NewRoomCompletion, roomCompletion } from "@/lib/db/schema";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";

export const ServerRoute = createServerFileRoute("/api/game/complete").methods({
  POST: async ({ request }: { request: Request }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
      }

      const body = await request.json();
      const { roomId, finalScore, totalTime, hintsUsed } = body;

      if (!roomId) {
        return new Response("Room ID is required", { status: 400 });
      }

      // 기존 진행상황 완료 처리
      await db
        .update(gameProgress)
        .set({
          isCompleted: true,
          completedAt: new Date(),
          score: finalScore,
          timeElapsed: totalTime,
          hintsUsed,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(gameProgress.userId, session.user.id),
            eq(gameProgress.roomId, roomId),
            eq(gameProgress.isCompleted, false),
          ),
        );

      // 기존 완료 기록 확인
      const existingCompletion = await db.query.roomCompletion.findFirst({
        where: and(
          eq(roomCompletion.userId, session.user.id),
          eq(roomCompletion.roomId, roomId),
        ),
      });

      let completionResult;
      if (existingCompletion) {
        // 기존 기록 업데이트 (더 좋은 기록인 경우)
        const isBetterTime = totalTime < existingCompletion.bestTime;
        const isBetterScore = finalScore > existingCompletion.score;

        if (isBetterTime || isBetterScore) {
          completionResult = await db
            .update(roomCompletion)
            .set({
              bestTime: isBetterTime ? totalTime : existingCompletion.bestTime,
              score: isBetterScore ? finalScore : existingCompletion.score,
              totalAttempts: existingCompletion.totalAttempts + 1,
              hintsUsed: isBetterTime ? hintsUsed : existingCompletion.hintsUsed,
              updatedAt: new Date(),
            })
            .where(eq(roomCompletion.id, existingCompletion.id))
            .returning();
        } else {
          // 기록 갱신은 없지만 시도 횟수 증가
          completionResult = await db
            .update(roomCompletion)
            .set({
              totalAttempts: existingCompletion.totalAttempts + 1,
              updatedAt: new Date(),
            })
            .where(eq(roomCompletion.id, existingCompletion.id))
            .returning();
        }
      } else {
        // 첫 완료 기록 생성
        const newCompletion: NewRoomCompletion = {
          userId: session.user.id,
          roomId,
          bestTime: totalTime,
          score: finalScore,
          hintsUsed,
        };
        completionResult = await db
          .insert(roomCompletion)
          .values(newCompletion)
          .returning();
      }

      return json({
        success: true,
        completion: completionResult[0],
        isNewRecord:
          !existingCompletion ||
          totalTime < existingCompletion.bestTime ||
          finalScore > existingCompletion.score,
      });
    } catch (error) {
      console.error("[POST /api/game/complete] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
