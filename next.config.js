/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    turbo: {
      rules: {
        '*.test.{js,ts,jsx,tsx,mjs}': {
          loaders: [],
          as: '*.js',
        },
      },
    },
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    LLM_MODEL: process.env.LLM_MODEL,
    FRAXTAL_RPC_URL: process.env.FRAXTAL_RPC_URL,
    FRAXTAL_CHAIN_ID: process.env.FRAXTAL_CHAIN_ID,
  },
  // Next.js 16 optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  // Exclude problematic files from build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Exclude test files and problematic modules
    config.module.rules.push({
      test: /node_modules\/thread-stream\/test\//,
      use: 'ignore-loader'
    })
    
    return config
  },
}

module.exports = nextConfig
