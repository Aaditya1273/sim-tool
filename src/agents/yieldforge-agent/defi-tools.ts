import { createTool } from "@iqai/adk";
import axios from "axios";
import { z } from "zod";

// DeFiLlama API client (free, no auth required)
const defiLlamaClient = axios.create({
	baseURL: "https://yields.llama.fi",
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Scan yield pools across DeFi protocols
 * Fetches real-time APY data from DeFiLlama
 */
export const scanYieldPools = createTool({
	name: "SCAN_YIELD_POOLS",
	description:
		"Scan DeFi protocols for yield opportunities. Returns APY, TVL, and risk metrics for various pools.",
	schema: z.object({
		chain: z
			.enum(["ethereum", "base", "arbitrum", "optimism", "all"])
			.default("all")
			.describe("Blockchain to scan (default: all chains)"),
		minApy: z
			.number()
			.min(0)
			.max(100)
			.default(5)
			.describe("Minimum APY threshold (%)"),
		limit: z
			.number()
			.int()
			.min(1)
			.max(50)
			.default(10)
			.describe("Number of pools to return"),
	}),
	fn: async ({ chain, minApy, limit }) => {
		try {
			const response = await defiLlamaClient.get("/pools");
			const pools = response.data.data;

			// Filter and sort pools
			let filteredPools = pools
				.filter((pool: any) => {
					const apy = pool.apy || 0;
					const tvl = pool.tvlUsd || 0;
					const chainMatch = chain === "all" || pool.chain === chain;
					return chainMatch && apy >= minApy && tvl > 100000; // Min $100k TVL
				})
				.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0))
				.slice(0, limit);

			// Format response
			const formattedPools = filteredPools.map((pool: any) => ({
				protocol: pool.project,
				pool: pool.symbol,
				chain: pool.chain,
				apy: pool.apy?.toFixed(2) || "0.00",
				apyBase: pool.apyBase?.toFixed(2) || "0.00",
				apyReward: pool.apyReward?.toFixed(2) || "0.00",
				tvl: `$${(pool.tvlUsd / 1000000).toFixed(2)}M`,
				stablecoin: pool.stablecoin || false,
				ilRisk: pool.ilRisk || "unknown",
			}));

			return {
				success: true,
				timestamp: new Date().toISOString(),
				poolsFound: formattedPools.length,
				pools: formattedPools,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to fetch yield pools",
			};
		}
	},
});

/**
 * Analyze risk profile and recommend pools
 */
export const analyzeRiskProfile = createTool({
	name: "ANALYZE_RISK_PROFILE",
	description:
		"Analyze user risk tolerance and recommend suitable yield strategies. Returns personalized pool recommendations.",
	schema: z.object({
		riskTolerance: z
			.enum(["conservative", "moderate", "aggressive"])
			.describe("User's risk tolerance level"),
		targetApy: z
			.number()
			.min(0)
			.max(100)
			.optional()
			.describe("Target APY goal (%)"),
		preferStablecoins: z
			.boolean()
			.default(true)
			.describe("Prefer stablecoin pools"),
	}),
	fn: async ({ riskTolerance, targetApy, preferStablecoins }) => {
		try {
			const response = await defiLlamaClient.get("/pools");
			const pools = response.data.data;

			// Risk-based filtering
			const riskParams = {
				conservative: {
					minTvl: 10000000, // $10M+
					maxApy: 15,
					stablecoinOnly: true,
					ilRisk: "none",
				},
				moderate: {
					minTvl: 5000000, // $5M+
					maxApy: 30,
					stablecoinOnly: false,
					ilRisk: "low",
				},
				aggressive: {
					minTvl: 1000000, // $1M+
					maxApy: 100,
					stablecoinOnly: false,
					ilRisk: "high",
				},
			};

			const params = riskParams[riskTolerance];

			let filteredPools = pools
				.filter((pool: any) => {
					const apy = pool.apy || 0;
					const tvl = pool.tvlUsd || 0;
					const isStablecoin = pool.stablecoin || false;

					if (tvl < params.minTvl) return false;
					if (apy > params.maxApy) return false;
					if (preferStablecoins && !isStablecoin) return false;
					if (targetApy && apy < targetApy) return false;

					return true;
				})
				.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0))
				.slice(0, 5);

			const recommendations = filteredPools.map((pool: any) => ({
				protocol: pool.project,
				pool: pool.symbol,
				chain: pool.chain,
				apy: pool.apy?.toFixed(2) || "0.00",
				tvl: `$${(pool.tvlUsd / 1000000).toFixed(2)}M`,
				riskScore: calculateRiskScore(pool),
				recommendation: generateRecommendation(pool, riskTolerance),
			}));

			return {
				success: true,
				riskProfile: riskTolerance,
				targetApy: targetApy || "flexible",
				recommendationsCount: recommendations.length,
				recommendations,
				summary: generateSummary(recommendations, riskTolerance),
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to analyze risk profile",
			};
		}
	},
});

