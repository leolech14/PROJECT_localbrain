// Context Segment Type - Exact Swift mirror
// LocalBrain › Types › Context.ts
// Source: LocalBrain/Models/ContextSegment.swift

export type ContextSegmentType =
  | "systemPrompt"
  | "userPrompt"
  | "knowledge"
  | "memory"
  | "file"
  | "snippet"
  | "settings";

export interface ContextSegment {
  id: string;
  type: ContextSegmentType;
  title: string;
  content: string;
  isActive: boolean;
  tokens: number;
  timestamp: Date;
}

// Context segment type metadata
export const ContextTypeMetadata: Record<
  ContextSegmentType,
  { icon: string; displayName: string; color: string }
> = {
  systemPrompt: { icon: "🧠", displayName: "System Prompt", color: "oklch(0.70 0.20 240)" },
  userPrompt: { icon: "💬", displayName: "User Prompt", color: "oklch(0.70 0.20 145)" },
  knowledge: { icon: "📚", displayName: "Knowledge Base", color: "oklch(0.70 0.20 300)" },
  memory: { icon: "🔄", displayName: "Conversation Memory", color: "oklch(0.70 0.20 30)" },
  file: { icon: "📄", displayName: "File Context", color: "var(--tx3)" },
  snippet: { icon: "</>", displayName: "Code Snippet", color: "oklch(0.70 0.20 330)" },
  settings: { icon: "⚙️", displayName: "AI Settings", color: "oklch(0.70 0.20 60)" },
};

// Helper to estimate tokens (rough: ~4 chars per token)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Helper to create new context segment
export function createContextSegment(
  type: ContextSegmentType,
  title: string,
  content: string,
  isActive: boolean = true
): ContextSegment {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    content,
    isActive,
    tokens: estimateTokens(content),
    timestamp: new Date(),
  };
}

// Default context templates
export const DefaultContexts = {
  systemPrompt: createContextSegment(
    "systemPrompt",
    "LocalBrain Assistant",
    `You are LocalBrain, an advanced AI assistant integrated into a macOS application.

Core Capabilities:
• You have access to the user's context files and conversation history
• You can help with various tasks including coding, analysis, and creative work
• You maintain awareness of all context segments provided to you

Personality:
• Be concise, helpful, and proactive
• Provide clear, actionable responses
• When referencing context, explicitly mention which segment you're using

Context Awareness:
• You can see files in the context pool
• You understand the user's project structure
• You maintain conversation continuity across messages`
  ),

  settings: createContextSegment(
    "settings",
    "AI Configuration",
    `Temperature: 0.7
Max Tokens: 2048
Model: Claude 3 Opus
Stream: Enabled`
  ),
};

// Context statistics
export interface ContextStatistics {
  totalSegments: number;
  activeSegments: number;
  totalTokens: number;
  maxTokens: number;
}

export function calculateContextStats(
  segments: ContextSegment[],
  maxTokens: number = 100000
): ContextStatistics {
  const activeSegs = segments.filter((s) => s.isActive);
  const totalTokens = activeSegs.reduce((sum, s) => sum + s.tokens, 0);

  return {
    totalSegments: segments.length,
    activeSegments: activeSegs.length,
    totalTokens,
    maxTokens,
  };
}

export function formatTokenUsage(stats: ContextStatistics): string {
  return `${stats.totalTokens.toLocaleString()} / ${stats.maxTokens.toLocaleString()} tokens`;
}

export function tokenUsagePercentage(stats: ContextStatistics): number {
  if (stats.maxTokens === 0) return 0;
  return stats.totalTokens / stats.maxTokens;
}

export function isNearTokenLimit(stats: ContextStatistics): boolean {
  return tokenUsagePercentage(stats) > 0.8;
}
