#!/usr/bin/env python3
"""
Inject real ULTRATHINK diagrams from LocalBrain_ULTRATHINK_REAL.html
into maximum_extraction_report.html
"""

import re

# Read the real diagrams file
with open('LocalBrain_ULTRATHINK_REAL.html', 'r') as f:
    real_html = f.read()

# Read the main report
with open('maximum_extraction_report.html', 'r') as f:
    report_html = f.read()

# Extract all 5 diagrams from the real file
real_diagrams = re.findall(r'<div class="mermaid">(.*?)</div>', real_html, re.DOTALL)

if len(real_diagrams) != 5:
    print(f"ERROR: Expected 5 diagrams, found {len(real_diagrams)}")
    exit(1)

print(f"✅ Extracted {len(real_diagrams)} real diagrams")

# Map diagrams to their IDs
diagram_mapping = {
    'mermaid-ultrathink-main-core': real_diagrams[0],
    'mermaid-ultrathink-critical-paths': real_diagrams[1],
    'mermaid-ultrathink-component-clusters': real_diagrams[2],
    'mermaid-ultrathink-service-layers': real_diagrams[3],
    'mermaid-ultrathink-risk-analysis': real_diagrams[4],
}

# Replace each diagram
for diagram_id, new_content in diagram_mapping.items():
    # Find the mermaid div and replace its content
    pattern = rf'(<div class="mermaid" id="{diagram_id}"[^>]*>)(.*?)(</div>)'

    def replace_diagram(match):
        return match.group(1) + new_content + match.group(3)

    report_html, count = re.subn(pattern, replace_diagram, report_html, flags=re.DOTALL)

    if count > 0:
        print(f"✅ Replaced {diagram_id}")
    else:
        print(f"❌ Could not find {diagram_id}")

# Save the updated report
with open('maximum_extraction_report.html', 'w') as f:
    f.write(report_html)

print("\n🚀 Successfully injected all real ULTRATHINK diagrams into maximum_extraction_report.html")
