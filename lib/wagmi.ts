import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Fraxtal Testnet
export const fraxtalTestnet = defineChain({
  id: 2522,
  name: 'Fraxtal Testnet',
  nativeCurrency: {
    name: 'Frax',
    symbol: 'FRAX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.frax.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Fraxtal Testnet Explorer',
      url: 'https://hoodi.fraxscan.com',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'YieldForge',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [fraxtalTestnet],
  ssr: true,
});
