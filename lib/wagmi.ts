import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Fraxtal Testnet
export const fraxtalTestnet = defineChain({
  id: 2523,
  name: 'Fraxtal Testnet',
  nativeCurrency: {
    name: 'Frax Ether',
    symbol: 'frxETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.fraxtal.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Fraxtal Explorer',
      url: 'https://explorer.testnet.fraxtal.io',
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
