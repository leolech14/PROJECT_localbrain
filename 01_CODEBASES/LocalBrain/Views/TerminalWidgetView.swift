//
//  TerminalWidgetView.swift
//  LocalBrain
//
//  Purpose: Real Terminal implementation for widget grid
//  Created: 2025-10-07
//

import SwiftUI
import AppKit

/// Real Terminal widget with full command execution
struct TerminalWidgetView: View {
    @StateObject private var terminal = TerminalViewModel()
    @FocusState private var isInputFocused: Bool
    @State private var isExpanded = false

    var body: some View {
        VStack(spacing: 0) {
            // Terminal Header
            terminalHeader

            // Terminal Content
            if isExpanded {
                expandedTerminalContent
            } else {
                compactTerminalContent
            }

            Spacer()
        }
        .padding(12)
        .background(Color.black)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.green.opacity(0.3), lineWidth: 1)
        )
        .onAppear {
            terminal.initialize()
            isInputFocused = true
        }
    }

    private var terminalHeader: some View {
        HStack {
            Image(systemName: "terminal.fill")
                .foregroundColor(.green)
                .font(.system(size: 12, weight: .medium))

            Text("Terminal")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.green)

            Text("~/\(terminal.currentDirectory)")
                .font(.caption2)
                .foregroundColor(.gray)
                .lineLimit(1)

            Spacer()

            // Clear button
            Button(action: { terminal.clear() }) {
                Image(systemName: "trash")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
            .buttonStyle(.plain)

            // Expand/collapse button
            Button(action: { withAnimation(.easeInOut(duration: 0.2)) { isExpanded.toggle() } }) {
                Image(systemName: isExpanded ? "arrow.down.left.and.arrow.up.right" : "arrow.up.right.and.arrow.down.left")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
            .buttonStyle(.plain)
        }
        .padding(.bottom, 8)
    }

    private var compactTerminalContent: some View {
        VStack(alignment: .leading, spacing: 2) {
            // Show last few terminal lines
            ForEach(terminal.outputLines.suffix(3)) { line in
                CompactTerminalLine(line: line)
            }

            // Current input line
            HStack(spacing: 0) {
                Text(terminal.currentPrompt)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(.green)

                TextField("", text: $terminal.currentInput)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(.white)
                    .textFieldStyle(.plain)
                    .focused($isInputFocused)
                    .onSubmit {
                        terminal.executeCommand()
                    }

                Spacer()
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var expandedTerminalContent: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // All terminal output
                    ForEach(terminal.outputLines) { line in
                        TerminalLine(line: line)
                    }

                    // Current input line
                    HStack(spacing: 0) {
                        Text(terminal.currentPrompt)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.green)

                        TextField("", text: $terminal.currentInput)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.white)
                            .textFieldStyle(.plain)
                            .focused($isInputFocused)
                            .onSubmit {
                                terminal.executeCommand()
                            }
                            .id("input")

                        Spacer()
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .onChange(of: terminal.outputLines.count) {
                withAnimation(.easeOut(duration: 0.1)) {
                    proxy.scrollTo("input", anchor: .bottom)
                }
            }
        }
    }
}

// MARK: - Terminal Line Views

struct CompactTerminalLine: View {
    let line: TerminalOutputLine

    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            if line.isCommand {
                Text(line.prompt ?? "$ ")
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(.green)
            }

            Text(line.content)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(lineColor)
                .lineLimit(1)

            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var lineColor: Color {
        switch line.type {
        case .command: return Color.cyan
        case .output: return Color.white
        case .error: return Color.red
        case .success: return Color.green
        case .warning: return Color.orange
        case .info: return Color.blue
        }
    }
}

struct TerminalLine: View {
    let line: TerminalOutputLine

    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            if line.isCommand {
                Text(line.prompt ?? "$ ")
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundColor(.green)
            }

            Text(line.content)
                .font(.system(size: 11, design: .monospaced))
                .foregroundColor(lineColor)
                .textSelection(.enabled)

