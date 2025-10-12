#!/usr/bin/env python3
"""
Canvas Registry Generator
Creates a comprehensive JSON registry from Canvas View with:
- Entity extraction with precise coordinates
- Content analysis for each markdown file
- Categorization by domain/layer/priority
- Navigational intelligence
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class CanvasRegistryGenerator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.canvas_file = self.project_root / "CANVAS VIEW.canvas"
        self.registry = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "canvas_file": str(self.canvas_file),
                "total_entities": 0,
                "total_files_analyzed": 0
            },
            "entities": [],
            "files": {},
            "categories": {
                "functional_domains": {},
                "architectural_layers": {},
                "specification_types": {},
                "priority_levels": {}
            },
            "connections": []
        }

    def analyze_markdown_content(self, file_path: Path) -> Dict[str, Any]:
        """Analyze markdown file for content metrics and categorization"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            lines = content.split('\n')
            line_count = len(lines)

            # Extract YAML frontmatter
            frontmatter = {}
            if content.startswith('---'):
                end_idx = content.find('---', 3)
                if end_idx != -1:
                    yaml_content = content[3:end_idx]
                    for line in yaml_content.split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            frontmatter[key.strip()] = value.strip().strip('"')

            # Calculate complexity score
            complexity_factors = {
                'code_blocks': len(re.findall(r'```[\s\S]*?```', content)),
                'headings': len(re.findall(r'^#+\s', content, re.MULTILINE)),
                'links': len(re.findall(r'\[.*?\]\(.*?\)', content)),
                'lists': len(re.findall(r'^\s*[-*+]\s', content, re.MULTILINE)),
                'tables': content.count('|'),
                'yaml_frontmatter': 1 if frontmatter else 0
            }

            complexity_score = sum(complexity_factors.values())

            # Determine main topics/subjects
            topics = []
            if 'title' in frontmatter:
                topics.append(frontmatter['title'])

            # Extract topics from headings
            headings = re.findall(r'^#+\s(.+)', content, re.MULTILINE)
            topics.extend(headings[:5])  # Top 5 headings

            # Determine completion state
            completion_indicators = {
                'has_frontmatter': bool(frontmatter),
                'has_implementation': 'implementation' in content.lower(),
                'has_tests': 'test' in content.lower(),
                'has_documentation': len(headings) >= 3,
                'has_production_code': '```typescript' in content or '```javascript' in content
            }

            completion_score = sum(completion_indicators.values()) / len(completion_indicators)

            # Categorize functional domain
            domain = self.categorize_domain(file_path, content, frontmatter)
            layer = self.categorize_layer(file_path, content, frontmatter)
            spec_type = self.categorize_specification_type(file_path, content, frontmatter)
            priority = self.categorize_priority(file_path, content, frontmatter)

            return {
                "file_path": str(file_path),
                "line_count": line_count,
                "complexity_score": complexity_score,
                "complexity_factors": complexity_factors,
                "main_topics": topics,
                "completion_score": completion_score,
                "completion_indicators": completion_indicators,
                "functional_domain": domain,
                "architectural_layer": layer,
                "specification_type": spec_type,
                "priority_level": priority,
                "frontmatter": frontmatter,
                "dependencies": self.extract_dependencies(content),
                "file_size_bytes": file_path.stat().st_size if file_path.exists() else 0
            }
        except Exception as e:
            return {
                "file_path": str(file_path),
                "error": str(e),
                "line_count": 0,
                "complexity_score": 0
            }

    def categorize_domain(self, file_path: Path, content: str, frontmatter: Dict) -> str:
        """Categorize functional domain based on file analysis"""
        filename = file_path.name.lower()
        content_lower = content.lower()

        if any(keyword in filename for keyword in ['agent', 'ai', 'orchestrator', 'intelligence']):
            return "Agent Intelligence"
        elif any(keyword in filename for keyword in ['data', 'pool', 'engine', 'adapter']):
            return "Data Processing"
        elif any(keyword in filename for keyword in ['dashboard', 'ui', 'component', 'view']):
            return "User Interface"
        elif any(keyword in filename for keyword in ['security', 'auth', 'policy', 'audit']):
            return "Security & Compliance"
        elif any(keyword in filename for keyword in ['revenue', 'expense', 'forecast', 'budget']):
            return "Financial Analytics"
        elif any(keyword in filename for keyword in ['bank', 'transaction', 'wallet', 'finance']):
            return "Financial Data"
        elif any(keyword in filename for keyword in ['architecture', 'specification', 'implementation']):
            return "Architecture & Planning"
        else:
            return "General"

    def categorize_layer(self, file_path: Path, content: str, frontmatter: Dict) -> str:
        """Categorize architectural layer"""
        filename = file_path.name.lower()

        if any(keyword in filename for keyword in ['00_', '01_', '02_', '03_', '04_', '05_', '06_']):
            return "Presentation Layer"
        elif any(keyword in filename for keyword in ['10_', '11_', '12_', '13_', '14_', '15_', '16_']):
            return "Core Intelligence"
        elif any(keyword in filename for keyword in ['20_', '21_', '22_']):
            return "User Interface"
        elif any(keyword in filename for keyword in ['30_', '31_', '32_', '33_']):
            return "Financial Processing"
        elif any(keyword in filename for keyword in ['40_', '41_', '42_', '43_', '44_']):
            return "Analytics & Visualization"
        elif any(keyword in filename for keyword in ['50_', '51_', '52_', '53_']):
            return "Data Infrastructure"
        elif any(keyword in filename for keyword in ['60_', '61_', '62_']):
            return "External Integration"
        elif any(keyword in filename for keyword in ['70_', '80_', '90_']):
            return "System Infrastructure"
        elif any(keyword in filename for keyword in ['0.2_', '0.3_', '0.4_']):
            return "Meta-Orchestration"
        else:
            return "Documentation"

    def categorize_specification_type(self, file_path: Path, content: str, frontmatter: Dict) -> str:
        """Categorize specification type"""
        if 'type' in frontmatter:
            return frontmatter['type']

        content_lower = content.lower()
        if 'implementation' in content_lower and 'production' in content_lower:
            return "Implementation Specification"
        elif 'architecture' in content_lower:
            return "Architecture Specification"
        elif 'security' in content_lower:
            return "Security Specification"
        elif 'ui' in content_lower or 'component' in content_lower:
            return "UI Specification"
        elif 'api' in content_lower:
            return "API Specification"
        else:
            return "General Specification"

    def categorize_priority(self, file_path: Path, content: str, frontmatter: Dict) -> str:
        """Categorize priority level"""
        if 'priority' in frontmatter:
            return frontmatter['priority']

        filename = file_path.name.lower()
        if any(keyword in filename for keyword in ['10_', '20_', '30_', '0.3_']):
            return "critical"
        elif any(keyword in filename for keyword in ['11_', '12_', '21_', '31_']):
            return "high"
        elif any(keyword in filename for keyword in ['40_', '41_', '50_', '51_']):
            return "medium"
        else:
            return "low"

    def extract_dependencies(self, content: str) -> List[str]:
        """Extract dependencies from markdown links"""
        dependencies = []

        # Find [[module_links]]
        module_links = re.findall(r'\[\[([^\]]+)\]\]', content)
        dependencies.extend(module_links)

        # Find dependencies in frontmatter or content
        dep_matches = re.findall(r'dependencies?:\s*\[(.*?)\]', content, re.IGNORECASE)
        for match in dep_matches:
            deps = [d.strip().strip('"\'') for d in match.split(',')]
            dependencies.extend(deps)

        return list(set(dependencies))  # Remove duplicates

    def parse_canvas_file(self) -> Dict[str, Any]:
        """Parse the Canvas file and extract entities"""
        try:
            with open(self.canvas_file, 'r', encoding='utf-8') as f:
                canvas_data = json.load(f)

            entities = []
            connections = []

            # Process nodes
            for node in canvas_data.get('nodes', []):
                entity = {
                    "id": node.get('id'),
                    "type": node.get('type'),
                    "coordinates": {
                        "x": node.get('x', 0),
                        "y": node.get('y', 0),
                        "width": node.get('width', 0),
                        "height": node.get('height', 0)
                    },
                    "color": node.get('color'),
                    "bounding_box": {
                        "left": node.get('x', 0),
                        "top": node.get('y', 0),
                        "right": node.get('x', 0) + node.get('width', 0),
                        "bottom": node.get('y', 0) + node.get('height', 0)
                    }
                }

                # Handle file nodes
                if node.get('type') == 'file':
                    entity['file_path'] = node.get('file', '')
                    entity['subpath'] = node.get('subpath', '')

                # Handle text nodes
                elif node.get('type') == 'text':
                    entity['text_content'] = node.get('text', '')
                    entity['text_length'] = len(node.get('text', ''))

                entities.append(entity)

            # Process edges/connections
            for edge in canvas_data.get('edges', []):
                connection = {
                    "id": edge.get('id'),
                    "from_node": edge.get('fromNode'),
                    "to_node": edge.get('toNode'),
                    "from_side": edge.get('fromSide'),
                    "to_side": edge.get('toSide'),
                    "color": edge.get('color'),
                    "label": edge.get('label', '')
                }
                connections.append(connection)

            return {
                "entities": entities,
                "connections": connections,
                "total_entities": len(entities),
                "total_connections": len(connections)
            }

        except Exception as e:
            print(f"Error parsing canvas file: {e}")
            return {"entities": [], "connections": [], "total_entities": 0, "total_connections": 0}

    def generate_registry(self) -> Dict[str, Any]:
        """Generate the complete registry"""
        print("Generating Canvas Registry...")

        # Parse canvas file
        print("Parsing canvas file...")
        canvas_data = self.parse_canvas_file()
        self.registry["entities"] = canvas_data["entities"]
        self.registry["connections"] = canvas_data["connections"]
        self.registry["metadata"]["total_entities"] = canvas_data["total_entities"]

        # Analyze all markdown files
        print("Analyzing markdown files...")
        md_files = list(self.project_root.glob("**/*.md"))

        for md_file in md_files:
            print(f"  Analyzing: {md_file.name}")
            analysis = self.analyze_markdown_content(md_file)

            # Store file analysis
            relative_path = str(md_file.relative_to(self.project_root))
            self.registry["files"][relative_path] = analysis

            # Update category counts
            domain = analysis.get("functional_domain", "Unknown")
            layer = analysis.get("architectural_layer", "Unknown")
            spec_type = analysis.get("specification_type", "Unknown")
            priority = analysis.get("priority_level", "Unknown")

            self.registry["categories"]["functional_domains"][domain] = \
                self.registry["categories"]["functional_domains"].get(domain, 0) + 1
            self.registry["categories"]["architectural_layers"][layer] = \
                self.registry["categories"]["architectural_layers"].get(layer, 0) + 1
            self.registry["categories"]["specification_types"][spec_type] = \
                self.registry["categories"]["specification_types"].get(spec_type, 0) + 1
            self.registry["categories"]["priority_levels"][priority] = \
                self.registry["categories"]["priority_levels"].get(priority, 0) + 1

        self.registry["metadata"]["total_files_analyzed"] = len(md_files)

        # Link canvas entities to file analyses
        print("Linking canvas entities to file analyses...")
        for entity in self.registry["entities"]:
            if entity.get("type") == "file" and entity.get("file_path"):
                file_path = entity["file_path"]
                if file_path in self.registry["files"]:
                    entity["file_analysis"] = self.registry["files"][file_path]

        return self.registry

    def save_registry(self, output_path: str):
        """Save the registry to a JSON file"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.registry, f, indent=2, ensure_ascii=False)
        print(f"Registry saved to: {output_path}")

def main():
    project_root = "/Users/lech/PROJECTS_all/PROJECT_finops/obsidian-finops"
    output_file = f"{project_root}/CANVAS_REGISTRY.json"

    generator = CanvasRegistryGenerator(project_root)
    registry = generator.generate_registry()
    generator.save_registry(output_file)

    # Print summary
    print("\n" + "="*60)
    print("CANVAS REGISTRY GENERATION COMPLETE")
    print("="*60)
    print(f"Total Entities: {registry['metadata']['total_entities']}")
    print(f"Total Files Analyzed: {registry['metadata']['total_files_analyzed']}")
    print(f"Total Connections: {len(registry['connections'])}")

    print("\nFunctional Domains:")
    for domain, count in registry['categories']['functional_domains'].items():
        print(f"  {domain}: {count}")

    print("\nArchitectural Layers:")
    for layer, count in registry['categories']['architectural_layers'].items():
        print(f"  {layer}: {count}")

    print(f"\nRegistry file: {output_file}")

if __name__ == "__main__":
    main()