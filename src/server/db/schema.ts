import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

// Games table
export const games = sqliteTable("games", {
  id: int("id").primaryKey().notNull(),
  name: text("name").notNull(),
  difficulty: text({
    enum: ["beginner", "easy", "medium", "hard", "extreme"],
  }).notNull(),
  board: text("board", { mode: "json" }).$type<string[][]>().notNull(),
  gameState: text({
    enum: ["opening", "midgame", "endgame", "unknown"],
  }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});
