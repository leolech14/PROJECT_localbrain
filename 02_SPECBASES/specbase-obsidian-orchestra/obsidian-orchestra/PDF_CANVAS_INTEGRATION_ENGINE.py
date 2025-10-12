#!/usr/bin/env python3
"""
🎯 PDF CANVAS INTEGRATION ENGINE
Add all PDF files to Canvas organized by groups with first page preview

PDF LAYOUT STRATEGY:
- Square components with full PDF width
- 60% of first page height for preview
- Organized by architectural groups (ARCH, UIX, SEC, etc.)
- Positioned above the linear markdown layout
"""

import json
import re
from datetime import datetime
from pathlib import Path

class PDFCanvasIntegrationEngine:
    """
    Integrates all PDF research documents into Canvas with organized layout
    """

    def __init__(self):
        # PDF preview dimensions
        self.pdf_width = 640  # Match markdown width for consistency
        self.pdf_height = 480  # 60% of typical PDF first page height (~800px)
        self.group_spacing = 100  # Space between PDF groups
        self.pdf_spacing = 20   # Space between PDFs within group
        self.pdf_row_offset = -2000  # Position PDFs above markdown files

    def load_current_canvas(self):
        """Load current Canvas with linear layout"""
        print("📊 Loading current Canvas layout...")

        with open("CANVAS VIEW.canvas", 'r') as f:
            self.canvas_data = json.load(f)

        print(f"   ✅ Current entities: {len(self.canvas_data['nodes'])}")

    def categorize_pdfs_by_groups(self) -> dict:
        """Categorize PDFs by their architectural groups"""

        pdf_files = list(Path('pdfs').glob('*.pdf'))

        groups = {
            'ARCH': [],    # Architecture & Audit
            'UIX': [],     # UI/UX Design
            'SEC': [],     # Security
            'LEDG': [],    # Ledger & Orchestration
            'MOD': [],     # Modules
            'FIN': [],     # Finance & Tax
            'OBS': [],     # Observability
            'DEV': [],     # DevOps
            'EXT': [],     # External & Wallet
            'GRAPH': [],   # Graph & Visualization
            'DOC': []      # Documentation
        }

        for pdf_file in pdf_files:
            file_name = pdf_file.name

            # Extract group from filename prefix
            if file_name.startswith('ARCH__'):
                groups['ARCH'].append(str(pdf_file))
            elif file_name.startswith('UIX__'):
                groups['UIX'].append(str(pdf_file))
            elif file_name.startswith('SEC__'):
                groups['SEC'].append(str(pdf_file))
            elif file_name.startswith('LEDG__'):
                groups['LEDG'].append(str(pdf_file))
            elif file_name.startswith('MOD__'):
                groups['MOD'].append(str(pdf_file))
            elif file_name.startswith('FIN__'):
                groups['FIN'].append(str(pdf_file))
            elif file_name.startswith('OBS__'):
                groups['OBS'].append(str(pdf_file))
            elif file_name.startswith('DEV__'):
                groups['DEV'].append(str(pdf_file))
            elif file_name.startswith('EXT__'):
                groups['EXT'].append(str(pdf_file))
            elif file_name.startswith('GRAPH__'):
                groups['GRAPH'].append(str(pdf_file))
            elif file_name.startswith('DOC__'):
                groups['DOC'].append(str(pdf_file))
            else:
                groups['DOC'].append(str(pdf_file))  # Default to documentation

        # Remove empty groups and sort files within groups
        groups = {k: sorted(v) for k, v in groups.items() if v}

        print(f"📋 PDF Groups identified:")
        for group, files in groups.items():
            print(f"   {group}: {len(files)} files")

        return groups

    def calculate_pdf_group_positions(self, pdf_groups: dict) -> dict:
        """Calculate positions for PDF groups and individual PDFs"""

        print("📐 Calculating PDF group positions...")

        positioned_pdfs = {}
        current_x = 0
        group_y = self.pdf_row_offset

        for group_name, pdf_files in pdf_groups.items():
            print(f"   📍 Positioning {group_name} group ({len(pdf_files)} PDFs)")

            group_start_x = current_x

            # Position PDFs within group
            for i, pdf_file in enumerate(pdf_files):
                pdf_name = Path(pdf_file).name

                positioned_pdfs[pdf_file] = {
                    'coordinates': {
                        'x': current_x,
                        'y': group_y,
                        'width': self.pdf_width,
                        'height': self.pdf_height
                    },
                    'group': group_name,
                    'sequence_in_group': i + 1,
                    'display_name': self._create_display_name(pdf_name)
                }

                print(f"      {i+1}. {pdf_name:<80} ({current_x}, {group_y})")

                # Move to next PDF position
                current_x += self.pdf_width + self.pdf_spacing

            # Add group spacing after each group
            current_x += self.group_spacing

        return positioned_pdfs

    def _create_display_name(self, pdf_filename: str) -> str:
        """Create clean display name from PDF filename"""

        # Remove prefix and extension
        name = pdf_filename.replace('.pdf', '')

        # Remove group prefixes
        prefixes = ['ARCH__audit__', 'UIX__uiux__', 'SEC__security__', 'LEDG__ledger__',
                   'LEDG__orchestrator__', 'LEDG__agent__', 'MOD__module__', 'FIN__open-finance__',
                   'FIN__tax__', 'OBS__observability__', 'DEV__devops__', 'EXT__extra__',
                   'EXT__wallet__', 'GRAPH__graph__', 'DOC__docs__']

        for prefix in prefixes:
            if name.startswith(prefix):
                name = name[len(prefix):]
                break

        # Clean up the name
        name = name.replace('-', ' ').replace('_', ' ')
        name = ' '.join(word.capitalize() for word in name.split())

        return name

    def create_pdf_canvas_nodes(self, positioned_pdfs: dict) -> list:
        """Create Canvas nodes for all positioned PDFs"""

        print("📄 Creating PDF Canvas nodes...")

        pdf_nodes = []
        node_id_counter = 1000  # Start from 1000 to avoid conflicts

        for pdf_file, position_data in positioned_pdfs.items():
            pdf_name = Path(pdf_file).name
            group = position_data['group']

            # Determine color based on group
            group_colors = {
                'ARCH': '1',    # Red - Architecture
                'UIX': '2',     # Blue - UI/UX
                'SEC': '6',     # Yellow - Security
                'LEDG': '4',    # Orange - Ledger
                'MOD': '3',     # Green - Modules
                'FIN': '5',     # Purple - Finance
                'OBS': '6',     # Yellow - Observability
                'DEV': '3',     # Green - DevOps
                'EXT': '2',     # Blue - External
                'GRAPH': '4',   # Orange - Graph
                'DOC': '5'      # Purple - Documentation
            }

            pdf_node = {
                "id": f"pdf-{node_id_counter}",
                "type": "file",
                "file": pdf_file,
                "x": position_data['coordinates']['x'],
                "y": position_data['coordinates']['y'],
                "width": position_data['coordinates']['width'],
                "height": position_data['coordinates']['height'],
                "color": group_colors.get(group, '2')
            }

            pdf_nodes.append(pdf_node)
            node_id_counter += 1

            print(f"   📄 {pdf_name}")

        return pdf_nodes

    def integrate_pdfs_into_canvas(self):
        """Integrate all PDFs into the Canvas with organized layout"""

        print("🎯 PDF CANVAS INTEGRATION ENGINE - ENGAGING")
        print("📄 Adding all PDF research documents with first page preview")
        print("=" * 65)

        # Load current Canvas
        self.load_current_canvas()

        # Categorize PDFs
        pdf_groups = self.categorize_pdfs_by_groups()

        # Calculate positions
        positioned_pdfs = self.calculate_pdf_group_positions(pdf_groups)

        # Create PDF nodes
        pdf_nodes = self.create_pdf_canvas_nodes(positioned_pdfs)

        # Add PDF nodes to Canvas
        self.canvas_data['nodes'].extend(pdf_nodes)

        # Update metadata
        self.canvas_data['pdf_integration'] = {
            'generated_at': datetime.now().isoformat(),
            'total_pdfs_added': len(pdf_nodes),
            'pdf_groups': {group: len(files) for group, files in pdf_groups.items()},
            'layout_parameters': {
                'pdf_width': self.pdf_width,
                'pdf_height': self.pdf_height,
                'first_page_height_percentage': 60,
                'group_spacing': self.group_spacing,
                'pdf_spacing': self.pdf_spacing
            }
        }

        print(f"\n✅ PDF INTEGRATION COMPLETE!")
        print(f"📄 PDFs added: {len(pdf_nodes)}")
        print(f"📊 Groups created: {len(pdf_groups)}")
        print(f"📐 Layout: Grouped side-by-side above markdown files")

        return {
            'pdf_nodes_added': len(pdf_nodes),
            'groups_created': pdf_groups,
            'positioned_pdfs': positioned_pdfs
        }

    def save_integrated_canvas(self, output_file: str = "CANVAS VIEW.canvas"):
        """Save Canvas with integrated PDFs"""

        with open(output_file, 'w') as f:
            json.dump(self.canvas_data, f, indent=1)

        print(f"💾 Integrated Canvas saved: {output_file}")

    def generate_pdf_integration_report(self, results: dict):
        """Generate report on PDF integration"""

        with open("PDF_INTEGRATION_REPORT.md", 'w') as f:
            f.write("# 📄 PDF CANVAS INTEGRATION REPORT\n")
            f.write("**Complete Integration of Research PDF Documents**\n\n")
            f.write(f"Generated: {datetime.now().isoformat()}\n\n")
            f.write("---\n\n")

            f.write("## 📊 INTEGRATION SUMMARY\n\n")
            f.write(f"**PDFs Added:** {results['pdf_nodes_added']}\n")
            f.write(f"**Groups Created:** {len(results['groups_created'])}\n")
            f.write(f"**Layout:** Grouped side-by-side above markdown specifications\n\n")

            f.write("## 📋 PDF GROUPS\n\n")
            for group, files in results['groups_created'].items():
                f.write(f"### {group} Group ({len(files)} files)\n")
                for pdf_file in files:
                    display_name = self._create_display_name(Path(pdf_file).name)
                    f.write(f"- {display_name}\n")
                f.write("\n")

            f.write("## 📐 LAYOUT SPECIFICATIONS\n\n")
            f.write(f"**PDF Dimensions:** {self.pdf_width}×{self.pdf_height}px (60% first page height)\n")
            f.write(f"**Group Spacing:** {self.group_spacing}px\n")
            f.write(f"**PDF Spacing:** {self.pdf_spacing}px\n")
            f.write(f"**Vertical Offset:** {self.pdf_row_offset}px (above markdown files)\n\n")

        print("📋 PDF integration report generated: PDF_INTEGRATION_REPORT.md")

def main():
    """Execute PDF Canvas integration"""

    engine = PDFCanvasIntegrationEngine()
    results = engine.integrate_pdfs_into_canvas()
    engine.save_integrated_canvas()
    engine.generate_pdf_integration_report(results)

    print("\n🎯 PDF CANVAS INTEGRATION COMPLETE!")
    print("📄 All research PDFs integrated with first page preview")
    print("📊 Organized by architectural groups")
    print("📐 Square components with 60% first page height")

if __name__ == "__main__":
    main()