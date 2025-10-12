//
//  OpenAIEmbeddingService.swift
//  LocalBrain
//
//  Purpose: Real OpenAI embeddings-ada-002 API integration
//  Created: 2025-10-06 (Real Backend Day!)
//

import Foundation
import Combine

// MARK: - OpenAI Embedding Models
struct OpenAIEmbeddingRequest: Codable {
    let model: String
    let input: String
    let encodingFormat: String?
}

struct OpenAIEmbeddingResponse: Codable {
    let object: String
    let model: String
    let data: [OpenAIEmbeddingData]
    let usage: OpenAIEmbeddingUsage
}

struct OpenAIEmbeddingData: Codable {
    let object: String
    let embedding: [Float]
    let index: Int
}

struct OpenAIEmbeddingUsage: Codable {
    let promptTokens: Int
    let totalTokens: Int
}

struct OpenAIEmbeddingErrorResponse: Codable {
    let error: OpenAIEmbeddingError
}

struct OpenAIEmbeddingError: Codable {
    let message: String
    let type: String
    let code: String?
}

// MARK: - OpenAI Embedding Service
@MainActor
class OpenAIEmbeddingService: ObservableObject {

    // MARK: - Configuration
    private let baseURL = "https://api.openai.com/v1/embeddings"
    private let apiKey: String
    private let model: String = "text-embedding-3-small" // Cheaper and faster than ada-002

    // MARK: - State
    @Published var isConnected = false
    @Published var lastError: String?
    @Published var requestCount: Int = 0
    @Published var totalTokensUsed: Int = 0

    // MARK: - Cache
    private var embeddingCache: [String: [Float]] = [:]
    private let maxCacheSize = 1000

    // MARK: - Initialization
    init(apiKey: String) {
        self.apiKey = apiKey
        testConnection()
    }

    // MARK: - Public Methods

    /// Generate embedding for text using real OpenAI API
    func generateEmbedding(for text: String) async throws -> [Float] {
        lastError = nil

        // Check cache first
        if let cachedEmbedding = embeddingCache[text] {
            print("📋 Cache hit for embedding: \(text.prefix(50))...")
            return cachedEmbedding
        }

        print("🚀 Generating real embedding for: \(text.prefix(50))...")

        let request = OpenAIEmbeddingRequest(
            model: model,
            input: text,
            encodingFormat: "float"
        )

        let response = try await sendEmbeddingRequest(request)

        guard let embeddingData = response.data.first else {
            throw OpenAIEmbeddingServiceError.noEmbeddingData
        }

        let embedding = embeddingData.embedding

        // Cache the result
        cacheEmbedding(text: text, embedding: embedding)

        // Update usage statistics
        requestCount += 1
        totalTokensUsed += response.usage.totalTokens

        print("✅ Embedding generated successfully! Dimensions: \(embedding.count)")

        return embedding
    }

    /// Generate embeddings for multiple texts in batch
    func generateEmbeddingsBatch(for texts: [String]) async throws -> [[Float]] {
        guard !texts.isEmpty else { return [] }

        // For batch requests, we need to make individual calls due to API limitations
        var embeddings: [[Float]] = []

        for text in texts {
            let embedding = try await generateEmbedding(for: text)
            embeddings.append(embedding)

            // Small delay to avoid rate limiting
            try? await Task.sleep(nanoseconds: 100_000_000) // 100ms
        }

        return embeddings
    }

    /// Get embedding statistics
    func getEmbeddingStats() -> (requests: Int, tokens: Int, cacheSize: Int) {
        return (requestCount, totalTokensUsed, embeddingCache.count)
    }

    /// Clear embedding cache
    func clearCache() {
        embeddingCache.removeAll()
        print("🗑️ Embedding cache cleared")
    }

    // MARK: - Private Methods

    private func testConnection() {
        Task {
            do {
                let testRequest = OpenAIEmbeddingRequest(
                    model: model,
                    input: "Hello, world!",
                    encodingFormat: "float"
                )

                _ = try await sendEmbeddingRequest(testRequest)

                await MainActor.run {
                    self.isConnected = true
                    print("✅ OpenAI Embedding service connected successfully")
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastError = error.localizedDescription
                    print("❌ OpenAI Embedding service connection failed: \(error)")
                }
            }
        }
    }

    private func sendEmbeddingRequest(_ request: OpenAIEmbeddingRequest) async throws -> OpenAIEmbeddingResponse {
        guard let url = URL(string: baseURL) else {
            throw OpenAIEmbeddingServiceError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")

        let jsonData = try JSONEncoder().encode(request)
        urlRequest.httpBody = jsonData

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw OpenAIEmbeddingServiceError.invalidResponse
        }

        guard httpResponse.statusCode == 200 else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"

            // Try to parse as error response
            if let errorResponse = try? JSONDecoder().decode(OpenAIEmbeddingErrorResponse.self, from: data) {
                throw OpenAIEmbeddingServiceError.apiError(errorResponse.error.message)
            } else {
                throw OpenAIEmbeddingServiceError.httpError(httpResponse.statusCode, errorMessage)
            }
        }

        return try JSONDecoder().decode(OpenAIEmbeddingResponse.self, from: data)
    }

    private func cacheEmbedding(text: String, embedding: [Float]) {
        // Remove oldest entries if cache is full
        if embeddingCache.count >= maxCacheSize {
            let oldestKey = embeddingCache.keys.first!
            embeddingCache.removeValue(forKey: oldestKey)
        }

        embeddingCache[text] = embedding
    }
}

// MARK: - Error Types
enum OpenAIEmbeddingServiceError: LocalizedError {
    case invalidURL
    case invalidResponse
    case apiError(String)
    case httpError(Int, String)
    case encodingError
    case decodingError
    case noEmbeddingData

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response"
        case .apiError(let message):
            return "OpenAI Embedding API Error: \(message)"
        case .httpError(let code, let message):
            return "HTTP Error \(code): \(message)"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        case .noEmbeddingData:
            return "No embedding data in response"
        }
    }
}