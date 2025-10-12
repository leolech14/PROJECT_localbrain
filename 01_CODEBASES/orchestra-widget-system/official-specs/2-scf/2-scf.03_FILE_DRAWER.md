---
title: "File Drawer – Context Intake"
scaffold_id: "LB-FILE-DRAWER-UI-003"
type: "scaffold"
category: "structural"
swiftui_view: "FileDrawerView"
swift_file: "LocalBrain/Views/FileDrawerView.swift"
view_type: "drawer"
lifecycle: "dev"
state: "minimal"
seat: "mvp"
phase_availability: "always"
priority: "critical"
macos_version: "14.0+"
observability:
  spec_events: ["FileDrawerView.render.success","FileDrawerView.interaction.performed"]
  performance_metrics: ["render_time_ms","frame_rate"]
  spec_validation: ["SPEC/features/FileDrawerView.spec.md"]
security:
  user_interaction: true
  sensitive_data_display: false
  accessibility_required: true
  voiceover_support: true
last_updated: "2025-10-05"
---

## Purpose
Provides the visual foundation for File Drawer – Context Intake.

**Out of scope:**
- Business logic
- Data persistence

## Primary Features
- **Visual:** Minimal animated display, responds to state
- **Interaction:** Keyboard/mouse accessible
- **Accessibility:** VoiceOver labels and focus order

## Architecture
```mermaid
graph TD
  A[FileDrawerView] --> B[State Model]
  A --> C[Animation Layer]
```
