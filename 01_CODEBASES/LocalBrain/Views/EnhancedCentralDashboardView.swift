//
//  EnhancedCentralDashboardView.swift
//  LocalBrain
//
//  Purpose: Enhanced dashboard with 3x3 widget grid system inspired by localhost:3001
//  Created: 2025-10-07
//

import SwiftUI
import Combine

/// Enhanced central dashboard with 3x3 widget grid system
struct EnhancedCentralDashboardView: View {
    @EnvironmentObject private var appModel: AppModel
    @State private var selectedNavigationItem: NavigationItem = .chat
    @State private var sidebarWidth: CGFloat = 260
    @State private var isSidebarCollapsed = false
    @State private var widgetStates: [String: EnhancedWidgetState] = [:]
    @State private var systemMetrics: SystemMetrics = SystemMetrics()

    // Widget grid configuration
    private let gridColumns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 3)

    var body: some View {
        HStack(spacing: 0) {
            // Sidebar Navigation
            sidebarView
                .frame(width: isSidebarCollapsed ? 60 : sidebarWidth)
                .background(Color.bg2)
                .transition(.asymmetric(
                    insertion: .move(edge: .leading),
                    removal: .move(edge: .leading)
                ))

            // Main Content Area
            mainContentView
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(Color.bg1)
        .ignoresSafeArea(.container, edges: .bottom)
        .onAppear {
            setupWidgetStates()
            startMetricsMonitoring()
        }
    }

    // MARK: - Sidebar Navigation

    private var sidebarView: some View {
        VStack(spacing: 0) {
            // Header
            sidebarHeader

            // Navigation Items
            ScrollView {
                LazyVStack(spacing: 2) {
                    ForEach(NavigationItem.allCases, id: \.self) { item in
                        sidebarNavigationItem(item)
                    }
                }
                .padding(.vertical, 8)
            }

            // Footer with collapse toggle
            sidebarFooter
        }
        .overlay(
            Rectangle()
                .fill(Color.bg3.opacity(0.3))
                .frame(width: 1),
            alignment: .trailing
        )
    }

    private var sidebarHeader: some View {
        HStack {
            if !isSidebarCollapsed {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Image(systemName: "brain.head.profile.fill")
                            .foregroundColor(.accentColor)
                            .font(.title2)
                        Text("LocalBrain")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.tx1)
                    }
                    Text("Enhanced Intelligence")
                        .font(.caption)
                        .foregroundColor(.tx3)
                }
                Spacer()
            } else {
                Image(systemName: "brain.head.profile.fill")
                    .foregroundColor(.accentColor)
                    .font(.title2)
                    .frame(maxWidth: .infinity)
            }

            Button(action: { withAnimation(.easeInOut(duration: 0.3)) { isSidebarCollapsed.toggle() } }) {
                Image(systemName: isSidebarCollapsed ? "sidebar.right" : "sidebar.left")
                    .foregroundColor(.tx3)
                    .font(.caption)
            }
        }
        .padding(16)
        .background(Color.bg1)
    }

    private func sidebarNavigationItem(_ item: NavigationItem) -> some View {
        Button(action: {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedNavigationItem = item
            }
        }) {
            HStack(spacing: 12) {
                Image(systemName: item.icon)
                    .foregroundColor(selectedNavigationItem == item ? .accentColor : .tx3)
                    .font(.system(size: 14, weight: .medium))
                    .frame(width: isSidebarCollapsed ? nil : 20)

                if !isSidebarCollapsed {
                    Text(item.title)
                        .foregroundColor(selectedNavigationItem == item ? .tx1 : .tx3)
                        .font(.system(size: 13, weight: .medium))
                        .frame(maxWidth: .infinity, alignment: .leading)

                    if let badge = item.badge {
                        Text(badge)
                            .font(.caption2)
                            .foregroundColor(.bg1)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.accentColor)
                            .clipShape(Capsule())
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                selectedNavigationItem == item ? Color.bg3.opacity(0.5) : Color.clear,
                in: RoundedRectangle(cornerRadius: 6)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .frame(height: isSidebarCollapsed ? 44 : 36)
    }

    private var sidebarFooter: some View {
        VStack(spacing: 8) {
            Divider()
                .background(Color.bg3.opacity(0.3))

            if !isSidebarCollapsed {
                // Mini System Metrics
                VStack(spacing: 4) {
                    metricIndicator("CPU", systemMetrics.cpuUsage, "%")
                    metricIndicator("RAM", systemMetrics.ramUsage, "%")
                    metricIndicator("NET", systemMetrics.networkSpeed, "MB/s")
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
            }
        }
    }

    private func metricIndicator(_ label: String, _ value: String, _ unit: String) -> some View {
        HStack {
            Text(label)
                .font(.caption2)
                .foregroundColor(.tx3)
                .frame(width: 30, alignment: .leading)

            Text("\(value)\(unit)")
                .font(.caption2)
                .foregroundColor(.tx2)
                .frame(maxWidth: .infinity, alignment: .trailing)
        }
    }

    // MARK: - Main Content Area

    private var mainContentView: some View {
        VStack(spacing: 0) {
            // Header
            headerView

            // Widget Grid Content
            widgetGridContent

            // Footer with detailed metrics
            footerView
        }
    }

    private var headerView: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(selectedNavigationItem.title)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.tx1)

                Text(selectedNavigationItem.subtitle)
                    .font(.caption)
                    .foregroundColor(.tx3)
            }

            Spacer()

            // Search Bar
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.tx3)
                    .font(.caption)

                TextField("Search...", text: .constant(""))
                    .textFieldStyle(PlainTextFieldStyle())
                    .foregroundColor(.tx1)

                Button(action: {}) {
                    Image(systemName: "command")
                        .foregroundColor(.tx3)
                        .font(.caption2)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color.bg1)
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .frame(maxWidth: 240)

            // User Actions
            HStack(spacing: 8) {
                Button(action: {}) {
                    Image(systemName: "bell")
                        .foregroundColor(.tx3)
                }

                Button(action: {}) {
                    Image(systemName: "gear")
                        .foregroundColor(.tx3)
                }
            }
            .font(.system(size: 14))
        }
        .padding(16)
        .background(Color.bg1)
    }

    private var widgetGridContent: some View {
        ScrollView {
            LazyVGrid(columns: gridColumns, spacing: 12) {
                ForEach(DashboardWidgetType.allCases, id: \.self) { widgetType in
                    EnhancedWidgetView(
                        widgetType: widgetType,
                        state: widgetStates[widgetType.id] ?? EnhancedWidgetState(),
                        onUpdateState: { newState in
                            widgetStates[widgetType.id] = newState
                        }
                    )
                    .frame(height: 200)
                }
            }
            .padding(16)
        }
        .background(Color.bg1)
    }

    private var footerView: some View {
        HStack(spacing: 24) {
            // System Metrics Group
            HStack(spacing: 20) {
                metricGroup("CPU", systemMetrics.cpuUsage, "%", .blue)
                metricGroup("RAM", systemMetrics.ramUsage, "%", .green)
                metricGroup("GPU", systemMetrics.gpuUsage, "%", .purple)
                metricGroup("NET", systemMetrics.networkSpeed, "MB/s", .orange)
            }

            Spacer()

            // Status Indicators
            HStack(spacing: 16) {
                statusIndicator("AI", .healthy)
                statusIndicator("DB", .healthy)
                statusIndicator("API", .warning)
                statusIndicator("Cache", .healthy)
            }

            // Timestamp
            Text(systemMetrics.timestamp)
                .font(.caption)
                .foregroundColor(.tx3)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color.bg1)
    }

    private func metricGroup(_ label: String, _ value: String, _ unit: String, _ color: Color) -> some View {
        HStack(spacing: 6) {
            Circle()
                .fill(color)
                .frame(width: 6, height: 6)

            Text(label)
                .font(.caption)
                .foregroundColor(.tx3)

            Text("\(value)\(unit)")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)
        }
    }

    private func statusIndicator(_ label: String, _ status: DashboardSystemStatus) -> some View {
        HStack(spacing: 4) {
            Circle()
                .fill(status.color)
                .frame(width: 6, height: 6)

            Text(label)
                .font(.caption)
                .foregroundColor(.tx3)
        }
    }

    // MARK: - Helper Methods

    private func setupWidgetStates() {
        for widgetType in DashboardWidgetType.allCases {
            widgetStates[widgetType.id] = EnhancedWidgetState(
                isLoading: false,
                data: nil,
                error: nil,
                lastUpdated: Date()
            )
        }
    }

    private func startMetricsMonitoring() {
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            updateSystemMetrics()
        }
    }

    private func updateSystemMetrics() {
        // Mock system metrics - replace with real system monitoring
        systemMetrics = SystemMetrics(
            cpuUsage: String(format: "%.0f", Double.random(in: 10...80)),
            ramUsage: String(format: "%.0f", Double.random(in: 30...70)),
            gpuUsage: String(format: "%.0f", Double.random(in: 5...60)),
            networkSpeed: String(format: "%.1f", Double.random(in: 0.1...5.0)),
            timestamp: formatCurrentTime()
        )
    }

    private func formatCurrentTime() -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .medium
        return formatter.string(from: Date())
    }
}

