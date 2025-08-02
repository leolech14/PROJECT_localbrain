// Common types for LocalBrain desktop application

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  content: string
  model: string
  usage: Record<string, number>
  provider: string
}

export interface TerminalSession {
  id: string
  pid?: number
  status: string
  working_directory: string
}

export interface FileInfo {
  name: string
  path: string
  is_file: boolean
  is_dir: boolean
  size: number
  modified: string
}

export interface Settings {
  voice_enabled: boolean
  offline_mode: boolean
  allowed_roots: string[]
  openai_api_key?: string
  openai_model: string
  tts_provider: string
  stt_provider: string
  theme: string
  window_bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  terminal_settings: {
    shell: string
    font_family: string
    font_size: number
    cursor_style: string
    theme: string
  }
  voice_settings: {
    wake_word: string
    voice_model: string
    response_voice: string
    auto_speak_responses: boolean
    noise_suppression: boolean
  }
  security_settings: {
    audit_retention_days: number
    require_confirmation: boolean
    sandbox_plugins: boolean
    max_file_size_mb: number
  }
}