#!/usr/bin/env python3
"""
Registry Validation and Usage Examples
Validates the generated Canvas registry and demonstrates usage patterns
"""

import json
from pathlib import Path

def load_registry():
    """Load the generated registry file"""
    registry_path = Path(__file__).parent / "CANVAS_REGISTRY.json"
    with open(registry_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate_registry(registry):
    """Validate registry structure and data integrity"""
    validation_results = {
        "metadata_valid": False,
        "entities_valid": False,
        "files_valid": False,
        "categories_valid": False,
        "spatial_data_valid": False,
        "issues": []
    }

    # Validate metadata
    if "metadata" in registry and registry["metadata"].get("total_entities", 0) > 0:
        validation_results["metadata_valid"] = True
    else:
        validation_results["issues"].append("Invalid or missing metadata")

    # Validate entities
    entities = registry.get("entities", [])
    if entities and len(entities) > 0:
        validation_results["entities_valid"] = True

        # Check spatial data
        spatial_valid = True
        for entity in entities:
            coords = entity.get("coordinates", {})
            bbox = entity.get("bounding_box", {})
            if not all(key in coords for key in ["x", "y", "width", "height"]):
                spatial_valid = False
                break
            if not all(key in bbox for key in ["left", "top", "right", "bottom"]):
                spatial_valid = False
                break

        validation_results["spatial_data_valid"] = spatial_valid
        if not spatial_valid:
            validation_results["issues"].append("Invalid spatial coordinate data")
    else:
        validation_results["issues"].append("No entities found")

    # Validate files
    files = registry.get("files", {})
    if files and len(files) > 0:
        validation_results["files_valid"] = True
    else:
        validation_results["issues"].append("No file analyses found")

    # Validate categories
    categories = registry.get("categories", {})
    required_categories = ["functional_domains", "architectural_layers", "specification_types", "priority_levels"]
    if all(cat in categories for cat in required_categories):
        validation_results["categories_valid"] = True
    else:
        validation_results["issues"].append("Missing category data")

    return validation_results

def get_entity_by_coordinates(registry, x_min, x_max, y_min, y_max):
    """Find entities within coordinate bounds"""
    entities_in_bounds = []
    for entity in registry.get("entities", []):
        coords = entity.get("coordinates", {})
        if (x_min <= coords.get("x", 0) <= x_max and
            y_min <= coords.get("y", 0) <= y_max):
            entities_in_bounds.append(entity)
    return entities_in_bounds

def get_files_by_complexity(registry, min_complexity=0, max_complexity=float('inf')):
    """Find files by complexity score range"""
    complex_files = []
    for file_path, analysis in registry.get("files", {}).items():
        complexity = analysis.get("complexity_score", 0)
        if min_complexity <= complexity <= max_complexity:
            complex_files.append({
                "file": file_path,
                "complexity": complexity,
                "lines": analysis.get("line_count", 0),
                "domain": analysis.get("functional_domain", "Unknown")
            })
    return sorted(complex_files, key=lambda x: x["complexity"], reverse=True)

def get_files_by_domain(registry, domain):
    """Find all files in a specific functional domain"""
    domain_files = []
    for file_path, analysis in registry.get("files", {}).items():
        if analysis.get("functional_domain") == domain:
            domain_files.append({
                "file": file_path,
                "complexity": analysis.get("complexity_score", 0),
                "lines": analysis.get("line_count", 0),
                "completion": analysis.get("completion_score", 0)
            })
    return sorted(domain_files, key=lambda x: x["complexity"], reverse=True)

def get_implementation_order(registry):
    """Get suggested implementation order based on dependencies"""
    layers = registry.get("categories", {}).get("architectural_layers", {})

    # Define implementation order based on layer dependencies
    order = [
        "System Infrastructure",
        "Data Infrastructure",
        "Core Intelligence",
        "Financial Processing",
        "Analytics & Visualization",
        "User Interface",
        "Presentation Layer",
        "External Integration",
        "Meta-Orchestration"
    ]

    implementation_plan = []
    for layer in order:
        if layer in layers:
            files_in_layer = get_files_by_layer(registry, layer)
            if files_in_layer:
                implementation_plan.append({
                    "phase": layer,
                    "file_count": len(files_in_layer),
                    "files": files_in_layer[:5]  # Top 5 files
                })

    return implementation_plan

def get_files_by_layer(registry, layer):
    """Get files in a specific architectural layer"""
    layer_files = []
    for file_path, analysis in registry.get("files", {}).items():
        if analysis.get("architectural_layer") == layer:
            layer_files.append({
                "file": file_path,
                "complexity": analysis.get("complexity_score", 0),
                "priority": analysis.get("priority_level", "low")
            })
    return sorted(layer_files, key=lambda x: x["complexity"], reverse=True)

def main():
    print("🔍 CANVAS REGISTRY VALIDATION & USAGE EXAMPLES")
    print("=" * 60)

    # Load and validate registry
    registry = load_registry()
    validation = validate_registry(registry)

    print("\n📋 VALIDATION RESULTS:")
    for check, result in validation.items():
        if check != "issues":
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {check}: {status}")

    if validation["issues"]:
        print("\n⚠️  ISSUES FOUND:")
        for issue in validation["issues"]:
            print(f"  - {issue}")

    print(f"\n📊 REGISTRY STATISTICS:")
    metadata = registry.get("metadata", {})
    print(f"  Total Entities: {metadata.get('total_entities', 0)}")
    print(f"  Files Analyzed: {metadata.get('total_files_analyzed', 0)}")
    print(f"  Connections: {len(registry.get('connections', []))}")

    # Usage Example 1: Find entities in central area
    print(f"\n🎯 EXAMPLE 1: Entities in Central Hub Area")
    central_entities = get_entity_by_coordinates(registry, 0, 2000, -5000, 0)
    print(f"  Found {len(central_entities)} entities in central area")
    for entity in central_entities[:3]:
        entity_type = entity.get("type", "unknown")
        coords = entity.get("coordinates", {})
        print(f"    - {entity_type} at ({coords.get('x')}, {coords.get('y')})")

    # Usage Example 2: High complexity files
    print(f"\n🧠 EXAMPLE 2: High Complexity Files")
    complex_files = get_files_by_complexity(registry, min_complexity=50)
    print(f"  Found {len(complex_files)} high-complexity files")
    for file_info in complex_files[:5]:
        print(f"    - {Path(file_info['file']).name}: {file_info['complexity']} complexity, {file_info['lines']} lines")

    # Usage Example 3: Agent Intelligence domain
    print(f"\n🤖 EXAMPLE 3: Agent Intelligence Domain Files")
    agent_files = get_files_by_domain(registry, "Agent Intelligence")
    print(f"  Found {len(agent_files)} agent intelligence files")
    for file_info in agent_files[:5]:
        print(f"    - {Path(file_info['file']).name}: {file_info['complexity']} complexity")

    # Usage Example 4: Implementation order
    print(f"\n🚀 EXAMPLE 4: Suggested Implementation Order")
    impl_order = get_implementation_order(registry)
    for i, phase in enumerate(impl_order[:5], 1):
        print(f"  Phase {i}: {phase['phase']} ({phase['file_count']} files)")
        if phase['files']:
            print(f"    Key file: {Path(phase['files'][0]['file']).name}")

    # Usage Example 5: Spatial analysis
    print(f"\n📍 EXAMPLE 5: Spatial Distribution Analysis")
    entities = registry.get("entities", [])
    if entities:
        x_coords = [e.get("coordinates", {}).get("x", 0) for e in entities]
        y_coords = [e.get("coordinates", {}).get("y", 0) for e in entities]
        print(f"  X Range: {min(x_coords)} to {max(x_coords)}")
        print(f"  Y Range: {min(y_coords)} to {max(y_coords)}")
        print(f"  Canvas Area: {max(x_coords) - min(x_coords)} × {max(y_coords) - min(y_coords)} units")

    print(f"\n✅ Registry validation and examples complete!")
    print(f"📄 Full registry available in: CANVAS_REGISTRY.json")
    print(f"📖 Navigation guide available in: CANVAS_NAVIGATION_INTELLIGENCE.md")

if __name__ == "__main__":
    main()