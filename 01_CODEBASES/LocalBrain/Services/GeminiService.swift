//
//  GeminiService.swift
//  LocalBrain
//
//  Purpose: Real Google Gemini API integration with streaming support
//  Created: 2025-10-06 (AI Integration Day!)
//

import Foundation
import Combine

// MARK: - Gemini Models
struct GeminiMessage: Codable {
    let role: String
    let parts: [GeminiPart]
}

struct GeminiPart: Codable {
    let text: String
}

struct GeminiRequest: Codable {
    let contents: [GeminiMessage]
    let generationConfig: GeminiGenerationConfig
    let safetySettings: [GeminiSafetySetting]
}

struct GeminiGenerationConfig: Codable {
    let temperature: Double?
    let maxOutputTokens: Int?
    let topP: Double?
    let topK: Int?
}

struct GeminiSafetySetting: Codable {
    let category: String
    let threshold: String
}

struct GeminiResponse: Codable {
    let candidates: [GeminiCandidate]
    let promptFeedback: GeminiPromptFeedback?
}

struct GeminiCandidate: Codable {
    let content: GeminiMessage
    let finishReason: String?
    let index: Int?
    let safetyRatings: [GeminiSafetyRating]?
}

struct GeminiSafetyRating: Codable {
    let category: String
    let probability: String
}

struct GeminiPromptFeedback: Codable {
    let blockReason: String?
    let safetyRatings: [GeminiSafetyRating]?
}

struct GeminiErrorResponse: Codable {
    let error: GeminiError
}

struct GeminiError: Codable {
    let code: Int
    let message: String
    let status: String
}

// MARK: - Gemini Service
@MainActor
class GeminiService: ObservableObject, LLMServiceProtocol {

    // MARK: - Configuration
    private let baseURL = "https://generativelanguage.googleapis.com/v1beta/models/"
    private let apiKey: String
    private let model: String

    // MARK: - State
    @Published var isConnected = false
    @Published var lastError: String?

    // MARK: - LLMServiceProtocol
    var providerName: String { "Gemini" }

    // MARK: - Initialization
    init(apiKey: String, model: String = "gemini-1.5-flash") {
        self.apiKey = apiKey
        self.model = model
        testConnection()
    }

    // MARK: - Public Methods
    func sendMessage(text: String, history: [Message]) async throws -> AsyncStream<String> {
        lastError = nil

        // Convert Message to GeminiMessage format
        var geminiMessages: [GeminiMessage] = []

        // Add history (Gemini uses "user" and "model" roles)
        for message in history {
            let role = message.role == .user ? "user" : "model"
            geminiMessages.append(GeminiMessage(role: role, parts: [GeminiPart(text: message.text)]))
        }

        // Add current message
        geminiMessages.append(GeminiMessage(role: "user", parts: [GeminiPart(text: text)]))

        let request = GeminiRequest(
            contents: geminiMessages,
            generationConfig: GeminiGenerationConfig(
                temperature: 0.7,
                maxOutputTokens: 2000,
                topP: 0.95,
                topK: 64
            ),
            safetySettings: [
                GeminiSafetySetting(category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"),
                GeminiSafetySetting(category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE"),
                GeminiSafetySetting(category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE"),
                GeminiSafetySetting(category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE")
            ]
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
                let testRequest = GeminiRequest(
                    contents: [
                        GeminiMessage(role: "user", parts: [GeminiPart(text: "Hello")])
                    ],
                    generationConfig: GeminiGenerationConfig(
                        temperature: 0.7,
                        maxOutputTokens: 10,
                        topP: 0.95,
                        topK: 64
                    ),
                    safetySettings: [
                        GeminiSafetySetting(category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE")
                    ]
                )

                _ = try await sendNonStreamingRequest(request: testRequest)

                await MainActor.run {
                    self.isConnected = true
                    print("✅ Gemini connection successful")
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastError = error.localizedDescription
                    print("❌ Gemini connection failed: \(error)")
                }
            }
        }
    }

    private func sendStreamingRequest(request: GeminiRequest, continuation: AsyncStream<String>.Continuation) async throws {
        let urlString = "\(baseURL)\(model):streamGenerateContent?key=\(apiKey)"
        guard let url = URL(string: urlString) else {
            throw GeminiServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("text/event-stream", forHTTPHeaderField: "Accept")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw GeminiServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"

            // Try to parse as error response
            if let errorResponse = try? JSONDecoder().decode(GeminiErrorResponse.self, from: data) {
                throw GeminiServiceError.apiError(errorResponse.error.message)
            } else {
                throw GeminiServiceError.httpError(httpResponse.statusCode, errorMessage)
            }
        }

        // Parse streaming response
        let responseString = String(data: data, encoding: .utf8) ?? ""
        let lines = responseString.components(separatedBy: "\n")

        for line in lines {
            if line.hasPrefix("data: ") {
                let jsonString = String(line.dropFirst(6))

                guard let jsonData = jsonString.data(using: .utf8) else { continue }

                do {
                    let response = try JSONDecoder().decode(GeminiResponse.self, from: jsonData)
                    if let candidate = response.candidates.first,
                       let part = candidate.content.parts.first {
                        continuation.yield(part.text)

                        // Check if this is the final chunk
                        if let finishReason = candidate.finishReason,
                           finishReason != "STOP" && finishReason != "MAX_TOKENS" {
                            continuation.finish()
                            return
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

    private func sendNonStreamingRequest(request: GeminiRequest) async throws -> GeminiResponse {
        let urlString = "\(baseURL)\(model):generateContent?key=\(apiKey)"
        guard let url = URL(string: urlString) else {
            throw GeminiServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw GeminiServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw GeminiServiceError.httpError(httpResponse.statusCode, errorMessage)
        }

        return try JSONDecoder().decode(GeminiResponse.self, from: data)
    }
}

// MARK: - Error Types
enum GeminiServiceError: LocalizedError {
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
            return "Gemini API Error: \(message)"
        case .httpError(let code, let message):
            return "HTTP Error \(code): \(message)"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        }
    }
}