// MARK: - Supporting Types

enum NavigationItem: CaseIterable {
    case chat, context, voice, metrics, browser, files, preview, ide

    var title: String {
        switch self {
        case .chat: return "Chat"
        case .context: return "Context"
        case .voice: return "Voice"
        case .metrics: return "Metrics"
        case .browser: return "Browser"
        case .files: return "Files"
        case .preview: return "Preview"
        case .ide: return "IDE"
        }
    }

    var subtitle: String {
        switch self {
        case .chat: return "AI-powered conversations"
        case .context: return "Knowledge management"
        case .voice: return "Speech interaction"
        case .metrics: return "System monitoring"
        case .browser: return "Web research"
        case .files: return "Document processing"
        case .preview: return "Content preview"
        case .ide: return "Development tools"
        }
    }

    var icon: String {
        switch self {
        case .chat: return "bubble.left.and.bubble.right"
        case .context: return "brain.head.profile"
        case .voice: return "mic.fill"
        case .metrics: return "chart.line.uptrend.xyaxis"
        case .browser: return "safari"
        case .files: return "doc.text.fill"
        case .preview: return "eye.fill"
        case .ide: return "terminal.fill"
        }
    }

    var badge: String? {
        switch self {
        case .chat: return "12"
        case .context: return "3"
        case .voice: return nil
        case .metrics: return nil
        case .browser: return nil
        case .files: return "7"
        case .preview: return nil
        case .ide: return nil
        }
    }
}

