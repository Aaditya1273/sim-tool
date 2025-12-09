import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'YieldForge - Autonomous DeFi Yield Optimizer',
  description: 'AI-powered DeFi yield optimization with multi-agent architecture. Built for AGENT ARENA Hackathon.',
  keywords: ['DeFi', 'Yield Optimization', 'AI Agent', 'Fraxtal', 'ADK-TS'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
