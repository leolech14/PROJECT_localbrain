//
//  OpenAIService.swift
//  LocalBrain
//
//  Purpose: Real OpenAI API integration with streaming support
//  Created: 2025-10-06 (AI Integration Day!)
//

import Foundation
import Combine

// MARK: - OpenAI Models
struct OpenAIMessage: Codable {
    let role: String
    let content: String
}

struct OpenAIRequest: Codable {
    let model: String
    let messages: [OpenAIMessage]
    let stream: Bool
    let max_tokens: Int?
    let temperature: Double?
}

struct OpenAIResponse: Codable {
    let choices: [OpenAIChoice]
}

struct OpenAIChoice: Codable {
    let message: OpenAIMessage
    let delta: OpenAIDelta?
    let finish_reason: String?
}

struct OpenAIDelta: Codable {
    let role: String?
    let content: String?
}

struct OpenAIErrorResponse: Codable {
    let error: OpenAIError
}

struct OpenAIError: Codable {
    let message: String
    let type: String
    let code: String?
}

// MARK: - OpenAI Service
@MainActor
class OpenAIService: ObservableObject, LLMServiceProtocol {

    // MARK: - Configuration
    private let baseURL = "https://api.openai.com/v1/chat/completions"
    private let apiKey: String

    // MARK: - State
    @Published var isConnected = false
    @Published var lastError: String?

    // MARK: - LLMServiceProtocol
    var providerName: String { "OpenAI" }

    // MARK: - Initialization
    init(apiKey: String) {
        self.apiKey = apiKey
        testConnection()
    }

    // MARK: - Public Methods
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String> {
        lastError = nil

        // Convert Message to OpenAIMessage
        let openAIMessages = history.map { message in
            OpenAIMessage(role: message.role == .user ? "user" : "assistant", content: message.text)
        }

        // Add current message
        var messages = openAIMessages
        messages.append(OpenAIMessage(role: "user", content: text))

        let request = OpenAIRequest(
            model: "gpt-3.5-turbo",
            messages: messages,
            stream: true,
            max_tokens: 2000,
            temperature: 0.7
        )

        return AsyncStream { continuation in
            Task {
                do {
                    try await sendStreamingRequest(request: request, continuation: continuation)
                } catch {
                    await MainActor.run {
                        self.lastError = error.localizedDescription
                    }
                    continuation.finish()
                }
            }
        }
    }

    // MARK: - Private Methods
    private func testConnection() {
        Task {
            do {
                let testRequest = OpenAIRequest(
                    model: "gpt-3.5-turbo",
                    messages: [OpenAIMessage(role: "user", content: "Hello")],
                    stream: false,
                    max_tokens: 10,
                    temperature: 0.7
                )

                _ = try await sendNonStreamingRequest(request: testRequest)

                await MainActor.run {
                    self.isConnected = true
                    print("✅ OpenAI connection successful")
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastError = error.localizedDescription
                    print("❌ OpenAI connection failed: \(error)")
                }
            }
        }
    }

    private func sendStreamingRequest(request: OpenAIRequest, continuation: AsyncStream<String>.Continuation) async throws {
        guard let url = URL(string: baseURL) else {
            throw OpenAIServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("text/event-stream", forHTTPHeaderField: "Accept")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw OpenAIServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"

            // Try to parse as error response
            if let errorResponse = try? JSONDecoder().decode(OpenAIErrorResponse.self, from: data) {
                throw OpenAIServiceError.apiError(errorResponse.error.message)
            } else {
                throw OpenAIServiceError.httpError(httpResponse.statusCode, errorMessage)
            }
        }

        // Parse streaming response
        let responseString = String(data: data, encoding: .utf8) ?? ""
        let lines = responseString.components(separatedBy: "\n")

        for line in lines {
            if line.hasPrefix("data: ") {
                let jsonString = String(line.dropFirst(6))

                if jsonString == "[DONE]" {
                    continuation.finish()
                    return
                }

                guard let jsonData = jsonString.data(using: .utf8) else { continue }

                do {
                    let response = try JSONDecoder().decode(OpenAIResponse.self, from: jsonData)
                    if let choice = response.choices.first, let delta = choice.delta {
                        if let content = delta.content {
                            continuation.yield(content)
                        }
                    }
                } catch {
                    // Skip malformed JSON chunks
                    continue
                }
            }
        }

        continuation.finish()
    }

    private func sendNonStreamingRequest(request: OpenAIRequest) async throws -> OpenAIResponse {
        guard let url = URL(string: baseURL) else {
            throw OpenAIServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw OpenAIServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw OpenAIServiceError.httpError(httpResponse.statusCode, errorMessage)
        }

        return try JSONDecoder().decode(OpenAIResponse.self, from: data)
    }
}

// MARK: - Error Types
enum OpenAIServiceError: LocalizedError {
    case invalidURL
    case invalidResponse
    case apiError(String)
    case httpError(Int, String)
    case encodingError
    case decodingError

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response"
        case .apiError(let message):
            return "OpenAI API Error: \(message)"
        case .httpError(let code, let message):
            return "HTTP Error \(code): \(message)"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        }
    }
}