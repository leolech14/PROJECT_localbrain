#!/usr/bin/env python3
"""
🎯 SPATIAL MATHEMATICS ENGINE
Reposition Canvas nodes with mathematical precision based on content dimensions

MATHEMATICAL APPROACH:
- Calculate content-based dimensions (width/height from tokens/lines)
- Position files in numbering order with precise spacing
- Apply 5% spacing between files consistently
- Create perfect mathematical grid layout
"""

import json
import re
import math
from datetime import datetime
from typing import Dict, List, Tuple

class SpatialMathematicsEngine:
    """
    Mathematical Canvas repositioning engine
    """

    def __init__(self):
        self.base_width = 800  # Base width for calculations
        self.base_height = 400  # Base height for calculations
        self.spacing_percentage = 0.05  # 5% spacing between files
        self.columns_per_row = 6  # Files per row for grid layout

    def load_data(self):
        """Load Canvas and registry data"""

        print("📊 Loading Canvas and registry data...")

        # Load Canvas
        with open("CANVAS VIEW.canvas", 'r') as f:
            self.canvas_data = json.load(f)

        # Load Master Registry for content metrics
        with open("MASTER_REGISTRY.json", 'r') as f:
            self.registry_data = json.load(f)

        print(f"   ✅ Canvas: {len(self.canvas_data['nodes'])} entities")
        print(f"   ✅ Registry: {len(self.registry_data['complete_file_registry'])} files")

    def calculate_content_based_dimensions(self, file_metrics: Dict) -> Tuple[int, int]:
        """Calculate Canvas dimensions based on actual content metrics"""

        tokens = file_metrics.get('tokens', 100)
        lines = file_metrics.get('lines', 10)

        # Mathematical scaling based on content
        # Width: Based on average line length (tokens/lines ratio)
        # Height: Based on total content volume (lines)

        avg_line_length = tokens / lines if lines > 0 else 10

        # Scale width based on line complexity (more tokens per line = wider)
        width_factor = min(2.0, max(0.5, avg_line_length / 20))  # Normalize around 20 tokens/line
        calculated_width = int(self.base_width * width_factor)

        # Scale height based on total lines (more lines = taller)
        height_factor = max(0.3, min(5.0, lines / 100))  # Normalize around 100 lines
        calculated_height = int(self.base_height * height_factor)

        return calculated_width, calculated_height

    def sort_files_by_numbering_order(self) -> List[Dict]:
        """Sort files by their numbering order (00, 01, 0.2, etc.)"""

        file_entries = []

        for file_entry in self.registry_data['complete_file_registry']:
            file_name = file_entry['file_name']

            # Extract sorting key
            if re.match(r'^\d{2}_', file_name):
                # Numbered modules: 00_, 01_, etc.
                number = int(file_name[:2])
                sort_key = (1, number, file_name)
            elif re.match(r'^0\.\d_', file_name):
                # Orchestration: 0.2_, 0.3_, etc.
                decimal = float(file_name[:3])
                sort_key = (0, decimal, file_name)
            elif file_name.isupper() and '_' in file_name:
                # Master documents: alphabetical
                sort_key = (2, 0, file_name)
            else:
                # Supporting documents: alphabetical
                sort_key = (3, 0, file_name)

            file_entries.append({
                'sort_key': sort_key,
                'file_data': file_entry
            })

        # Sort by the calculated key
        sorted_entries = sorted(file_entries, key=lambda x: x['sort_key'])
        return [entry['file_data'] for entry in sorted_entries]

    def calculate_grid_positions(self, sorted_files: List[Dict]) -> Dict:
        """Calculate precise grid positions with mathematical spacing"""

        print("📐 Calculating mathematical grid positions...")

        positioned_files = {}
        start_x = 0
        start_y = 0
        current_row_max_height = 0
        files_in_current_row = 0

        for i, file_entry in enumerate(sorted_files):
            file_name = file_entry['file_name']
            file_metrics = file_entry['basic_metrics']

            # Calculate content-based dimensions
            width, height = self.calculate_content_based_dimensions(file_metrics)

            # Calculate spacing (5% of file width)
            spacing = int(width * self.spacing_percentage)

            # Position calculation
            if files_in_current_row >= self.columns_per_row:
                # Move to next row
                start_x = 0
                start_y += current_row_max_height + spacing
                current_row_max_height = 0
                files_in_current_row = 0

            x = start_x
            y = start_y

            # Track max height in current row for next row calculation
            current_row_max_height = max(current_row_max_height, height)

            positioned_files[file_name] = {
                'coordinates': {
                    'x': x,
                    'y': y,
                    'width': width,
                    'height': height
                },
                'row': y // (self.base_height + spacing),
                'column': files_in_current_row,
                'content_metrics': file_metrics
            }

            # Prepare for next file
            start_x += width + spacing
            files_in_current_row += 1

            print(f"   📍 {file_name}: ({x}, {y}) {width}×{height}px")

        return positioned_files

    def update_canvas_with_mathematical_positions(self, positioned_files: Dict):
        """Update Canvas JSON with new mathematical positions"""

        print("🔄 Updating Canvas with mathematical positions...")

        updated_nodes = []

        for node in self.canvas_data['nodes']:
            if node['type'] == 'file' and 'file' in node:
                file_name = node['file']

                if file_name in positioned_files:
                    # Update with mathematical position
                    position_data = positioned_files[file_name]

                    updated_node = node.copy()
                    updated_node['x'] = position_data['coordinates']['x']
                    updated_node['y'] = position_data['coordinates']['y']
                    updated_node['width'] = position_data['coordinates']['width']
                    updated_node['height'] = position_data['coordinates']['height']

                    updated_nodes.append(updated_node)
                    print(f"   ✅ Updated: {file_name}")
                else:
                    # Keep original position for unmapped files
                    updated_nodes.append(node)
            else:
                # Keep non-file nodes (text, diagrams) unchanged
                updated_nodes.append(node)

        # Update Canvas data
        self.canvas_data['nodes'] = updated_nodes

        return len([n for n in updated_nodes if n['type'] == 'file'])

    def generate_mathematical_layout_report(self) -> Dict:
        """Generate report on the mathematical layout"""

        report = {
            'layout_algorithm': 'content_proportional_grid',
            'spacing_formula': '5% of file width',
            'dimension_calculation': {
                'width': 'base_width * (avg_tokens_per_line / 20)',
                'height': 'base_height * (total_lines / 100)'
            },
            'grid_parameters': {
                'columns_per_row': self.columns_per_row,
                'base_width': self.base_width,
                'base_height': self.base_height,
                'spacing_percentage': self.spacing_percentage
            }
        }

        return report

    def save_mathematically_organized_canvas(self, output_file: str = "CANVAS VIEW.canvas"):
        """Save the mathematically reorganized Canvas"""

        # Add metadata about mathematical organization
        self.canvas_data['metadata'] = {
            'mathematical_organization': True,
            'generated_at': datetime.now().isoformat(),
            'algorithm': 'spatial_mathematics_engine',
            'spacing_formula': f'{self.spacing_percentage * 100}% of file width',
            'total_files_positioned': len(self.registry_data['complete_file_registry'])
        }

        with open(output_file, 'w') as f:
            json.dump(self.canvas_data, f, indent=1)

        print(f"💾 Mathematical Canvas saved: {output_file}")

    def execute_spatial_reorganization(self):
        """Execute complete spatial reorganization with mathematical precision"""

        print("🎯 SPATIAL MATHEMATICS ENGINE - ENGAGING")
        print("📐 Repositioning Canvas with mathematical precision")
        print("=" * 55)

        # Load data
        self.load_data()

        # Sort files by numbering order
        print("🔢 Sorting files by numbering order...")
        sorted_files = self.sort_files_by_numbering_order()
        print(f"   ✅ {len(sorted_files)} files sorted")

        # Calculate mathematical grid positions
        positioned_files = self.calculate_grid_positions(sorted_files)

        # Update Canvas with new positions
        updated_count = self.update_canvas_with_mathematical_positions(positioned_files)

        # Generate layout report
        layout_report = self.generate_mathematical_layout_report()

        # Save organized Canvas
        self.save_mathematically_organized_canvas()

        print("\n✅ SPATIAL MATHEMATICS COMPLETE!")
        print(f"📊 Files repositioned: {updated_count}")
        print(f"📐 Mathematical grid applied with {self.spacing_percentage*100}% spacing")
        print(f"🎯 Content-proportional dimensions calculated")

        return {
            'positioned_files': positioned_files,
            'layout_report': layout_report,
            'updated_files_count': updated_count
        }

def main():
    """Execute spatial mathematics engine"""

    engine = SpatialMathematicsEngine()
    results = engine.execute_spatial_reorganization()

    print("\n🎯 SPATIAL MATHEMATICS ENGINE COMPLETE!")
    print("📐 Canvas reorganized with mathematical precision")
    print("🔢 Files positioned by numbering order")
    print("📏 Content-proportional dimensions applied")
    print("📊 Perfect 5% spacing maintained")

if __name__ == "__main__":
    main()