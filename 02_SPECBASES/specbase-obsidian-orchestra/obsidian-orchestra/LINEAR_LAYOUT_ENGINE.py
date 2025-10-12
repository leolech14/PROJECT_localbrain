#!/usr/bin/env python3
"""
🎯 LINEAR LAYOUT ENGINE
Create linear left-to-right layout with full content extent and proper spacing

MATHEMATICAL ANALYSIS:
- 21_AGENT_CONSOLE.md: 367 lines = 9632px height
- Ratio: 26.2 pixels per line of content
- Width: 640px (optimal for text readability)

LAYOUT STRATEGY:
- Linear left-to-right positioning in numbering order
- Full content extent (proportional to actual line count)
- Proper spacing between files
- Remove all connections for clean view
"""

import json
import re
import os
from datetime import datetime

class LinearLayoutEngine:
    """
    Creates perfect linear layout with content-proportional dimensions
    """

    def __init__(self):
        # Mathematical constants derived from analysis
        self.pixels_per_line = 26.2  # From 21_AGENT_CONSOLE analysis
        self.optimal_width = 640     # Optimal width for text readability
        self.file_spacing = 100      # Space between files (larger gaps)
        self.start_x = 0            # Starting X position
        self.start_y = 0            # Starting Y position (all on same row)

    def load_canvas_and_registry(self):
        """Load Canvas and registry data"""

        print("📊 Loading Canvas and registry data...")

        # Load Canvas
        with open("CANVAS VIEW.canvas", 'r') as f:
            self.canvas_data = json.load(f)

        # Load Master Registry for metrics
        with open("MASTER_REGISTRY.json", 'r') as f:
            self.registry_data = json.load(f)

        print(f"   ✅ Canvas: {len(self.canvas_data['nodes'])} entities")
        print(f"   ✅ Registry: {len(self.registry_data['complete_file_registry'])} files")

    def calculate_full_extent_dimensions(self, file_metrics: dict) -> tuple:
        """Calculate full extent dimensions based on content"""

        lines = file_metrics.get('lines', 10)

        # Calculate height based on actual content lines
        calculated_height = int(lines * self.pixels_per_line)

        # Use optimal width for readability
        calculated_width = self.optimal_width

        return calculated_width, calculated_height

    def sort_files_in_numbering_order(self) -> list:
        """Sort all files in perfect numbering order"""

        files_with_metrics = []

        for file_entry in self.registry_data['complete_file_registry']:
            file_name = file_entry['file_name']

            # Create sort key for perfect ordering
            if re.match(r'^0\.\d_', file_name):
                # Orchestration files: 0.2, 0.3, 0.4
                decimal_part = float(file_name[:3])
                sort_key = (0, decimal_part, file_name)
            elif re.match(r'^\d{2}_', file_name):
                # Numbered modules: 00, 01, 02, ... 90
                number = int(file_name[:2])
                sort_key = (1, number, file_name)
            elif file_name.startswith('COMPLETE_'):
                # Master specifications first
                sort_key = (2, 0, file_name)
            elif file_name.startswith('ULTIMATE_'):
                # Implementation roadmaps
                sort_key = (2, 1, file_name)
            elif file_name.startswith('POLICY_'):
                # Policy documents
                sort_key = (2, 2, file_name)
            else:
                # All other files alphabetically
                sort_key = (3, 0, file_name)

            files_with_metrics.append({
                'sort_key': sort_key,
                'file_name': file_name,
                'metrics': file_entry['basic_metrics']
            })

        # Sort by the key
        sorted_files = sorted(files_with_metrics, key=lambda x: x['sort_key'])

        print(f"📋 Sorted {len(sorted_files)} files in numbering order")
        return sorted_files

    def create_linear_layout(self, sorted_files: list) -> dict:
        """Create linear left-to-right layout with full extent"""

        print("📐 Creating linear layout with full content extent...")

        positioned_files = {}
        current_x = self.start_x
        current_y = self.start_y

        for i, file_info in enumerate(sorted_files):
            file_name = file_info['file_name']
            file_metrics = file_info['metrics']

            # Calculate full extent dimensions
            width, height = self.calculate_full_extent_dimensions(file_metrics)

            # Position file
            positioned_files[file_name] = {
                'coordinates': {
                    'x': current_x,
                    'y': current_y,
                    'width': width,
                    'height': height
                },
                'sequence_number': i + 1,
                'content_lines': file_metrics['lines'],
                'content_tokens': file_metrics['tokens']
            }

            print(f"   📍 {i+1:2}. {file_name:<50} ({current_x:5}, {current_y}) {width}×{height}px ({file_metrics['lines']} lines)")

            # Move to next position
            current_x += width + self.file_spacing

        return positioned_files

    def update_canvas_linear_layout(self, positioned_files: dict):
        """Update Canvas with linear layout and remove connections"""

        print("🔄 Updating Canvas with linear layout...")

        # Update file nodes with new positions
        updated_count = 0
        for node in self.canvas_data['nodes']:
            if node['type'] == 'file' and 'file' in node:
                file_name = node['file']

                if file_name in positioned_files:
                    position = positioned_files[file_name]

                    # Update coordinates
                    node['x'] = position['coordinates']['x']
                    node['y'] = position['coordinates']['y']
                    node['width'] = position['coordinates']['width']
                    node['height'] = position['coordinates']['height']

                    updated_count += 1

        # Remove ALL connections for clean view
        print("🧹 Removing all connections for clean linear view...")
        self.canvas_data['edges'] = []

        # Remove non-markdown file nodes for cleaner view (keep only .md files)
        original_node_count = len(self.canvas_data['nodes'])
        self.canvas_data['nodes'] = [
            node for node in self.canvas_data['nodes']
            if node['type'] == 'file' and node.get('file', '').endswith('.md')
        ]

        print(f"   ✅ Files repositioned: {updated_count}")
        print(f"   🧹 Connections removed: All")
        print(f"   📄 Cleaned nodes: {original_node_count} → {len(self.canvas_data['nodes'])}")

        return updated_count

    def add_mathematical_metadata(self):
        """Add metadata about the mathematical organization"""

        self.canvas_data['mathematical_layout'] = {
            'generated_at': datetime.now().isoformat(),
            'layout_type': 'linear_left_to_right',
            'spacing_pixels': self.file_spacing,
            'pixels_per_line_ratio': self.pixels_per_line,
            'optimal_width': self.optimal_width,
            'ordering_system': 'numerical_sequence',
            'total_files_positioned': len([n for n in self.canvas_data['nodes'] if n['type'] == 'file'])
        }

    def save_linear_canvas(self, output_file: str = "CANVAS VIEW.canvas"):
        """Save the linear layout Canvas"""

        with open(output_file, 'w') as f:
            json.dump(self.canvas_data, f, indent=1)

        print(f"💾 Linear Canvas saved: {output_file}")

    def execute_linear_layout(self):
        """Execute complete linear layout reorganization"""

        print("🎯 LINEAR LAYOUT ENGINE - ENGAGING")
        print("📐 Creating linear left-to-right layout with full extent")
        print("=" * 60)

        # Load data
        self.load_canvas_and_registry()

        # Sort files in numbering order
        sorted_files = self.sort_files_in_numbering_order()

        # Create linear layout
        positioned_files = self.create_linear_layout(sorted_files)

        # Update Canvas
        updated_count = self.update_canvas_linear_layout(positioned_files)

        # Add mathematical metadata
        self.add_mathematical_metadata()

        # Save Canvas
        self.save_linear_canvas()

        # Generate summary
        total_width = max(pos['coordinates']['x'] + pos['coordinates']['width']
                         for pos in positioned_files.values())

        print(f"\n✅ LINEAR LAYOUT COMPLETE!")
        print(f"📊 Files positioned: {updated_count}")
        print(f"📏 Total Canvas width: {total_width:,}px")
        print(f"📐 Layout: Linear left-to-right")
        print(f"🔢 Order: Perfect numbering sequence")
        print(f"📖 Dimensions: Full content extent")

        return {
            'positioned_files': positioned_files,
            'total_width': total_width,
            'files_count': updated_count
        }

def main():
    """Execute linear layout engine"""

    engine = LinearLayoutEngine()
    results = engine.execute_linear_layout()

    print("\n🎯 LINEAR LAYOUT ENGINE COMPLETE!")
    print("📐 All files positioned in linear order with full extent")
    print("🧹 Connections removed for clean view")
    print("📏 Content-proportional dimensions applied")

if __name__ == "__main__":
    main()