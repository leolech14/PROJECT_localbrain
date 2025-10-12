//
//  CredentialManager.swift
//  LocalBrain
//
//  Purpose: Unified credential management using Doppler integration
//  Created: 2025-10-06 (Infrastructure Day!)
//  Manages: All API keys, service credentials, and configuration
//

import Foundation
import SwiftUI

@Observable
class CredentialManager {
    // MARK: - Singleton
    static let shared = CredentialManager()

    // MARK: - State
    var isLoading = false
    var isLoaded = false
    var availableServices: [AIService] = []
    var connectedServices: [AIService] = []
    var credentialStatus: [String: CredentialStatus] = [:]

    // MARK: - Credential Storage
    private var credentials: [String: String] = [:]
    private var dopplerProjects: [DopplerProject] = []

    // MARK: - Initialization
    private init() {
        loadAvailableServices()
        Task {
            await loadAllCredentials()
        }
    }

    // MARK: - Public Interface

    /// Get credential for a specific service
    func getCredential(for service: AIServiceType) -> String? {
        return credentials[service.rawValue]
    }

    /// Get all AI provider credentials
    func getAIProviderCredentials() -> [AIServiceType: String] {
        var providerCredentials: [AIServiceType: String] = [:]

        for serviceType in AIServiceType.allCases {
            if let credential = getCredential(for: serviceType) {
                providerCredentials[serviceType] = credential
            }
        }

        return providerCredentials
    }

    /// Check if service is available
    func isServiceAvailable(_ serviceType: AIServiceType) -> Bool {
        return credentials[serviceType.rawValue] != nil && !credentials[serviceType.rawValue]!.isEmpty
    }

    /// Get available AI providers
    func getAvailableAIProviders() -> [AIServiceType] {
        return AIServiceType.allCases.filter { isServiceAvailable($0) }
    }

    /// Test service connectivity
    func testServiceConnectivity(_ serviceType: AIServiceType) async -> Bool {
        guard let credential = getCredential(for: serviceType) else {
            await updateCredentialStatus(serviceType.rawValue, status: .missing)
            return false
        }

        await updateCredentialStatus(serviceType.rawValue, status: .testing)

        let success = await performConnectivityTest(serviceType, credential)

        let status: CredentialStatus = success ? .connected : .error
        await updateCredentialStatus(serviceType.rawValue, status: status)

        return success
    }

    /// Refresh all credentials from Doppler
    func refreshCredentials() async {
        isLoading = true
        defer { isLoading = false }

        await loadAllCredentials()
    }

    /// Get service configuration
    func getServiceConfiguration(_ serviceType: AIServiceType) -> AIServiceConfiguration? {
        guard let credential = getCredential(for: serviceType) else { return nil }

        switch serviceType {
        case .anthropic:
            return AIServiceConfiguration(
                type: serviceType,
                name: "Anthropic Claude",
                credential: credential,
                baseURL: "https://api.anthropic.com",
                maxTokens: 200000, // 1M context available
                supportedModels: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
                features: [.text, .largeContext, .code],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )

        case .openai:
            return AIServiceConfiguration(
                type: serviceType,
                name: "OpenAI GPT",
                credential: credential,
                baseURL: "https://api.openai.com/v1",
                maxTokens: 128000,
                supportedModels: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
                features: [.text, .code, .vision, .functionCalling],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )

        case .gemini:
            return AIServiceConfiguration(
                type: serviceType,
                name: "Google Gemini",
                credential: credential,
                baseURL: "https://generativelanguage.googleapis.com/v1",
                maxTokens: 32768,
                supportedModels: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"],
                features: [.text, .vision, .multimodal],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )

        case .elevenlabs:
            return AIServiceConfiguration(
                type: serviceType,
                name: "ElevenLabs",
                credential: credential,
                baseURL: "https://api.elevenlabs.io/v1",
                maxTokens: 0, // Audio service
                supportedModels: ["eleven_monolingual_v1", "eleven_multilingual_v2"],
                features: [.voice, .audio],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )

        case .replicate:
            return AIServiceConfiguration(
                type: serviceType,
                name: "Replicate",
                credential: credential,
                baseURL: "https://api.replicate.com/v1",
                maxTokens: 0, // Model hosting
                supportedModels: ["stability-ai/sdxl", "meta/llama-2-70b-chat"],
                features: [.image, .code, .hostedModels],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )

        default:
            return AIServiceConfiguration(
                type: serviceType,
                name: serviceType.rawValue.capitalized,
                credential: credential,
                baseURL: "",
                maxTokens: 0,
                supportedModels: [],
                features: [],
                status: credentialStatus[serviceType.rawValue] ?? .unknown
            )
        }
    }

