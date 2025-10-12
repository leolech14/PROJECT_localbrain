// MARK: - Message Model
// Chat message data structure
// LocalBrain › Models › Message.swift

import Foundation

struct Message: Identifiable, Equatable, Codable {
    enum Role: Codable { 
        case user
        case assistant 
    }
    
    let id: UUID
    var role: Role
    var text: String
    var ts: Date
    var isStreaming: Bool
    
    // Custom initializer to preserve timestamp during streaming updates
    init(role: Role, text: String, ts: Date? = nil, isStreaming: Bool = false) {
        self.id = UUID()
        self.role = role
        self.text = text
        self.ts = ts ?? Date()
        self.isStreaming = isStreaming
    }
}