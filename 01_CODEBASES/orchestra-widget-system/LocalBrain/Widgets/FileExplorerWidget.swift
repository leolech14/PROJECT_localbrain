//
//  FileExplorerWidget.swift
//  LocalBrain
//
//  Purpose: Migrated FileBrowserView as independent widget
//  Created: 2025-10-06 (Migration Day!)
//  Migrating from: LocalBrain/Views/FileBrowserView.swift
//

import SwiftUI
import Foundation

struct FileExplorerWidget: View {
    @State private var currentDirectory: URL
    @State private var selectedFiles: Set<URL> = []
    @State private var fileContents: [URL] = []
    @State private var searchQuery = ""
    @State private var viewMode: ViewMode = .list
    @State private var sortBy: SortOption = .name

    let onFileSelected: (URL) -> Void
    let onDirectoryChanged: (URL) -> Void

    init(
        initialDirectory: URL = URL(fileURLWithPath: NSHomeDirectory()),
        onFileSelected: @escaping (URL) -> Void = { _ in },
        onDirectoryChanged: @escaping (URL) -> Void = { _ in }
    ) {
        self._currentDirectory = State(initialValue: initialDirectory)
        self.onFileSelected = onFileSelected
        self.onDirectoryChanged = onDirectoryChanged
    }

    var body: some View {
        VStack(spacing: 0) {
            // Widget header
            widgetHeader

            // Search and controls
            searchAndControls

            Divider()
                .background(Color.gray.opacity(0.3))

            // File list
            fileList

            // Status bar
            statusBar
        }
        .background(Color.black)
        .onAppear {
            loadDirectoryContents()
        }
        .onChange(of: currentDirectory) { _, newDirectory in
            loadDirectoryContents()
            onDirectoryChanged(newDirectory)
        }
    }

    // MARK: - Widget Header
    private var widgetHeader: some View {
        HStack {
            Image(systemName: "folder.fill")
                .foregroundColor(.blue)

            Text(currentDirectory.lastPathComponent)
                .font(.headline)
                .foregroundColor(.white)

            Spacer()

            // View mode toggle
            Picker("View", selection: $viewMode) {
                Image(systemName: "list.bullet").tag(ViewMode.list)
                Image(systemName: "square.grid.2x2").tag(ViewMode.grid)
            }
            .pickerStyle(SegmentedPickerStyle())
            .frame(width: 100)

            // Sort options
            Menu {
                Picker("Sort by", selection: $sortBy) {
                    Text("Name").tag(SortOption.name)
                    Text("Date").tag(SortOption.date)
                    Text("Size").tag(SortOption.size)
                    Text("Type").tag(SortOption.type)
                }
            } label: {
                Image(systemName: "arrow.up.arrow.down")
                    .foregroundColor(.white)
            }
        }
        .padding()
        .background(Color.gray.opacity(0.2))
    }