    // MARK: - Private Methods

    private func loadAvailableServices() {
        availableServices = [
            AIService(type: .anthropic, name: "Anthropic Claude", description: "Advanced reasoning with 1M context", category: .primary),
            AIService(type: .openai, name: "OpenAI GPT", description: "Versatile AI for code and analysis", category: .primary),
            AIService(type: .gemini, name: "Google Gemini", description: "Multimodal AI capabilities", category: .primary),
            AIService(type: .elevenlabs, name: "ElevenLabs", description: "Voice synthesis and TTS", category: .voice),
            AIService(type: .replicate, name: "Replicate", description: "Model hosting and inference", category: .infrastructure),
            AIService(type: .groq, name: "Groq", description: "Fast AI inference", category: .performance),
            AIService(type: .huggingface, name: "Hugging Face", description: "Open models and embeddings", category: .infrastructure),
            AIService(type: .runpod, name: "RunPod", description: "GPU cloud computing", category: .infrastructure),
            AIService(type: .stabilityai, name: "Stability AI", description: "Image generation", category: .creative),
            AIService(type: .mapbox, name: "Mapbox", description: "Advanced mapping platform", category: .geospatial),
            AIService(type: .googlemaps, name: "Google Maps", description: "Standard mapping services", category: .geospatial),
            AIService(type: .openweather, name: "OpenWeather", description: "Weather data integration", category: .geospatial),
            AIService(type: .aws, name: "AWS", description: "Cloud infrastructure", category: .infrastructure),
            AIService(type: .supabase, name: "Supabase", description: "Real-time database", category: .database),
            AIService(type: .postgresql, name: "PostgreSQL", description: "Production database", category: .database),
            AIService(type: .stripe, name: "Stripe", description: "Payment processing", category: .commerce),
            AIService(type: .notion, name: "Notion", description: "Productivity integration", category: .productivity),
            AIService(type: .figma, name: "Figma", description: "Design collaboration", category: .productivity)
        ]
    }

    private func loadAllCredentials() async {
        print("🔐 Loading credentials from Doppler projects...")

        // Define all Doppler projects to check
        let projects = [
            DopplerProject(id: "ai-tools", name: "AI Tools"),
            DopplerProject(id: "profilepro", name: "ProfilePro"),
            DopplerProject(id: "general-purpose", name: "General Purpose"),
            DopplerProject(id: "project_maps", name: "Project Maps"),
            DopplerProject(id: "notion-integration", name: "Notion Integration")
        ]

        dopplerProjects = projects

        // Load credentials from each project
        for project in projects {
            await loadCredentialsFromProject(project)
        }

        // Update available services based on loaded credentials
        await updateAvailableServices()

        isLoaded = true
        print("✅ Credentials loaded successfully")
    }

    private func loadCredentialsFromProject(_ project: DopplerProject) async {
        do {
            let secrets = try await getDopplerSecrets(projectId: project.id, config: "dev")

            for (key, value) in secrets {
                let normalizedKey = normalizeCredentialKey(key)
                if !value.isEmpty && value != "placeholder" && !value.contains("your_") {
                    credentials[normalizedKey] = value
                }
            }

            print("📦 Loaded \(secrets.count) credentials from \(project.name)")
        } catch {
            print("❌ Failed to load credentials from \(project.name): \(error)")
        }
    }

