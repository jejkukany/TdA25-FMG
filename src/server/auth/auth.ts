import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema"; // Import your schema
import type { BetterAuthPlugin } from "better-auth/plugins";

// Initialize SQLite database with better-sqlite3
const sqlite = new Database("./sqlite.db");
const db = drizzle(sqlite, { schema });

// Admin Plugin
export const adminPlugin = () => {
  return {
    id: "admin-plugin",
    schema: {
      user: {
        fields: {
          isAdmin: {
            type: "boolean",
          },
        },
      },
    },
  } satisfies BetterAuthPlugin;
};

// Authentication setup
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  plugins: [adminPlugin()],
  emailAndPassword: {
    enabled: true,
  },
});
