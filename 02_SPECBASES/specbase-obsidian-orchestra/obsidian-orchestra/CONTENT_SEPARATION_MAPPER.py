#!/usr/bin/env python3
"""
🎯 CONTENT SEPARATION MAPPER
Use previous section mapping to properly separate content by nature

STRATEGY:
- Load SECTION_DATABASE.json for precise section metrics
- Map each section to MODULES, SUBSTRATE, or INTELLIGENCE nature
- Generate content separation plan with exact token/LOC allocation
- Create new pure-nature files from existing mixed content
"""

import json
import os
from collections import defaultdict, Counter
from datetime import datetime

class ContentSeparationMapper:
    """
    Maps content sections to proper nature categories for separation
    """

    def __init__(self):
        # Section-to-nature mapping based on semantic meaning
        self.section_nature_mapping = {
            # MODULE (Actor) SECTIONS
            'agent_orchestration_logic': 'MODULE',
            'typescript_implementation_code': 'MODULE',
            'implementation_task_checklist': 'MODULE',
            'production_implementation_specification': 'MODULE',
            'technical_implementation_details': 'MODULE',
            'module_purpose_and_objectives': 'MODULE',
            'api_interface_definitions': 'MODULE',
            'data_processing_logic': 'MODULE',
            'completed_implementation_verification': 'MODULE',

            # SUBSTRATE (Container) SECTIONS
            'ui_component_inventory_specifications': 'SUBSTRATE',
            'ui_component_behavioral_specification': 'SUBSTRATE',
            'user_interface_design_specification': 'SUBSTRATE',
            'configuration_data_structures': 'SUBSTRATE',
            'architectural_diagram_hierarchical_system_architecture': 'SUBSTRATE',

            # INTELLIGENCE (Governor) SECTIONS
            'security_requirements_and_controls': 'INTELLIGENCE',
            'functional_requirements_definition': 'INTELLIGENCE',
            'comprehensive_technical_documentation': 'INTELLIGENCE',
            'security_control_specifications': 'INTELLIGENCE',
            'testing_validation_procedures': 'INTELLIGENCE',
            'policy_enforcement_specifications': 'INTELLIGENCE',
            'feature_capability_catalog_specifications': 'INTELLIGENCE',
            'api_endpoint_catalog_specifications': 'INTELLIGENCE'
        }

    def load_section_database(self):
        """Load the detailed section mapping database"""
        print("📊 Loading section database with detailed metrics...")

        with open("SECTION_DATABASE.json", 'r') as f:
            self.section_data = json.load(f)

        total_files = len(self.section_data.get('file_analyses', []))
        total_sections = self.section_data.get('structural_insights', {}).get('total_sections_identified', 0)

        print(f"   ✅ {total_files} files with {total_sections} sections loaded")

    def analyze_content_separation_requirements(self) -> dict:
        """Analyze how content should be separated by nature"""

        print("🔬 Analyzing content separation requirements...")

        separation_analysis = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'source_database': 'SECTION_DATABASE.json',
                'analysis_type': 'content_separation_mapping'
            },
            'file_separation_plans': [],
            'nature_content_distribution': {
                'MODULE': {'files': 0, 'sections': 0, 'tokens': 0, 'lines': 0},
                'SUBSTRATE': {'files': 0, 'sections': 0, 'tokens': 0, 'lines': 0},
                'INTELLIGENCE': {'files': 0, 'sections': 0, 'tokens': 0, 'lines': 0}
            },
            'separation_statistics': {}
        }

        # Analyze each file for content separation
        for file_analysis in self.section_data.get('file_analyses', []):
            file_name = file_analysis['file_name']
            total_tokens = file_analysis['total_metrics']['tokens']
            total_lines = file_analysis['total_metrics']['lines']

            print(f"   🔍 Analyzing: {file_name}")

            # Map each section to nature
            section_nature_breakdown = {
                'MODULE': {'sections': [], 'tokens': 0, 'lines': 0},
                'SUBSTRATE': {'sections': [], 'tokens': 0, 'lines': 0},
                'INTELLIGENCE': {'sections': [], 'tokens': 0, 'lines': 0}
            }

            sections = file_analysis.get('sections', {})
            for section_name, section_data in sections.items():
                section_tokens = section_data['metrics']['tokens']
                section_lines = section_data['metrics']['lines']

                # Determine section nature
                nature = self._classify_section_nature(section_name, section_data)

                section_nature_breakdown[nature]['sections'].append({
                    'name': section_name,
                    'tokens': section_tokens,
                    'lines': section_lines,
                    'percentage_tokens': section_data['metrics']['percentage_tokens'],
                    'percentage_lines': section_data['metrics']['percentage_lines']
                })

                section_nature_breakdown[nature]['tokens'] += section_tokens
                section_nature_breakdown[nature]['lines'] += section_lines

            # Calculate separation requirements
            requires_separation = sum(1 for nature in section_nature_breakdown.values()
                                    if nature['tokens'] > 0) > 1

            separation_plan = {
                'file_name': file_name,
                'total_metrics': {'tokens': total_tokens, 'lines': total_lines},
                'requires_separation': requires_separation,
                'nature_breakdown': section_nature_breakdown,
                'recommended_split': self._generate_split_recommendation(
                    file_name, section_nature_breakdown, total_tokens
                )
            }

            separation_analysis['file_separation_plans'].append(separation_plan)

            # Update global nature distribution
            for nature, nature_data in section_nature_breakdown.items():
                if nature_data['tokens'] > 0:
                    separation_analysis['nature_content_distribution'][nature]['files'] += 1
                    separation_analysis['nature_content_distribution'][nature]['sections'] += len(nature_data['sections'])
                    separation_analysis['nature_content_distribution'][nature]['tokens'] += nature_data['tokens']
                    separation_analysis['nature_content_distribution'][nature]['lines'] += nature_data['lines']

        # Generate separation statistics
        separation_analysis['separation_statistics'] = self._calculate_separation_statistics(
            separation_analysis['file_separation_plans']
        )

        return separation_analysis

    def _classify_section_nature(self, section_name: str, section_data: dict) -> str:
        """Classify section nature based on semantic meaning"""

        # First check explicit mapping
        base_section = section_name.split('_')[0]
        if section_name in self.section_nature_mapping:
            return self.section_nature_mapping[section_name]
        if base_section in self.section_nature_mapping:
            return self.section_nature_mapping[base_section]

        # Analyze section content for nature classification
        section_text = section_data.get('content', '').lower()

        # MODULE indicators
        if any(keyword in section_text for keyword in [
            'agent', 'function', 'implement', 'execute', 'process', 'perform',
            'typescript', 'code', 'class', 'method', 'api'
        ]):
            return 'MODULE'

        # SUBSTRATE indicators
        elif any(keyword in section_text for keyword in [
            'layout', 'design', 'structure', 'framework', 'container',
            'grid', 'canvas', 'component', 'ui', 'interface'
        ]):
            return 'SUBSTRATE'

        # INTELLIGENCE indicators
        elif any(keyword in section_text for keyword in [
            'requirement', 'specification', 'policy', 'rule', 'governance',
            'compliance', 'standard', 'guideline', 'architecture'
        ]):
            return 'INTELLIGENCE'

        # Fallback: classify by section name patterns
        elif any(word in section_name for word in [
            'implementation', 'code', 'typescript', 'task', 'checklist'
        ]):
            return 'MODULE'
        elif any(word in section_name for word in [
            'ui_component', 'design', 'layout', 'canvas', 'grid'
        ]):
            return 'SUBSTRATE'
        else:
            return 'INTELLIGENCE'  # Default for requirements/documentation

    def _generate_split_recommendation(self, file_name: str, nature_breakdown: dict, total_tokens: int) -> dict:
        """Generate specific recommendations for splitting the file"""

        # Count natures with significant content (>5% of file)
        significant_natures = {}
        for nature, data in nature_breakdown.items():
            if data['tokens'] > 0:
                percentage = (data['tokens'] / total_tokens) * 100
                if percentage > 5:  # Significant if >5% of file
                    significant_natures[nature] = {
                        'tokens': data['tokens'],
                        'percentage': round(percentage, 1),
                        'sections': len(data['sections'])
                    }

        if len(significant_natures) > 1:
            # File needs splitting
            recommended_files = []
            for nature, data in significant_natures.items():
                new_filename = self._generate_nature_filename(file_name, nature)
                recommended_files.append({
                    'new_filename': new_filename,
                    'nature': nature,
                    'content_percentage': data['percentage'],
                    'sections_count': data['sections']
                })

            return {
                'action': 'split_required',
                'reason': f"Mixed content across {len(significant_natures)} natures",
                'recommended_files': recommended_files
            }
        else:
            # File is mostly pure nature
            dominant_nature = list(significant_natures.keys())[0] if significant_natures else 'MODULE'
            new_filename = self._generate_nature_filename(file_name, dominant_nature)
            return {
                'action': 'rename_only',
                'reason': f"Pure {dominant_nature} nature",
                'recommended_files': [{
                    'new_filename': new_filename,
                    'nature': dominant_nature,
                    'content_percentage': 100.0
                }]
            }

    def _generate_nature_filename(self, original_name: str, nature: str) -> str:
        """Generate new filename based on nature"""

        # Remove .md extension
        base_name = original_name.replace('.md', '')

        # Generate prefix based on nature
        if nature == 'MODULE':
            if base_name.startswith('0.'):
                return f"MODULE__{base_name}.md"
            elif base_name.isdigit() or (len(base_name) >= 2 and base_name[:2].isdigit()):
                return f"MODULE__{base_name}.md"
            else:
                return f"MODULE__{base_name}.md"
        elif nature == 'SUBSTRATE':
            return f"SUBSTRATE__{base_name}.md"
        else:  # INTELLIGENCE
            return f"INTELLIGENCE__{base_name}.md"

    def _calculate_separation_statistics(self, separation_plans: list) -> dict:
        """Calculate overall separation statistics"""

        stats = {
            'files_requiring_splits': 0,
            'files_ready_for_rename': 0,
            'total_new_files_needed': 0,
            'content_distribution_by_nature': {}
        }

        for plan in separation_plans:
            if plan['recommended_split']['action'] == 'split_required':
                stats['files_requiring_splits'] += 1
                stats['total_new_files_needed'] += len(plan['recommended_split']['recommended_files'])
            else:
                stats['files_ready_for_rename'] += 1
                stats['total_new_files_needed'] += 1

        return stats

    def generate_separation_plan_report(self, output_file: str = "CONTENT_SEPARATION_PLAN.md"):
        """Generate detailed content separation plan"""

        separation_data = self.analyze_content_separation_requirements()

        with open(output_file, 'w') as f:
            f.write("# 🔧 CONTENT SEPARATION PLAN\n")
            f.write("**Detailed Plan for Separating Mixed-Nature Content**\n\n")
            f.write(f"Generated: {separation_data['metadata']['generated_at']}\n\n")
            f.write("---\n\n")

            # Executive Summary
            stats = separation_data['separation_statistics']
            f.write("## 📊 SEPARATION REQUIREMENTS SUMMARY\n\n")
            f.write(f"**Files Requiring Splits:** {stats['files_requiring_splits']}\n")
            f.write(f"**Files Ready for Rename:** {stats['files_ready_for_rename']}\n")
            f.write(f"**Total New Files Needed:** {stats['total_new_files_needed']}\n\n")

            # Nature Distribution
            f.write("## 🧬 CONTENT DISTRIBUTION BY NATURE\n\n")
            nature_dist = separation_data['nature_content_distribution']
            for nature, data in nature_dist.items():
                f.write(f"### {nature} Nature:\n")
                f.write(f"- **Files with {nature} content:** {data['files']}\n")
                f.write(f"- **Total sections:** {data['sections']}\n")
                f.write(f"- **Total tokens:** {data['tokens']:,}\n")
                f.write(f"- **Total lines:** {data['lines']:,}\n\n")

            # Detailed Separation Plans
            f.write("## 📋 DETAILED SEPARATION PLANS\n\n")

            for plan in separation_data['file_separation_plans']:
                f.write(f"### {plan['file_name']}\n")
                f.write(f"**Total:** {plan['total_metrics']['tokens']:,} tokens, {plan['total_metrics']['lines']:,} lines\n")
                f.write(f"**Action:** {plan['recommended_split']['action']}\n\n")

                if plan['recommended_split']['action'] == 'split_required':
                    f.write("**Recommended Split:**\n")
                    for new_file in plan['recommended_split']['recommended_files']:
                        f.write(f"- **{new_file['new_filename']}** ({new_file['nature']}) - ")
                        f.write(f"{new_file['content_percentage']}% of original content\n")

                    f.write("\n**Content Breakdown by Nature:**\n")
                    for nature, nature_data in plan['nature_breakdown'].items():
                        if nature_data['tokens'] > 0:
                            percentage = round((nature_data['tokens'] / plan['total_metrics']['tokens']) * 100, 1)
                            f.write(f"- **{nature}:** {nature_data['tokens']:,} tokens ({percentage}%) ")
                            f.write(f"- {len(nature_data['sections'])} sections\n")

                    f.write("\n**Sections by Nature:**\n")
                    for nature, nature_data in plan['nature_breakdown'].items():
                        if nature_data['sections']:
                            f.write(f"**{nature} Sections:**\n")
                            for section in nature_data['sections']:
                                f.write(f"- `{section['name']}` - {section['tokens']} tokens ({section['percentage_tokens']:.1f}%)\n")
                            f.write("\n")

                else:
                    new_file = plan['recommended_split']['recommended_files'][0]
                    f.write(f"**Rename to:** {new_file['new_filename']}\n")

                f.write("\n")

        print(f"📋 Content separation plan generated: {output_file}")
        return separation_data

    def generate_separation_commands(self, separation_data: dict, output_file: str = "SEPARATION_COMMANDS.md"):
        """Generate specific commands for executing the content separation"""

        with open(output_file, 'w') as f:
            f.write("# 🚀 CONTENT SEPARATION EXECUTION COMMANDS\n")
            f.write("**Step-by-step commands to separate mixed-nature content**\n\n")

            split_count = 0
            rename_count = 0

            for plan in separation_data['file_separation_plans']:
                file_name = plan['file_name']

                if plan['recommended_split']['action'] == 'split_required':
                    split_count += 1
                    f.write(f"## SPLIT: {file_name}\n\n")

                    for new_file_info in plan['recommended_split']['recommended_files']:
                        new_filename = new_file_info['new_filename']
                        nature = new_file_info['nature']

                        f.write(f"### Create {new_filename}\n")
                        f.write(f"```bash\n")
                        f.write(f"# Extract {nature} content from {file_name}\n")
                        f.write(f"# Include sections: {nature} nature sections only\n")
                        f.write(f"# Content: {new_file_info['content_percentage']}% of original\n")
                        f.write(f"```\n\n")

                else:
                    rename_count += 1
                    new_filename = plan['recommended_split']['recommended_files'][0]['new_filename']
                    f.write(f"## RENAME: {file_name} → {new_filename}\n\n")

            f.write(f"\n## 📊 EXECUTION SUMMARY\n")
            f.write(f"**Files to Split:** {split_count}\n")
            f.write(f"**Files to Rename:** {rename_count}\n")
            f.write(f"**Total New Files:** {sum(len(p['recommended_split']['recommended_files']) for p in separation_data['file_separation_plans'])}\n")

        print(f"📋 Separation commands generated: {output_file}")

def main():
    """Execute content separation mapping"""

    mapper = ContentSeparationMapper()

    # Load section database
    mapper.load_section_database()

    # Generate separation plan
    separation_data = mapper.generate_separation_plan_report()

    # Generate execution commands
    mapper.generate_separation_commands(separation_data)

    print("\n🎯 CONTENT SEPARATION MAPPING COMPLETE!")
    print("🔧 Detailed separation plan generated with exact token/LOC allocation")
    print("📊 Content mapped by nature with precise metrics")
    print("🚀 Ready for systematic content separation execution!")

if __name__ == "__main__":
    main()