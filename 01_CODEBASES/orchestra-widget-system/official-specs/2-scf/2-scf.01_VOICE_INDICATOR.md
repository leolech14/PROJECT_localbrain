---
title: "Voice Indicator – Animated Eyes with Audio Levels"
scaffold_id: "LB-VOICE-INDICATOR-UI-001"
type: "scaffold"
category: "structural"
swiftui_view: "VoiceIndicatorView"
swift_file: "LocalBrain/Views/VoiceIndicatorView.swift"
view_type: "overlay"
lifecycle: "dev"
state: "minimal"
seat: "mvp"
phase_availability: "always"
priority: "critical"
macos_version: "14.0+"
observability:
  spec_events: ["VoiceIndicatorView.render.success","VoiceIndicatorView.interaction.performed"]
  performance_metrics: ["render_time_ms","frame_rate"]
  spec_validation: ["SPEC/features/VoiceIndicatorView.spec.md"]
security:
  user_interaction: true
  sensitive_data_display: false
  accessibility_required: true
  voiceover_support: true
last_updated: "2025-10-05"
---

## Purpose
Provides the visual foundation for Voice Indicator – Animated Eyes with Audio Levels.

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
  A[VoiceIndicatorView] --> B[State Model]
  A --> C[Animation Layer]
```
