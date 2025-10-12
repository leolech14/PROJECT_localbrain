//
//  WorkflowInputSheet.swift
//  LocalBrain
//
//  Purpose: Sheet for collecting workflow input before execution
//  Created: 2025-10-06 (Workflow Architecture Day!)
//

import SwiftUI

struct WorkflowInputSheet: View {
    let workflow: WorkflowTemplate?
    @Binding var input: String
    let onExecute: () -> Void
    @Environment(\.dismiss) private var dismiss

    @State private var selectedFile: URL?
    @State private var showingFilePicker = false

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 24) {
                // Workflow Info
                if let workflow = workflow {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: workflow.iconName)
                                .foregroundColor(.accentColor)
                                .font(.title2)

                            Text(workflow.name)
                                .font(.headline)
                        }

                        Text(workflow.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding()
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(8)
                }

                // Input Section
                VStack(alignment: .leading, spacing: 16) {
                    Text("Input Required")
                        .font(.headline)

                    if let workflow = workflow {
                        switch workflow.inputSchema.type {
                        case .text:
                            Text(workflow.inputSchema.description)
                                .font(.subheadline)
                                .foregroundColor(.secondary)

                            TextEditor(text: $input)
                                .frame(minHeight: 100)
                                .padding(8)
                                .background(Color.secondary.opacity(0.1))
                                .cornerRadius(8)

                        case .url:
                            TextField("Enter URL", text: $input)
                                .textFieldStyle(RoundedBorderTextFieldStyle())

                        case .file:
                            VStack(alignment: .leading, spacing: 8) {
                                Text(workflow.inputSchema.description)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)

                                Button("Select File") {
                                    showingFilePicker = true
                                }
                                .buttonStyle(.bordered)

                                if let file = selectedFile {
                                    HStack {
                                        Image(systemName: "doc")
                                        Text(file.lastPathComponent)
                                        Spacer()
                                        Button("Remove") {
                                            selectedFile = nil
                                            input = ""
                                        }
                                        .buttonStyle(.bordered)
                                    }
                                    .padding()
                                    .background(Color.secondary.opacity(0.1))
                                    .cornerRadius(8)
                                }
                            }

                        case .directory:
                            VStack(alignment: .leading, spacing: 8) {
                                Text(workflow.inputSchema.description)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)

                                TextField("Enter directory path", text: $input)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                            }

                        case .json:
                            VStack(alignment: .leading, spacing: 8) {
                                Text(workflow.inputSchema.description)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)

                                TextEditor(text: $input)
                                    .frame(minHeight: 150)
                                    .font(.system(.body, design: .monospaced))
                                    .padding(8)
                                    .background(Color.secondary.opacity(0.1))
                                    .cornerRadius(8)

                                if !isValidJSON(input) {
                                    Text("Invalid JSON format")
                                        .font(.caption)
                                        .foregroundColor(.red)
                                }
                            }
                        }
                    }
                }

                // Validation Message
                if let workflow = workflow, !input.isEmpty {
                    if isValidInput(input, for: workflow) {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Input is valid")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.green.opacity(0.1))
                        .cornerRadius(6)
                    } else {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.orange)
                            Text("Input validation failed")
                                .font(.caption)
                                .foregroundColor(.orange)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.orange.opacity(0.1))
                        .cornerRadius(6)
                    }
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Workflow Input")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .primaryAction) {
                    Button("Execute") {
                        onExecute()
                        dismiss()
                    }
                    .disabled(!canExecute)
                    .buttonStyle(.borderedProminent)
                }
            }
        }
        .fileImporter(
            isPresented: $showingFilePicker,
            allowedContentTypes: [.data],
            allowsMultipleSelection: false
        ) { result in
            switch result {
            case .success(let urls):
                if let url = urls.first {
                    selectedFile = url
                    input = url.path
                }
            case .failure(let error):
                print("File selection failed: \(error)")
            }
        }
    }

    private var canExecute: Bool {
        guard let workflow = workflow, !input.isEmpty else { return false }
        return isValidInput(input, for: workflow)
    }

    private func isValidInput(_ input: String, for workflow: WorkflowTemplate) -> Bool {
        // Check validation pattern if provided
        if let pattern = workflow.inputSchema.validationPattern {
            let regex = try? NSRegularExpression(pattern: pattern)
            let range = NSRange(location: 0, length: input.utf16.count)
            return regex?.firstMatch(in: input, options: [], range: range) != nil
        }

        // Basic type validation
        switch workflow.inputSchema.type {
        case .url:
            return URL(string: input) != nil
        case .json:
            return isValidJSON(input)
        case .file:
            return FileManager.default.fileExists(atPath: input)
        case .directory:
            var isDirectory: ObjCBool = false
            return FileManager.default.fileExists(atPath: input, isDirectory: &isDirectory) && isDirectory.boolValue
        default:
            return true
        }
    }

    private func isValidJSON(_ string: String) -> Bool {
        guard let data = string.data(using: .utf8) else { return false }
        return (try? JSONSerialization.jsonObject(with: data)) != nil
    }
}

