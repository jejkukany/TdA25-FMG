import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";
import type { BetterAuthPlugin } from "better-auth/plugins";

export const userStatsPlugin = () => {
  return {
    id: "user-stats-plugin",
    schema: {
      user: {
        fields: {
          uuid: {
            type: "string",
          },
          elo: {
            type: "number",
          },
          wins: {
            type: "number",
          },
          draws: {
            type: "number",
          },
          losses: {
            type: "number",
          },
        },
      },
    },
  } satisfies BetterAuthPlugin;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  plugins: [userStatsPlugin()],
  emailAndPassword: {
    enabled: true,
  },
});
