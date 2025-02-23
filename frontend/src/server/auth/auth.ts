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
						required: false,
					},
					elo: {
						type: "number",
					},
					isAdmin: {
						type: "boolean",
						defaultValue: false,
					},
					wins: {
						type: "number",
						required: false,
					},
					draws: {
						type: "number",
						required: false,
					},
					losses: {
						type: "number",
						required: false,
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
	trustedOrigins: [
		"https://13682ac4.app.deploy.tourde.app",
		"http://localhost:3000"
	],
});