// MARK: - Execution View Components
struct WorkflowExecutionView: View {
    @ObservedObject var workflowSystem: WorkflowSystem
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                if !workflowSystem.activeExecutions.isEmpty {
                    ActiveExecutionsView(
                        executions: workflowSystem.activeExecutions,
                        onCancel: { executionId in
                            workflowSystem.cancelExecution(executionId)
                        }
                    )
                } else {
                    NoActiveExecutionsView()
                }

                Divider()

                // Execution History
                if !workflowSystem.executionHistory.isEmpty {
                    ExecutionHistoryView(executions: workflowSystem.executionHistory)
                }
            }
            .navigationTitle("Workflow Executions")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct ActiveExecutionsView: View {
    let executions: [WorkflowExecution]
    let onCancel: (UUID) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Active Executions")
                .font(.headline)
                .padding(.horizontal)

            LazyVStack(spacing: 12) {
                ForEach(executions) { execution in
                    ActiveExecutionRow(
                        execution: execution,
                        onCancel: { onCancel(execution.id) }
                    )
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical)
    }
}

struct ActiveExecutionRow: View {
    let execution: WorkflowExecution
    let onCancel: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Workflow #\(String(execution.id.uuidString.prefix(8)))")
                        .font(.subheadline)
                        .fontWeight(.medium)

                    Text("Started: \(execution.startTime.formatted(date: .omitted, time: .shortened))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Button("Cancel", action: onCancel)
                    .buttonStyle(.bordered)
                    .controlSize(.small)
            }

            // Progress Bar
            ProgressView(value: execution.progress)
                .progressViewStyle(LinearProgressViewStyle(tint: .accentColor))

            HStack {
                Text("Status: \(execution.status.rawValue.capitalized)")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Spacer()

                Text("\(Int(execution.progress * 100))%")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color.secondary.opacity(0.1))
        .cornerRadius(8)
    }
}

struct NoActiveExecutionsView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "play.circle")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            Text("No Active Executions")
                .font(.headline)

            Text("Execute a workflow to see its progress here.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}

struct ExecutionHistoryView: View {
    let executions: [WorkflowExecution]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Execution History")
                .font(.headline)
                .padding(.horizontal)

            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(executions.reversed()) { execution in
                        ExecutionHistoryRow(execution: execution)
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding(.vertical)
    }
}

struct ExecutionHistoryRow: View {
    let execution: WorkflowExecution

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Workflow #\(String(execution.id.uuidString.prefix(8)))")
                    .font(.subheadline)
                    .fontWeight(.medium)

                if let endTime = execution.endTime {
                    Text("Completed: \(endTime.formatted(date: .omitted, time: .shortened))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            HStack(spacing: 8) {
                Image(systemName: statusIcon)
                    .foregroundColor(statusColor)

                Text(execution.status.rawValue.capitalized)
                    .font(.caption)
                    .foregroundColor(statusColor)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color.secondary.opacity(0.05))
        .cornerRadius(6)
    }

    private var statusIcon: String {
        switch execution.status {
        case .completed:
            return "checkmark.circle.fill"
        case .failed:
            return "xmark.circle.fill"
        case .cancelled:
            return "stop.circle.fill"
        default:
            return "clock.circle"
        }
    }

    private var statusColor: Color {
        switch execution.status {
        case .completed:
            return .green
        case .failed:
            return .red
        case .cancelled:
            return .orange
        default:
            return .secondary
        }
    }
}

// MARK: - Supporting Sections
struct DependenciesSection: View {
    let dependencies: [WorkflowDependency]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Dependencies")
                .font(.headline)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(dependencies, id: \.name) { dependency in
                    HStack {
                        Image(systemName: dependencyTypeIcon(dependency.type))
                            .foregroundColor(.accentColor)
                            .frame(width: 20)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(dependency.name)
                                .font(.subheadline)
                                .fontWeight(.medium)

                            if let version = dependency.version {
                                Text("Version: \(version)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }

                        Spacer()
                    }
                    .padding(.vertical, 4)
                }
            }
            .padding()
            .background(Color.secondary.opacity(0.1))
            .cornerRadius(8)
        }
    }

    private func dependencyTypeIcon(_ type: WorkflowDependency.DependencyType) -> String {
        switch type {
        case .python:
            return "ant.fill"
        case .node:
            return "nodejs.fill"
        case .brew:
            return "mug.fill"
        case .binary:
            return "terminal.fill"
        case .system:
            return "gear"
        }
    }
}

