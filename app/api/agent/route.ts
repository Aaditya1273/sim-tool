import { NextRequest, NextResponse } from 'next/server'
import getYieldForgeAgent from '@/src/agents/yieldforge-agent/agent'

// Initialize agent once
let agentInstance: any = null

async function getAgent() {
  if (!agentInstance) {
    agentInstance = await getYieldForgeAgent()
  }
  return agentInstance
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get agent instance
    const agent = await getAgent()

    // Process message with agent
    const result = await agent.run(message)
    
    // Extract the text response from the agent result
    let responseText = 'Agent processing complete'
    
    if (typeof result === 'string') {
      responseText = result
    } else if (result?.text) {
      responseText = result.text
    } else if (result?.content) {
      responseText = result.content
    } else if (result?.response) {
      responseText = result.response
    } else if (result?.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1]
      responseText = lastMessage.content || lastMessage.text || JSON.stringify(lastMessage)
    } else {
      // Fallback: stringify the result
      responseText = JSON.stringify(result, null, 2)
    }

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Agent API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to process request',
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'YieldForge Agent API is running',
    version: '1.0.0',
    endpoints: {
      POST: '/api/agent - Send message to agent',
    },
    agent: {
      name: 'YieldForge',
      description: 'Autonomous DeFi Yield Optimizer',
      features: [
        'Yield pool scanning (50+ protocols)',
        'Risk profile analysis',
        'Harvest simulation',
        'Frax Finance integration',
        'KRWQ support',
        'Fraxtal testnet ready',
      ],
    },
  })
}
