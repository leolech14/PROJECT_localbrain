---
title: "Task Window – Orchestration Panel"
scaffold_id: "LB-TASK-WINDOW-UI-002"
type: "scaffold"
category: "structural"
swiftui_view: "TaskWindowView"
swift_file: "LocalBrain/Views/TaskWindowView.swift"
view_type: "panel"
lifecycle: "dev"
state: "minimal"
seat: "mvp"
phase_availability: "always"
priority: "critical"
macos_version: "14.0+"
observability:
  spec_events: ["TaskWindowView.render.success","TaskWindowView.interaction.performed"]
  performance_metrics: ["render_time_ms","frame_rate"]
  spec_validation: ["SPEC/features/TaskWindowView.spec.md"]
security:
  user_interaction: true
  sensitive_data_display: false
  accessibility_required: true
  voiceover_support: true
last_updated: "2025-10-05"
---

## Purpose
Provides the visual foundation for Task Window – Orchestration Panel.

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
  A[TaskWindowView] --> B[State Model]
  A --> C[Animation Layer]
```
