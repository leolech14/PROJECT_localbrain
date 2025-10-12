#!/usr/bin/env python3
"""
Fix bright colors in Mermaid diagrams - replace with dark OKLCH colors
"""

import re

# Read the HTML file
with open('maximum_extraction_report.html', 'r') as f:
    html = f.read()

# Color replacement mapping (hex -> OKLCH dark)
color_replacements = {
    # Orange/Yellow (VERY BRIGHT - PROBLEM!)
    '#f59e0b': 'oklch(0.45 0.12 50)',  # Dark orange
    '#d97706': 'oklch(0.38 0.10 45)',  # Darker orange/brown

    # Pink/Red bright
    '#ff4785': 'oklch(0.48 0.15 350)',  # Dark pink

    # Keep existing dark colors but convert to OKLCH
    '#4f46e5': 'oklch(0.48 0.15 270)',  # Indigo
    '#312e81': 'oklch(0.28 0.10 270)',  # Dark indigo

    '#059669': 'oklch(0.45 0.12 160)',  # Green
    '#065f46': 'oklch(0.30 0.10 160)',  # Dark green

    '#dc2626': 'oklch(0.48 0.15 25)',   # Red
    '#991b1b': 'oklch(0.32 0.12 25)',   # Dark red

    '#7c3aed': 'oklch(0.50 0.15 290)',  # Purple
    '#5b21b6': 'oklch(0.35 0.12 290)',  # Dark purple

    '#1e40af': 'oklch(0.40 0.12 260)',  # Blue
    '#1e3a8a': 'oklch(0.30 0.10 260)',  # Dark blue

    '#3b82f6': 'oklch(0.52 0.12 250)',  # Light blue -> darker
    '#1e40af': 'oklch(0.38 0.10 250)',  # Dark blue

    '#10b981': 'oklch(0.52 0.12 165)',  # Teal
    '#059669': 'oklch(0.38 0.10 165)',  # Dark teal

    '#8b5cf6': 'oklch(0.52 0.15 285)',  # Violet
    '#7c3aed': 'oklch(0.42 0.12 285)',  # Dark violet

    '#c9284d': 'oklch(0.42 0.15 355)',  # Dark magenta
    '#92400e': 'oklch(0.32 0.10 40)',   # Dark brown
}

# Replace all color instances
for hex_color, oklch_color in color_replacements.items():
    html = html.replace(f'fill:{hex_color}', f'fill:{oklch_color}')
    html = html.replace(f'stroke:{hex_color}', f'stroke:{oklch_color}')

# Save the updated file
with open('maximum_extraction_report.html', 'w') as f:
    f.write(html)

print("✅ Fixed all bright colors in Mermaid diagrams!")
print("\nReplaced colors:")
for hex_color, oklch_color in color_replacements.items():
    print(f"  {hex_color} → {oklch_color}")