            Spacer(minLength: 0)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 1)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var lineColor: Color {
        switch line.type {
        case .command: return Color.cyan
        case .output: return Color.white
        case .error: return Color.red
        case .success: return Color.green
        case .warning: return Color.orange
        case .info: return Color.blue
        }
    }
}

// MARK: - Terminal Output Line Model (moved from original)

struct TerminalOutputLine: Identifiable {
    let id = UUID()
    let content: String
    let type: LineType
    let isCommand: Bool
    let prompt: String?
    let timestamp = Date()

    enum LineType {
        case command, output, error, success, warning, info
    }
}

// MARK: - Terminal View Model (simplified for widget)

class TerminalViewModel: ObservableObject {
    @Published var outputLines: [TerminalOutputLine] = []
    @Published var currentInput = ""
    @Published var currentDirectory = ""
    @Published var currentPrompt = "$ "

    private var commandHistory: [String] = []
    private var historyIndex = -1
    private var workingDirectory: URL

    init() {
        self.workingDirectory = FileManager.default.homeDirectoryForCurrentUser
        updateCurrentDirectory()
    }

    func initialize() {
        // Add welcome message
        outputLines.append(TerminalOutputLine(
            content: "LocalBrain Terminal v1.0",
            type: .info,
            isCommand: false,
            prompt: nil
        ))
        outputLines.append(TerminalOutputLine(
            content: "Type 'help' for commands or run any shell command",
            type: .info,
            isCommand: false,
            prompt: nil
        ))
        outputLines.append(TerminalOutputLine(
            content: "",
            type: .output,
            isCommand: false,
            prompt: nil
        ))

        // Test environment
        Task {
            await testEnvironment()
        }
    }

    @MainActor
    private func testEnvironment() async {
        let testProcess = Process()
        testProcess.executableURL = URL(fileURLWithPath: "/bin/zsh")
        testProcess.arguments = ["-l", "-c", "echo '✓ Terminal ready'"]

        let outputPipe = Pipe()
        testProcess.standardOutput = outputPipe
        testProcess.standardError = outputPipe
        testProcess.standardInput = FileHandle.nullDevice

        do {
            try testProcess.run()
            testProcess.waitUntilExit()

            if testProcess.terminationStatus == 0 {
                outputLines.append(TerminalOutputLine(
                    content: "✓ Shell environment ready",
                    type: .success,
                    isCommand: false,
                    prompt: nil
                ))
            }
        } catch {
            outputLines.append(TerminalOutputLine(
                content: "⚠ Environment test failed: \(error.localizedDescription)",
                type: .warning,
                isCommand: false,
                prompt: nil
            ))
        }
    }

    func executeCommand() {
        guard !currentInput.isEmpty else { return }

        // Add to history
        commandHistory.append(currentInput)
        historyIndex = -1

        // Add command to output
        outputLines.append(TerminalOutputLine(
            content: currentInput,
            type: .command,
            isCommand: true,
            prompt: currentPrompt
        ))

        let command = currentInput
        currentInput = ""

        // Handle built-in commands
        if handleBuiltInCommand(command) {
            return
        }

        // Execute shell command
        Task {
            await executeShellCommand(command)
        }
    }

    private func handleBuiltInCommand(_ command: String) -> Bool {
        let parts = command.split(separator: " ").map(String.init)
        guard let cmd = parts.first else { return false }

        switch cmd {
        case "cd":
            let path = parts.count > 1 ? parts[1] : "~"
            changeDirectory(to: path)
            return true

        case "clear", "cls":
            clear()
            return true

        case "pwd":
            outputLines.append(TerminalOutputLine(
                content: workingDirectory.path,
                type: .output,
                isCommand: false,
                prompt: nil
            ))
            return true

        case "help", "?":
            let helpText = """
            Commands: cd, pwd, clear/cls, help, ls, git, npm, python, etc.
            All standard shell commands are supported.
            """

            let lines = helpText.split(separator: "\n")
            for line in lines {
                outputLines.append(TerminalOutputLine(
                    content: String(line),
                    type: .info,
                    isCommand: false,
                    prompt: nil
                ))
            }
            return true

        default:
            return false
        }
    }

