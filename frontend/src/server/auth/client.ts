import { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { userStatsPlugin } from "./auth";
import { adminClient, usernameClient } from "better-auth/client/plugins";

export const userStatsClientPlugin = () => {
	return {
		id: "userStatsPlugin",
		$InferServerPlugin: {} as ReturnType<typeof userStatsPlugin>,
	} satisfies BetterAuthClientPlugin;
};
export const client = createAuthClient({
	plugins: [userStatsClientPlugin(), usernameClient(), adminClient()],
});
