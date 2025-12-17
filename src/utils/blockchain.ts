import { ethers } from "ethers";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import { env } from "../env";

/**
 * Fraxtal Testnet Chain Configuration
 * For AGENT ARENA Hackathon Development
 */
export const fraxtalTestnet = defineChain({
	id: 2522,
	name: "Fraxtal Testnet",
	nativeCurrency: {
		name: "Frax",
		symbol: "FRAX",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.testnet.frax.com"],
		},
		public: {
			http: [
				"https://rpc.testnet.frax.com",
				"https://fraxtal-testnet-rpc.publicnode.com",
			],
		},
	},
	blockExplorers: {
		default: {
			name: "Fraxtal Testnet Explorer",
			url: "https://hoodi.fraxscan.com",
		},
	},
	testnet: true,
});

/**
 * Get ethers.js provider for Fraxtal Testnet
 */
export function getFraxtalProvider(): ethers.JsonRpcProvider {
	return new ethers.JsonRpcProvider(env.FRAXTAL_RPC_URL);
}

/**
 * Get ethers.js wallet (if private key is configured)
 */
export function getFraxtalWallet(): ethers.Wallet | null {
	if (!env.WALLET_PRIVATE_KEY) {
		return null;
	}
	const provider = getFraxtalProvider();
	return new ethers.Wallet(env.WALLET_PRIVATE_KEY, provider);
}

/**
 * Get viem public client for reading blockchain data
 */
export function getPublicClient() {
	return createPublicClient({
		chain: fraxtalTestnet,
		transport: http(),
	});
}

/**
 * Get viem wallet client for transactions (if private key is configured)
 */
export function getWalletClient() {
	if (!env.WALLET_PRIVATE_KEY) {
		return null;
	}

	const account = privateKeyToAccount(
		env.WALLET_PRIVATE_KEY as `0x${string}`,
	);

	return createWalletClient({
		account,
		chain: fraxtalTestnet,
		transport: http(),
	});
}

/**
 * Format blockchain address for display
 */
export function formatAddress(address: string): string {
	if (!address || address.length < 10) return address;
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
	amount: bigint | string,
	decimals: number = 18,
	displayDecimals: number = 4,
): string {
	const value = typeof amount === "string" ? BigInt(amount) : amount;
	const divisor = BigInt(10 ** decimals);
	const whole = value / divisor;
	const fraction = value % divisor;

	const fractionStr = fraction
		.toString()
		.padStart(decimals, "0")
		.slice(0, displayDecimals);
	return `${whole}.${fractionStr}`;
}

/**
 * Get Fraxtal testnet faucet URL
 */
export function getFaucetUrl(): string {
	return "https://faucet.fraxtal.io";
}

/**
 * Get block explorer URL for address/tx
 */
export function getExplorerUrl(
	type: "address" | "tx" | "token",
	value: string,
): string {
	const baseUrl = env.FRAXTAL_EXPLORER;
	switch (type) {
		case "address":
			return `${baseUrl}/address/${value}`;
		case "tx":
			return `${baseUrl}/tx/${value}`;
		case "token":
			return `${baseUrl}/token/${value}`;
		default:
			return baseUrl;
	}
}

/**
 * Check if wallet is configured and has balance
 */
export async function checkWalletStatus(): Promise<{
	configured: boolean;
	address?: string;
	balance?: string;
	balanceFormatted?: string;
}> {
	const wallet = getFraxtalWallet();

	if (!wallet) {
		return { configured: false };
	}

	try {
		const address = await wallet.getAddress();
		const provider = wallet.provider;
		if (!provider) {
			return { configured: true };
		}
		const balance = await provider.getBalance(address);
		const balanceFormatted = ethers.formatEther(balance);

		return {
			configured: true,
			address,
			balance: balance.toString(),
			balanceFormatted: `${balanceFormatted} FRAX`,
		};
	} catch (error) {
		console.error("Failed to check wallet status:", error);
		return { configured: true };
	}
}
