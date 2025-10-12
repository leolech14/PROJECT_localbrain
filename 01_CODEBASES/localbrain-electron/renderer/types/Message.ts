// Message Type - Exact Swift mirror
// LocalBrain › Types › Message.ts
// Source: LocalBrain/Models/Message.swift

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  ts: Date;
  isStreaming?: boolean;
}

// Helper to create new message
export function createMessage(
  role: MessageRole,
  text: string,
  ts?: Date,
  isStreaming: boolean = false
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    ts: ts || new Date(),
    isStreaming,
  };
}

// Helper to convert from API response
export function messageFromJSON(json: any): Message {
  return {
    id: json.id || crypto.randomUUID(),
    role: json.role as MessageRole,
    text: json.text,
    ts: new Date(json.ts),
    isStreaming: json.isStreaming || false,
  };
}
