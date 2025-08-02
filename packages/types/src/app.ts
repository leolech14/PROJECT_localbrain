// FILE: packages/types/src/app.ts
import { z } from 'zod'

export const WindowBoundsSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

export const TerminalSettingsSchema = z.object({
  shell: z.string(),
  font_family: z.string(),
  font_size: z.number(),
  cursor_style: z.string(),
  theme: z.string(),
})

export const VoiceSettingsSchema = z.object({
  wake_word: z.string(),
  voice_model: z.string(),
  response_voice: z.string(),
  auto_speak_responses: z.boolean(),
  noise_suppression: z.boolean(),
})

export const SecuritySettingsSchema = z.object({
  audit_retention_days: z.number(),
  require_confirmation: z.boolean(),
  sandbox_plugins: z.boolean(),
  max_file_size_mb: z.number(),
})

export const AppSettingsSchema = z.object({
  voice_enabled: z.boolean(),
  offline_mode: z.boolean(),
  allowed_roots: z.array(z.string()),
  openai_api_key: z.string().optional(),
  openai_model: z.string(),
  tts_provider: z.string(),
  stt_provider: z.string(),
  theme: z.string(),
  window_bounds: WindowBoundsSchema,
  terminal_settings: TerminalSettingsSchema,
  voice_settings: VoiceSettingsSchema,
  security_settings: SecuritySettingsSchema,
})

export const SessionInfoSchema = z.object({
  id: z.string(),
  session_type: z.string(),
  created_at: z.string(),
  last_activity: z.string(),
  metadata: z.any(),
})

export const AppStateSchema = z.object({
  settings: AppSettingsSchema,
  is_initialized: z.boolean(),
  voice_manager: z.any(),
  terminal_manager: z.any(),
  plugin_manager: z.any(),
  security: z.any(),
  database: z.any(),
  active_sessions: z.record(z.string(), SessionInfoSchema),
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
})

// Type exports
export type WindowBounds = z.infer<typeof WindowBoundsSchema>
export type TerminalSettings = z.infer<typeof TerminalSettingsSchema>
export type VoiceSettings = z.infer<typeof VoiceSettingsSchema>
export type SecuritySettings = z.infer<typeof SecuritySettingsSchema>
export type AppSettings = z.infer<typeof AppSettingsSchema>
export type SessionInfo = z.infer<typeof SessionInfoSchema>
export type AppState = z.infer<typeof AppStateSchema>
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}