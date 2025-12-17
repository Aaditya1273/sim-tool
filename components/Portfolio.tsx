'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { 
  useTokenBalance, 
  useStakeInfo, 
  useVaultBalance,
  useVaultStats,
  useStakeTokens,
  useDepositToVault,
  useApproveToken,
  formatTokenAmount,
  isContractDeployed,
  CONTRACTS
} from '@/lib/contracts';
import styles from './Portfolio.module.css';

export function Portfolio() {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Read contract data
  const { data: balance } = useTokenBalance(address);
  const { data: stakeInfo } = useStakeInfo(address);
  const { data: vaultBalance } = useVaultBalance(address);
  const { data: vaultStats } = useVaultStats();

  // Write functions
  const { stake, isPending: isStaking } = useStakeTokens();
  const { deposit, isPending: isDepositing } = useDepositToVault();
  const { approve, isPending: isApproving } = useApproveToken();

  if (!isContractDeployed()) {
    return (
      <div className={styles.portfolio}>
        <div className={styles.warning}>
          <h3>⚠️ Contracts Not Deployed</h3>
          <p>Smart contracts need to be deployed to Fraxtal Testnet.</p>
          <div className={styles.steps}>
            <h4>Deployment Steps:</h4>
            <ol>
              <li>Get test FRAX from <a href="https://faucet.fraxtal.io" target="_blank" rel="noopener noreferrer">Fraxtal Faucet</a></li>
              <li>Add WALLET_PRIVATE_KEY to .env</li>
              <li>Run: <code>npm run deploy:testnet</code></li>
              <li>Copy contract addresses to .env:
                <pre>
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...
                </pre>
              </li>
              <li>Restart the app</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.portfolio}>
      <h2 className={styles.title}>Your Portfolio</h2>

      {/* Token Balance */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>💰</span>
          <h3>$YFORGE Balance</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.balance}>
            {formatTokenAmount(balance)} YFORGE
          </div>
          <div className={styles.address}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      </div>

      {/* Staking */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>🎁</span>
          <h3>Staking (10% APY)</h3>
        </div>
        <div className={styles.cardContent}>
          {stakeInfo && (
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>Staked</span>
                <span className={styles.value}>{formatTokenAmount(stakeInfo[0])} YFORGE</span>
              </div>
              <div className={styles.stat}>
                <span>Pending Rewards</span>
                <span className={styles.value}>{formatTokenAmount(stakeInfo[2])} YFORGE</span>
              </div>
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Amount to stake"
              className={styles.input}
            />
            <button
              onClick={() => stake(stakeAmount)}
              disabled={isStaking || !stakeAmount}
              className={styles.button}
            >
              {isStaking ? 'Staking...' : 'Stake'}
            </button>
          </div>
        </div>
      </div>

      {/* Vault */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>🏦</span>
          <h3>Yield Vault</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span>Your Deposit</span>
              <span className={styles.value}>{formatTokenAmount(vaultBalance)} YFORGE</span>
            </div>
            {vaultStats && (
              <>
                <div className={styles.stat}>
                  <span>Total Vault TVL</span>
                  <span className={styles.value}>{formatTokenAmount(vaultStats[0])} YFORGE</span>
                </div>
                <div className={styles.stat}>
                  <span>Performance Fee</span>
                  <span className={styles.value}>{Number(vaultStats[3]) / 100}%</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount to deposit"
              className={styles.input}
            />
            <button
              onClick={() => {
                // First approve, then deposit
                approve(CONTRACTS.YFORGE_VAULT, depositAmount);
              }}
              disabled={isApproving || !depositAmount}
              className={styles.button}
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={() => deposit(depositAmount)}
              disabled={isDepositing || !depositAmount}
              className={styles.button}
            >
              {isDepositing ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className={styles.info}>
        <h4>Contract Addresses</h4>
        <div className={styles.addresses}>
          <div>
            <strong>$YFORGE Token:</strong>
            <a 
              href={`https://explorer.testnet.fraxtal.io/address/${CONTRACTS.YFORGE_TOKEN}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTRACTS.YFORGE_TOKEN.slice(0, 10)}...{CONTRACTS.YFORGE_TOKEN.slice(-8)}
            </a>
          </div>
          <div>
            <strong>Yield Vault:</strong>
            <a 
              href={`https://explorer.testnet.fraxtal.io/address/${CONTRACTS.YFORGE_VAULT}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTRACTS.YFORGE_VAULT.slice(0, 10)}...{CONTRACTS.YFORGE_VAULT.slice(-8)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
