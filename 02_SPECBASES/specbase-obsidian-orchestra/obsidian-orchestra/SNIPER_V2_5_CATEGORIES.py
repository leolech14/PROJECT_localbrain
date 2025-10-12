#!/usr/bin/env python3
"""
🎯 CANVAS SNIPER V2 - 5-Category Precision Query Tool
Updated for new 5-category organization system (cfg/scf/mod/gov/ops)

Features:
- Query by category (cfg/scf/mod/gov/ops)
- Query by section type (12 universal sections)
- Query by spatial zone (5 Canvas zones)
- Query by color (1-6 Obsidian colors)
- Atomic precision queries for instant results

Author: Trinity Intelligence + Claude Code
Version: 2.0.0
Date: 2025-10-01
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Set

# ============================================================================
# CONFIGURATION: 5-Category System
# ============================================================================

CATEGORIES = {
    'cfg': {
        'name': 'CONFIGURATIONS',
        'color': '1',
        'emoji': '🔴',
        'zone': (0, 3000),
        'purpose': 'Executable rules governing autonomous behavior'
    },
    'scf': {
        'name': 'SCAFFOLDS',
        'color': '4',
        'emoji': '🟢',
        'zone': (3000, 12000),
        'purpose': 'Visual structure and containers'
    },
    'mod': {
        'name': 'MODULES',
        'color': '3',
        'emoji': '🟡',
        'zone': (12000, 42000),
        'purpose': 'Core functionality with agent souls'
    },
    'gov': {
        'name': 'GOVERNANCE',
        'color': '6',
        'emoji': '🟣',
        'zone': (42000, 54000),
        'purpose': 'Strategic wisdom and blueprints'
    },
    'ops': {
        'name': 'OPERATIONS',
        'color': '5',
        'emoji': '🔵',
        'zone': (54000, 66000),
        'purpose': 'Development tools and analysis'
    }
}

# 12 Universal Sections (0-12)
UNIVERSAL_SECTIONS = {
    0: 'YAML Front-Matter',
    1: 'Purpose',
    2: 'Primary Features',
    3: 'Architecture',
    4: 'Contracts',
    5: 'Sub-Components & Behavior',
    6: 'State Progression & Promotion Gates',
    7: 'Production Implementation',
    8: 'Security & Compliance',
    9: 'Testing Strategy',
    10: 'Success Criteria, Performance & Observability',
    11: 'Agent Integration',
    12: 'Integrations & References'
}

# ============================================================================
# SNIPER QUERIES
# ============================================================================

class CanvasSniper:
    def __init__(self, canvas_path: str = 'CANVAS_VIEW.canvas'):
        self.canvas_path = canvas_path
        self.canvas = self._load_canvas()
        self.files = self._scan_vault()

    def _load_canvas(self) -> Dict:
        """Load Canvas file"""
        try:
            with open(self.canvas_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"⚠️ Canvas not found: {self.canvas_path}")
            return {'nodes': [], 'edges': []}

    def _scan_vault(self) -> List[str]:
        """Scan all .md files in vault"""
        return [f for f in os.listdir('.') if f.endswith('.md')]

    # ========================================================================
    # CATEGORY QUERIES
    # ========================================================================

    def query_by_category(self, category: str) -> List[Dict]:
        """
        Query all files in a specific category

        Args:
            category: 'cfg', 'scf', 'mod', 'gov', or 'ops'

        Returns:
            List of files with metadata
        """
        if category not in CATEGORIES:
            return []

        cat_info = CATEGORIES[category]
        pattern = f"{category}."

        results = []
        for filename in self.files:
            if filename.startswith(pattern):
                # Get Canvas node if exists
                canvas_node = self._find_canvas_node(filename)

                results.append({
                    'file': filename,
                    'category': cat_info['name'],
                    'emoji': cat_info['emoji'],
                    'color': cat_info['color'],
                    'canvas_position': canvas_node.get('x') if canvas_node else None,
                    'canvas_height': canvas_node.get('height') if canvas_node else None,
                    'in_zone': self._check_zone(canvas_node, cat_info['zone']) if canvas_node else None
                })

        return sorted(results, key=lambda r: r['file'])

    def _find_canvas_node(self, filename: str) -> Optional[Dict]:
        """Find Canvas node for a file"""
        for node in self.canvas.get('nodes', []):
            if node.get('type') == 'file' and node.get('file') == filename:
                return node
        return None

    def _check_zone(self, node: Dict, zone: tuple) -> bool:
        """Check if node is in expected zone"""
        x = node.get('x', 0)
        return zone[0] <= x < zone[1]

    # ========================================================================
    # SECTION QUERIES
    # ========================================================================

    def query_by_section(self, section_num: int) -> List[Dict]:
        """
        Query all files containing a specific section

        Args:
            section_num: 0-12 (0=YAML, 1=Purpose, ..., 12=Integrations)

        Returns:
            List of files with that section
        """
        if section_num not in UNIVERSAL_SECTIONS:
            return []

        section_name = UNIVERSAL_SECTIONS[section_num]
        results = []

        for filename in self.files:
            if self._has_section(filename, section_name):
                results.append({
                    'file': filename,
                    'section': section_name,
                    'section_num': section_num,
                    'content_preview': self._extract_section(filename, section_name)[:200]
                })

        return results

    def _has_section(self, filename: str, section_name: str) -> bool:
        """Check if file has a section"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Pattern matching for section headers
            patterns = [
                f"## {section_name}",
                f"## **{section_name}**",
                f"### {section_name}",
                section_name.lower().replace(' ', '_').replace('&', '')
            ]

            return any(pattern in content for pattern in patterns)
        except:
            return False

    def _extract_section(self, filename: str, section_name: str) -> str:
        """Extract section content"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find section
            pattern = f"## {section_name}"
            if pattern in content:
                start = content.index(pattern)
                # Find next ## header
                next_header = content.find('\n## ', start + 1)
                if next_header == -1:
                    return content[start:start+500]
                return content[start:next_header]
            return ""
        except:
            return ""

    # ========================================================================
    # SPATIAL QUERIES
    # ========================================================================

    def query_by_zone(self, zone_num: int) -> List[Dict]:
        """
        Query all files in a Canvas spatial zone

        Args:
            zone_num: 1-5 (1=cfg, 2=scf, 3=mod, 4=gov, 5=ops)

        Returns:
            Files in that zone
        """
        zone_map = {
            1: ('cfg', CATEGORIES['cfg']['zone']),
            2: ('scf', CATEGORIES['scf']['zone']),
            3: ('mod', CATEGORIES['mod']['zone']),
            4: ('gov', CATEGORIES['gov']['zone']),
            5: ('ops', CATEGORIES['ops']['zone'])
        }

        if zone_num not in zone_map:
            return []

        cat_key, (x_min, x_max) = zone_map[zone_num]
        results = []

        for node in self.canvas.get('nodes', []):
            if node.get('type') == 'file':
                x = node.get('x', 0)
                if x_min <= x < x_max:
                    results.append({
                        'file': node['file'],
                        'zone': zone_num,
                        'category': CATEGORIES[cat_key]['name'],
                        'x': x,
                        'height': node.get('height'),
                        'color': node.get('color')
                    })

        return sorted(results, key=lambda r: r['x'])

    # ========================================================================
    # COLOR QUERIES
    # ========================================================================

    def query_by_color(self, color: str) -> List[Dict]:
        """Query all files with specific Canvas color"""
        results = []

        for node in self.canvas.get('nodes', []):
            if node.get('type') == 'file' and node.get('color') == color:
                filename = node['file']
                # Determine expected category
                prefix = filename.split('.')[0] if '.' in filename else 'unknown'

                results.append({
                    'file': filename,
                    'color': color,
                    'prefix': prefix,
                    'x': node.get('x'),
                    'height': node.get('height')
                })

        return sorted(results, key=lambda r: r['x'])

    # ========================================================================
    # ADVANCED QUERIES
    # ========================================================================

    def query_misaligned(self) -> List[Dict]:
        """Find files with color not matching category"""
        misaligned = []

        for node in self.canvas.get('nodes', []):
            if node.get('type') == 'file':
                filename = node['file']
                actual_color = node.get('color')

                # Determine expected color
                prefix = filename.split('.')[0] if '.' in filename else 'unknown'
                expected_color = CATEGORIES.get(prefix, {}).get('color', 'unknown')

                if expected_color != 'unknown' and actual_color != expected_color:
                    misaligned.append({
                        'file': filename,
                        'expected_color': expected_color,
                        'actual_color': actual_color,
                        'x': node.get('x')
                    })

        return misaligned

    def query_section_coverage(self) -> Dict[str, float]:
        """Calculate % of files having each universal section"""
        coverage = {}
        total = len(self.files)

        for num, section in UNIVERSAL_SECTIONS.items():
            count = sum(1 for f in self.files if self._has_section(f, section))
            coverage[section] = (count / total * 100) if total > 0 else 0

        return coverage

    def query_by_pattern(self, pattern: str) -> List[Dict]:
        """Search for text pattern across all files"""
        results = []

        for filename in self.files:
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()

                if re.search(pattern, content, re.IGNORECASE):
                    # Count occurrences
                    matches = len(re.findall(pattern, content, re.IGNORECASE))

                    results.append({
                        'file': filename,
                        'matches': matches,
                        'preview': self._get_preview(content, pattern)
                    })
            except:
                pass

        return sorted(results, key=lambda r: -r['matches'])

    def _get_preview(self, content: str, pattern: str) -> str:
        """Get preview of pattern match"""
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            start = max(0, match.start() - 50)
            end = min(len(content), match.end() + 50)
            return content[start:end]
        return ""

# ============================================================================
# CLI INTERFACE
# ============================================================================

def main():
    sniper = CanvasSniper()

    print("🎯 CANVAS SNIPER V2.0 - 5-Category Precision Queries")
    print("="*70)

    # Category breakdown
    print("\n📊 CATEGORY BREAKDOWN:\n")
    for cat_key, cat_info in CATEGORIES.items():
        files = sniper.query_by_category(cat_key)
        print(f"{cat_info['emoji']} {cat_info['name']} ({cat_key}):")
        print(f"   Files: {len(files)}")
        print(f"   Color: {cat_info['color']}")
        print(f"   Zone: X:{cat_info['zone'][0]}-{cat_info['zone'][1]}")

        # Check zone alignment
        in_zone = sum(1 for f in files if f['in_zone'])
        print(f"   Zone Alignment: {in_zone}/{len(files)} ({'✅' if in_zone == len(files) else '⚠️'})")
        print()

    # Section coverage
    print("\n📋 SECTION COVERAGE (12 Universal Sections):\n")
    coverage = sniper.query_section_coverage()
    for num in range(1, 13):
        section = UNIVERSAL_SECTIONS[num]
        pct = coverage.get(section, 0)
        status = '✅' if pct > 80 else '⚠️' if pct > 50 else '❌'
        print(f"{status} {num:2d}. {section:45s}: {pct:5.1f}%")

    # Misalignments
    print("\n🔍 MISALIGNMENT CHECK:\n")
    misaligned = sniper.query_misaligned()
    if misaligned:
        print(f"⚠️ Found {len(misaligned)} files with color not matching category:")
        for m in misaligned[:5]:
            print(f"   {m['file']}: expected={m['expected_color']}, actual={m['actual_color']}")
    else:
        print("✅ All files have correct colors!")

    # Zone integrity
    print("\n🗺️ SPATIAL ZONE INTEGRITY:\n")
    for zone_num in range(1, 6):
        files = sniper.query_by_zone(zone_num)
        cat_key = list(CATEGORIES.keys())[zone_num-1]
        cat_name = CATEGORIES[cat_key]['name']
        print(f"Zone {zone_num} ({cat_name}): {len(files)} files")

    print("\n" + "="*70)
    print("\n✅ SNIPER CALIBRATED FOR 5-CATEGORY SYSTEM")

if __name__ == '__main__':
    main()
