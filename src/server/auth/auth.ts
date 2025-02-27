import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";
import { admin, username, type BetterAuthPlugin } from "better-auth/plugins";

export const userStatsPlugin = () => {
	return {
		id: "user-stats-plugin",
		schema: {
			user: {
				fields: {
					uuid: {
						type: "string",
						unique: true,
					},
					elo: {
						type: "number",
						required: true,
					},
					wins: {
						type: "number",
						required: true,
					},
					draws: {
						type: "number",
						required: true,
					},
					losses: {
						type: "number",
						required: true,
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
	plugins: [userStatsPlugin(), username(), admin()],
	emailAndPassword: {
		enabled: true,
	},
	user: {
		changeEmail: {
			enabled: true,
		},
	},
	trustedOrigins: ["https://13682ac4.app.deploy.tourde.app"],
});
