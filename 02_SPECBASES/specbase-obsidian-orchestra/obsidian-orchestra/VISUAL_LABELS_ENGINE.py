#!/usr/bin/env python3
"""
🎯 VISUAL LABELS ENGINE
Add visual text elements to Canvas for zoomed-out visibility

LABELING STRATEGY:
- File name labels above each file
- Group headers for PDF sections
- Large readable text for zoomed-out view
- Color-coded labels matching file themes
"""

import json
import re
from datetime import datetime
from pathlib import Path

class VisualLabelsEngine:
    """
    Creates visual text labels for Canvas entities
    """

    def __init__(self):
        self.label_height = 100  # Height for file name labels
        self.label_offset = 120  # Distance above files
        self.group_header_height = 150  # Height for group headers
        self.group_header_offset = 200  # Distance above PDF group

    def load_current_canvas(self):
        """Load current Canvas with mathematical layout"""
        print("📊 Loading current Canvas...")

        with open("CANVAS VIEW.canvas", 'r') as f:
            self.canvas_data = json.load(f)

        print(f"   ✅ Current entities: {len(self.canvas_data['nodes'])}")

    def create_file_name_labels(self) -> list:
        """Create file name labels for all files"""

        print("🏷️ Creating file name labels...")

        label_nodes = []
        label_id_counter = 2000

        # Get all file nodes
        file_nodes = [node for node in self.canvas_data['nodes'] if node['type'] == 'file']

        for file_node in file_nodes:
            file_path = file_node['file']
            file_name = Path(file_path).name

            # Create clean display name
            if file_name.endswith('.md'):
                display_name = self._create_clean_md_name(file_name)
            else:
                display_name = self._create_clean_pdf_name(file_name)

            # Position label above file
            label_x = file_node['x']
            label_y = file_node['y'] - self.label_offset
            label_width = file_node['width']

            label_node = {
                "id": f"label-{label_id_counter}",
                "type": "text",
                "text": f"**{display_name}**",
                "x": label_x,
                "y": label_y,
                "width": label_width,
                "height": self.label_height,
                "color": file_node.get('color', '2')
            }

            label_nodes.append(label_node)
            label_id_counter += 1

            print(f"   🏷️ {display_name}")

        return label_nodes

    def create_pdf_group_headers(self) -> list:
        """Create group headers for PDF sections"""

        print("📋 Creating PDF group headers...")

        # Get PDF groups from Canvas metadata
        pdf_groups = self.canvas_data.get('pdf_integration', {}).get('pdf_groups', {})

        group_headers = []
        header_id_counter = 3000

        # Calculate group positions
        current_x = 0
        for group_name, pdf_count in pdf_groups.items():

            group_description = self._get_group_description(group_name)

            # Calculate group width (PDFs + spacing)
            group_width = (640 * pdf_count) + (20 * (pdf_count - 1))

            header_node = {
                "id": f"group-header-{header_id_counter}",
                "type": "text",
                "text": f"# 📊 {group_name} GROUP\n**{group_description}**\n`{pdf_count} documents`",
                "x": current_x,
                "y": -2400,  # Above PDF row
                "width": group_width,
                "height": self.group_header_height,
                "color": self._get_group_color(group_name)
            }

            group_headers.append(header_node)
            header_id_counter += 1

            print(f"   📋 {group_name}: {pdf_count} files, width {group_width}px")

            # Move to next group position
            current_x += group_width + 100  # Group spacing

        return group_headers

    def create_main_canvas_title(self) -> dict:
        """Create main title for the entire Canvas"""

        title_node = {
            "id": "main-canvas-title",
            "type": "text",
            "text": "# 🎯 FINANCIAL INTELLIGENCE PLATFORM - COMPLETE ARCHITECTURAL UNIVERSE\n## 52 Research PDFs + 66 Implementation Specifications\n### Mathematical Organization with Content-Proportional Dimensions",
            "x": 0,
            "y": -2800,
            "width": 2000,
            "height": 200,
            "color": "1"
        }

        return title_node

    def create_navigation_legend(self) -> dict:
        """Create navigation legend for Canvas understanding"""

        legend_text = """# 🗺️ NAVIGATION LEGEND

## 📊 COLOR CODING:
🔴 **Red:** Orchestration & UI Components
🔵 **Blue:** Architecture & UI/UX Research
🟡 **Yellow:** Core Intelligence & Security
🟠 **Orange:** Analytics & Ledger Systems
🟢 **Green:** Processing Engines & Modules
🟣 **Purple:** Finance & Documentation

## 📐 LAYOUT SYSTEM:
**PDF Layer (Y:-2000):** Research documents with first page preview
**Specification Layer (Y:0):** Complete implementation specs

## 📏 DIMENSIONS:
**Height = Content Volume** (26.2 pixels per line of specification)
**Width = 640px** (optimal readability)
"""

        legend_node = {
            "id": "navigation-legend",
            "type": "text",
            "text": legend_text,
            "x": 2200,
            "y": -2800,
            "width": 800,
            "height": 600,
            "color": "6"
        }

        return legend_node

    def _create_clean_md_name(self, filename: str) -> str:
        """Create clean display name for markdown files"""

        name = filename.replace('.md', '')

        # Handle numbered modules
        if re.match(r'^\d{2}_', name):
            parts = name.split('_')
            number = parts[0]
            rest = ' '.join(parts[1:]).title().replace('_', ' ')
            return f"{number}. {rest}"

        # Handle orchestration files
        elif re.match(r'^0\.\d_', name):
            parts = name.split('_')
            number = parts[0]
            rest = ' '.join(parts[1:]).title().replace('_', ' ')
            return f"{number} {rest}"

        # Handle all caps files
        elif name.isupper():
            return name.replace('_', ' ').title()

        # Default cleaning
        else:
            return name.replace('_', ' ').title()

    def _create_clean_pdf_name(self, filename: str) -> str:
        """Create clean display name for PDF files"""

        name = filename.replace('.pdf', '')

        # Remove group prefixes
        prefixes = ['ARCH__audit__', 'UIX__uiux__', 'SEC__security__', 'LEDG__ledger__',
                   'LEDG__orchestrator__', 'LEDG__agent__', 'MOD__module__', 'FIN__open-finance__',
                   'FIN__tax__', 'OBS__observability__', 'DEV__devops__', 'EXT__extra__',
                   'EXT__wallet__', 'GRAPH__graph__', 'DOC__docs__']

        for prefix in prefixes:
            if name.startswith(prefix):
                name = name[len(prefix):]
                break

        # Extract number and clean title
        if re.match(r'^\d+\-', name):
            parts = name.split('-', 1)
            number = parts[0]
            title = parts[1].replace('-', ' ').replace('_', ' ').title()
            return f"{number}. {title}"
        else:
            return name.replace('-', ' ').replace('_', ' ').title()

    def _get_group_description(self, group_name: str) -> str:
        """Get description for PDF group"""

        descriptions = {
            'ARCH': 'Architecture & System Audit Documents',
            'UIX': 'User Interface & Experience Design',
            'SEC': 'Security & Compliance Framework',
            'LEDG': 'Ledger & Orchestration Systems',
            'MOD': 'Module Implementation & Design',
            'FIN': 'Finance & Tax Intelligence',
            'OBS': 'Observability & Data Quality',
            'DEV': 'DevOps & Infrastructure',
            'EXT': 'External Integration & Wallets',
            'GRAPH': 'Graph Visualization & Theory',
            'DOC': 'Documentation & Guidelines'
        }

        return descriptions.get(group_name, 'Research Documents')

    def _get_group_color(self, group_name: str) -> str:
        """Get color for PDF group header"""

        group_colors = {
            'ARCH': '1',    # Red
            'UIX': '2',     # Blue
            'SEC': '6',     # Yellow
            'LEDG': '4',    # Orange
            'MOD': '3',     # Green
            'FIN': '5',     # Purple
            'OBS': '6',     # Yellow
            'DEV': '3',     # Green
            'EXT': '2',     # Blue
            'GRAPH': '4',   # Orange
            'DOC': '5'      # Purple
        }

        return group_colors.get(group_name, '2')

    def integrate_visual_labels(self):
        """Integrate all visual labels into Canvas"""

        print("🎯 VISUAL LABELS ENGINE - ENGAGING")
        print("🏷️ Adding visual elements for zoomed-out visibility")
        print("=" * 55)

        # Load current Canvas
        self.load_current_canvas()

        # Create file name labels
        file_labels = self.create_file_name_labels()

        # Create PDF group headers
        group_headers = self.create_pdf_group_headers()

        # Create main title
        main_title = self.create_main_canvas_title()

        # Create navigation legend
        legend = self.create_navigation_legend()

        # Add all visual elements to Canvas
        self.canvas_data['nodes'].extend(file_labels)
        self.canvas_data['nodes'].extend(group_headers)
        self.canvas_data['nodes'].append(main_title)
        self.canvas_data['nodes'].append(legend)

        # Update metadata
        self.canvas_data['visual_labels'] = {
            'generated_at': datetime.now().isoformat(),
            'file_labels_added': len(file_labels),
            'group_headers_added': len(group_headers),
            'navigation_elements': 2,
            'total_visual_elements': len(file_labels) + len(group_headers) + 2
        }

        print(f"\n✅ VISUAL LABELS INTEGRATION COMPLETE!")
        print(f"🏷️ File labels: {len(file_labels)}")
        print(f"📋 Group headers: {len(group_headers)}")
        print(f"🎯 Navigation elements: 2")
        print(f"📊 Total visual elements: {len(file_labels) + len(group_headers) + 2}")

        return {
            'file_labels': len(file_labels),
            'group_headers': len(group_headers),
            'total_elements': len(file_labels) + len(group_headers) + 2
        }

    def save_labeled_canvas(self, output_file: str = "CANVAS VIEW.canvas"):
        """Save Canvas with visual labels"""

        with open(output_file, 'w') as f:
            json.dump(self.canvas_data, f, indent=1)

        print(f"💾 Labeled Canvas saved: {output_file}")

def main():
    """Execute visual labels integration"""

    engine = VisualLabelsEngine()
    results = engine.integrate_visual_labels()
    engine.save_labeled_canvas()

    print("\n🎯 VISUAL LABELS ENGINE COMPLETE!")
    print("🏷️ All files now have visible names for zoomed-out view")
    print("📋 PDF groups labeled with descriptions")
    print("🗺️ Navigation legend and title added")
    print("📊 Complete Canvas visibility achieved!")

if __name__ == "__main__":
    main()