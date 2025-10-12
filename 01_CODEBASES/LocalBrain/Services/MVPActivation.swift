//
//  MVPActivation.swift
//  LocalBrain
//
//  MVP Activation System - CLEAN VERSION (No dependencies)
//  Controls activation levels for Central Intelligence features
//
//  Created: 2025-10-06 (Minimal MVP Build)
//

import Foundation
import SwiftUI

// MARK: - MVP Configuration
@MainActor
class MVPActivation: ObservableObject {
    static let shared = MVPActivation()

    // MARK: - Published States
    @Published var isCentralIntelligenceActive = false
    @Published var isAdvancedModeEnabled = false
    @Published var isMVPSimplifiedMode = true
    @Published var currentActivationLevel: ActivationLevel = .core

    // MARK: - Activation Levels
    enum ActivationLevel: String, CaseIterable {
        case core = "Core MVP"
        case enhanced = "Enhanced AI"
        case full = "Full Intelligence"

        var description: String {
            switch self {
            case .core:
                return "Essential chat + GLM-4.6 + basic context"
            case .enhanced:
                return "Advanced AI orchestration + voice + metrics"
            case .full:
                return "Complete Trinity Intelligence ecosystem"
            }
        }

        var features: [String] {
            switch self {
            case .core:
                return ["GLM-4.6 Chat", "Basic Context", "Simple UI"]
            case .enhanced:
                return ["Multi-Provider AI", "Voice Interaction", "Context Management", "Metrics Dashboard"]
            case .full:
                return ["Central Intelligence", "Trinity Consciousness", "Self-Modification", "Advanced Orchestration"]
            }
        }
    }

    private init() {
        // Start in Core MVP mode
        setActivationLevel(.core)
    }

    // MARK: - Activation Methods

    func activateCoreMVP() {
        setActivationLevel(.core)
        print("🚀 Core MVP activated")
    }

    func setActivationLevel(_ level: ActivationLevel) {
        currentActivationLevel = level

        switch level {
        case .core:
            isCentralIntelligenceActive = false
            isAdvancedModeEnabled = false
            isMVPSimplifiedMode = true

        case .enhanced:
            isCentralIntelligenceActive = false
            isAdvancedModeEnabled = true
            isMVPSimplifiedMode = false

        case .full:
            isCentralIntelligenceActive = true
            isAdvancedModeEnabled = true
            isMVPSimplifiedMode = false
        }

        print("🚀 MVP Activation Level: \(level.rawValue)")
        print("   Features: \(level.features.joined(separator: ", "))")
    }

    func toggleCentralIntelligence() {
        isCentralIntelligenceActive.toggle()

        if isCentralIntelligenceActive {
            print("🧠 CENTRAL INTELLIGENCE ACTIVATED")
            print("   - Advanced orchestration enabled")
            print("   - Multi-agent reasoning active")
            print("   - Self-modification systems online")
        } else {
            print("🛑 Central Intelligence deactivated")
        }
    }

    // MARK: - Feature Helpers

    func shouldShowAdvancedFeatures() -> Bool {
        return !isMVPSimplifiedMode
    }

    func shouldShowCentralIntelligence() -> Bool {
        return isCentralIntelligenceActive
    }

    func shouldShowMetrics() -> Bool {
        return currentActivationLevel != .core
    }

    func shouldShowVoice() -> Bool {
        return currentActivationLevel != .core
    }

    func shouldShowDocker() -> Bool {
        return currentActivationLevel == .full
    }

    // MARK: - State Reporting

    func getCurrentFeatureSet() -> [String] {
        return currentActivationLevel.features
    }

    func printStatus() {
        print("""

        ═══════════════════════════════════════════════
        🚀 LocalBrain MVP Status
        ═══════════════════════════════════════════════
        Activation Level: \(currentActivationLevel.rawValue)
        Central Intelligence: \(isCentralIntelligenceActive ? "✅ Active" : "⏸️  Inactive")
        Advanced Mode: \(isAdvancedModeEnabled ? "✅ Enabled" : "⏸️  Disabled")
        Simplified Mode: \(isMVPSimplifiedMode ? "✅ Yes" : "❌ No")

        Available Features:
        \(currentActivationLevel.features.map { "  • \($0)" }.joined(separator: "\n"))
        ═══════════════════════════════════════════════

        """)
    }
}
