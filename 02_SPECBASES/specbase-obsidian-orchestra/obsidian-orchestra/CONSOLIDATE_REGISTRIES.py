#!/usr/bin/env python3
"""
🎯 REGISTRY CONSOLIDATION ENGINE
Merge all registry data into single comprehensive master registry
"""

import json
import os
from datetime import datetime
from collections import Counter, defaultdict

def consolidate_all_registries():
    """Consolidate all registry data into single master file"""

    print("🎯 REGISTRY CONSOLIDATION ENGINE - ENGAGING")
    print("🔄 Merging all registry data into single master file")
    print("=" * 55)

    master_registry = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "consolidation_sources": [
                "CANVAS_REGISTRY.json",
                "SECTION_DATABASE.json",
                "MEANINGFUL_SECTION_REPORT.md",
                "CANVAS_SNIPER_ANALYSIS.md"
            ],
            "total_files_mapped": 0,
            "total_sections_analyzed": 0,
            "total_canvas_entities": 0
        },
        "complete_file_registry": [],
        "canvas_spatial_intelligence": {},
        "section_semantic_mapping": {},
        "architectural_intelligence": {},
        "query_pattern_analysis": {},
        "navigation_system": {}
    }

    # Load Canvas spatial data
    print("📍 Loading Canvas spatial intelligence...")
    try:
        with open("CANVAS VIEW.canvas", 'r') as f:
            canvas_data = json.load(f)

        canvas_entities = {}
        for node in canvas_data['nodes']:
            if node['type'] == 'file' and 'file' in node:
                file_name = node['file']
                canvas_entities[file_name] = {
                    "canvas_id": node['id'],
                    "coordinates": {
                        "x": node['x'],
                        "y": node['y'],
                        "width": node['width'],
                        "height": node['height']
                    },
                    "color": node.get('color', 'none'),
                    "spatial_zone": determine_spatial_zone(node['x'])
                }

        master_registry["canvas_spatial_intelligence"] = canvas_entities
        master_registry["metadata"]["total_canvas_entities"] = len(canvas_entities)
        print(f"   ✅ {len(canvas_entities)} Canvas entities loaded")

    except Exception as e:
        print(f"   ⚠️ Canvas data error: {e}")

    # Load section analysis data
    print("📋 Loading section analysis data...")
    try:
        with open("SECTION_DATABASE.json", 'r') as f:
            section_data = json.load(f)

        section_analyses = {}
        for file_analysis in section_data.get('file_analyses', []):
            file_name = file_analysis['file_name']
            section_analyses[file_name] = {
                "total_metrics": file_analysis['total_metrics'],
                "sections": file_analysis['sections'],
                "coverage_analysis": file_analysis['coverage_analysis'],
                "file_classification": file_analysis['file_classification']
            }

        master_registry["section_semantic_mapping"] = section_analyses
        master_registry["metadata"]["total_sections_analyzed"] = section_data['structural_insights']['total_sections_identified']
        print(f"   ✅ {len(section_analyses)} files with section analysis loaded")

    except Exception as e:
        print(f"   ⚠️ Section data error: {e}")

    # Generate consolidated file registry
    print("🔄 Consolidating complete file registry...")

    all_files = set()
    if canvas_entities:
        all_files.update(canvas_entities.keys())
    if section_analyses:
        all_files.update(section_analyses.keys())

    for file_name in sorted(all_files):
        if not file_name.endswith('.md'):
            continue

        # Get file metrics
        file_metrics = get_file_basic_metrics(file_name)

        consolidated_entry = {
            "file_name": file_name,
            "file_classification": classify_file_type(file_name),
            "basic_metrics": file_metrics,
            "canvas_data": canvas_entities.get(file_name, {}),
            "section_analysis": section_analyses.get(file_name, {}),
            "architectural_significance": calculate_architectural_significance(
                canvas_entities.get(file_name, {}),
                section_analyses.get(file_name, {}),
                file_metrics
            )
        }

        master_registry["complete_file_registry"].append(consolidated_entry)

    master_registry["metadata"]["total_files_mapped"] = len(master_registry["complete_file_registry"])

    # Generate architectural intelligence summary
    print("🧠 Generating architectural intelligence...")
    master_registry["architectural_intelligence"] = generate_architectural_intelligence(master_registry)

    # Generate navigation system
    print("🗺️ Creating navigation system...")
    master_registry["navigation_system"] = create_navigation_system(master_registry)

    return master_registry

def determine_spatial_zone(x_coordinate):
    """Determine spatial zone from x coordinate"""
    if x_coordinate < -10000:
        return "research_highlands"
    elif x_coordinate < -1000:
        return "orchestration_core"
    elif x_coordinate < 5000:
        return "intelligence_nucleus"
    elif x_coordinate < 12000:
        return "analytics_processing"
    else:
        return "interface_district"

def classify_file_type(file_name):
    """Classify file type by naming pattern"""
    import re

    if re.match(r'^\d{2}_', file_name):
        return "numbered_module"
    elif re.match(r'^0\.\d_', file_name):
        return "orchestration_core"
    elif file_name.isupper() and '_' in file_name:
        return "master_document"
    else:
        return "supporting_document"