    // MARK: - Search and Controls
    private var searchAndControls: some View {
        HStack {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)

                TextField("Search files...", text: $searchQuery)
                    .textFieldStyle(PlainTextFieldStyle())
                    .foregroundColor(.white)

                if !searchQuery.isEmpty {
                    Button(action: { searchQuery = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(8)
            .background(Color.gray.opacity(0.3))
            .cornerRadius(8)

            Spacer()

            // Navigation buttons
            HStack(spacing: 8) {
                Button(action: navigateBack) {
                    Image(systemName: "arrow.left")
                        .foregroundColor(canGoBack ? .white : .gray)
                }
                .disabled(!canGoBack)

                Button(action: navigateUp) {
                    Image(systemName: "arrow.up")
                        .foregroundColor(canGoUp ? .white : .gray)
                }
                .disabled(!canGoUp)

                Button(action: refreshDirectory) {
                    Image(systemName: "arrow.clockwise")
                        .foregroundColor(.white)
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
    }

    // MARK: - File List
    private var fileList: some View {
        ScrollView {
            LazyVStack(spacing: 2) {
                // Parent directory navigation
                if canGoUp {
                    FileItemRow(
                        url: currentDirectory.deletingLastPathComponent(),
                        name: "..",
                        isDirectory: true,
                        isSelected: false
                    ) {
                        navigateUp()
                    }
                }

                // Filtered and sorted file contents
                ForEach(filteredAndSortedContents, id: \.self) { url in
                    FileItemRow(
                        url: url,
                        name: url.lastPathComponent,
                        isDirectory: url.hasDirectoryPath,
                        isSelected: selectedFiles.contains(url)
                    ) {
                        handleFileSelection(url)
                    }
                }
            }
        }
    }

    // MARK: - Status Bar
    private var statusBar: some View {
        HStack {
            Text("\(fileContents.count) items")
                .font(.caption)
                .foregroundColor(.gray)

            if !selectedFiles.isEmpty {
                Text("• \(selectedFiles.count) selected")
                    .font(.caption)
                    .foregroundColor(.blue)
            }

            Spacer()

            Text(currentDirectory.path)
                .font(.caption2)
                .foregroundColor(.gray)
                .lineLimit(1)
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
        .background(Color.gray.opacity(0.2))
    }

    // MARK: - File Operations
    private func loadDirectoryContents() {
        do {
            let contents = try FileManager.default.contentsOfDirectory(
                at: currentDirectory,
                includingPropertiesForKeys: [
                    .isDirectoryKey,
                    .fileSizeKey,
                    .contentModificationDateKey,
                    .contentTypeKey
                ],
                options: [.skipsHiddenFiles]
            )
            fileContents = sortContents(contents)
        } catch {
            print("Error loading directory: \(error)")
            fileContents = []
        }
    }

    private func handleFileSelection(_ url: URL) {
        if url.hasDirectoryPath {
            // Navigate into directory
            currentDirectory = url
        } else {
            // Select file
            if selectedFiles.contains(url) {
                selectedFiles.remove(url)
            } else {
                selectedFiles.insert(url)
            }
            onFileSelected(url)
        }
    }

    private func navigateBack() {
        // Implementation for navigation history
        if canGoUp {
            navigateUp()
        }
    }

    private func navigateUp() {
        let parent = currentDirectory.deletingLastPathComponent()
        if parent.path != currentDirectory.path {
            currentDirectory = parent
        }
    }

    private func refreshDirectory() {
        loadDirectoryContents()
    }

    private func sortContents(_ contents: [URL]) -> [URL] {
        return contents.sorted { url1, url2 in
            // Directories first
            let isDir1 = url1.hasDirectoryPath
            let isDir2 = url2.hasDirectoryPath

            if isDir1 != isDir2 {
                return isDir1 && !isDir2
            }

            // Then sort by selected option
            switch sortBy {
            case .name:
                return url1.lastPathComponent.localizedStandardCompare(url2.lastPathComponent) == .orderedAscending
            case .date:
                // Compare modification dates
                return true // Simplified for now
            case .size:
                return true // Simplified for now
            case .type:
                return true // Simplified for now
            }
        }
    }

    // MARK: - Computed Properties
    private var filteredAndSortedContents: [URL] {
        let sorted = sortContents(fileContents)

        if searchQuery.isEmpty {
            return sorted
        } else {
            return sorted.filter { url in
                url.lastPathComponent.localizedCaseInsensitiveContains(searchQuery)
            }
        }
    }

    private var canGoUp: Bool {
        return currentDirectory.path != "/" && currentDirectory.deletingLastPathComponent().path != currentDirectory.path
    }

    private var canGoBack: Bool {
        // Implement navigation history logic
        return canGoUp
    }
}

// MARK: - File Item Row
struct FileItemRow: View {
    let url: URL
    let name: String
    let isDirectory: Bool
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // File/folder icon
                Image(systemName: isDirectory ? "folder.fill" : fileIcon)
                    .foregroundColor(isDirectory ? .blue : fileIconColor)
                    .frame(width: 20)

                // File name
                Text(name)
                    .font(.system(size: 13))
                    .foregroundColor(.white)
                    .lineLimit(1)

                Spacer()

                // File size (for files only)
                if !isDirectory {
                    Text(fileSize)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(isSelected ? Color.blue.opacity(0.3) : Color.clear)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .background(Color.clear)
    }

    private var fileIcon: String {
        let extension = url.pathExtension.lowercased()
        switch extension {
        case "txt", "md": return "doc.text"
        case "swift", "js", "ts", "py", "java": return "doc.text.fill"
        case "jpg", "png", "gif", "svg": return "photo"
        case "pdf": return "doc.fill"
        case "zip", "tar", "gz": return "doc.zipper"
        default: return "doc"
        }
    }

    private var fileIconColor: Color {
        let extension = url.pathExtension.lowercased()
        switch extension {
        case "swift", "js", "ts", "py", "java": return .green
        case "jpg", "png", "gif", "svg": return .orange
        case "pdf": return .red
        default: return .gray
        }
    }

    private var fileSize: String {
        do {
            let resourceValues = try url.resourceValues(forKeys: [.fileSizeKey])
            if let size = resourceValues.fileSize {
                return ByteCountFormatter.string(fromByteCount: Int64(size), countStyle: .file)
            }
        } catch {
            // Handle error
        }
        return ""
    }
}

// MARK: - Supporting Types
enum ViewMode {
    case list
    case grid
}

enum SortOption {
    case name
    case date
    case size
    case type
}

// MARK: - Widget Integration Extension
extension FileExplorerWidget {
    static func fromLegacyState(_ state: FileExplorerLegacyState) -> FileExplorerWidget {
        return FileExplorerWidget(
            initialDirectory: state.currentPath,
            onFileSelected: { url in
                print("File selected: \(url.path)")
            },
            onDirectoryChanged: { url in
                print("Directory changed: \(url.path)")
            }
        )
    }
}