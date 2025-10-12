//
//  MessageBubble.swift
//  LocalBrain
//
//  Minimal message bubble for MVP
//
//  Created: 2025-10-06 (Minimal MVP Build)
//

import SwiftUI

struct MessageBubble: View {
    let message: Message

    var body: some View {
        HStack {
            if message.role == .user {
                Spacer()
            }

            VStack(alignment: message.role == .user ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .padding(12)
                    .background(message.role == .user ? Color.acc : Color.bg3)
                    .foregroundColor(Color.tx1)
                    .cornerRadius(12)

                Text(timeString(from: message.ts))
                    .font(.caption2)
                    .foregroundColor(Color.tx3)
            }

            if message.role == .assistant {
                Spacer()
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
    }

    private func timeString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}
