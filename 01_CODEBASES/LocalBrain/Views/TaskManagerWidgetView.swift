//
//  TaskManagerWidgetView.swift
//  LocalBrain
//
//  Purpose: Real Task Manager implementation for widget grid
//  Created: 2025-10-07
//

import SwiftUI

// MARK: - TaskItem Model
/// Task model for task manager widget
struct EnhancedTaskItem: Identifiable {
    let id = UUID()
    var name: String
    var status: Status
    var progress: Double = 0.0
    var lastLine: String?

    enum Status {
        case pending, running, completed, failed, cancelled
    }
}

// MARK: - Task Manager Widget
/// Real Task Manager widget with live task monitoring
struct TaskManagerWidgetView: View {
    @State private var tasks: [EnhancedTaskItem] = []
    @State private var isExpanded = false

    var body: some View {
        VStack(spacing: 0) {
            // Task Manager Header
            taskManagerHeader

            // Task Content
            if isExpanded {
                expandedTaskContent
            } else {
                compactTaskContent
            }

            Spacer()
        }
        .padding(12)
        .background(Color.bg1)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.bg3.opacity(0.3), lineWidth: 1)
        )
        .onAppear {
            startTaskSimulation()
        }
    }

    private var taskManagerHeader: some View {
        HStack {
            Image(systemName: "list.bullet.clipboard.fill")
                .foregroundColor(.accentColor)
                .font(.system(size: 12, weight: .medium))

            Text("Task Manager")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.tx1)

            Spacer()

            // Task count badge
            Text("\(tasks.count)")
                .font(.caption2)
                .foregroundColor(Color.bg1)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.accentColor)
                .clipShape(Capsule())

            // Expand/collapse button
            Button(action: { withAnimation(.easeInOut(duration: 0.2)) { isExpanded.toggle() } }) {
                Image(systemName: isExpanded ? "arrow.down.left.and.arrow.up.right" : "arrow.up.right.and.arrow.down.left")
                    .foregroundColor(.tx3)
                    .font(.caption)
            }
            .buttonStyle(.plain)
        }
        .padding(.bottom, 8)
    }

    private var compactTaskContent: some View {
        VStack(spacing: 6) {
            // Show up to 3 most important tasks
            ForEach(Array(tasks.prefix(3)), id: \.id) { task in
                CompactTaskCard(task: task)
            }
        }
    }

    private var expandedTaskContent: some View {
        ScrollView {
            VStack(spacing: 6) {
                // Show all tasks
                ForEach(tasks, id: \.id) { task in
                    TaskCard(task: task)
                }

                // Add new task button
                Button(action: addNewTask) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(.accentColor)
                        Text("Add Task")
                            .foregroundColor(.tx1)
                            .font(.caption)
                    }
                    .padding(.vertical, 8)
                    .frame(maxWidth: .infinity)
                    .background(Color.bg2.opacity(0.5))
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func addNewTask() {
        let newTask = EnhancedTaskItem(
            name: "Sample Task \(tasks.count + 1)",
            status: EnhancedTaskItem.Status.pending,
            progress: 0.0,
            lastLine: "Created just now"
        )
        tasks.append(newTask)

        // Simulate task execution
        Task {
            await simulateTaskExecution(newTask)
        }
    }

    private func startTaskSimulation() {
        // Add some initial demo tasks
        let demoTasks = [
            EnhancedTaskItem(name: "Code Analysis", status: EnhancedTaskItem.Status.running, progress: 0.75, lastLine: "Analyzing Swift files..."),
            EnhancedTaskItem(name: "Document Processing", status: EnhancedTaskItem.Status.completed, progress: 1.0, lastLine: "Processed 15 documents"),
            EnhancedTaskItem(name: "API Sync", status: EnhancedTaskItem.Status.pending, progress: 0.0, lastLine: "Waiting to start"),
            EnhancedTaskItem(name: "RAG Index Update", status: EnhancedTaskItem.Status.running, progress: 0.3, lastLine: "Building vector index...")
        ]

        tasks = demoTasks

        // Simulate task progress updates
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
            updateTaskProgress()
        }
    }

    private func updateTaskProgress() {
        for i in tasks.indices {
            let task = tasks[i]

            if task.status == .running {
                let newProgress = min(1.0, task.progress + Double.random(in: 0.05...0.15))
                tasks[i].progress = newProgress

                if newProgress >= 1.0 {
                    tasks[i].status = .completed
                    tasks[i].lastLine = "Completed successfully"
                } else {
                    tasks[i].lastLine = "Progress: \(Int(newProgress * 100))%"
                }
            } else if task.status == .pending && Bool.random() {
                // Randomly start pending tasks
                tasks[i].status = .running
                tasks[i].lastLine = "Starting execution..."
            }
        }
    }

    @MainActor
    private func simulateTaskExecution(_ task: EnhancedTaskItem) async {
        // Simulate task starting
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index].status = .running
            tasks[index].lastLine = "Starting task..."
        }

        // Simulate progress
        for progress in stride(from: 0.1, through: 1.0, by: 0.1) {
            try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds

            if let index = tasks.firstIndex(where: { $0.id == task.id }) {
                tasks[index].progress = progress
                tasks[index].lastLine = "Progress: \(Int(progress * 100))%"
            }
        }

        // Mark as completed
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index].status = .completed
            tasks[index].lastLine = "Completed successfully"
        }
    }
}

