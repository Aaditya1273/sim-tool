import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Contract addresses (will be set after deployment)
export const CONTRACTS = {
  YFORGE_TOKEN: (process.env.NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  YFORGE_VAULT: (process.env.NEXT_PUBLIC_YFORGE_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
};

// YieldForge Token ABI (minimal - add more functions as needed)
export const YFORGE_TOKEN_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getPendingRewards',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStakeInfo',
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'pendingRewards', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// YieldForge Vault ABI (minimal)
export const YFORGE_VAULT_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserBalance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVaultStats',
    outputs: [
      { name: '_totalAssets', type: 'uint256' },
      { name: '_totalShares', type: 'uint256' },
      { name: '_strategyCount', type: 'uint256' },
      { name: '_performanceFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Custom hooks for contract interactions

// Read token balance
export function useTokenBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.YFORGE_TOKEN,
    abi: YFORGE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });
}

// Read staking info
export function useStakeInfo(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.YFORGE_TOKEN,
    abi: YFORGE_TOKEN_ABI,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
  });
}

// Read vault balance
export function useVaultBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.YFORGE_VAULT,
    abi: YFORGE_VAULT_ABI,
    functionName: 'getUserBalance',
    args: address ? [address] : undefined,
  });
}

// Read vault stats
export function useVaultStats() {
  return useReadContract({
    address: CONTRACTS.YFORGE_VAULT,
    abi: YFORGE_VAULT_ABI,
    functionName: 'getVaultStats',
  });
}

// Write functions
export function useStakeTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: string) => {
    writeContract({
      address: CONTRACTS.YFORGE_TOKEN,
      abi: YFORGE_TOKEN_ABI,
      functionName: 'stake',
      args: [parseEther(amount)],
    });
  };

  return { stake, isPending, isConfirming, isSuccess, error };
}

export function useDepositToVault() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (amount: string) => {
    writeContract({
      address: CONTRACTS.YFORGE_VAULT,
      abi: YFORGE_VAULT_ABI,
      functionName: 'deposit',
      args: [parseEther(amount)],
    });
  };

  return { deposit, isPending, isConfirming, isSuccess, error };
}

export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: string) => {
    writeContract({
      address: CONTRACTS.YFORGE_TOKEN,
      abi: YFORGE_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, error };
}

// Helper functions
export function formatTokenAmount(amount: bigint | undefined): string {
  if (!amount) return '0';
  return formatEther(amount);
}

export function isContractDeployed(): boolean {
  return CONTRACTS.YFORGE_TOKEN !== '0x0000000000000000000000000000000000000000';
}
