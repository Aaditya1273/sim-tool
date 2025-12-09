import getYieldForgeAgent from "./agents/yieldforge-agent/agent.js";

/**
 * YieldForge Agent - Entry Point
 * Autonomous DeFi Yield Optimizer for AGENT ARENA Hackathon
 */
async function main() {
	console.log("🚀 Initializing YieldForge Agent...");
	console.log("📊 Multi-Agent DeFi Yield Optimizer");
	console.log("🏆 Built for AGENT ARENA Hackathon");
	console.log("━".repeat(50));

	try {
		const agent = await getYieldForgeAgent();
		console.log("✅ YieldForge Agent initialized successfully!");
		console.log("🔧 Sub-agents loaded:");
		console.log("   • Yield Scanner - Scans 50+ DeFi protocols");
		console.log("   • Risk Analyzer - Personalized risk assessment");
		console.log("   • Strategy Simulator - Projects returns & simulations");
		console.log("━".repeat(50));
		console.log("💡 Run 'adk web' to start the web interface");
		console.log("💡 Run 'adk run' for CLI chat interface");
		console.log("━".repeat(50));

		return agent;
	} catch (error) {
		console.error("❌ Failed to initialize YieldForge Agent:", error);
		throw error;
	}
}

// Export for ADK CLI
export default main;

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}