enum DashboardWidgetType: CaseIterable {
    case chat, context, voice, terminal, taskManager, browser, files, metrics, ai

    var id: String {
        switch self {
        case .chat: return "chat"
        case .context: return "context"
        case .voice: return "voice"
        case .terminal: return "terminal"
        case .taskManager: return "taskManager"
        case .browser: return "browser"
        case .files: return "files"
        case .metrics: return "metrics"
        case .ai: return "ai"
        }
    }

    var title: String {
        switch self {
        case .chat: return "Chat Interface"
        case .context: return "Context Pool"
        case .voice: return "Voice Control"
        case .terminal: return "Terminal"
        case .taskManager: return "Task Manager"
        case .browser: return "Browser"
        case .files: return "File Manager"
        case .metrics: return "System Metrics"
        case .ai: return "AI Status"
        }
    }

    var icon: String {
        switch self {
        case .chat: return "bubble.left.and.bubble.right.fill"
        case .context: return "brain.head.profile.fill"
        case .voice: return "mic.fill"
        case .terminal: return "terminal.fill"
        case .taskManager: return "list.bullet.clipboard.fill"
        case .browser: return "safari.fill"
        case .files: return "doc.text.fill"
        case .metrics: return "chart.line.uptrend.xyaxis.fill"
        case .ai: return "cpu.fill"
        }
    }
}

struct EnhancedWidgetState {
    var isLoading: Bool = false
    var data: Any?
    var error: String?
    var lastUpdated: Date = Date()
}

struct SystemMetrics {
    var cpuUsage: String = "0"
    var ramUsage: String = "0"
    var gpuUsage: String = "0"
    var networkSpeed: String = "0.0"
    var timestamp: String = ""
}

enum DashboardSystemStatus {
    case healthy, warning, error

    var color: Color {
        switch self {
        case .healthy: return .green
        case .warning: return .orange
        case .error: return .red
        }
    }
}

// MARK: - Enhanced Widget View

struct EnhancedWidgetView: View {
    let widgetType: DashboardWidgetType
    let state: EnhancedWidgetState
    let onUpdateState: (EnhancedWidgetState) -> Void

    var body: some View {
        VStack(spacing: 0) {
            // Widget Header
            widgetHeader

            // Widget Content
            widgetContent

            Spacer()
        }
        .padding(12)
        .background(Color.bg1)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.bg3.opacity(0.3), lineWidth: 1)
        )
    }

    private var widgetHeader: some View {
        HStack {
            Image(systemName: widgetType.icon)
                .foregroundColor(.accentColor)
                .font(.system(size: 12, weight: .medium))

            Text(widgetType.title)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            Spacer()

            if state.isLoading {
                ProgressView()
                    .scaleEffect(0.7)
            } else {
                Button(action: {}) {
                    Image(systemName: "ellipsis")
                        .foregroundColor(.tx3)
                        .font(.caption)
                }
            }
        }
        .padding(.bottom, 8)
    }

    private var widgetContent: some View {
        Group {
            switch widgetType {
            case .chat:
                ChatWidgetContent()
            case .context:
                ContextWidgetContent()
            case .voice:
                VoiceWidgetContent()
            case .terminal:
                TerminalWidgetView()
            case .taskManager:
                TaskManagerWidgetView()
            case .browser:
                BrowserWidgetContent()
            case .files:
                FilesWidgetContent()
            case .metrics:
                MetricsWidgetContent()
            case .ai:
                AIStatusWidgetContent()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Widget Content Views

struct ChatWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Circle().fill(Color.green).frame(width: 6, height: 6)
                Text("Claude")
                    .font(.caption2)
                    .foregroundColor(.tx2)
                Spacer()
                Text("Active")
                    .font(.caption2)
                    .foregroundColor(.green)
            }

            Text("How can I help with your project today?")
                .font(.caption)
                .foregroundColor(.tx1)
                .lineLimit(2)
                .padding(.top, 4)
        }
    }
}

