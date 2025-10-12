#!/usr/bin/env python3
"""
📋 MASTER REGISTRY MARKDOWN GENERATOR
Convert the comprehensive JSON registry into human-readable markdown format
"""

import json
from datetime import datetime

def generate_master_registry_markdown():
    """Generate comprehensive markdown version of master registry"""

    print("📋 GENERATING MASTER REGISTRY MARKDOWN VERSION")
    print("🔄 Converting JSON intelligence to human-readable format")
    print("=" * 55)

    # Load master registry
    with open("MASTER_REGISTRY.json", 'r') as f:
        registry = json.load(f)

    markdown_content = []

    # Header
    markdown_content.append("# 📊 MASTER REGISTRY - COMPLETE PLATFORM INTELLIGENCE")
    markdown_content.append("**The Ultimate Human-Readable Registry of All Files, Sections, and Metrics**")
    markdown_content.append("")
    markdown_content.append(f"Generated: {registry['metadata']['generated_at']}")
    markdown_content.append("")
    markdown_content.append("---")
    markdown_content.append("")

    # Executive Summary
    markdown_content.append("## 🎯 EXECUTIVE SUMMARY")
    markdown_content.append("")
    markdown_content.append(f"**Files Mapped:** {registry['metadata']['total_files_mapped']}")
    markdown_content.append(f"**Sections Analyzed:** {registry['metadata']['total_sections_analyzed']}")
    markdown_content.append(f"**Canvas Entities:** {registry['metadata']['total_canvas_entities']}")
    markdown_content.append("")

    # Platform totals
    if 'architectural_intelligence' in registry:
        ai = registry['architectural_intelligence']
        if 'total_content_metrics' in ai:
            totals = ai['total_content_metrics']
            markdown_content.append(f"**Total Platform Content:**")
            markdown_content.append(f"- Lines: {totals.get('total_lines', 0):,}")
            markdown_content.append(f"- Tokens: {totals.get('total_tokens', 0):,}")
            markdown_content.append(f"- Size: {totals.get('total_size_kb', 0):.1f} KB")
            markdown_content.append("")

    # Architectural intelligence
    if 'architectural_intelligence' in registry:
        ai = registry['architectural_intelligence']

        markdown_content.append("## 🏗️ ARCHITECTURAL INTELLIGENCE")
        markdown_content.append("")

        # File classifications
        if 'file_classifications' in ai:
            markdown_content.append("### File Classification Distribution:")
            for classification, count in ai['file_classifications'].items():
                percentage = round((count / registry['metadata']['total_files_mapped']) * 100, 1)
                markdown_content.append(f"- **{classification.replace('_', ' ').title()}:** {count} files ({percentage}%)")
            markdown_content.append("")

        # Significance distribution
        if 'significance_distribution' in ai:
            markdown_content.append("### Architectural Significance:")
            for significance, count in ai['significance_distribution'].items():
                percentage = round((count / registry['metadata']['total_files_mapped']) * 100, 1)
                markdown_content.append(f"- **{significance.title()}:** {count} files ({percentage}%)")
            markdown_content.append("")

        # Spatial distribution
        if 'spatial_distribution' in ai:
            markdown_content.append("### Spatial Zone Distribution:")
            for zone, count in ai['spatial_distribution'].items():
                percentage = round((count / registry['metadata']['total_files_mapped']) * 100, 1)
                markdown_content.append(f"- **{zone.replace('_', ' ').title()}:** {count} files ({percentage}%)")
            markdown_content.append("")

    # Navigation system
    if 'navigation_system' in registry:
        nav = registry['navigation_system']

        markdown_content.append("## 🗺️ NAVIGATION INTELLIGENCE")
        markdown_content.append("")

        # Largest files
        if 'largest_files' in nav:
            markdown_content.append("### 📏 Largest Files by Content:")
            markdown_content.append("| Rank | File | Tokens | Lines | Size |")
            markdown_content.append("|------|------|--------|-------|------|")
            for i, file_info in enumerate(nav['largest_files'][:15], 1):
                markdown_content.append(f"| {i:2} | {file_info['file']} | {file_info['tokens']:,} | {file_info['lines']:,} | {file_info['tokens']*4//1024:.1f}KB |")
            markdown_content.append("")

        # Most complex Canvas entities
        if 'most_complex_canvas_entities' in nav:
            markdown_content.append("### 🎨 Most Complex Canvas Entities:")
            markdown_content.append("| Rank | File | Canvas Height | Zone |")
            markdown_content.append("|------|------|---------------|------|")
            for i, entity_info in enumerate(nav['most_complex_canvas_entities'][:15], 1):
                height = entity_info['canvas_height']
                zone = entity_info['spatial_zone'].replace('_', ' ').title()
                markdown_content.append(f"| {i:2} | {entity_info['file']} | {height:,}px | {zone} |")
            markdown_content.append("")

    # Complete file registry breakdown
    markdown_content.append("## 📋 COMPLETE FILE REGISTRY")
    markdown_content.append("")

    # Group files by classification for better organization
    files_by_classification = {}
    for file_entry in registry.get('complete_file_registry', []):
        classification = file_entry['file_classification']
        if classification not in files_by_classification:
            files_by_classification[classification] = []
        files_by_classification[classification].append(file_entry)

    for classification, files in sorted(files_by_classification.items()):
        markdown_content.append(f"### 🏗️ {classification.replace('_', ' ').title()} ({len(files)} files)")
        markdown_content.append("")
        markdown_content.append("| File | Tokens | Lines | Canvas Position | Significance |")
        markdown_content.append("|------|--------|-------|-----------------|--------------|")

        for file_entry in sorted(files, key=lambda x: x['basic_metrics']['tokens'], reverse=True):
            name = file_entry['file_name']
            tokens = file_entry['basic_metrics']['tokens']
            lines = file_entry['basic_metrics']['lines']

            # Canvas position
            canvas_data = file_entry.get('canvas_data', {})
            if 'coordinates' in canvas_data:
                pos = f"({canvas_data['coordinates']['x']}, {canvas_data['coordinates']['y']})"
            else:
                pos = "Unmapped"

            significance = file_entry.get('architectural_significance', 'unknown')

            markdown_content.append(f"| {name} | {tokens:,} | {lines:,} | {pos} | {significance.title()} |")

        markdown_content.append("")

    # Section analysis summary
    markdown_content.append("## 🧠 SECTION ANALYSIS INTELLIGENCE")
    markdown_content.append("")

    # Get section statistics
    all_sections = []
    section_types = {}

    for file_entry in registry.get('complete_file_registry', []):
        section_analysis = file_entry.get('section_analysis', {})
        if 'sections' in section_analysis:
            for section_name, section_data in section_analysis['sections'].items():
                all_sections.append({
                    'file': file_entry['file_name'],
                    'section': section_name,
                    'tokens': section_data['metrics']['tokens'],
                    'percentage': section_data['metrics']['percentage_tokens']
                })

                # Count section types
                section_base = section_name.split('_')[0]
                section_types[section_base] = section_types.get(section_base, 0) + 1

    # Most common section types
    markdown_content.append("### 📊 Most Common Section Types:")
    sorted_sections = sorted(section_types.items(), key=lambda x: x[1], reverse=True)
    for section_type, count in sorted_sections[:15]:
        percentage = round((count / registry['metadata']['total_sections_analyzed']) * 100, 1)
        markdown_content.append(f"- **{section_type}:** {count} sections ({percentage}%)")
    markdown_content.append("")

    # Largest sections
    largest_sections = sorted(all_sections, key=lambda x: x['tokens'], reverse=True)
    markdown_content.append("### 📏 Largest Sections by Content:")
    markdown_content.append("| File | Section | Tokens | % of File |")
    markdown_content.append("|------|---------|--------|-----------|")
    for section in largest_sections[:20]:
        markdown_content.append(f"| {section['file']} | {section['section']} | {section['tokens']:,} | {section['percentage']:.1f}% |")
    markdown_content.append("")

    # Usage examples
    markdown_content.append("## 🎯 USAGE EXAMPLES")
    markdown_content.append("")
    markdown_content.append("### Finding Files by Criteria:")
    markdown_content.append("```python")
    markdown_content.append("import json")
    markdown_content.append("")
    markdown_content.append("# Load master registry")
    markdown_content.append("with open('MASTER_REGISTRY.json', 'r') as f:")
    markdown_content.append("    registry = json.load(f)")
    markdown_content.append("")
    markdown_content.append("# Find critical files")
    markdown_content.append("critical_files = [f for f in registry['complete_file_registry']")
    markdown_content.append("                 if f['architectural_significance'] == 'critical']")
    markdown_content.append("")
    markdown_content.append("# Find files in orchestration core")
    markdown_content.append("orchestration_files = [f for f in registry['complete_file_registry']")
    markdown_content.append("                      if f['canvas_data'].get('spatial_zone') == 'orchestration_core']")
    markdown_content.append("")
    markdown_content.append("# Find largest files")
    markdown_content.append("large_files = [f for f in registry['complete_file_registry']")
    markdown_content.append("              if f['basic_metrics']['tokens'] > 2000]")
    markdown_content.append("```")
    markdown_content.append("")

    markdown_content.append("---")
    markdown_content.append("")
    markdown_content.append("**The Master Registry represents the ultimate achievement in technical documentation intelligence - every file, every section, every metric unified in a single comprehensive system!** 🚀✨")

    # Write markdown file
    with open("MASTER_REGISTRY.md", 'w') as f:
        f.write('\n'.join(markdown_content))

    print("✅ Master Registry Markdown generated!")
    print("📋 File: MASTER_REGISTRY.md")

if __name__ == "__main__":
    generate_master_registry_markdown()