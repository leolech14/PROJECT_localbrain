//
//  WidgetApp.swift
//  LocalBrain
//
//  Purpose: Main app entry point with widget system integration
//  Created: 2025-10-06 (Migration Day!)
//  Integration: Legacy LocalBrain + New Widget System
//

import SwiftUI

@main
struct WidgetApp: App {
    @StateObject private var gridManager = GridWidgetManager()
    @StateObject private var stateBridge = StateBridge()
    @State private var useWidgetSystem = true // Toggle for migration

    var body: some Scene {
        WindowGroup {
            ZStack {
                if useWidgetSystem {
                    // NEW: Widget-based interface
                    WidgetGridView()
                        .environmentObject(gridManager)
                        .environmentObject(stateBridge)
                        .transition(.opacity)
                } else {
                    // LEGACY: Original LocalBrain interface
                    LegacyWorkingControlPanel()
                        .transition(.opacity)
                }

                // Migration toggle (for development)
                VStack {
                    HStack {
                        Spacer()
                        migrationToggle
                    }
                    Spacer()
                }
                .padding()
            }
            .animation(.easeInOut(duration: 0.5), value: useWidgetSystem)
            .onAppear {
                setupMigration()
            }
        }
    }

    // MARK: - Migration Toggle (Development Only)
    private var migrationToggle: some View {
        VStack(spacing: 8) {
            Button(action: {
                withAnimation {
                    useWidgetSystem.toggle()
                }
                print("🔄 Switched to \(useWidgetSystem ? "Widget System" : "Legacy Interface")")
            }) {
                HStack {
                    Image(systemName: useWidgetSystem ? "cube.box" : "rectangle.stack")
                    Text(useWidgetSystem ? "Widgets" : "Legacy")
                        .font(.caption)
                }
                .padding(8)
                .background(useWidgetSystem ? Color.blue : Color.green)
                .foregroundColor(.white)
                .cornerRadius(6)
            }

            Text("Migration Mode")
                .font(.caption2)
                .foregroundColor(.white.opacity(0.6))
        }
    }

    // MARK: - Migration Setup
    private func setupMigration() {
        print("🚀 LocalBrain v2.0.0 Widget System Starting...")

        // Setup state bridge with existing LocalBrain state
        setupStateBridge()

        // Load initial widget configuration
        loadWidgetConfiguration()

        print("✅ Widget system initialized and ready!")
    }

    private func setupStateBridge() {
        // Register current FileBrowserView state
        let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        stateBridge.registerFileExplorerState(
            currentPath: documentsPath,
            selectedFiles: []
        )

        // Register other legacy states as they become available
        // stateBridge.registerTerminalState(...)
        // stateBridge.registerChatState(...)

        print("🌉 StateBridge configured with legacy states")
    }

    private func loadWidgetConfiguration() {
        // Load saved widget layout if exists
        // For now, use default layout
        print("📋 Widget configuration loaded")
    }
}

// MARK: - Legacy Working Control Panel (Placeholder)
struct LegacyWorkingControlPanel: View {
    var body: some View {
        ZStack {
            Color.black
            VStack {
                Text("Legacy LocalBrain Interface")
                    .font(.title)
                    .foregroundColor(.white)
                Text("This will be replaced by widgets during migration")
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding()
            }
        }
    }
}