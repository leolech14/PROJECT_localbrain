//
//  WorkflowGalleryView.swift
//  LocalBrain
//
//  Purpose: UI for browsing and executing available workflows
//  Created: 2025-10-06 (Workflow Architecture Day!)
//

import SwiftUI
import UniformTypeIdentifiers

struct WorkflowGalleryView: View {
    @StateObject private var workflowSystem = WorkflowSystem()
    @State private var selectedWorkflow: WorkflowTemplate?
    @State private var showingExecutionSheet = false
    @State private var showingInputSheet = false
    @State private var workflowInput = ""
    @State private var searchText = ""
    @State private var selectedCategory: WorkflowCategory? = nil

    var body: some View {
        NavigationSplitView {
            // Workflow List Sidebar
            WorkflowListSidebar(
                workflows: filteredWorkflows,
                selectedWorkflow: $selectedWorkflow,
                searchText: $searchText,
                selectedCategory: $selectedCategory
            )
        } detail: {
            // Workflow Detail View
            if let workflow = selectedWorkflow {
                WorkflowDetailView(
                    workflow: workflow,
                    onExecute: {
                        workflowInput = ""
                        showingInputSheet = true
                    }
                )
            } else {
                WorkflowSelectionPlaceholder()
            }
        }
        .sheet(isPresented: $showingInputSheet) {
            WorkflowInputSheet(
                workflow: selectedWorkflow,
                input: $workflowInput,
                onExecute: executeWorkflow
            )
        }
        .sheet(isPresented: $showingExecutionSheet) {
            WorkflowExecutionView(workflowSystem: workflowSystem)
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showingExecutionSheet = true
                } label: {
                    Label("Active Executions", systemImage: "play.circle.fill")
                        .badge(workflowSystem.activeExecutions.count)
                }
            }
        }
        .onAppear {
            workflowSystem.loadWorkflowTemplates()
        }
    }

    private var filteredWorkflows: [WorkflowTemplate] {
        var workflows = workflowSystem.availableWorkflows

        // Filter by category
        if let category = selectedCategory {
            workflows = workflows.filter { $0.category == category }
        }

        // Filter by search text
        if !searchText.isEmpty {
            workflows = workflows.filter { workflow in
                workflow.name.localizedCaseInsensitiveContains(searchText) ||
                workflow.description.localizedCaseInsensitiveContains(searchText) ||
                workflow.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }

        return workflows.sorted { $0.name < $1.name }
    }

    private func executeWorkflow() {
        guard let workflow = selectedWorkflow else { return }

        Task {
            do {
                let input = WorkflowInput(
                    value: workflowInput,
                    type: workflow.inputSchema.type.rawValue,
                    metadata: ["source": "localbrain_ui"]
                )

                let output = try await workflowSystem.executeWorkflow(workflow, input: input)

                await MainActor.run {
                    print("✅ Workflow completed successfully!")
                    print("📁 Output files: \(output.files)")
                    showingInputSheet = false
                }

            } catch {
                await MainActor.run {
                    print("❌ Workflow execution failed: \(error)")
                }
            }
        }
    }
}

// MARK: - Workflow List Sidebar
struct WorkflowListSidebar: View {
    let workflows: [WorkflowTemplate]
    @Binding var selectedWorkflow: WorkflowTemplate?
    @Binding var searchText: String
    @Binding var selectedCategory: WorkflowCategory?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Search Bar
            SearchBar(text: $searchText, placeholder: "Search workflows...")

            // Category Filter
            CategoryFilter(
                selectedCategory: $selectedCategory
            )

            Divider()

            // Workflow List
            List(workflows, id: \.id, selection: $selectedWorkflow) { workflow in
                WorkflowRowView(workflow: workflow)
            }
            .listStyle(SidebarListStyle())
        }
        .navigationTitle("Workflows")
    }
}

// MARK: - Workflow Row View
struct WorkflowRowView: View {
    let workflow: WorkflowTemplate

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Image(systemName: workflow.iconName)
                    .foregroundColor(.accentColor)
                    .frame(width: 20)