    private func getDopplerSecrets(projectId: String, config: String) async throws -> [String: String] {
        // Use Doppler CLI to get secrets
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/local/bin/doppler")
        process.arguments = ["secrets", "--project", projectId, "--config", config, "--json"]

        let pipe = Pipe()
        process.standardOutput = pipe

        try process.run()
        process.waitUntilExit()

        guard process.terminationStatus == 0 else {
            throw CredentialError.dopplerCLIError(process.terminationStatus)
        }

        let data = pipe.fileHandleForReading.readDataToEndOfFile()
        let secrets = try JSONDecoder().decode([String: DopplerSecret].self, from: data)

        var result: [String: String] = [:]
        for (key, secret) in secrets {
            result[key] = secret.computed
        }

        return result
    }

    private func normalizeCredentialKey(_ key: String) -> String {
        let normalized = key
            .replacingOccurrences(of: "_API_KEY", with: "")
            .replacingOccurrences(of: "_TOKEN", with: "")
            .replacingOccurrences(of: "_SECRET", with: "")
            .replacingOccurrences(of: "_KEY", with: "")
            .lowercased()

        // Map known keys to service types
        switch normalized {
        case "anthropic": return AIServiceType.anthropic.rawValue
        case "openai": return AIServiceType.openai.rawValue
        case "gemini", "google_ai_studio": return AIServiceType.gemini.rawValue
        case "elevenlabs": return AIServiceType.elevenlabs.rawValue
        case "replicate": return AIServiceType.replicate.rawValue
        case "groq": return AIServiceType.groq.rawValue
        case "hf_token": return AIServiceType.huggingface.rawValue
        case "runpod": return AIServiceType.runpod.rawValue
        case "stability": return AIServiceType.stabilityai.rawValue
        case "mapbox_access_token": return AIServiceType.mapbox.rawValue
        case "google_maps", "google_api_key": return AIServiceType.googlemaps.rawValue
        case "openweather": return AIServiceType.openweather.rawValue
        case "aws_access_key_id": return AIServiceType.aws.rawValue
        case "supabase": return AIServiceType.supabase.rawValue
        case "database_url", "postgresql": return AIServiceType.postgresql.rawValue
        case "stripe": return AIServiceType.stripe.rawValue
        case "notion": return AIServiceType.notion.rawValue
        case "figma": return AIServiceType.figma.rawValue
        default: return key
        }
    }

    private func updateAvailableServices() async {
        let availableProviders = getAvailableAIProviders()

        await MainActor.run {
            connectedServices = availableServices.filter { service in
                credentials[service.type.rawValue] != nil
            }
        }
    }

    private func updateCredentialStatus(_ serviceKey: String, status: CredentialStatus) async {
        await MainActor.run {
            credentialStatus[serviceKey] = status
        }
    }

    private func performConnectivityTest(_ serviceType: AIServiceType, _ credential: String) async -> Bool {
        // Simple connectivity test for each service
        switch serviceType {
        case .anthropic:
            return await testAnthropicConnectivity(credential)
        case .openai:
            return await testOpenAIConnectivity(credential)
        case .gemini:
            return await testGeminiConnectivity(credential)
        case .elevenlabs:
            return await testElevenLabsConnectivity(credential)
        case .mapbox:
            return await testMapboxConnectivity(credential)
        case .googlemaps:
            return await testGoogleMapsConnectivity(credential)
        case .openweather:
            return await testOpenWeatherConnectivity(credential)
        default:
            return true // Assume connected for services without easy testing
        }
    }

    // MARK: - Connectivity Tests

