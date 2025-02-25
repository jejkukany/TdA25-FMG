import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Games table
export const games = sqliteTable("games", {
	uuid: text("uuid").notNull().unique(),
	name: text("name").notNull(),
	difficulty: text({
		enum: ["beginner", "easy", "medium", "hard", "extreme"],
	}).notNull(),
	board: text("board", { mode: "json" }).$type<string[][]>().notNull(),
	gameState: text({
		enum: ["opening", "midgame", "endgame", "unknown"],
	}),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const matches = sqliteTable("matches", {
	uuid: text("uuid").notNull().unique(),
	player1Id: text("player1_id")
		.notNull()
		.references(() => user.uuid, { onDelete: "cascade" }),
	player2Id: text("player2_id")
		.notNull()
		.references(() => user.uuid, { onDelete: "cascade" }),
	result: text({ enum: ["player1_win", "player2_win", "draw"] }).notNull(),
	player1EloChange: integer("player1_elo_change").notNull(),
	player2EloChange: integer("player2_elo_change").notNull(),
	finalBoard: text("final_board", { mode: "json" })
		.$type<string[][]>()
		.notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const moves = sqliteTable("moves", {
	uuid: text("uuid").notNull().unique(),
	matchId: text("match_id")
		.notNull()
		.references(() => matches.uuid, { onDelete: "cascade" }),
	playerId: text("player_id")
		.notNull()
		.references(() => user.uuid, { onDelete: "cascade" }),
	position: text("position", { mode: "json" })
		.$type<[number, number]>()
		.notNull(),
	symbol: text("symbol", { enum: ["X", "O"] }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	isAdmin: integer("is_admin", { mode: "boolean" }),
	uuid: text("uuid").unique(),
	elo: integer("elo").default(400),
	wins: integer("wins").default(0),
	draws: integer("draws").default(0),
	losses: integer("losses").default(0),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
	updatedAt: integer("updated_at", { mode: "timestamp" }),
});