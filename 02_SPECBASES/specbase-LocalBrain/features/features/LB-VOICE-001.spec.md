---
spec_id: LB-VOICE-001
title: Voice indicator responds to speech amplitude and pitch
version: 1.0.0
owners: [product, audio]
status: ready
platforms: [electron, ios, web]
priority: p0
tags: [voice, ui, realtime]
depends_on: []
probes_required: ["voice.metrics", "ui.frame"]
acceptance_criteria:
  - ac_id: AC-0001
    text: During speech, indicator scale rises above idle baseline for >=80% of speaking frames.
  - ac_id: AC-0002
    text: Idle CPU usage of the indicator remains below 1% on reference hardware.
runtime_checks:
  - kind: symbol_exists
    symbol: "Swift:LocalBrain.VoiceIndicatorView.update(with:)"
  - kind: symbol_exists
    symbol: "TS:ui/VoiceIndicator.tsx#update"
tests:
  - id: T-VOICE-001
    platforms: [electron, web]
    steps:
      - action: app.launch
      - action: simulate.audio
        params: { sample: "samples/speech_female_10s.wav" }
      - action: probe.expect
        params: { event: "voice.metrics", where: "isSpeech == true", count_gte: 100 }
      - action: assert
        params: { ac_id: "AC-0001", kind: metric_threshold, metric: "voice.rms.scale_ratio", threshold: ">= 0.8" }
  - id: T-VOICE-002
    platforms: [ios]
    steps:
      - action: app.launch
      - action: simulate.audio
        params: { sample: "samples/speech_male_10s.wav" }
      - action: assert
        params: { ac_id: "AC-0002", kind: metric_threshold, metric: "ui.cpu_idle_percent_idle", threshold: ">= 99" }
assertions:
  - ac_id: AC-0001
    kind: metric_threshold
    metric: "voice.rms.scale_ratio"
    threshold: ">= 0.8"
  - ac_id: AC-0002
    kind: metric_threshold
    metric: "ui.cpu_idle_percent_idle"
    threshold: ">= 99"
    optional: true
evidence:
  screenshots: true
  telemetry_dump: true
---
Body: Implementation notes.