                VStack(alignment: .leading, spacing: 2) {
                    Text(workflow.name)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text(workflow.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(workflow.category.displayName)
                        .font(.caption2)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(workflow.category.color.opacity(0.2))
                        .foregroundColor(workflow.category.color)
                        .cornerRadius(4)

                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .font(.caption2)
                        Text(workflow.estimatedDuration.formattedDuration())
                            .font(.caption2)
                    }
                    .foregroundColor(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Workflow Detail View
struct WorkflowDetailView: View {
    let workflow: WorkflowTemplate
    let onExecute: () -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header
                WorkflowHeader(workflow: workflow, onExecute: onExecute)

                // Description
                VStack(alignment: .leading, spacing: 8) {
                    Text("Description")
                        .font(.headline)
                    Text(workflow.description)
                        .font(.body)
                        .foregroundColor(.secondary)
                }

                // Dependencies
                if !workflow.dependencies.isEmpty {
                    DependenciesSection(dependencies: workflow.dependencies)
                }

                // Input Schema
                InputSchemaSection(schema: workflow.inputSchema)

                // Output Schema
                OutputSchemaSection(schema: workflow.outputSchema)

                // LLM Steps
                if let llmSteps = workflow.llmSteps, !llmSteps.isEmpty {
                    LLMStepsSection(steps: llmSteps)
                }

                // Tags
                if !workflow.tags.isEmpty {
                    TagsSection(tags: workflow.tags)
                }
            }
            .padding()
        }
        .navigationTitle(workflow.name)
    }
}

// MARK: - Workflow Header
struct WorkflowHeader: View {
    let workflow: WorkflowTemplate
    let onExecute: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: workflow.iconName)
                    .font(.system(size: 40))
                    .foregroundColor(.accentColor)

                VStack(alignment: .leading, spacing: 8) {
                    Text(workflow.name)
                        .font(.title2)
                        .fontWeight(.bold)

                    HStack(spacing: 16) {
                        Label(workflow.version, systemImage: "tag")
                        Label(workflow.author, systemImage: "person.crop.circle")
                        Label(workflow.estimatedDuration.formattedDuration(), systemImage: "clock")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }

                Spacer()

                Button(action: onExecute) {
                    Label("Execute", systemImage: "play.circle.fill")
                        .font(.headline)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
            }

            // Category Badge
            HStack {
                Image(systemName: workflow.category.iconName)
                Text(workflow.category.displayName)
            }
            .font(.subheadline)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(workflow.category.color.opacity(0.2))
            .foregroundColor(workflow.category.color)
            .cornerRadius(8)
        }
        .padding()
        .background(Color.secondary.opacity(0.1))
        .cornerRadius(12)
    }
}

// MARK: - Supporting Views
struct SearchBar: View {
    @Binding var text: String
    let placeholder: String

    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)

            TextField(placeholder, text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
        .padding()
    }
}

struct CategoryFilter: View {
    @Binding var selectedCategory: WorkflowCategory?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                CategoryChip(
                    title: "All",
                    isSelected: selectedCategory == nil
                ) {
                    selectedCategory = nil
                }

                ForEach(WorkflowCategory.allCases, id: \.self) { category in
                    CategoryChip(
                        title: category.displayName,
                        isSelected: selectedCategory == category
                    ) {
                        selectedCategory = category
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct CategoryChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct WorkflowSelectionPlaceholder: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "gearshape.2")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            Text("Select a Workflow")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Choose a workflow from the sidebar to view details and execute it.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Workflow Extensions
extension WorkflowTemplate {
    var iconName: String {
        switch category {
        case .media:
            return "photo.and.video"
        case .document:
            return "doc.text"
        case .data:
            return "chart.bar.doc.horizontal"
        case .ai:
            return "brain.head.profile"
        case .system:
            return "gear"
        case .development:
            return "hammer"
        }
    }
}

extension WorkflowCategory {
    var displayName: String {
        rawValue.capitalized
    }

    var iconName: String {
        switch self {
        case .media:
            return "photo.and.video"
        case .document:
            return "doc.text"
        case .data:
            return "chart.bar.doc.horizontal"
        case .ai:
            return "brain.head.profile"
        case .system:
            return "gear"
        case .development:
            return "hammer"
        }
    }

    var color: Color {
        switch self {
        case .media:
            return .blue
        case .document:
            return .green
        case .data:
            return .orange
        case .ai:
            return .purple
        case .system:
            return .gray
        case .development:
            return .red
        }
    }
}

extension TimeInterval {
    func formattedDuration() -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute, .second]
        formatter.unitsStyle = .abbreviated
        return formatter.string(from: self) ?? "0s"
    }
}

// MARK: - Preview
struct WorkflowGalleryView_Previews: PreviewProvider {
    static var previews: some View {
        WorkflowGalleryView()
    }
}