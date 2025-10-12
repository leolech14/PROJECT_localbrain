//
//  KeychainService.swift
//  LocalBrain
//
//  Purpose: Secure API key storage using macOS Keychain
//  Created: 2025-10-06 (Security Implementation Day!)
//

import Foundation
import Security

// MARK: - Keychain Service
class KeychainService {

    private let service = "com.localbrain.apikeys"

    // MARK: - Public Methods
    func saveAPIKey(provider: String, key: String) throws {
        guard let keyData = key.data(using: .utf8) else {
            throw KeychainError.encodingError
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: provider,
            kSecValueData as String: keyData,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]

        // Delete existing key first
        deleteAPIKey(provider: provider)

        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.saveError(status)
        }

        print("✅ API key saved for \(provider)")
    }

    func getAPIKey(provider: String) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: provider,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess, let keyData = result as? Data else {
            if status == errSecItemNotFound {
                throw KeychainError.keyNotFound
            }
            throw KeychainError.loadError(status)
        }

        guard let key = String(data: keyData, encoding: .utf8) else {
            throw KeychainError.decodingError
        }

        return key
    }

    func deleteAPIKey(provider: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: provider
        ]

        SecItemDelete(query as CFDictionary)
    }

    func hasAPIKey(provider: String) -> Bool {
        do {
            _ = try getAPIKey(provider: provider)
            return true
        } catch KeychainError.keyNotFound {
            return false
        } catch {
            return false
        }
    }

    func getAllProviders() -> [String] {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecReturnAttributes as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitAll
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess, let items = result as? [[String: Any]] else {
            return []
        }

        return items.compactMap { item in
            item[kSecAttrAccount as String] as? String
        }
    }
}

// MARK: - Error Types
enum KeychainError: LocalizedError {
    case encodingError
    case decodingError
    case saveError(OSStatus)
    case loadError(OSStatus)
    case keyNotFound

    var errorDescription: String? {
        switch self {
        case .encodingError:
            return "Failed to encode API key"
        case .decodingError:
            return "Failed to decode API key"
        case .saveError(let status):
            return "Failed to save API key: \(status)"
        case .loadError(let status):
            return "Failed to load API key: \(status)"
        case .keyNotFound:
            return "API key not found in keychain"
        }
    }
}