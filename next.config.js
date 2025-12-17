/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Turbopack to use webpack (fixes thread-stream issues)
  experimental: {
    turbo: false,
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
  // Fix thread-stream test files issue for deployment
  webpack: (config, { isServer, dev }) => {
    // Completely exclude thread-stream test directory and problematic files
    config.module.rules.push({
      test: /node_modules\/thread-stream\/(test|bench)/,
      use: 'ignore-loader'
    })
    
    config.module.rules.push({
      test: /node_modules\/thread-stream\/LICENSE$/,
      use: 'ignore-loader'
    })
    
    // Exclude all test files from all packages
    config.module.rules.push({
      test: /node_modules\/.*\/(test|tests|spec|__tests__)\/.*\.(js|mjs|ts)$/,
      use: 'ignore-loader'
    })
    
    // Add comprehensive resolve aliases to prevent loading problematic files
    config.resolve.alias = {
      ...config.resolve.alias,
      'thread-stream/test': false,
      'thread-stream/bench.js': false,
      'thread-stream/LICENSE': false,
      'tap': false,
      'fastbench': false,
      'desm': false,
      'why-is-node-running': false,
      'tape': false,
      'pino-elasticsearch': false,
    }
    
    // Add fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        path: false,
        os: false,
      }
    }
    
    // Ignore missing modules in production
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        'tap': 'tap',
        'fastbench': 'fastbench',
        'desm': 'desm',
        'why-is-node-running': 'why-is-node-running',
        'tape': 'tape',
        'pino-elasticsearch': 'pino-elasticsearch'
      })
    }
    
    return config
  },
}

module.exports = nextConfig