    private func testAnthropicConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://api.anthropic.com/v1/messages")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("anthropic-version: 2023-06-01", forHTTPHeaderField: "anthropic-version")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let requestBody = [
            "model": "claude-3-haiku-20240307",
            "max_tokens": 10,
            "messages": [["role": "user", "content": "Hi"]]
        ] as [String: Any]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
            let (_, response) = try await URLSession.shared.data(for: request)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testOpenAIConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://api.openai.com/v1/models")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testGeminiConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://generativelanguage.googleapis.com/v1/models?key=\(apiKey)")!
        do {
            let (_, response) = try await URLSession.shared.data(from: url)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testElevenLabsConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://api.elevenlabs.io/v1/voices")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "xi-api-key")

        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testMapboxConnectivity(_ accessToken: String) async -> Bool {
        let url = URL(string: "https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=\(accessToken)")!
        do {
            let (_, response) = try await URLSession.shared.data(from: url)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testGoogleMapsConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://maps.googleapis.com/maps/api/geocode/json?address=Los+Angeles&key=\(apiKey)")!
        do {
            let (_, response) = try await URLSession.shared.data(from: url)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }

    private func testOpenWeatherConnectivity(_ apiKey: String) async -> Bool {
        let url = URL(string: "https://api.openweathermap.org/data/2.5/weather?q=Los%20Angeles&appid=\(apiKey)")!
        do {
            let (_, response) = try await URLSession.shared.data(from: url)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }
}

// MARK: - Supporting Models

enum AIServiceType: String, CaseIterable {
    case anthropic = "anthropic"
    case openai = "openai"
    case gemini = "gemini"
    case elevenlabs = "elevenlabs"
    case replicate = "replicate"
    case groq = "groq"
    case huggingface = "huggingface"
    case runpod = "runpod"
    case stabilityai = "stabilityai"
    case mapbox = "mapbox"
    case googlemaps = "googlemaps"
    case openweather = "openweather"
    case aws = "aws"
    case supabase = "supabase"
    case postgresql = "postgresql"
    case stripe = "stripe"
    case notion = "notion"
    case figma = "figma"
}

enum AIServiceCategory {
    case primary
    case voice
    case infrastructure
    case performance
    case creative
    case geospatial
    case database
    case commerce
    case productivity
}

enum CredentialStatus {
    case unknown
    case missing
    case testing
    case connected
    case error

    var displayText: String {
        switch self {
        case .unknown: return "Unknown"
        case .missing: return "Missing"
        case .testing: return "Testing..."
        case .connected: return "Connected"
        case .error: return "Error"
        }
    }

    var color: Color {
        switch self {
        case .unknown: return .gray
        case .missing: return .red
        case .testing: return .orange
        case .connected: return .green
        case .error: return .red
        }
    }
}

struct AIService {
    let type: AIServiceType
    let name: String
    let description: String
    let category: AIServiceCategory
}

struct AIServiceConfiguration {
    let type: AIServiceType
    let name: String
    let credential: String
    let baseURL: String
    let maxTokens: Int
    let supportedModels: [String]
    let features: [AIServiceFeature]
    let status: CredentialStatus
}

enum AIServiceFeature {
    case text
    case code
    case vision
    case voice
    case audio
    case image
    case video
    case multimodal
    case largeContext
    case functionCalling
    case hostedModels
}

struct DopplerProject {
    let id: String
    let name: String
}

struct DopplerSecret: Codable {
    let computed: String
    let computedValueType: ValueType
    let computedVisibility: String
    let note: String

    enum ValueType: Codable {
        case string
    }
}

enum CredentialError: Error {
    case dopplerCLIError(Int32)
    case jsonDecodingError(Error)
    case networkError(Error)
    case invalidCredentialFormat
}

// MARK: - SwiftUI Integration

extension Color {
    static let credentialGreen = Color.green
    static let credentialOrange = Color.orange
    static let credentialRed = Color.red
    static let credentialGray = Color.gray
}