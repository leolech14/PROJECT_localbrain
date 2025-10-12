#!/usr/bin/env python3
"""
MFMPP.PY Mermaid Integration
============================

Integrates interactive Mermaid dependency diagrams into MFMPP.PY.
Provides beautiful dependency visualization for project analysis.

Usage:
    from mfmpp_mermaid_integration import MermaidDiagramGenerator

    generator = MermaidDiagramGenerator()
    html_output = generator.create_dependency_diagram(
        project_root="/path/to/project",
        new_feature="/path/to/new/feature"
    )

Created: 2025-01-09
Purpose: Add Mermaid diagram generation to MFMPP.PY
"""

import os
import json
import tempfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from mermaid_integration import MermaidDependencyVisualizer

class MFMPPMermaidIntegration:
    """Mermaid diagram generator for MFMPP.PY"""

    def __init__(self, central_mcp_path: Optional[str] = None):
        if central_mcp_path is None:
            central_mcp_path = "/Users/lech/PROJECTS_all/PROJECT_central-mcp/central-mcp"

        self.visualizer = MermaidDependencyVisualizer(central_mcp_path)
        self.output_dir = Path(tempfile.gettempdir()) / "mfmpp_mermaid_diagrams"
        self.output_dir.mkdir(exist_ok=True)

    def create_dependency_diagram(self,
                                project_root: str,
                                new_feature_path: str,
                                diagram_type: str = "TD",
                                auto_open: bool = False,
                                save_to_file: bool = True) -> Dict:
        """
        Create interactive dependency diagram

        Args:
            project_root: Root path of the project to analyze
            new_feature_path: Path to the new feature file
            diagram_type: Mermaid diagram type (TD, LR, BT, RL)
            auto_open: Whether to automatically open in browser
            save_to_file: Whether to save to file

        Returns:
            Dictionary containing diagram information
        """

        try:
            # Run dependency analysis
            analysis_result = self.visualizer.analyze_dependencies(project_root, new_feature_path)

            if "error" in analysis_result:
                return {
                    "success": False,
                    "error": analysis_result["error"],
                    "diagram_path": None,
                    "statistics": None
                }

            # Generate Mermaid diagram
            mermaid_code = self.visualizer.generate_mermaid_diagram(analysis_result, diagram_type)

            # Create interactive HTML
            if save_to_file:
                feature_name = Path(new_feature_path).stem
                output_filename = f"dependency_diagram_{feature_name}.html"
                output_path = self.output_dir / output_filename

                html_file = self.visualizer.create_interactive_html(
                    project_root, new_feature_path, str(output_path)
                )
            else:
                html_file = None

            # Get statistics
            statistics = self.visualizer.get_dependency_statistics(analysis_result)

            # Auto-open in browser if requested
            if auto_open and html_file:
                import webbrowser
                webbrowser.open(f'file://{html_file}')

            return {
                "success": True,
                "error": None,
                "diagram_path": str(html_file) if html_file else None,
                "mermaid_code": mermaid_code,
                "statistics": statistics,
                "analysis_result": analysis_result
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Diagram creation failed: {str(e)}",
                "diagram_path": None,
                "statistics": None
            }

    def create_batch_diagrams(self,
                             project_root: str,
                             feature_paths: List[str],
                             diagram_type: str = "TD") -> List[Dict]:
        """
        Create dependency diagrams for multiple features

        Args:
            project_root: Root path of the project to analyze
            feature_paths: List of new feature file paths
            diagram_type: Mermaid diagram type

        Returns:
            List of diagram creation results
        """

        results = []

        for feature_path in feature_paths:
            result = self.create_dependency_diagram(
                project_root=project_root,
                new_feature_path=feature_path,
                diagram_type=diagram_type,
                auto_open=False,
                save_to_file=True
            )
            result["feature_path"] = feature_path
            results.append(result)

        return results

    def create_summary_dashboard(self,
                               project_root: str,
                               feature_paths: List[str]) -> Dict:
        """
        Create a summary dashboard with multiple dependency diagrams

        Args:
            project_root: Root path of the project to analyze
            feature_paths: List of new feature file paths

        Returns:
            Dashboard information with all diagrams
        """

        # Create individual diagrams
        diagram_results = self.create_batch_diagrams(project_root, feature_paths)

        # Aggregate statistics
        total_direct_deps = 0
        total_indirect_deps = 0
        total_files = 0
        risk_levels = []
        successful_diagrams = []
        failed_diagrams = []

        for result in diagram_results:
            if result["success"]:
                stats = result["statistics"]
                total_direct_deps += stats.get("direct_dependencies", 0)
                total_indirect_deps += stats.get("indirect_dependencies", 0)
                total_files = max(total_files, stats.get("total_files", 0))
                risk_levels.append(stats.get("risk_level", "UNKNOWN"))
                successful_diagrams.append(result)
            else:
                failed_diagrams.append(result)

        # Calculate overall risk level
        risk_priority = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        overall_risk = "LOW"
        if risk_levels:
            max_risk_value = max(risk_priority.get(risk, 1) for risk in risk_levels)
            overall_risk = next(risk for risk, value in risk_priority.items() if value == max_risk_value)

        # Create dashboard HTML
        dashboard_html = self._create_dashboard_html(
            project_root, successful_diagrams, failed_diagrams,
            total_direct_deps, total_indirect_deps, total_files, overall_risk
        )

        dashboard_path = self.output_dir / "dependency_dashboard.html"
        with open(dashboard_path, 'w', encoding='utf-8') as f:
            f.write(dashboard_html)

        return {
            "success": True,
            "dashboard_path": str(dashboard_path),
            "total_features": len(feature_paths),
            "successful_diagrams": len(successful_diagrams),
            "failed_diagrams": len(failed_diagrams),
            "total_direct_dependencies": total_direct_deps,
            "total_indirect_dependencies": total_indirect_deps,
            "overall_risk_level": overall_risk,
            "individual_results": diagram_results
        }

    def _create_dashboard_html(self, project_root: str, successful_diagrams: List[Dict],
                              failed_diagrams: List[Dict], total_direct: int,
                              total_indirect: int, total_files: int, overall_risk: str) -> str:
        """Create HTML dashboard with multiple dependency diagrams"""

        dashboard_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dependency Analysis Dashboard - {Path(project_root).name}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .dashboard-container {{
            max-width: 1600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        header h1 {{ font-size: 2.5em; margin-bottom: 10px; }}
        header p {{ font-size: 1.2em; opacity: 0.9; }}
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }}
        .stat-card {{
            background: white;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #667eea;
        }}
        .stat-number {{ font-size: 2.5em; font-weight: bold; color: #667eea; }}
        .stat-label {{ font-size: 1.1em; color: #6c757d; font-weight: 600; }}
        .diagrams-section {{ padding: 30px; }}
        .diagram-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
            gap: 30px;
        }}
        .diagram-card {{
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }}
        .diagram-title {{
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #495057;
        }}
        .mermaid {{ font-size: 12px; }}
        .risk-LOW {{ color: #28a745; }}
        .risk-MEDIUM {{ color: #ffc107; }}
        .risk-HIGH {{ color: #fd7e14; }}
        .risk-CRITICAL {{ color: #dc3545; }}
        .error-message {{
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
        }}
    </style>
</head>
<body>
    <div class="dashboard-container">
        <header>
            <h1>🦋 Dependency Analysis Dashboard</h1>
            <p>Project: {Path(project_root).name}</p>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{total_files}</div>
                <div class="stat-label">Total Files Analyzed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{total_direct}</div>
                <div class="stat-label">Direct Dependencies</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{total_indirect}</div>
                <div class="stat-label">Indirect Dependencies</div>
            </div>
            <div class="stat-card">
                <div class="stat-number risk-{overall_risk}">{overall_risk}</div>
                <div class="stat-label">Overall Risk Level</div>
            </div>
        </div>

        <div class="diagrams-section">
            <h2 style="margin-bottom: 20px; color: #495057;">Dependency Diagrams</h2>
            <div class="diagram-grid">
"""

        # Add successful diagrams
        for i, result in enumerate(successful_diagrams):
            feature_name = Path(result["feature_path"]).stem
            mermaid_code = result["mermaid_code"]
            stats = result["statistics"]
            risk_level = stats.get("risk_level", "UNKNOWN")

            dashboard_html += f"""
                <div class="diagram-card">
                    <div class="diagram-title">📊 {feature_name}</div>
                    <div style="margin-bottom: 10px;">
                        <strong>Risk:</strong> <span class="risk-{risk_level}">{risk_level}</span> |
                        <strong>Direct:</strong> {stats.get('direct_dependencies', 0)} |
                        <strong>Indirect:</strong> {stats.get('indirect_dependencies', 0)}
                    </div>
                    <div class="mermaid">
{mermaid_code}
                    </div>
                </div>
            """

        # Add failed diagrams
        for result in failed_diagrams:
            feature_name = Path(result["feature_path"]).stem
            error = result["error"]

            dashboard_html += f"""
                <div class="diagram-card">
                    <div class="diagram-title">❌ {feature_name}</div>
                    <div class="error-message">
                        <strong>Analysis Failed:</strong> {error}
                    </div>
                </div>
            """

        dashboard_html += """
            </div>
        </div>
    </div>

    <script>
        mermaid.initialize({startOnLoad: true});
    </script>
</body>
</html>"""

        return dashboard_html

    def get_project_features(self, project_root: str,
                           feature_pattern: str = "*.spec.md") -> List[str]:
        """
        Find all feature files in the project

        Args:
            project_root: Root path of the project
            feature_pattern: Pattern to match feature files

        Returns:
            List of feature file paths
        """

        project_path = Path(project_root)
        feature_files = []

        # Search for spec files
        for spec_file in project_path.rglob(feature_pattern):
            if spec_file.is_file():
                feature_files.append(str(spec_file))

        return sorted(feature_files)

    def auto_analyze_project(self, project_root: str,
                            max_features: int = 10) -> Dict:
        """
        Automatically analyze the project and create dependency diagrams

        Args:
            project_root: Root path of the project to analyze
            max_features: Maximum number of features to analyze

        Returns:
            Dashboard analysis result
        """

        # Find feature files
        feature_files = self.get_project_features(project_root)

        if not feature_files:
            return {
                "success": False,
                "error": f"No feature files found in {project_root}",
                "dashboard_path": None
            }

        # Limit number of features
        if len(feature_files) > max_features:
            feature_files = feature_files[:max_features]

        # Create dashboard
        return self.create_summary_dashboard(project_root, feature_files)


# MFMPP.PY Integration Functions
def add_dependency_diagram_to_mfmpp():
    """
    Example of how to integrate Mermaid diagrams into MFMPP.PY

    This function demonstrates the integration pattern that can be added to MFMPP.PY
    """

    def create_dependency_diagram_command(project_root: str, new_feature: str):
        """Command to create dependency diagram"""
        generator = MFMPPMermaidIntegration()
        result = generator.create_dependency_diagram(
            project_root=project_root,
            new_feature_path=new_feature,
            auto_open=True
        )

        if result["success"]:
            print(f"✅ Dependency diagram created: {result['diagram_path']}")
            print(f"📊 Direct dependencies: {result['statistics']['direct_dependencies']}")
            print(f"📈 Indirect dependencies: {result['statistics']['indirect_dependencies']}")
            print(f"⚠️  Risk level: {result['statistics']['risk_level']}")
        else:
            print(f"❌ Failed to create diagram: {result['error']}")

    def analyze_project_command(project_root: str, max_features: int = 10):
        """Command to analyze entire project"""
        generator = MFMPPMermaidIntegration()
        result = generator.auto_analyze_project(project_root, max_features)

        if result["success"]:
            print(f"✅ Project analysis dashboard created: {result['dashboard_path']}")
            print(f"📊 Features analyzed: {result['total_features']}")
            print(f"📈 Successful diagrams: {result['successful_diagrams']}")
            print(f"⚠️  Overall risk level: {result['overall_risk_level']}")
        else:
            print(f"❌ Failed to analyze project: {result['error']}")

    # Return integration functions
    return {
        "create_dependency_diagram": create_dependency_diagram_command,
        "analyze_project": analyze_project_command
    }


if __name__ == "__main__":
    # Example usage
    import argparse

    parser = argparse.ArgumentParser(description="MFMPP Mermaid Integration")
    parser.add_argument("--project-root", required=True, help="Project root path")
    parser.add_argument("--feature", help="Single feature to analyze")
    parser.add_argument("--analyze-project", action="store_true", help="Analyze entire project")
    parser.add_argument("--max-features", type=int, default=10, help="Max features to analyze")
    parser.add_argument("--open-browser", action="store_true", help="Open results in browser")

    args = parser.parse_args()

    generator = MFMPPMermaidIntegration()

    if args.feature:
        # Analyze single feature
        result = generator.create_dependency_diagram(
            project_root=args.project_root,
            new_feature_path=args.feature,
            auto_open=args.open_browser
        )

        if result["success"]:
            print(f"✅ Diagram created: {result['diagram_path']}")
        else:
            print(f"❌ Error: {result['error']}")

    elif args.analyze_project:
        # Analyze entire project
        result = generator.auto_analyze_project(args.project_root, args.max_features)

        if result["success"]:
            print(f"✅ Dashboard created: {result['dashboard_path']}")
            if args.open_browser:
                import webbrowser
                webbrowser.open(f'file://{result["dashboard_path"]}')
        else:
            print(f"❌ Error: {result['error']}")

    else:
        print("Please specify either --feature or --analyze-project")
        exit(1)