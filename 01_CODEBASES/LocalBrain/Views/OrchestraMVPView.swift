//
//  OrchestraMVPView.swift
//  LocalBrain
//
//  Single-page MVP following Orchestra.blue SCF scaffold exactly
//  Header + Sidebar + Central Canvas + Footer with OKLCH theming
//
//  Created for LocalBrain MVP Implementation
//  Date: 2025-10-06
//

import SwiftUI

// MARK: - Active Module Types
enum ActiveModule: String, CaseIterable {
    case chat = "chat"
    case context = "context"
    case voice = "voice"
    case metrics = "metrics"
    case widgets = "widgets"

    var displayName: String {
        switch self {
        case .chat: return "Chat"
        case .context: return "Context"
        case .voice: return "Voice"
        case .metrics: return "Metrics"
        case .widgets: return "Widgets"
        }
    }
}

struct OrchestraMVPView: View {
    @EnvironmentObject private var M: AppModel
    @StateObject private var mvp = MVPActivation.shared
    @FocusState private var isInputFocused: Bool
    @State private var showingSettings = false
    @State private var currentInputBuffer = ""
    @State private var searchQuery = ""
    @State private var isSearchFocused = false
    @State private var isSidebarCollapsed = false
    @State private var isFooterExpanded = false
    @State private var themeMode: ThemeMode = .auto
    @State private var activeModule: ActiveModule = .chat  // NEW: Track active module

    // OKLCH Color System
    private let theme = OKLCHTheme.current

    var body: some View {
        VStack(spacing: 0) {
            // 01 HEADER COMPONENT
            headerComponent

            // MAIN BODY: Sidebar + Central Canvas
            HStack(spacing: 0) {
                // 02 SIDEBAR COMPONENT
                if !isSidebarCollapsed {
                    sidebarComponent
                        .frame(width: 260)
                        .transition(.move(edge: .leading).combined(with: .opacity))
                }

                // CENTRAL CANVAS - Grid View (Default)
                centralCanvas
            }

            // 03 FOOTER COMPONENT
            footerComponent
        }
        .background(Color.bg1)
        .onAppear {
            setupOrchestraMVP()
        }
        .onReceive(NotificationCenter.default.publisher(for: NSApplication.didBecomeActiveNotification)) { _ in
            // Auto-refresh system status
        }
        .sheet(isPresented: $showingSettings) {
            UnifiedSettingsView()
        }
    }

    // MARK: - 01 HEADER COMPONENT
    private var headerComponent: some View {
        HStack(spacing: 16) {
            // Brand Section
            HStack(spacing: 8) {
                Image(systemName: "brain")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(Color.tx1)

                VStack(alignment: .leading, spacing: 2) {
                    Text("LocalBrain")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color.tx1)

                    Text("v2.0")
                        .font(.caption)
                        .foregroundStyle(Color.tx3)
                }
            }

            // Search Section (⌘K)
            VStack(spacing: 0) {
                HStack(spacing: 6) {
                    Image(systemName: "magnifyingglass")
                        .font(.caption)
                        .foregroundStyle(Color.tx2)

                    TextField("Search... (⌘K)", text: $searchQuery)
                        .font(.system(size: 13))
                        .foregroundStyle(Color.tx1)
                        .textFieldStyle(.plain)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.bg3)
                .clipShape(RoundedRectangle(cornerRadius: 6))
                .overlay(
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(isSearchFocused ? Color.acc : Color.hair, lineWidth: 1)
                )
            }

            Spacer()

            // Controls Section
            HStack(spacing: 12) {
                // Upload Button
                Button(action: { M.selectFileForContext() }) {
                    HStack(spacing: 4) {
                        Image(systemName: "doc.badge.plus")
                            .font(.caption)
                        Text("Upload")
                            .font(.caption)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.acc.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                }
                .buttonStyle(.plain)

                // Theme Toggle (Auto/Light/Dark)
                Button(action: { toggleTheme() }) {
                    Image(systemName: themeIcon)
                        .font(.system(size: 14))
                        .foregroundStyle(Color.tx2)
                }
                .buttonStyle(.plain)
                .help("Toggle theme (\(themeMode.description))")

                // Agent Status Indicator
                HStack(spacing: 4) {
                    Circle()
                        .fill(Color.tx3)
                        .frame(width: 4, height: 4)

                    Text(mvp.isCentralIntelligenceActive ? "CI" : "AI")
                        .font(.caption)
                        .foregroundStyle(Color.tx2)
                }
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.bg2)
                .clipShape(RoundedRectangle(cornerRadius: 4))
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color.bg2)
        .overlay(
            Rectangle()
                .stroke(Color.hair, lineWidth: 1)
        )
    }