/**
 * Simulate yield harvest strategy
 */
export const simulateHarvest = createTool({
	name: "SIMULATE_HARVEST",
	description:
		"Simulate yield harvesting strategy over time. Shows projected returns, gas costs, and optimal rebalancing schedule.",
	schema: z.object({
		initialAmount: z
			.number()
			.min(100)
			.max(1000000)
			.describe("Initial investment amount in USD"),
		pools: z
			.array(z.string())
			.min(1)
			.max(5)
			.describe("Pool names to simulate (e.g., ['Aave USDC', 'Curve 3pool'])"),
		duration: z
			.enum(["30d", "90d", "365d"])
			.default("90d")
			.describe("Simulation duration"),
	}),
	fn: async ({ initialAmount, pools, duration }) => {
		try {
			// Fetch current APYs for selected pools
			const response = await defiLlamaClient.get("/pools");
			const allPools = response.data.data;

			const selectedPools = pools
				.map((poolName) => {
					return allPools.find(
						(p: any) =>
							p.symbol?.toLowerCase().includes(poolName.toLowerCase()) ||
							p.project?.toLowerCase().includes(poolName.toLowerCase()),
					);
				})
				.filter(Boolean);

			if (selectedPools.length === 0) {
				return {
					success: false,
					error: "No matching pools found for simulation",
				};
			}

			// Calculate projections
			const days = duration === "30d" ? 30 : duration === "90d" ? 90 : 365;
			const avgApy =
				selectedPools.reduce((sum: number, p: any) => sum + (p.apy || 0), 0) /
				selectedPools.length;

			const projectedReturn = initialAmount * (avgApy / 100) * (days / 365);
			const finalAmount = initialAmount + projectedReturn;

			// Estimate gas costs (simplified)
			const gasPerRebalance = 15; // $15 avg gas
			const rebalanceFrequency = days / 30; // Monthly rebalancing
			const totalGasCost = gasPerRebalance * rebalanceFrequency;

			const netReturn = projectedReturn - totalGasCost;
			const netApy = (netReturn / initialAmount) * (365 / days) * 100;

			return {
				success: true,
				simulation: {
					initialAmount: `$${initialAmount.toLocaleString()}`,
					duration: `${days} days`,
					poolsUsed: selectedPools.map((p: any) => ({
						name: p.symbol,
						protocol: p.project,
						apy: p.apy?.toFixed(2),
					})),
					averageApy: `${avgApy.toFixed(2)}%`,
					projectedReturn: `$${projectedReturn.toFixed(2)}`,
					gasCosts: `$${totalGasCost.toFixed(2)}`,
					netReturn: `$${netReturn.toFixed(2)}`,
					finalAmount: `$${finalAmount.toFixed(2)}`,
					netApy: `${netApy.toFixed(2)}%`,
					rebalanceSchedule: `Every ${Math.floor(days / rebalanceFrequency)} days`,
				},
				recommendation:
					netApy > 10
						? "Strong strategy - proceed with confidence"
						: netApy > 5
							? "Moderate returns - consider higher APY pools"
							: "Low returns - gas costs eating into profits",
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to simulate harvest",
			};
		}
	},
});

