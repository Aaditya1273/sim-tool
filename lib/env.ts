/**
 * Environment variables for Next.js application
 * Client-side safe environment configuration
 */

export const env = {
  // LLM Configuration (server-side only)
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  LLM_MODEL: process.env.LLM_MODEL || 'gemini-2.5-flash',
  
  // Debug mode
  ADK_DEBUG: process.env.ADK_DEBUG === 'true',
  
  // Fraxtal Configuration (server-side)
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
  FRAXTAL_RPC_URL: process.env.FRAXTAL_RPC_URL || 'https://rpc.testnet.frax.com',
  FRAXTAL_CHAIN_ID: parseInt(process.env.FRAXTAL_CHAIN_ID || '2523'),
  FRAXTAL_EXPLORER: process.env.FRAXTAL_EXPLORER || 'https://holesky.fraxscan.com',
};

// Validate required environment variables
if (typeof window === 'undefined') {
  // Server-side validation only
  if (!env.GOOGLE_API_KEY) {
    console.warn('⚠️  GOOGLE_API_KEY is not set. Agent functionality will be limited.');
  }
}
