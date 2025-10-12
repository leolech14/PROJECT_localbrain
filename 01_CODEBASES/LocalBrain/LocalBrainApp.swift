//
//  LocalBrainApp_MINIMAL.swift
//  LocalBrain - Minimal MVP Version
//
//  Stripped down to ONLY what's needed for OrchestraMVPView + Widgets
//

import SwiftUI

@main
struct LocalBrainApp: App {
    @StateObject private var appModel = AppModel()

    var body: some Scene {
        WindowGroup("LocalBrain") {
            EnhancedCentralDashboardView()
                .environmentObject(appModel)
                #if os(macOS)
                .frame(minWidth: 1200, minHeight: 800)
                .frame(idealWidth: 1400, idealHeight: 1000)
                #endif
        }
        #if os(macOS)
        .windowStyle(.titleBar)
        .windowResizability(.contentSize)
        #endif
    }
}
