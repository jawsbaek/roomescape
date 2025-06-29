import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const gameProgress = pgTable("game_progress", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  roomId: text("room_id").notNull(),
  currentStep: integer("current_step").notNull().default(0),
  collectedItems: jsonb("collected_items").$type<string[]>().default([]),
  solvedPuzzles: jsonb("solved_puzzles").$type<string[]>().default([]),
  hintsUsed: integer("hints_used").notNull().default(0),
  score: integer("score").notNull().default(0),
  timeElapsed: integer("time_elapsed").notNull().default(0), // 초 단위
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  startTime: timestamp("start_time")
    .$defaultFn(() => new Date())
    .notNull(),
  lastSaveTime: timestamp("last_save_time")
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const roomCompletion = pgTable("room_completion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  roomId: text("room_id").notNull(),
  bestTime: integer("best_time").notNull(), // 초 단위
  totalAttempts: integer("total_attempts").notNull().default(1),
  hintsUsed: integer("hints_used").notNull().default(0),
  score: integer("score").notNull().default(0),
  completedAt: timestamp("completed_at")
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export type GameProgress = typeof gameProgress.$inferSelect;
export type NewGameProgress = typeof gameProgress.$inferInsert;
export type RoomCompletion = typeof roomCompletion.$inferSelect;
export type NewRoomCompletion = typeof roomCompletion.$inferInsert;