    // MARK: - 02 SIDEBAR COMPONENT
    private var sidebarComponent: some View {
        VStack(spacing: 0) {
            // Collapse Toggle
            HStack {
                Text("Navigation")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color.tx1)

                Spacer()

                Button(action: { withAnimation(.easeInOut(duration: 0.3)) { isSidebarCollapsed.toggle() } }) {
                    Image(systemName: "sidebar.left")
                        .font(.caption)
                        .foregroundStyle(Color.tx2)
                }
                .buttonStyle(.plain)
            }
            .padding(12)

            Divider()
                .overlay(Color.hair)

            // Module Navigation
            ScrollView {
                VStack(alignment: .leading, spacing: 6) {
                    // Chat Module
                    moduleButton(
                        title: "Chat",
                        subtitle: "AI Conversation",
                        isActive: activeModule == .chat,
                        icon: "message"
                    ) {
                        activeModule = .chat
                    }

                    // Context Module
                    moduleButton(
                        title: "Context",
                        subtitle: "\(M.contextPool.count) items",
                        isActive: activeModule == .context,
                        icon: "folder"
                    ) {
                        activeModule = .context
                    }

                    // Voice Module
                    moduleButton(
                        title: "Voice",
                        subtitle: M.micActive ? "Recording" : "Inactive",
                        isActive: activeModule == .voice,
                        icon: "mic"
                    ) {
                        activeModule = .voice
                    }

                    // Metrics Module
                    moduleButton(
                        title: "Metrics",
                        subtitle: M.tokenUsage,
                        isActive: activeModule == .metrics,
                        icon: "chart.bar"
                    ) {
                        activeModule = .metrics
                    }

                    // Widgets Module
                    moduleButton(
                        title: "Widgets",
                        subtitle: "Grid Layout",
                        isActive: activeModule == .widgets,
                        icon: "square.grid.2x2"
                    ) {
                        activeModule = .widgets
                    }

                    Divider()
                        .overlay(Color.hair)
                        .padding(.vertical, 8)

                    // Agent Panel Section
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Agent Panel")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundStyle(Color.tx2)
                            .padding(.horizontal, 12)

                        // Central Intelligence Status
                        if mvp.shouldShowCentralIntelligence() {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Circle()
                                        .fill(Color.tx3)
                                        .frame(width: 4, height: 4)
                                    Text("Central Intelligence")
                                        .font(.caption)
                                        .foregroundStyle(Color.tx1)
                                }

                                Text("FSM: Ready")  // TODO: Connect CentralIntelligence
                                    .font(.caption2)
                                    .foregroundStyle(Color.tx2)
                                    .padding(.horizontal, 8)

                                Button("Toggle CI") {
                                    mvp.toggleCentralIntelligence()
                                }
                                .font(.caption2)
                                .foregroundStyle(Color.tx1)
                                .buttonStyle(.plain)
                            }
                            .padding(8)
                            .background(Color.bg3)
                            .clipShape(RoundedRectangle(cornerRadius: 4))
                            .padding(.horizontal, 12)
                        }
                    }
                }
                .padding(.vertical, 8)
            }
            .scrollIndicators(.hidden)

            Divider()
                .overlay(Color.hair)

            // Quick Actions
            VStack(alignment: .leading, spacing: 8) {
                Text("Quick Actions")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color.tx2)
                    .padding(.horizontal, 12)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 6) {
                    quickActionButton("Clear Chat", "trash") {
                        M.messages.removeAll()
                    }

                    quickActionButton("Export", "square.and.arrow.up") {
                        // Export conversation
                    }

                    quickActionButton("Settings", "gearshape") {
                        showingSettings = true
                    }

                    quickActionButton("Help", "questionmark.circle") {
                        // Show help
                    }
                }
                .padding(.horizontal, 12)
            }
            .padding(.bottom, 12)

            Spacer()
        }
        .background(Color.bg1)
        .overlay(
            Rectangle()
                .stroke(Color.hair, lineWidth: 1)
        )
    }

    private func moduleButton(title: String, subtitle: String, isActive: Bool, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.caption)
                    .foregroundStyle(isActive ? Color.acc : Color.tx2)
                    .frame(width: 16)

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Color.tx1)

                    Text(subtitle)
                        .font(.caption2)
                        .foregroundStyle(Color.tx2)
                }

                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isActive ? Color.acc.opacity(0.1) : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: 6))
        }
        .buttonStyle(.plain)
    }

    private func quickActionButton(_ title: String, _ icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.caption2)
                Text(title)
                    .font(.caption2)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 6)
            .background(Color.bg2)
            .clipShape(RoundedRectangle(cornerRadius: 4))
        }
        .buttonStyle(.plain)
    }

    // MARK: - CENTRAL CANVAS (Module-Based)
    private var centralCanvas: some View {
        VStack(spacing: 0) {
            // Show different content based on active module
            Group {
                switch activeModule {
                case .chat:
                    chatCanvas
                case .context:
                    contextCanvas
                case .voice:
                    voiceCanvas
                case .metrics:
                    metricsCanvas
                case .widgets:
                    WidgetCentralCanvasView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // Input Area - Show for chat and context modules
            if activeModule == .chat || activeModule == .context {
                inputArea
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }

    // MARK: - Chat Canvas
    private var chatCanvas: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(spacing: 16) {
                    if M.messages.isEmpty {
                        emptyChatState
                    } else {
                        // Intelligence header (if active)
                        if mvp.shouldShowCentralIntelligence() {
                            intelligenceHeader
                        }

                        // Messages Grid (Living widgets that expand to fill space)
                        LazyVStack(spacing: 12) {
                            ForEach(Array(M.messages.enumerated()), id: \.element.id) { index, message in
                                MessageBubble(message: message)
                                    .contextMenu {
                                        if mvp.shouldShowCentralIntelligence() {
                                            Button("Analyze with CI") {
                                                analyzeMessageWithCentralIntelligence(message)
                                            }
                                            Divider()
                                        }
                                        Button("Copy") {
                                            copyToClipboard(message.text)
                                        }
                                        Button("Delete") {
                                            deleteMessage(message)
                                        }
                                    }
                            }

                            // Streaming indicator
                            if M.isStreaming {
                                streamingIndicator
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 20)
                    }
                }
                .padding(.bottom, 20)
                .frame(maxWidth: .infinity)
            }
            .background(Color.clear)
        }
    }

    // MARK: - Empty Chat State
    private var emptyChatState: some View {
        VStack(spacing: 20) {
            Image(systemName: "sparkle.magnifyingglass")
                .font(.system(size: 48))
                .foregroundColor(Color.tx3)

            Text("Start a New Conversation")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color.tx1)

            Text("Type your message below or add context files to begin.")
                .font(.subheadline)
                .foregroundColor(Color.tx2)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 300)

            HStack(spacing: 12) {
                Button("Add Context File") {
                    M.selectFileForContext()
                }
                .buttonStyle(.borderedProminent)

                Button("Explore Features") {
                    activeModule = .widgets // Assuming widgets module can showcase features
                }
                .buttonStyle(.plain)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 60)
    }

    // MARK: - Quick Prompts Section
    private var quickPromptsSection: some View {
        VStack(spacing: 12) {
            Text("Quick Prompts")
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Color.tx2)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                promptButton("Introduction", "Learn about the system")
                promptButton("Capabilities", "Discover available features")
                promptButton("Documentation", "View help and guides")
                if mvp.shouldShowCentralIntelligence() {
                    promptButton("Advanced Mode", "Activate Central Intelligence")
                }
            }
        }
        .frame(maxWidth: 500)
    }

    private func promptButton(_ title: String, _ description: String) -> some View {
        Button(action: {
            currentInputBuffer = title
            isInputFocused = true
        }) {
            VStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(Color.tx1)
                    .multilineTextAlignment(.center)

                Text(description)
                    .font(.system(size: 10))
                    .foregroundStyle(Color.tx2)
                    .multilineTextAlignment(.center)
            }
            .padding(12)
            .frame(maxWidth: .infinity)
            .background(Color.bg2)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.hair, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    // MARK: - Intelligence Header
    private var intelligenceHeader: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(Color.tx3)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                Text("Central Intelligence")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Color.tx1)

                Text("Multi-agent orchestration active")
                    .font(.system(size: 11))
                    .foregroundStyle(Color.tx2)
            }

            Spacer()

            // State indicator
            Text("Ready")  // TODO: Connect CentralIntelligence
                .font(.system(size: 10))
                .foregroundStyle(Color.tx2)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.bg3)
                .clipShape(Capsule())
        }
        .padding(16)
        .background(Color.bg2)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.hair, lineWidth: 1)
        )
    }

    // MARK: - Streaming Indicator
    private var streamingIndicator: some View {
        HStack(spacing: 8) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(Color.tx3)
                    .frame(width: 6, height: 6)
                    .scaleEffect(M.isStreaming ? 1.0 : 0.5)
                    .animation(
                        .easeInOut(duration: 0.6)
                        .repeatForever()
                        .delay(Double(index) * 0.2),
                        value: M.isStreaming
                    )
            }
        }
        .padding(12)
        .background(Color.bg3)
        .clipShape(Capsule())
    }

    // MARK: - Input Area
    private var inputArea: some View {
        VStack(spacing: 12) {
            // Context indicator (if any)
            if !M.contextPool.isEmpty {
                contextIndicator
            }

            // Main input
            HStack(spacing: 12) {
                // Voice button
                Button(action: { M.toggleMic() }) {
                    VoiceOrb(
                        scale: M.orbScale,
                        glow: M.orbGlow,
                        active: M.micActive,
                        onTap: { M.toggleMic() }
                    )
                }
                .buttonStyle(.plain)

                // Text input
                TextField("Type your message...", text: $currentInputBuffer, axis: .vertical)
                    .focused($isInputFocused)
                    .font(.system(size: 14))
                    .foregroundColor(Color.tx1)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color.bg3)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(isInputFocused ? Color.acc : Color.hair, lineWidth: isInputFocused ? 2 : 1)
                    )
                    .onSubmit {
                        sendMessage()
                    }

                // Send button
                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(canSend ? Color.acc : Color.tx2)
                }
                .disabled(!canSend)
                .buttonStyle(.plain)

                // Intelligence toggle (if advanced mode)
                if mvp.shouldShowAdvancedFeatures() {
                    Button(action: {
                        mvp.toggleCentralIntelligence()
                    }) {
                        Image(systemName: mvp.isCentralIntelligenceActive ? "brain.head.profile.fill" : "brain.head.profile")
                            .font(.system(size: 16))
                            .foregroundColor(mvp.isCentralIntelligenceActive ? Color.green : Color.tx2)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
        .background(Color.bg2)
        .overlay(
            Rectangle()
                .stroke(Color.hair, lineWidth: 1)
        )
    }

    // MARK: - Context Indicator
    private var contextIndicator: some View {
        HStack(spacing: 8) {
            Image(systemName: "doc.text.fill")
                .font(.system(size: 12))
                .foregroundColor(Color.acc)

            Text("\(M.contextPool.count) context items active")
                .font(.system(size: 11))
                .foregroundStyle(Color.tx2)

            Spacer()

            Button("Manage") {
                // TODO: Open context management
            }
            .font(.system(size: 10))
            .foregroundStyle(Color.acc)
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color.bg3)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    // MARK: - 03 FOOTER COMPONENT
    private var footerComponent: some View {
        VStack(spacing: 0) {
            // Main Status Line
            HStack(spacing: 16) {
                // Technology Stack Display
                HStack(spacing: 8) {
                    Text("STACK:")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color.tx2)

                    Text("AI: glm-4.6 · Auth: keychain · DB: coredata · API: swift · Deploy: macOS")
                        .font(.caption)
                        .fontDesign(.monospaced)
                        .foregroundStyle(Color.tx2)
                }

                // System Health Indicators
                HStack(spacing: 12) {
                    statusDot("API", M.isAIConnected ? .healthy : .error)
                    statusDot("AI", mvp.isCentralIntelligenceActive ? .healthy : .warning)
                    statusDot("Voice", M.micActive ? .healthy : .inactive)
                }

                Spacer()

                // Version Info
                HStack(spacing: 8) {
                    Text("v1.4.1")
                        .font(.caption)
                        .foregroundStyle(Color.tx2)

                    Button(action: { withAnimation(.easeInOut(duration: 0.3)) { isFooterExpanded.toggle() } }) {
                        Image(systemName: isFooterExpanded ? "chevron.up" : "chevron.down")
                            .font(.caption2)
                            .foregroundStyle(Color.tx2)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 8)

            // Expanded Details
            if isFooterExpanded {
                Divider()
                    .overlay(Color.hair)

                VStack(alignment: .leading, spacing: 12) {
                    // System Details
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("System Details")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundStyle(Color.tx1)

                            HStack(spacing: 16) {
                                Text("Build: 2025.10.06")
                                    .font(.caption2)
                                    .foregroundStyle(Color.tx2)
                                Text("Platform: macOS")
                                    .font(.caption2)
                                    .foregroundStyle(Color.tx2)
                                Text("Swift: 5.9")
                                    .font(.caption2)
                                    .foregroundStyle(Color.tx2)
                            }
                        }

                        Spacer()

                        // MVP Status
                        VStack(alignment: .leading, spacing: 4) {
                            Text("MVP Status")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundStyle(Color.tx1)

                            Text("Mode: \(mvp.currentActivationLevel.rawValue)")
                                .font(.caption2)
                                .foregroundStyle(Color.tx2)
                            Text("CI: \(mvp.isCentralIntelligenceActive ? "Active" : "Inactive")")
                                .font(.caption2)
                                .foregroundStyle(Color.tx2)
                        }
                    }

                    // Legal Information
                    HStack {
                        Text("© 2025 LocalBrain. Built with Orchestra.blue SCF scaffold.")
                            .font(.caption2)
                            .foregroundStyle(Color.tx2)

                        Spacer()

                        HStack(spacing: 12) {
                            Button("Documentation") {
                                // Open docs
                            }
                            .font(.caption2)
                            .foregroundStyle(Color.acc)
                            .buttonStyle(.plain)

                            Button("Support") {
                                // Open support
                            }
                            .font(.caption2)
                            .foregroundStyle(Color.acc)
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
            }
        }
        .background(Color.bg2)
        .overlay(
            Rectangle()
                .stroke(Color.hair, lineWidth: 1)
        )
    }

    private func statusDot(_ label: String, _ status: HealthStatus) -> some View {
        HStack(spacing: 4) {
            Circle()
                .fill(status.color)
                .frame(width: 6, height: 6)

            Text(label)
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
    }

    // MARK: - Helper Properties
    private var canSend: Bool {
        !currentInputBuffer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !M.isStreaming
    }

    private var themeIcon: String {
        switch themeMode {
        case .auto: return "circle.lefthalf.filled"
        case .light: return "sun.max.fill"
        case .dark: return "moon.fill"
        }
    }

    // MARK: - Helper Methods
    private func setupOrchestraMVP() {
        // Initialize with proper context sync
        M.syncContextFiles()

        // Set default activation level
        mvp.activateCoreMVP()

        // Initialize theme
        initializeTheme()
    }

    private func initializeTheme() {
        // Auto-detect system preference
        if #available(macOS 12.0, *) {
            themeMode = .auto
        }
    }

    private func toggleTheme() {
        switch themeMode {
        case .auto:
            themeMode = .light
        case .light:
            themeMode = .dark
        case .dark:
            themeMode = .auto
        }
        // Apply theme changes
    }

    private func sendMessage() {
        let message = currentInputBuffer.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !message.isEmpty && !M.isStreaming else { return }

        // Use Central Intelligence if active
        if mvp.isCentralIntelligenceActive {
            sendWithCentralIntelligence(message)
        } else {
            // Use regular chat
            M.inputText = message
            M.send()
        }

        currentInputBuffer = ""
        isInputFocused = true
    }

    private func sendWithCentralIntelligence(_ message: String) {
        // TODO: Connect CentralIntelligence when infrastructure is integrated
        print("🚧 CI send not implemented yet - using AppModel.send() instead")
        M.inputText = message
        M.send()
    }

    private func analyzeMessageWithCentralIntelligence(_ message: Message) {
        // TODO: Connect CentralIntelligence analysis when infrastructure is integrated
        print("🚧 CI analysis not implemented yet - message: \(message.text)")
    }

    private func copyToClipboard(_ text: String) {
        #if os(macOS)
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(text, forType: .string)
        #endif
    }

    private func deleteMessage(_ message: Message) {
        M.messages.removeAll { $0.id == message.id }
    }

    // MARK: - Context Canvas
    private var contextCanvas: some View {
        VStack {
            if M.contextPool.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "folder.badge.plus")
                        .font(.system(size: 48))
                        .foregroundColor(Color.tx3)

                    Text("No Context Items")
                        .font(.headline)
                        .foregroundColor(Color.tx1)

                    Text("Add files or documents to enhance AI responses")
                        .font(.subheadline)
                        .foregroundColor(Color.tx2)
                        .multilineTextAlignment(.center)

                    Button("Add Context") {
                        M.selectFileForContext()
                    }
                    .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List(M.contextPool, id: \.id) { item in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(item.title)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color.tx1)

                        Text(item.content)
                            .font(.system(size: 11))
                            .foregroundColor(Color.tx2)
                            .lineLimit(2)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
    }

    // MARK: - Voice Canvas
    private var voiceCanvas: some View {
        VStack(spacing: 24) {
            Spacer()

            VoiceOrb(
                scale: M.micActive ? 1.2 : 1.0,
                glow: M.micActive ? 1.0 : 0.3,
                active: M.micActive,
                onTap: { M.toggleMic() }
            )
            .frame(width: 120, height: 120)

            Text(M.micActive ? "Listening..." : "Tap to start recording")
                .font(.title3)
                .foregroundColor(Color.tx1)

            if M.micActive {
                Text("Voice recognition active")
                    .font(.caption)
                    .foregroundColor(Color.tx2)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Metrics Canvas
    private var metricsCanvas: some View {
        VStack(spacing: 20) {
            Text("Usage Metrics")
                .font(.title)
                .foregroundColor(Color.tx1)

            Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 16) {
                GridRow {
                    metricCard("Messages", "\(M.messages.count)")
                    metricCard("Tokens", M.tokenUsage)
                }

                GridRow {
                    metricCard("Context Items", "\(M.contextPool.count)")
                    metricCard("Status", M.isAIConnected ? "Connected" : "Disconnected")
                }
            }
            .padding()

            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func metricCard(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(Color.tx2)

            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color.tx1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color.bg2)
        .cornerRadius(12)
    }
}

// MARK: - Supporting Types
enum ThemeMode: String, CaseIterable {
    case auto = "auto"
    case light = "light"
    case dark = "dark"

    var description: String {
        switch self {
        case .auto: return "Auto"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }
}

// MARK: - OKLCH Theme System (Simplified)
struct OKLCHTheme {
    static let current = OKLCHTheme()

    // These would be OKLCH values in production
    let primary = Color.blue
    let surface = Color.bg2
    let surfaceVariant = Color.bg3
    let onSurface = Color.tx1
    let onSurfaceVariant = Color.tx2
    let success = Color.green
    let warning = Color.orange
    let error = Color.red
}

// MARK: - Preview
#Preview {
    OrchestraMVPView()
        .environmentObject(AppModel())
        .frame(width: 1200, height: 800)
}