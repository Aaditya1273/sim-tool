import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema definition for YieldForge Agent.
 * Validates agent configuration for AGENT ARENA Hackathon.
 */
export const envSchema = z.object({
	// Agent configuration
	ADK_DEBUG: z.coerce.boolean().default(false),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	
	// Fraxtal Testnet configuration (for hackathon demo)
	WALLET_PRIVATE_KEY: z.string().optional(),
	FRAXTAL_RPC_URL: z
		.string()
		.url()
		.default("https://rpc.testnet.fraxtal.io"),
	FRAXTAL_CHAIN_ID: z.coerce.number().default(2522),
	FRAXTAL_EXPLORER: z
		.string()
		.url()
		.default("https://explorer.testnet.fraxtal.io"),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
