// FILE: packages/core/src/api.ts
import { invoke } from '@tauri-apps/api/tauri'
import type { ApiResponse } from '@localbrain/types'

/**
 * Generic API client for invoking Tauri commands
 */
export class TauriAPI {
  /**
   * Invoke a Tauri command with type safety
   */
  static async invoke<T = any>(
    command: string,
    args?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await invoke<ApiResponse<T>>(command, args)
      return response
    } catch (error) {
      console.error(`API Error [${command}]:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * App state operations
   */
  static async getAppState() {
    return this.invoke('get_app_state')
  }

  static async updateSettings(settings: any) {
    return this.invoke('update_settings', { settings })
  }

  /**
   * File operations
   */
  static async readFile(path: string) {
    return this.invoke<string>('read_file_content', { path })
  }

  static async writeFile(path: string, content: string) {
    return this.invoke('write_file_content', { path, content })
  }

  static async listDirectory(path: string) {
    return this.invoke<string[]>('list_directory', { path })
  }

  /**
   * Command execution
   */
  static async executeCommand(command: string, args: string[], cwd?: string) {
    return this.invoke<string>('execute_command', { command, args, cwd })
  }

  /**
   * Voice operations
   */
  static async startVoiceSession(config: any) {
    return this.invoke<string>('start_voice_session', { config })
  }

  static async stopVoiceSession(sessionId: string) {
    return this.invoke('stop_voice_session', { sessionId })
  }

  static async speak(text: string, options?: any) {
    return this.invoke('speak_text', { text, options })
  }

  /**
   * Terminal operations
   */
  static async createTerminal(config: any) {
    return this.invoke<string>('create_terminal', { config })
  }

  static async sendTerminalInput(terminalId: string, input: string) {
    return this.invoke('send_terminal_input', { terminalId, input })
  }

  static async resizeTerminal(terminalId: string, cols: number, rows: number) {
    return this.invoke('resize_terminal', { terminalId, cols, rows })
  }

  static async closeTerminal(terminalId: string) {
    return this.invoke('close_terminal', { terminalId })
  }

  /**
   * Plugin operations
   */
  static async loadPlugin(pluginPath: string) {
    return this.invoke<string>('load_plugin', { pluginPath })
  }

  static async unloadPlugin(pluginId: string) {
    return this.invoke('unload_plugin', { pluginId })
  }

  static async listPlugins() {
    return this.invoke<any[]>('list_plugins')
  }

  /**
   * Chat operations
   */
  static async sendChatMessage(message: string, context?: any) {
    return this.invoke<string>('send_chat_message', { message, context })
  }

  /**
   * Security operations
   */
  static async checkPermissions(resource: string, action: string) {
    return this.invoke<boolean>('check_permissions', { resource, action })
  }

  static async auditLog(action: string, details: string) {
    return this.invoke('audit_log', { action, details })
  }

  /**
   * Context operations
   */
  static async saveContext(name: string, data: any) {
    return this.invoke<string>('save_context', { name, data })
  }

  static async loadContext(id: string) {
    return this.invoke<any>('load_context', { id })
  }

  static async deleteContext(id: string) {
    return this.invoke('delete_context', { id })
  }

  static async listContexts() {
    return this.invoke<any[]>('list_contexts')
  }
}