'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { 
  FaRocket, 
  FaChartLine, 
  FaShieldAlt, 
  FaCoins, 
  FaBolt,
  FaGithub,
  FaTwitter,
  FaDiscord
} from 'react-icons/fa';
import styles from './page.module.css';

export default function Home() {
  const { isConnected } = useAccount();
  const [showChat, setShowChat] = useState(false);

  if (showChat && isConnected) {
    return <ChatInterface />;
  }

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <motion.div 
            className={styles.logo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className={styles.logoIcon}>🔥</span>
            <span className={styles.logoText}>YieldForge</span>
          </motion.div>
          
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#tokenomics">Tokenomics</a>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Maximize Your DeFi Yields
            <br />
            <span className={styles.gradient}>With AI-Powered Optimization</span>
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            YieldForge uses advanced multi-agent AI to scan 50+ protocols,
            analyze risk, and optimize your yield strategies automatically.
          </motion.p>

          <motion.div 
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isConnected ? (
              <button 
                className={styles.primaryButton}
                onClick={() => setShowChat(true)}
              >
                <FaRocket /> Launch App
              </button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button 
                    className={styles.primaryButton}
                    onClick={openConnectModal}
                  >
                    <FaBolt /> Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            )}
            <a href="#how-it-works" className={styles.secondaryButton}>
              Learn More
            </a>
          </motion.div>

          <motion.div 
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className={styles.stat}>
              <div className={styles.statValue}>50+</div>
              <div className={styles.statLabel}>Protocols</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>15-30%</div>
              <div className={styles.statLabel}>More Yield</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Monitoring</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className={styles.floatingCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📊</span>
              <span>Portfolio Overview</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardStat}>
                <span>Total Value</span>
                <span className={styles.cardValue}>$12,450</span>
              </div>
              <div className={styles.cardStat}>
                <span>APY</span>
                <span className={styles.cardValue}>+18.5%</span>
              </div>
              <div className={styles.cardStat}>
                <span>24h Yield</span>
                <span className={styles.cardValue}>+$6.32</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Powered by Advanced AI
        </motion.h2>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className={styles.tokenomics}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          $YFORGE Tokenomics
        </motion.h2>

        <div className={styles.tokenGrid}>
          <motion.div
            className={styles.tokenCard}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h3>Token Utility</h3>
            <ul className={styles.tokenList}>
              <li>🗳️ Governance voting rights</li>
              <li>💰 20% revenue sharing</li>
              <li>🎁 Staking rewards (10% APY)</li>
              <li>⭐ Premium features access</li>
              <li>🔥 Deflationary buyback & burn</li>
            </ul>
          </motion.div>

          <motion.div
            className={styles.tokenCard}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3>Distribution</h3>
            <div className={styles.distribution}>
              <div className={styles.distItem}>
                <span>Community</span>
                <span className={styles.distValue}>30%</span>
              </div>
              <div className={styles.distItem}>
                <span>Treasury</span>
                <span className={styles.distValue}>30%</span>
              </div>
              <div className={styles.distItem}>
                <span>Team</span>
                <span className={styles.distValue}>20%</span>
              </div>
              <div className={styles.distItem}>
                <span>Liquidity</span>
                <span className={styles.distValue}>20%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>Ready to Optimize Your Yields?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of users maximizing their DeFi returns with AI
          </p>
          {isConnected ? (
            <button 
              className={styles.ctaButton}
              onClick={() => setShowChat(true)}
            >
              <FaRocket /> Launch App Now
            </button>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button 
                  className={styles.ctaButton}
                  onClick={openConnectModal}
                >
                  <FaBolt /> Connect Wallet to Start
                </button>
              )}
            </ConnectButton.Custom>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.logoIcon}>🔥</span>
              <span className={styles.logoText}>YieldForge</span>
            </div>
            <p className={styles.footerTagline}>
              AI-Powered DeFi Yield Optimization
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#tokenomics">Tokenomics</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <a href="https://adk.iqai.com" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="https://github.com/IQAIcom/adk-ts-samples" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://discord.gg/w2Uk6ACK4D" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Community</h4>
              <div className={styles.socialLinks}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
                <a href="https://discord.gg/w2Uk6ACK4D" target="_blank" rel="noopener noreferrer">
                  <FaDiscord />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 YieldForge. Built for AGENT ARENA Hackathon.</p>
          <p>Powered by ADK-TS • Fraxtal • Frax Finance</p>
        </div>
      </footer>
    </div>
  );
}

// Chat Interface Component
function ChatInterface() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, address }),
      });

      const data = await response.json();
      setChat(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setChat(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Failed to connect to agent. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatHeader}>
        <div className={styles.chatLogo}>
          <span className={styles.logoIcon}>🔥</span>
          <span className={styles.logoText}>YieldForge AI</span>
        </div>
        <ConnectButton />
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {chat.length === 0 && (
            <div className={styles.welcome}>
              <h2>Welcome to YieldForge AI! 👋</h2>
              <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <div className={styles.examples}>
                <h3>Try asking:</h3>
                <button onClick={() => setMessage("I want to earn yield on $1000 USDC with minimal risk")}>
                  💰 Optimize $1000 USDC
                </button>
                <button onClick={() => setMessage("Show me Frax Finance pools")}>
                  🏦 Frax Finance Pools
                </button>
                <button onClick={() => setMessage("Check Fraxtal testnet status")}>
                  ⛓️ Check Network Status
                </button>
              </div>
            </div>
          )}
          
          {chat.map((msg, idx) => (
            <motion.div 
              key={idx} 
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.messageContent}>
                <strong>{msg.role === 'user' ? '👤 You' : '🔥 YieldForge'}:</strong>
                <p>{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className={styles.assistantMessage}>
              <div className={styles.messageContent}>
                <strong>🔥 YieldForge:</strong>
                <p className={styles.loading}>Analyzing DeFi opportunities...</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about DeFi yield opportunities..."
            className={styles.input}
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            className={styles.sendButton}
            disabled={loading || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Data
const features = [
  {
    icon: <FaChartLine />,
    title: 'Smart Pool Scanning',
    description: 'Real-time monitoring of 50+ DeFi protocols including Uniswap, Aave, Compound, and Frax Finance.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Risk Analysis',
    description: 'AI-powered risk assessment tailored to your tolerance level - conservative, moderate, or aggressive.',
  },
  {
    icon: <FaCoins />,
    title: 'Yield Simulation',
    description: 'Project returns over 7/30/90/365 days with gas cost analysis before executing any strategy.',
  },
  {
    icon: <FaBolt />,
    title: 'Auto-Rebalancing',
    description: 'Automated portfolio rebalancing to maintain optimal yield across changing market conditions.',
  },
  {
    icon: <FaRocket />,
    title: 'Multi-Agent AI',
    description: 'Three specialized AI agents working in parallel for maximum efficiency and accuracy.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Fraxtal Ready',
    description: 'Integrated with Fraxtal testnet for future on-chain execution and ATP tokenization.',
  },
];

const steps = [
  {
    title: 'Connect Your Wallet',
    description: 'Securely connect your wallet using RainbowKit. Supports MetaMask, WalletConnect, and more.',
  },
  {
    title: 'Set Your Risk Profile',
    description: 'Tell our AI your investment goals and risk tolerance. Conservative, moderate, or aggressive.',
  },
  {
    title: 'AI Scans & Analyzes',
    description: 'Our multi-agent system scans 50+ protocols, analyzes opportunities, and simulates strategies.',
  },
  {
    title: 'Optimize & Earn',
    description: 'Review recommendations and let YieldForge optimize your yields automatically. Earn 15-30% more.',
  },
];
