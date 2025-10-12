#!/usr/bin/env python3
"""Generate ULTRATHINK HTML report with real LocalBrain architecture"""
import subprocess

# Get diagrams
result = subprocess.run(['python3', 'generate_real_ultrathink.py'], capture_output=True, text=True)
output = result.stdout

# Extract diagrams
diagrams = {}
current_diagram = None
current_content = []

for line in output.split('\n'):
    if 'DIAGRAM:' in line:
        if current_diagram:
            diagrams[current_diagram] = '\n'.join(current_content)
        current_diagram = line.split('DIAGRAM:')[1].strip()
        current_content = []
    elif '=' not in line or len(set(line)) > 2:
        current_content.append(line)

if current_diagram:
    diagrams[current_diagram] = '\n'.join(current_content)

# Generate HTML
html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LocalBrain ULTRATHINK Architecture Analysis</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {{
            --bg: oklch(0.15 0.02 250);
            --surface: oklch(0.20 0.02 250);
            --text: oklch(0.95 0.01 250);
            --accent: oklch(0.65 0.15 270);
            --border: oklch(0.30 0.02 250);
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }}
        h1 {{
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .subtitle {{
            font-size: 1.2rem;
            color: oklch(0.70 0.05 250);
            margin-bottom: 3rem;
        }}
        .diagram-card {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
        }}
        .diagram-title {{
            font-size: 1.8rem;
            margin-bottom: 16px;
            color: var(--accent);
        }}
        .diagram-desc {{
            color: oklch(0.70 0.05 250);
            margin-bottom: 24px;
        }}
        .mermaid {{
            background: oklch(0.25 0.02 250);
            border-radius: 12px;
            padding: 24px;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }}
        .stat {{
            background: var(--surface);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--border);
        }}
        .stat-value {{
            font-size: 2rem;
            font-weight: bold;
            color: var(--accent);
        }}
        .stat-label {{
            color: oklch(0.70 0.05 250);
            margin-top: 8px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 LocalBrain ULTRATHINK</h1>
        <p class="subtitle">Complete Architecture Analysis - 48,144 Files Mapped</p>

        <div class="stats">
            <div class="stat">
                <div class="stat-value">9</div>
                <div class="stat-label">Codebases</div>
            </div>
            <div class="stat">
                <div class="stat-value">5</div>
                <div class="stat-label">Architecture Layers</div>
            </div>
            <div class="stat">
                <div class="stat-value">48K</div>
                <div class="stat-label">Total Files</div>
            </div>
            <div class="stat">
                <div class="stat-value">1.1GB</div>
                <div class="stat-label">Project Size</div>
            </div>
        </div>

        <div class="diagram-card">
            <h2 class="diagram-title">1. Complete System Architecture</h2>
            <p class="diagram-desc">Shows all 9 codebases and their interconnections across frontend, backend, core, and infrastructure layers.</p>
            <div class="mermaid">
{diagrams.get('1_architecture', '').strip()}
            </div>
        </div>

        <div class="diagram-card">
            <h2 class="diagram-title">2. Electron Desktop App</h2>
            <p class="diagram-desc">Internal architecture of the Electron application showing main process, renderer process, and IPC communication.</p>
            <div class="mermaid">
{diagrams.get('2_electron', '').strip()}
            </div>
        </div>

        <div class="diagram-card">
            <h2 class="diagram-title">3. Backend RAG System</h2>
            <p class="diagram-desc">RAG (Retrieval Augmented Generation) backend with search, indexing, and vector database integration.</p>
            <div class="mermaid">
{diagrams.get('3_backend', '').strip()}
            </div>
        </div>

        <div class="diagram-card">
            <h2 class="diagram-title">4. Agent Framework & MCP</h2>
            <p class="diagram-desc">Multi-agent coordination system with MCP task registry managing 19 tasks across 4 specialized agents.</p>
            <div class="mermaid">
{diagrams.get('4_agents', '').strip()}
            </div>
        </div>

        <div class="diagram-card">
            <h2 class="diagram-title">5. Design System</h2>
            <p class="diagram-desc">Storybook-based design system with components, tokens, and motion system with accessibility support.</p>
            <div class="mermaid">
{diagrams.get('5_design', '').strip()}
            </div>
        </div>
    </div>

    <script>
        mermaid.initialize({{ 
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {{
                primaryColor: '#4f46e5',
                primaryTextColor: '#fff',
                primaryBorderColor: '#312e81',
                lineColor: '#7c3aed',
                secondaryColor: '#059669',
                tertiaryColor: '#dc2626'
            }}
        }});
    </script>
</body>
</html>"""

with open('LocalBrain_ULTRATHINK_REAL.html', 'w') as f:
    f.write(html)

print("✅ Generated: LocalBrain_ULTRATHINK_REAL.html")
