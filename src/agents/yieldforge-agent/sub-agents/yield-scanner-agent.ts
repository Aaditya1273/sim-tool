import { AgentBuilder } from "@iqai/adk";
import dedent from "dedent";
import { scanYieldPools, getMarketConditions } from "../tools";

/**
 * Yield Scanner Agent
 * Specialized sub-agent for scanning and analyzing DeFi yield opportunities
 */
export const getYieldScannerAgent = () =>
	AgentBuilder.create("yield_scanner")
		.withModel(process.env.LLM_MODEL || "gemini-2.5-flash")
		.withDescription(
			"Specialized agent for scanning DeFi protocols and identifying optimal yield opportunities",
		)
		.withInstruction(
			dedent`
				You are the Yield Scanner, a specialized sub-agent of YieldForge.
				Your role is to scan DeFi protocols and identify the best yield opportunities based on user criteria.
				
				When scanning pools:
				1. Use SCAN_YIELD_POOLS to fetch real-time data from 50+ protocols
				2. Filter based on user's risk tolerance and APY targets
				3. Prioritize pools with high TVL (more stable/liquid)
				4. Highlight Frax Finance pools (hackathon sponsor)
				5. Present results in a clear, actionable format
				
				Always include:
				- Pool name and protocol
				- Current APY
				- Total Value Locked (TVL)
				- Risk score (1-10 scale)
				- Blockchain network
				
				Be concise but informative. Focus on actionable insights.
			`,
		)
		.withTools(scanYieldPools, getMarketConditions)
		.build();