struct ContextWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Context Pool")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            Text("15 documents loaded")
                .font(.caption2)
                .foregroundColor(.tx2)

            ProgressView(value: 0.75)
                .progressViewStyle(LinearProgressViewStyle(tint: .accentColor))
                .padding(.top, 4)
        }
    }
}

struct VoiceWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Voice Control")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            HStack {
                Circle()
                    .fill(Color.red)
                    .frame(width: 8, height: 8)
                    .scaleEffect(1.2)
                Text("Listening...")
                    .font(.caption)
                    .foregroundColor(.red)
            }
            .padding(.top, 8)
        }
    }
}

// TerminalWidgetContent moved to WidgetGridView.swift to avoid redeclaration

struct TaskManagerWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Active Tasks")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            TaskItemWidget(title: "Code Analysis", status: .running)
            TaskItemWidget(title: "Document Processing", status: .completed)
            TaskItemWidget(title: "API Sync", status: .pending)
        }
    }
}

struct TaskItemWidget: View {
    let title: String
    let status: TaskStatus

    var body: some View {
        HStack {
            Circle()
                .fill(status.color)
                .frame(width: 6, height: 6)

            Text(title)
                .font(.caption2)
                .foregroundColor(.tx2)

            Spacer()

            Text(status.text)
                .font(.caption2)
                .foregroundColor(status.color)
        }
    }

    enum TaskStatus {
        case running, completed, pending

        var color: Color {
            switch self {
            case .running: return .blue
            case .completed: return .green
            case .pending: return .orange
            }
        }

        var text: String {
            switch self {
            case .running: return "45%"
            case .completed: return "Done"
            case .pending: return "Queue"
            }
        }
    }
}

struct BrowserWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Browser Research")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            Text("• Swift documentation")
                .font(.caption2)
                .foregroundColor(.tx2)

            Text("• AI API references")
                .font(.caption2)
                .foregroundColor(.tx2)

            Text("• SwiftUI tutorials")
                .font(.caption2)
                .foregroundColor(.tx2)
        }
    }
}

struct FilesWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Recent Files")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            HStack {
                Image(systemName: "doc.text.fill")
                    .foregroundColor(.blue)
                    .font(.caption)
                Text("ContextManager.swift")
                    .font(.caption2)
                    .foregroundColor(.tx2)
            }

            HStack {
                Image(systemName: "doc.fill")
                    .foregroundColor(.orange)
                    .font(.caption)
                Text("API_Documentation.pdf")
                    .font(.caption2)
                    .foregroundColor(.tx2)
            }
        }
    }
}

struct MetricsWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("System Health")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            HStack {
                Text("CPU")
                    .font(.caption2)
                    .foregroundColor(.tx3)
                Spacer()
                Text("23%")
                    .font(.caption2)
                    .foregroundColor(.tx1)
            }

            HStack {
                Text("Memory")
                    .font(.caption2)
                    .foregroundColor(.tx3)
                Spacer()
                Text("4.2 GB")
                    .font(.caption2)
                    .foregroundColor(.tx1)
            }

            HStack {
                Text("Network")
                    .font(.caption2)
                    .foregroundColor(.tx3)
                Spacer()
                Text("1.2 MB/s")
                    .font(.caption2)
                    .foregroundColor(.tx1)
            }
        }
    }
}

struct AIStatusWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("AI Providers")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            AIProviderStatus(name: "Claude", status: .healthy)
            AIProviderStatus(name: "OpenAI", status: .healthy)
            AIProviderStatus(name: "Gemini", status: .warning)
        }
    }
}

struct AIProviderStatus: View {
    let name: String
    let status: HealthStatus

    var body: some View {
        HStack {
            Circle()
                .fill(status.color)
                .frame(width: 6, height: 6)

            Text(name)
                .font(.caption2)
                .foregroundColor(.tx2)

            Spacer()

            Text(status == .healthy ? "Online" : "Slow")
                .font(.caption2)
                .foregroundColor(status.color)
        }
    }
}

// MARK: - Preview

#Preview {
    EnhancedCentralDashboardView()
        .environmentObject(AppModel())
        .preferredColorScheme(.dark)
        .frame(width: 1200, height: 800)
}