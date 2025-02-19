import { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { userStatsPlugin } from "./auth";

export const userStatsClientPlugin = () => {
	return {
		id: "userStatsPlugin",
		$InferServerPlugin: {} as ReturnType<typeof userStatsPlugin>,
	} satisfies BetterAuthClientPlugin;
};
export const client = createAuthClient({
	plugins: [userStatsClientPlugin()],
});
