/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    LLM_MODEL: process.env.LLM_MODEL,
    FRAXTAL_RPC_URL: process.env.FRAXTAL_RPC_URL,
    FRAXTAL_CHAIN_ID: process.env.FRAXTAL_CHAIN_ID,
  },
}

module.exports = nextConfig
