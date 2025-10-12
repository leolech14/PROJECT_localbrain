//
//  UnifiedSettingsView.swift
//  LocalBrain
//
//  Minimal settings placeholder for MVP
//
//  Created: 2025-10-06 (Minimal MVP Build)
//

import SwiftUI

struct UnifiedSettingsView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 20) {
            // Header
            HStack {
                Text("⚙️ Settings")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundStyle(Color.tx1)

                Spacer()

                Button(action: { dismiss() }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title2)
                        .foregroundStyle(Color.tx2)
                }
                .buttonStyle(.plain)
            }
            .padding()

            // Placeholder content
            VStack(spacing: 16) {
                Text("Settings Coming Soon")
                    .font(.headline)
                    .foregroundStyle(Color.tx1)

                Text("API keys, preferences, and configuration will be available here.")
                    .font(.subheadline)
                    .foregroundStyle(Color.tx2)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                Divider()
                    .padding(.vertical)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Planned Settings:")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color.tx1)

                    Group {
                        settingRow(icon: "key.fill", title: "API Keys", subtitle: "Configure provider credentials")
                        settingRow(icon: "paintbrush.fill", title: "Theme", subtitle: "Dark/Light/Auto modes")
                        settingRow(icon: "mic.fill", title: "Voice", subtitle: "Speech recognition settings")
                        settingRow(icon: "gearshape.fill", title: "Advanced", subtitle: "Feature toggles and debugging")
                    }
                }
                .padding()
                .background(Color.bg2)
                .cornerRadius(12)
                .padding(.horizontal)
            }

            Spacer()

            // Footer
            Button("Close") {
                dismiss()
            }
            .buttonStyle(.borderedProminent)
            .padding()
        }
        .frame(width: 500, height: 600)
        .background(Color.bg1)
    }

    private func settingRow(icon: String, title: String, subtitle: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(Color.acc)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(Color.tx1)

                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(Color.tx2)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(Color.tx3)
        }
        .padding(.vertical, 8)
    }
}
