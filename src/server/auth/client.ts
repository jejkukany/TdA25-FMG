import type { BetterAuthPlugin } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

const userStatsPlugin = () => {
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

export const client = createAuthClient({
  plugins: [userStatsPlugin()],
});