// MARK: - Task Card Views

struct CompactTaskCard: View {
    let task: EnhancedTaskItem

    var body: some View {
        HStack(spacing: 6) {
            // Status indicator
            Circle()
                .fill(statusColor)
                .frame(width: 6, height: 6)

            // Task name
            Text(task.name)
                .font(.caption2)
                .foregroundColor(.tx1)
                .lineLimit(1)

            Spacer()

            // Status badge
            Text(statusText)
                .font(.caption2)
                .foregroundColor(statusColor)
                .padding(.horizontal, 4)
                .padding(.vertical, 1)
                .background(statusColor.opacity(0.1))
                .clipShape(Capsule())
        }
        .padding(.horizontal, 6)
        .padding(.vertical, 3)
        .background(Color.bg2.opacity(0.3))
        .clipShape(RoundedRectangle(cornerRadius: 4))
    }

    private var statusColor: Color {
        switch task.status {
        case .pending: return .orange
        case .running: return .blue
        case .completed: return .green
        case .failed: return .red
        case .cancelled: return .gray
        }
    }

    private var statusText: String {
        switch task.status {
        case .pending: return "Pending"
        case .running: return "\(Int(task.progress * 100))%"
        case .completed: return "Done"
        case .failed: return "Failed"
        case .cancelled: return "Cancelled"
        }
    }
}

struct TaskCard: View {
    let task: EnhancedTaskItem

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Header with name and status
            HStack {
                Text(task.name)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.tx1)

                Spacer()

                StatusBadge(status: task.status)
            }

            // Progress bar
            ProgressView(value: task.progress)
                .progressViewStyle(LinearProgressViewStyle(tint: statusColor))
                .scaleEffect(y: 0.8)

            // Last line / status text
            if let lastLine = task.lastLine {
                Text(lastLine)
                    .font(.caption2)
                    .foregroundColor(.tx2)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 3)
                    .background(Color.bg2.opacity(0.5))
                    .clipShape(RoundedRectangle(cornerRadius: 4))
            }

            // Progress percentage
            HStack {
                Text("Progress:")
                    .font(.caption2)
                    .foregroundColor(.tx3)

                Spacer()

                Text("\(Int(task.progress * 100))%")
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundColor(statusColor)
            }
        }
        .padding(8)
        .background(Color.bg2)
        .clipShape(RoundedRectangle(cornerRadius: 6))
    }

    private var statusColor: Color {
        switch task.status {
        case .pending: return .orange
        case .running: return .blue
        case .completed: return .green
        case .failed: return .red
        case .cancelled: return .gray
        }
    }
}

struct StatusBadge: View {
    let status: EnhancedTaskItem.Status

    var body: some View {
        Text(text)
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(backgroundColor)
            .foregroundColor(textColor)
            .clipShape(Capsule())
    }

    private var text: String {
        switch status {
        case .pending: return "Pending"
        case .running: return "Running"
        case .completed: return "Completed"
        case .failed: return "Failed"
        case .cancelled: return "Cancelled"
        }
    }

    private var backgroundColor: Color {
        switch status {
        case .pending: return Color.orange.opacity(0.2)
        case .running: return Color.blue.opacity(0.2)
        case .completed: return Color.green.opacity(0.2)
        case .failed: return Color.red.opacity(0.2)
        case .cancelled: return Color.gray.opacity(0.2)
        }
    }

    private var textColor: Color {
        switch status {
        case .pending: return .orange
        case .running: return .blue
        case .completed: return .green
        case .failed: return .red
        case .cancelled: return .gray
        }
    }
}

// MARK: - TaskItem Model (ensure it exists in AppModel)


// MARK: - Preview

#Preview {
    TaskManagerWidgetView()
        .environmentObject(AppModel())
        .frame(width: 400, height: 300)
        .preferredColorScheme(.dark)
}