def get_file_basic_metrics(file_name):
    """Get basic file metrics"""
    try:
        if os.path.exists(file_name):
            with open(file_name, 'r', encoding='utf-8') as f:
                content = f.read()

            lines = content.split('\n')
            tokens = content.split()

            return {
                "lines": len(lines),
                "tokens": len(tokens),
                "characters": len(content),
                "size_kb": round(len(content) / 1024, 1)
            }
    except:
        pass

    return {"lines": 0, "tokens": 0, "characters": 0, "size_kb": 0}

def calculate_architectural_significance(canvas_data, section_data, file_metrics):
    """Calculate overall architectural significance"""

    significance_score = 0

    # Canvas height indicates complexity
    canvas_height = canvas_data.get('coordinates', {}).get('height', 0)
    if canvas_height > 8000:
        significance_score += 3
    elif canvas_height > 5000:
        significance_score += 2
    elif canvas_height > 2000:
        significance_score += 1

    # File size indicates depth
    tokens = file_metrics.get('tokens', 0)
    if tokens > 3000:
        significance_score += 3
    elif tokens > 1500:
        significance_score += 2
    elif tokens > 500:
        significance_score += 1

    # Section count indicates comprehensiveness
    section_count = len(section_data.get('sections', {}))
    if section_count > 15:
        significance_score += 2
    elif section_count > 10:
        significance_score += 1

    if significance_score >= 7:
        return "critical"
    elif significance_score >= 5:
        return "high"
    elif significance_score >= 3:
        return "medium"
    else:
        return "low"

def generate_architectural_intelligence(master_registry):
    """Generate architectural intelligence summary"""

    file_registry = master_registry["complete_file_registry"]

    # Classification distribution
    classifications = Counter(entry["file_classification"] for entry in file_registry)

    # Significance distribution
    significance = Counter(entry["architectural_significance"] for entry in file_registry)

    # Spatial distribution
    spatial_zones = Counter()
    for entry in file_registry:
        zone = entry["canvas_data"].get("spatial_zone", "unmapped")
        spatial_zones[zone] += 1

    return {
        "file_classifications": dict(classifications),
        "significance_distribution": dict(significance),
        "spatial_distribution": dict(spatial_zones),
        "total_content_metrics": {
            "total_lines": sum(entry["basic_metrics"]["lines"] for entry in file_registry),
            "total_tokens": sum(entry["basic_metrics"]["tokens"] for entry in file_registry),
            "total_size_kb": sum(entry["basic_metrics"]["size_kb"] for entry in file_registry)
        }
    }

def create_navigation_system(master_registry):
    """Create navigation system for easy file discovery"""

    file_registry = master_registry["complete_file_registry"]

    navigation = {
        "by_significance": defaultdict(list),
        "by_classification": defaultdict(list),
        "by_spatial_zone": defaultdict(list),
        "largest_files": [],
        "most_complex_canvas_entities": []
    }

    for entry in file_registry:
        file_name = entry["file_name"]

        # Group by significance
        significance = entry["architectural_significance"]
        navigation["by_significance"][significance].append(file_name)

        # Group by classification
        classification = entry["file_classification"]
        navigation["by_classification"][classification].append(file_name)

        # Group by spatial zone
        zone = entry["canvas_data"].get("spatial_zone", "unmapped")
        navigation["by_spatial_zone"][zone].append(file_name)

    # Sort files by size for largest files
    sorted_by_tokens = sorted(file_registry, key=lambda x: x["basic_metrics"]["tokens"], reverse=True)
    navigation["largest_files"] = [
        {
            "file": entry["file_name"],
            "tokens": entry["basic_metrics"]["tokens"],
            "lines": entry["basic_metrics"]["lines"]
        }
        for entry in sorted_by_tokens[:15]
    ]

    # Sort by Canvas height for visual complexity
    canvas_files = [entry for entry in file_registry if entry["canvas_data"]]
    sorted_by_height = sorted(canvas_files, key=lambda x: x["canvas_data"].get("coordinates", {}).get("height", 0), reverse=True)
    navigation["most_complex_canvas_entities"] = [
        {
            "file": entry["file_name"],
            "canvas_height": entry["canvas_data"]["coordinates"]["height"],
            "spatial_zone": entry["canvas_data"]["spatial_zone"]
        }
        for entry in sorted_by_height[:15]
    ]

    return navigation

def main():
    """Execute registry consolidation"""

    master_registry = consolidate_all_registries()

    # Export master registry
    with open("MASTER_REGISTRY.json", 'w') as f:
        json.dump(master_registry, f, indent=2, ensure_ascii=False)

    print(f"\n✅ MASTER REGISTRY CREATED!")
    print(f"📊 Files mapped: {master_registry['metadata']['total_files_mapped']}")
    print(f"📋 Sections analyzed: {master_registry['metadata']['total_sections_analyzed']}")
    print(f"🗺️ Canvas entities: {master_registry['metadata']['total_canvas_entities']}")
    print(f"💾 Saved as: MASTER_REGISTRY.json")

if __name__ == "__main__":
    main()