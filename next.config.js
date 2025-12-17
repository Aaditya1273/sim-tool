/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  // Targeted webpack configuration to handle thread-stream test files
  webpack: (config, { isServer }) => {
    // Only exclude test files, not the main functionality
    config.module.rules.push({
      test: /node_modules\/thread-stream\/test\/.*\.(js|mjs|ts)$/,
      use: 'ignore-loader'
    })
    
    config.module.rules.push({
      test: /node_modules\/thread-stream\/bench\.js$/,
      use: 'ignore-loader'
    })
    
    config.module.rules.push({
      test: /node_modules\/thread-stream\/LICENSE$/,
      use: 'ignore-loader'
    })
    
    // Add resolve aliases only for problematic test dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      'tap': false,
      'fastbench': false,
      'desm': false,
      'why-is-node-running': false,
      'tape': false,
      'pino-elasticsearch': false,
    }
    
    // Client-side fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
      }
    }
    
    return config
  },
}

module.exports = nextConfig
