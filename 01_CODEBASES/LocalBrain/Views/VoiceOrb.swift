//
//  VoiceOrb.swift
//  LocalBrain
//
//  Minimal voice orb for MVP
//
//  Created: 2025-10-06 (Minimal MVP Build)
//

import SwiftUI

struct VoiceOrb: View {
    var scale: Double
    var glow: Double
    var active: Bool
    var onTap: () -> Void

    var body: some View {
        Circle()
            .fill(
                RadialGradient(
                    colors: [
                        active ? Color.green : Color.blue,
                        active ? Color.green.opacity(0.5) : Color.blue.opacity(0.5)
                    ],
                    center: .center,
                    startRadius: 0,
                    endRadius: 50
                )
            )
            .frame(width: 60 * scale, height: 60 * scale)
            .shadow(color: active ? Color.green.opacity(glow) : Color.blue.opacity(glow), radius: 20)
            .onTapGesture(perform: onTap)
            .animation(.easeInOut(duration: 0.3), value: active)
            .animation(.easeInOut(duration: 0.3), value: scale)
    }
}