/**
 * Get Frax Finance specific pools (sponsor integration)
 */
export const getFraxPools = createTool({
	name: "GET_FRAX_POOLS",
	description:
		"Get yield opportunities specifically from Frax Finance protocol. Highlights FRAX stablecoin pools and KRWQ integration potential.",
	fn: async () => {
		try {
			const response = await defiLlamaClient.get("/pools");
			const pools = response.data.data;

			// Filter for Frax-related pools
			const fraxPools = pools
				.filter(
					(pool: any) =>
						pool.project?.toLowerCase().includes("frax") ||
						pool.symbol?.toLowerCase().includes("frax"),
				)
				.sort((a: any, b: any) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
				.slice(0, 10);

			const formattedPools = fraxPools.map((pool: any) => ({
				protocol: pool.project,
				pool: pool.symbol,
				chain: pool.chain,
				apy: pool.apy?.toFixed(2) || "0.00",
				tvl: `$${(pool.tvlUsd / 1000000).toFixed(2)}M`,
				stablecoin: pool.stablecoin || false,
				krwqCompatible: pool.chain === "base" || pool.chain === "ethereum", // KRWQ integration potential
			}));

			return {
				success: true,
				timestamp: new Date().toISOString(),
				fraxPoolsFound: formattedPools.length,
				pools: formattedPools,
				sponsorNote:
					"Frax Finance is a leading stablecoin protocol. These pools offer stable yields with low impermanent loss risk.",
				krwqIntegration:
					"KRWQ (digital Korean Won) can be integrated with Frax pools on Base and Ethereum for Korean market access.",
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to fetch Frax pools",
			};
		}
	},
});

// Helper functions
function calculateRiskScore(pool: any): string {
	const tvl = pool.tvlUsd || 0;
	const apy = pool.apy || 0;
	const isStablecoin = pool.stablecoin || false;

	let score = 0;
	if (tvl > 10000000) score += 3;
	else if (tvl > 5000000) score += 2;
	else score += 1;

	if (isStablecoin) score += 2;
	if (apy < 15) score += 2;
	else if (apy < 30) score += 1;

	if (score >= 6) return "Low Risk";
	if (score >= 4) return "Medium Risk";
	return "High Risk";
}

function generateRecommendation(pool: any, riskTolerance: string): string {
	const apy = pool.apy || 0;
	const isStablecoin = pool.stablecoin || false;

	if (riskTolerance === "conservative") {
		return isStablecoin
			? `Excellent choice for conservative investors. Stable ${apy.toFixed(2)}% APY with minimal risk.`
			: "Consider stablecoin alternatives for lower risk.";
	}

	if (riskTolerance === "moderate") {
		return apy > 15
			? `Good balance of risk and reward. ${apy.toFixed(2)}% APY with moderate volatility.`
			: "Acceptable returns for moderate risk tolerance.";
	}

	return apy > 30
		? `High yield opportunity at ${apy.toFixed(2)}% APY. Monitor closely for volatility.`
		: "Consider higher APY pools for aggressive strategy.";
}

function generateSummary(recommendations: any[], riskTolerance: string): string {
	if (recommendations.length === 0) {
		return "No suitable pools found for your risk profile. Consider adjusting parameters.";
	}

	const avgApy =
		recommendations.reduce(
			(sum, r) => sum + parseFloat(r.apy || "0"),
			0,
		) / recommendations.length;

	return `Found ${recommendations.length} pools matching your ${riskTolerance} risk profile with average APY of ${avgApy.toFixed(2)}%. Diversify across these pools for optimal risk-adjusted returns.`;
}

export const defiTools = [
	scanYieldPools,
	analyzeRiskProfile,
	simulateHarvest,
	getFraxPools,
];