struct InputSchemaSection: View {
    let schema: WorkflowInputSchema

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Input Required")
                .font(.headline)

            HStack {
                Image(systemName: inputTypeIcon(schema.type))
                    .foregroundColor(.accentColor)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Type: \(schema.type.rawValue.capitalized)")
                        .font(.subheadline)

                    Text(schema.description)
                        .font(.body)
                        .foregroundColor(.secondary)

                    if schema.required {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.orange)
                                .font(.caption)
                            Text("Required")
                                .font(.caption)
                                .foregroundColor(.orange)
                        }
                    }
                }

                Spacer()
            }
            .padding()
            .background(Color.secondary.opacity(0.1))
            .cornerRadius(8)
        }
    }

    private func inputTypeIcon(_ type: WorkflowInputSchema.InputType) -> String {
        switch type {
        case .text:
            return "text.alignleft"
        case .file:
            return "doc"
        case .url:
            return "link"
        case .directory:
            return "folder"
        case .json:
            return "doc.text"
        }
    }
}

struct OutputSchemaSection: View {
    let schema: WorkflowOutputSchema

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Output")
                .font(.headline)

            HStack {
                Image(systemName: "doc.badge.gearshape")
                    .foregroundColor(.accentColor)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Type: \(schema.type.rawValue.capitalized)")
                        .font(.subheadline)

                    Text(schema.description)
                        .font(.body)
                        .foregroundColor(.secondary)

                    if let extensions = schema.fileExtensions, !extensions.isEmpty {
                        Text("Files: \(extensions.joined(separator: ", "))")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()
            }
            .padding()
            .background(Color.secondary.opacity(0.1))
            .cornerRadius(8)
        }
    }
}

struct LLMStepsSection: View {
    let steps: [WorkflowLLMStep]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("AI Processing Steps")
                .font(.headline)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(steps, id: \.id) { step in
                    HStack {
                        Image(systemName: "brain.head.profile")
                            .foregroundColor(.purple)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(step.name)
                                .font(.subheadline)
                                .fontWeight(.medium)

                            Text("Model: \(step.model) (\(step.provider))")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Spacer()
                    }
                    .padding(.vertical, 4)
                }
            }
            .padding()
            .background(Color.purple.opacity(0.1))
            .cornerRadius(8)
        }
    }
}

struct TagsSection: View {
    let tags: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tags")
                .font(.headline)

            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: 80))
            ], spacing: 8) {
                ForEach(tags, id: \.self) { tag in
                    Text(tag)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.2))
                        .foregroundColor(.accentColor)
                        .cornerRadius(4)
                }
            }
        }
    }
}

// MARK: - Preview
struct WorkflowInputSheet_Previews: PreviewProvider {
    static var previews: some View {
        WorkflowInputSheet(
            workflow: nil,
            input: .constant(""),
            onExecute: {}
        )
    }
}