    private func changeDirectory(to path: String) {
        let expandedPath: String
        if path.starts(with: "~") {
            expandedPath = NSString(string: path).expandingTildeInPath
        } else if path.starts(with: "/") {
            expandedPath = path
        } else {
            expandedPath = workingDirectory.appendingPathComponent(path).path
        }

        var isDirectory: ObjCBool = false
        if FileManager.default.fileExists(atPath: expandedPath, isDirectory: &isDirectory) && isDirectory.boolValue {
            workingDirectory = URL(fileURLWithPath: expandedPath)
            updateCurrentDirectory()
            outputLines.append(TerminalOutputLine(
                content: "Changed directory to: \(workingDirectory.path)",
                type: .success,
                isCommand: false,
                prompt: nil
            ))
        } else {
            outputLines.append(TerminalOutputLine(
                content: "cd: no such file or directory: \(path)",
                type: .error,
                isCommand: false,
                prompt: nil
            ))
        }
    }

    @MainActor
    private func executeShellCommand(_ command: String) async {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/zsh")
        process.arguments = ["-l", "-c", command]
        process.currentDirectoryURL = workingDirectory

        // Set up environment
        var environment = ProcessInfo.processInfo.environment
        environment["TERM"] = "xterm-256color"
        environment["SHELL"] = "/bin/zsh"
        environment["HOME"] = FileManager.default.homeDirectoryForCurrentUser.path
        environment["USER"] = NSUserName()
        environment["PWD"] = workingDirectory.path

        let pathComponents = [
            "/usr/local/bin", "/usr/bin", "/bin", "/usr/sbin", "/sbin",
            "/opt/homebrew/bin", "/opt/homebrew/sbin"
        ]
        let existingPath = environment["PATH"] ?? ""
        environment["PATH"] = pathComponents.joined(separator: ":") + ":" + existingPath

        process.environment = environment

        let outputPipe = Pipe()
        let errorPipe = Pipe()
        process.standardOutput = outputPipe
        process.standardError = errorPipe
        process.standardInput = FileHandle.nullDevice

        do {
            try process.run()
            process.waitUntilExit()

            // Read output
            let outputData = outputPipe.fileHandleForReading.readDataToEndOfFile()
            let errorData = errorPipe.fileHandleForReading.readDataToEndOfFile()

            if let output = String(data: outputData, encoding: .utf8),
               !output.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                let lines = output.split(separator: "\n")
                for line in lines {
                    outputLines.append(TerminalOutputLine(
                        content: String(line),
                        type: .output,
                        isCommand: false,
                        prompt: nil
                    ))
                }
            }

            if let error = String(data: errorData, encoding: .utf8),
               !error.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                let lines = error.split(separator: "\n")
                for line in lines {
                    outputLines.append(TerminalOutputLine(
                        content: String(line),
                        type: .error,
                        isCommand: false,
                        prompt: nil
                    ))
                }
            }

            if process.terminationStatus != 0 {
                outputLines.append(TerminalOutputLine(
                    content: "Process exited with status \(process.terminationStatus)",
                    type: .warning,
                    isCommand: false,
                    prompt: nil
                ))
            }

        } catch {
            outputLines.append(TerminalOutputLine(
                content: "Error: \(error.localizedDescription)",
                type: .error,
                isCommand: false,
                prompt: nil
            ))
        }
    }

    func clear() {
        outputLines.removeAll()
        outputLines.append(TerminalOutputLine(
            content: "Terminal cleared",
            type: .info,
            isCommand: false,
            prompt: nil
        ))
    }

    private func updateCurrentDirectory() {
        let home = FileManager.default.homeDirectoryForCurrentUser.path
        let current = workingDirectory.path

        if current.starts(with: home) {
            currentDirectory = current.replacingOccurrences(of: home, with: "~")
        } else {
            currentDirectory = current
        }

        let lastComponent = workingDirectory.lastPathComponent
        currentPrompt = "[\(lastComponent)]$ "
    }
}

// MARK: - Preview

#Preview {
    TerminalWidgetView()
        .frame(width: 400, height: 300)
        .preferredColorScheme(.dark)
}