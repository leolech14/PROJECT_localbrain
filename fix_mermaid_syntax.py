#!/usr/bin/env python3
"""
Convert OKLCH colors to dark HEX in Mermaid diagrams
Mermaid 10.6.1 doesn't support OKLCH syntax
"""

import re

# Read the HTML file
with open('maximum_extraction_report.html', 'r') as f:
    html = f.read()

# OKLCH to dark HEX mapping
oklch_to_hex = {
    # Primary colors (darker versions)
    'fill:oklch(0.48 0.15 270)': 'fill:#4338ca',  # Dark indigo
    'stroke:oklch(0.28 0.10 270)': 'stroke:#312e81',  # Very dark indigo

    'fill:oklch(0.45 0.12 160)': 'fill:#047857',  # Dark green
    'fill:oklch(0.38 0.10 165)': 'fill:#065f46',  # Very dark green
    'stroke:oklch(0.30 0.10 160)': 'stroke:#064e3b',  # Very dark green
    'stroke:oklch(0.38 0.10 165)': 'stroke:#065f46',  # Very dark green

    'fill:oklch(0.48 0.15 25)': 'fill:#b91c1c',  # Dark red
    'stroke:oklch(0.32 0.12 25)': 'stroke:#991b1b',  # Very dark red

    'fill:oklch(0.50 0.15 290)': 'fill:#6d28d9',  # Dark purple
    'fill:oklch(0.42 0.12 285)': 'fill:#7c3aed',  # Dark purple
    'stroke:oklch(0.35 0.12 290)': 'stroke:#5b21b6',  # Very dark purple

    # Process colors
    'fill:oklch(0.40 0.12 260)': 'fill:#1e40af',  # Dark blue
    'stroke:oklch(0.30 0.10 260)': 'stroke:#1e3a8a',  # Very dark blue

    # Service colors
    'fill:oklch(0.52 0.12 165)': 'fill:#059669',  # Teal
    'stroke:oklch(0.38 0.10 165)': 'stroke:#047857',  # Dark teal

    # Type/Data colors (brown/orange - dark)
    'fill:oklch(0.45 0.12 50)': 'fill:#b45309',  # Dark orange
    'fill:oklch(0.38 0.10 45)': 'fill:#92400e',  # Very dark brown
    'stroke:oklch(0.38 0.10 45)': 'stroke:#78350f',  # Very dark brown
    'stroke:oklch(0.32 0.10 40)': 'stroke:#78350f',  # Very dark brown

    # API colors
    'fill:oklch(0.52 0.12 250)': 'fill:#3b82f6',  # Blue
    'stroke:oklch(0.38 0.10 250)': 'stroke:#1e40af',  # Dark blue

    # CLI colors
    'fill:oklch(0.52 0.15 285)': 'fill:#7c3aed',  # Purple
    'stroke:oklch(0.42 0.12 285)': 'stroke:#6d28d9',  # Dark purple

    # Storybook (pink/magenta - dark)
    'fill:oklch(0.48 0.15 350)': 'fill:#db2777',  # Dark pink
    'stroke:oklch(0.42 0.15 355)': 'stroke:#9f1239',  # Very dark pink
}

# Replace all OKLCH colors with HEX
for oklch, hex_color in oklch_to_hex.items():
    html = html.replace(oklch, hex_color)

# Save the updated file
with open('maximum_extraction_report.html', 'w') as f:
    f.write(html)

print("✅ Converted all OKLCH colors to dark HEX for Mermaid compatibility!")
print(f"\nConverted {len(oklch_to_hex)} color definitions")
