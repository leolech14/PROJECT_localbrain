#!/usr/bin/env python3
"""
🗺️ CANVAS ENTITY REGISTRY EXPLORER
Comprehensive navigation and analysis tool for the Financial Intelligence Platform Canvas
"""

import json
import os
from typing import List, Dict, Any, Tuple

class CanvasExplorer:
    def __init__(self, registry_path: str = "CANVAS_ENTITY_REGISTRY.json"):
        with open(registry_path, 'r') as f:
            self.registry = json.load(f)

        print(f"🎯 Canvas Explorer Initialized")
        print(f"📊 Total Entities: {self.registry['metadata']['total_entities']}")
        print(f"🗺️ Canvas Size: {self.registry['metadata']['canvas_bounds']['total_width']}×{self.registry['metadata']['canvas_bounds']['total_height']}px")
        print()

    def get_file_metrics(self) -> Dict[str, Any]:
        """Get comprehensive file analysis with line counts and complexity"""
        files = []

        for file_path in os.listdir('.'):
            if file_path.endswith('.md') and not file_path.startswith('.'):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        line_count = len(lines)

                    # Determine complexity based on line count
                    if line_count > 800:
                        complexity = "very_high"
                    elif line_count > 400:
                        complexity = "high"
                    elif line_count > 200:
                        complexity = "medium"
                    else:
                        complexity = "low"

                    # Extract front matter state if present
                    state = "unknown"
                    for line in lines[:30]:  # Check first 30 lines for front matter
                        if "state:" in line:
                            state = line.split("state:")[-1].strip().strip('"')
                            break

                    files.append({
                        "name": file_path,
                        "lines": line_count,
                        "complexity": complexity,
                        "state": state,
                        "size_kb": round(os.path.getsize(file_path) / 1024, 1)
                    })
                except Exception as e:
                    print(f"⚠️ Error reading {file_path}: {e}")

        return sorted(files, key=lambda x: x['lines'], reverse=True)

    def find_by_zone(self, zone_name: str) -> List[Dict]:
        """Find all entities in a specific architectural zone"""
        zone_bounds = self.registry['architectural_zones'].get(zone_name, {}).get('bounds', {})
        if not zone_bounds:
            return []

        entities_in_zone = []
        for entity in self.registry['entities']:
            x, y = entity['coordinates']['x'], entity['coordinates']['y']
            if (zone_bounds['x_min'] <= x <= zone_bounds['x_max'] and
                zone_bounds['y_min'] <= y <= zone_bounds['y_max']):
                entities_in_zone.append(entity)

        return entities_in_zone

    def find_by_coordinates(self, x: int, y: int, radius: int = 1000) -> List[Dict]:
        """Find entities near specific coordinates"""
        nearby = []
        for entity in self.registry['entities']:
            entity_x, entity_y = entity['coordinates']['x'], entity['coordinates']['y']
            distance = ((entity_x - x)**2 + (entity_y - y)**2)**0.5
            if distance <= radius:
                nearby.append({
                    'entity': entity,
                    'distance': round(distance)
                })

        return sorted(nearby, key=lambda x: x['distance'])

    def analyze_content_distribution(self):
        """Analyze the distribution of content across the Canvas"""
        print("📊 CONTENT DISTRIBUTION ANALYSIS\n")

        # Get file metrics
        file_metrics = self.get_file_metrics()

        # Complexity distribution
        complexity_counts = {}
        for file_info in file_metrics:
            comp = file_info['complexity']
            complexity_counts[comp] = complexity_counts.get(comp, 0) + 1

        print("🎯 COMPLEXITY DISTRIBUTION:")
        for complexity, count in sorted(complexity_counts.items()):
            print(f"   {complexity.upper()}: {count} files")

        print(f"\n📋 TOP 10 LARGEST FILES:")
        for i, file_info in enumerate(file_metrics[:10], 1):
            print(f"   {i:2}. {file_info['name']:<40} {file_info['lines']:4} lines ({file_info['complexity']})")

        print(f"\n🎯 COMPLETION STATES:")
        states = {}
        for file_info in file_metrics:
            state = file_info['state']
            states[state] = states.get(state, 0) + 1

        for state, count in sorted(states.items()):
            print(f"   {state.upper()}: {count} files")

    def generate_navigation_map(self):
        """Generate a text-based navigation map"""
        print("🗺️ CANVAS NAVIGATION MAP\n")

        zones = self.registry['architectural_zones']
        for zone_name, zone_info in zones.items():
            print(f"🏗️ {zone_name.upper().replace('_', ' ')}")
            print(f"   📍 Bounds: X({zone_info['bounds']['x_min']} to {zone_info['bounds']['x_max']}) Y({zone_info['bounds']['y_min']} to {zone_info['bounds']['y_max']})")
            print(f"   🎨 Theme: {zone_info['color_theme']}")
            print(f"   📝 {zone_info['description']}")

            # Find entities in this zone
            entities = self.find_by_zone(zone_name)
            print(f"   📊 Files: {len(entities)}")
            print()

    def find_largest_files_by_canvas_height(self):
        """Find files with largest Canvas heights (indicating content volume)"""
        print("📏 CANVAS HEIGHT ANALYSIS (Content Volume Visualization)\n")

        file_entities = [e for e in self.registry['entities'] if e['type'] == 'file' and e.get('file_name', '').endswith('.md')]
        by_height = sorted(file_entities, key=lambda x: x['coordinates']['height'], reverse=True)

        print("🏗️ TALLEST CANVAS ENTITIES (Visual Content Volume):")
        for i, entity in enumerate(by_height[:10], 1):
            height = entity['coordinates']['height']
            width = entity['coordinates']['width']
            name = entity['file_name']
            print(f"   {i:2}. {name:<50} {height:5}px H × {width:3}px W")

def main():
    """Main exploration interface"""
    print("🎯 FINANCIAL INTELLIGENCE PLATFORM - CANVAS REGISTRY EXPLORER")
    print("=" * 70)

    try:
        explorer = CanvasExplorer()

        print("\n1️⃣ CONTENT ANALYSIS:")
        explorer.analyze_content_distribution()

        print("\n2️⃣ NAVIGATION MAP:")
        explorer.generate_navigation_map()

        print("\n3️⃣ CANVAS HEIGHT ANALYSIS:")
        explorer.find_largest_files_by_canvas_height()

        print("\n✅ Canvas exploration complete!")

    except FileNotFoundError:
        print("❌ Registry file not found. Please ensure CANVAS_ENTITY_REGISTRY.json exists.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()