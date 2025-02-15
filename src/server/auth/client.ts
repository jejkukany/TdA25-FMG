import type { BetterAuthPlugin } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

const adminPlugin = () => {
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
export const client = createAuthClient({
  plugins: [adminPlugin()],
});
