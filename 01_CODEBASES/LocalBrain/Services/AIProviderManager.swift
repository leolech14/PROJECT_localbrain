//
//  AIProviderManager.swift
//  LocalBrain
//
//  Purpose: Manages multiple AI providers with seamless switching
//  Created: 2025-10-06 (Multi-Provider Integration Day!)
//

import Foundation
import Combine

// MARK: - AI Provider Manager
@MainActor
class AIProviderManager: ObservableObject {

    // MARK: - Published Properties
    @Published var currentProvider: AIProvider = .openai
    @Published var availableProviders: [AIProvider] = []
    @Published var isConnected: Bool = false
    @Published var lastError: String?

    // MARK: - Private Properties
    private var services: [AIProvider: LLMServiceProtocol] = [:]
    private let keychainService = KeychainService()

    // MARK: - Initialization
    init() {
        setupProviders()
        checkAvailableProviders()
        selectProvider(.openai) // Default to OpenAI
    }

    // MARK: - Public Methods

    /// Switch to a different AI provider
    func selectProvider(_ provider: AIProvider) {
        currentProvider = provider
        updateConnectionStatus()
        print("🔄 Switched to \(provider.displayName) provider")
    }

    /// Send message using current provider
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String> {
        guard let service = services[currentProvider] else {
            throw AIProviderManagerError.noServiceForProvider
        }

        guard service.isConnected else {
            throw AIProviderManagerError.providerNotConnected
        }

        lastError = nil
        return try await service.sendMessage(text: text, history: history)
    }

    /// Check if current provider has API key
    func hasAPIKey(for provider: AIProvider? = nil) -> Bool {
        let provider = provider ?? currentProvider
        return keychainService.hasAPIKey(provider: provider.rawValue.lowercased())
    }

    /// Set API key for a provider
    func setAPIKey(_ apiKey: String, for provider: AIProvider) throws {
        try keychainService.saveAPIKey(provider: provider.rawValue.lowercased(), key: apiKey)

        // Reinitialize the service with new key
        setupProvider(provider)

        // If this is the current provider, update connection status
        if provider == currentProvider {
            updateConnectionStatus()
        }

        print("✅ API key set for \(provider.displayName)")
    }

    /// Remove API key for a provider
    func removeAPIKey(for provider: AIProvider) {
        keychainService.deleteAPIKey(provider: provider.rawValue.lowercased())

        // Remove service from memory
        services.removeValue(forKey: provider)

        // If this was the current provider, switch to another available one
        if provider == currentProvider {
            switchToAvailableProvider()
        }

        print("🗑️ API key removed for \(provider.displayName)")
    }

    /// Get provider-specific error message
    func getProviderError() -> String? {
        return services[currentProvider]?.lastError
    }

    // MARK: - Private Methods

    private func setupProviders() {
        for provider in AIProvider.allCases {
            setupProvider(provider)
        }
    }

    private func setupProvider(_ provider: AIProvider) {
        guard hasAPIKey(for: provider) else {
            services.removeValue(forKey: provider)
            return
        }

        do {
            let apiKey = try keychainService.getAPIKey(provider: provider.rawValue.lowercased())
            let service: LLMServiceProtocol

            switch provider {
            case .openai:
                service = OpenAIService(apiKey: apiKey)
            case .claude:
                service = ClaudeService(apiKey: apiKey)
            case .gemini:
                service = GeminiService(apiKey: apiKey)
            case .glm:
                service = GLMService(apiKey: apiKey)
            }

            services[provider] = service
            print("✅ \(provider.displayName) service initialized")

        } catch {
            print("❌ Failed to initialize \(provider.displayName): \(error)")
            services.removeValue(forKey: provider)
        }
    }

    private func checkAvailableProviders() {
        availableProviders = AIProvider.allCases.filter { hasAPIKey(for: $0) }
        print("📊 Available providers: \(availableProviders.map { $0.displayName }.joined(separator: ", "))")
    }

    private func updateConnectionStatus() {
        isConnected = services[currentProvider]?.isConnected ?? false
        lastError = services[currentProvider]?.lastError
    }

    private func switchToAvailableProvider() {
        if let firstAvailable = availableProviders.first {
            selectProvider(firstAvailable)
        } else {
            isConnected = false
            lastError = "No AI providers configured"
        }
    }
}

// MARK: - Error Types
enum AIProviderManagerError: LocalizedError {
    case noServiceForProvider
    case providerNotConnected
    case apiKeyMissing

    var errorDescription: String? {
        switch self {
        case .noServiceForProvider:
            return "No service available for selected provider"
        case .providerNotConnected:
            return "Provider is not connected"
        case .apiKeyMissing:
            return "API key is missing for this provider"
        }
    }
}