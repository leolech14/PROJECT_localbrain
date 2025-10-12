#!/usr/bin/env python3
"""
Mermaid Diagram Integration for Dependency-Edits System
========================================================

Connects the Dependency-Edits Analyzer with interactive HTML Mermaid visualization.
Generates beautiful dependency diagrams that can be embedded in any web application.

Created: 2025-01-09
Purpose: Bridge between Dependency-Edits analysis and web visualization
"""

import json
import sqlite3
import subprocess
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import webbrowser
import tempfile

class MermaidDependencyVisualizer:
    """Generates interactive Mermaid diagrams from dependency analysis"""

    def __init__(self, central_mcp_path: str = "/Users/lech/PROJECTS_all/PROJECT_central-mcp/central-mcp"):
        self.central_mcp_path = Path(central_mcp_path)
        self.db_path = self.central_mcp_path / "data" / "registry.db"
        self.html_template_path = Path(__file__).parent / "dependency_mermaid_visualizer.html"

    def analyze_dependencies(self, project_root: str, new_feature_path: str) -> Dict:
        """Run dependency analysis using Central-MCP"""
        try:
            # Call the Dependency-Edits analyzer
            analyzer_script = self.central_mcp_path / "dist" / "spec" / "DependencyEditsAnalyzer.js"

            if not analyzer_script.exists():
                return {"error": "Dependency-Edits Analyzer not found. Please build Central-MCP first."}

            # Prepare the analysis command
            cmd = [
                "node", str(analyzer_script),
                "analyze",
                "--project-root", project_root,
                "--new-feature", new_feature_path,
                "--output-format", "json"
            ]

            result = subprocess.run(
                cmd,
                cwd=self.central_mcp_path,
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode != 0:
                return {"error": f"Analysis failed: {result.stderr}"}

            # Parse the JSON result
            analysis_result = json.loads(result.stdout)
            return analysis_result

        except subprocess.TimeoutExpired:
            return {"error": "Analysis timed out"}
        except Exception as e:
            return {"error": f"Analysis error: {str(e)}"}

    def generate_mermaid_diagram(self, analysis_result: Dict, diagram_type: str = "TD") -> str:
        """Generate Mermaid diagram from dependency analysis"""

        if "error" in analysis_result:
            return f"graph TD\n    ERROR[\"{analysis_result['error']}\"]"

        try:
            feature_node = analysis_result.get("featureNode", {})
            direct_deps = analysis_result.get("directDependencies", [])
            indirect_deps = analysis_result.get("indirectDependencies", [])
            recommendations = analysis_result.get("recommendations", [])

            # Build Mermaid diagram
            mermaid_lines = [
                f"graph {diagram_type}",
                "    %% Dependency-Edits Analysis",
                f"    %% New Feature: {feature_node.get('fileName', 'Unknown')}",
                "",
                "    %% Main Feature Node"
            ]

            # Add main feature node
            feature_id = self._sanitize_node_id(feature_node.get('fileName', 'feature'))
            feature_name = feature_node.get('fileName', 'New Feature').split('/')[-1]
            mermaid_lines.append(f'    {feature_id}["{feature_name}<br/><span style=\'color:red;\'>NEW FEATURE</span>"]')
            mermaid_lines.append("")

            # Add direct dependencies
            if direct_deps:
                mermaid_lines.append("    %% Direct Dependencies")
                for dep in direct_deps:
                    dep_id = self._sanitize_node_id(dep.get('fileName', 'dep'))
                    dep_name = dep.get('fileName', 'Unknown').split('/')[-1]
                    dep_type = dep.get('entityType', 'FILE').upper()
                    mermaid_lines.append(f'    {dep_id}["{dep_name}<br/><span style=\'color:blue;\'>{dep_type}</span>"]')
                    mermaid_lines.append(f'    {feature_id} --> {dep_id}')
                mermaid_lines.append("")

            # Add indirect dependencies
            if indirect_deps:
                mermaid_lines.append("    %% Indirect Dependencies")
                for dep in indirect_deps:
                    dep_id = self._sanitize_node_id(dep.get('fileName', 'dep'))
                    dep_name = dep.get('fileName', 'Unknown').split('/')[-1]
                    dep_type = dep.get('entityType', 'FILE').upper()
                    mermaid_lines.append(f'    {dep_id}["{dep_name}<br/><span style=\'color:green;\'>{dep_type}</span>"]')
                    mermaid_lines.append(f'    {feature_id} -.-> {dep_id}')
                mermaid_lines.append("")

            # Add styling
            mermaid_lines.extend([
                "    %% Styling",
                "    classDef newFeature fill:#ffcccc,stroke:#ff6666,stroke-width:3px",
                "    classDef directDep fill:#cce5ff,stroke:#66aaff,stroke-width:2px",
                "    classDef indirectDep fill:#ccffcc,stroke:#66cc66,stroke-width:1px",
                f"    class {feature_id} newFeature"
            ])

            if direct_deps:
                direct_ids = [self._sanitize_node_id(dep.get('fileName', 'dep')) for dep in direct_deps]
                mermaid_lines.append(f"    class {','.join(direct_ids)} directDep")

            if indirect_deps:
                indirect_ids = [self._sanitize_node_id(dep.get('fileName', 'dep')) for dep in indirect_deps]
                mermaid_lines.append(f"    class {','.join(indirect_ids)} indirectDep")

            return "\n".join(mermaid_lines)

        except Exception as e:
            return f"graph TD\n    ERROR[\"Diagram generation failed: {str(e)}\"]"

    def _sanitize_node_id(self, filename: str) -> str:
        """Sanitize filename for Mermaid node ID"""
        if not filename:
            return "unknown"

        # Remove path and extension, sanitize characters
        sanitized = filename.split('/')[-1].split('.')[0]
        sanitized = ''.join(c if c.isalnum() else '_' for c in sanitized)

        # Ensure it starts with a letter
        if sanitized and sanitized[0].isdigit():
            sanitized = "node_" + sanitized

        return sanitized or "unknown"

    def create_interactive_html(self, project_root: str, new_feature_path: str,
                               output_path: Optional[str] = None) -> str:
        """Create interactive HTML visualization with Mermaid diagram"""

        # Run dependency analysis
        analysis_result = self.analyze_dependencies(project_root, new_feature_path)

        # Generate Mermaid diagram
        mermaid_code = self.generate_mermaid_diagram(analysis_result)

        # Read HTML template
        if not self.html_template_path.exists():
            raise FileNotFoundError(f"HTML template not found: {self.html_template_path}")

        with open(self.html_template_path, 'r', encoding='utf-8') as f:
            html_template = f.read()

        # Inject project data and Mermaid code
        html_content = html_template.replace(
            'value="/Users/lech/PROJECTS_all/LocalBrain"',
            f'value="{project_root}"'
        ).replace(
            'placeholder="Path to new feature file"',
            f'value="{new_feature_path}"'
        )

        # If output path specified, save the file
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            return output_path

        # Otherwise save to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
            f.write(html_content)
            return f.name

    def open_in_browser(self, project_root: str, new_feature_path: str) -> str:
        """Create and open interactive visualization in browser"""

        html_file = self.create_interactive_html(project_root, new_feature_path)

        try:
            webbrowser.open(f'file://{html_file}')
            return html_file
        except Exception as e:
            return f"Failed to open browser: {str(e)}"

    def get_dependency_statistics(self, analysis_result: Dict) -> Dict:
        """Extract statistics from dependency analysis"""

        if "error" in analysis_result:
            return {"error": analysis_result["error"]}

        stats = {
            "total_files": analysis_result.get("totalFiles", 0),
            "direct_dependencies": len(analysis_result.get("directDependencies", [])),
            "indirect_dependencies": len(analysis_result.get("indirectDependencies", [])),
            "risk_level": analysis_result.get("riskAssessment", {}).get("overallRisk", "UNKNOWN"),
            "recommendations": analysis_result.get("recommendations", []),
            "feature_node": analysis_result.get("featureNode", {}),
            "analysis_time": analysis_result.get("analysisTime", 0)
        }

        return stats

    def export_mermaid_only(self, project_root: str, new_feature_path: str,
                           diagram_type: str = "TD") -> str:
        """Export only the Mermaid code for external use"""

        analysis_result = self.analyze_dependencies(project_root, new_feature_path)
        mermaid_diagram = self.generate_mermaid_diagram(analysis_result, diagram_type)

        # Wrap in Mermaid code block
        return f"```mermaid\n{mermaid_diagram}\n```"


def main():
    """Command-line interface for Mermaid dependency visualization"""

    import argparse

    parser = argparse.ArgumentParser(description="Generate interactive Mermaid dependency diagrams")
    parser.add_argument("--project-root", required=True, help="Project root path")
    parser.add_argument("--new-feature", required=True, help="New feature file path")
    parser.add_argument("--output", help="Output HTML file path")
    parser.add_argument("--open-browser", action="store_true", help="Open in browser")
    parser.add_argument("--diagram-type", choices=["TD", "LR", "BT", "RL"], default="TD", help="Diagram layout")
    parser.add_argument("--mermaid-only", action="store_true", help="Export only Mermaid code")
    parser.add_argument("--central-mcp", default="/Users/lech/PROJECTS_all/PROJECT_central-mcp/central-mcp", help="Central-MCP path")

    args = parser.parse_args()

    # Initialize visualizer
    visualizer = MermaidDependencyVisualizer(args.central_mcp)

    if args.mermaid_only:
        # Export only Mermaid code
        mermaid_code = visualizer.export_mermaid_only(args.project_root, args.new_feature, args.diagram_type)
        print("Generated Mermaid Code:")
        print("=" * 50)
        print(mermaid_code)
        print("=" * 50)
        return

    # Create interactive HTML
    try:
        html_file = visualizer.create_interactive_html(
            args.project_root,
            args.new_feature,
            args.output
        )

        print(f"✅ Interactive HTML created: {html_file}")

        # Get and display statistics
        analysis_result = visualizer.analyze_dependencies(args.project_root, args.new_feature)
        stats = visualizer.get_dependency_statistics(analysis_result)

        if "error" not in stats:
            print(f"📊 Statistics:")
            print(f"   Total files analyzed: {stats['total_files']}")
            print(f"   Direct dependencies: {stats['direct_dependencies']}")
            print(f"   Indirect dependencies: {stats['indirect_dependencies']}")
            print(f"   Risk level: {stats['risk_level']}")

        # Open in browser if requested
        if args.open_browser:
            webbrowser.open(f'file://{html_file}')
            print(f"🌐 Opened in browser")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())