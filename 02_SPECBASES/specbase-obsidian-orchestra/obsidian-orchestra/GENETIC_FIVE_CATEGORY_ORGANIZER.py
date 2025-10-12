#!/usr/bin/env python3
"""
🧬 GENETIC FIVE-CATEGORY ORGANIZER
Organize files by ProfilePro's proven 5-category schema using genetic properties

CATEGORIES:
01-standards (STD) - Standards & Configurations
02-frameworks (FRW) - Frameworks & Layouts
03-modules (MOD) - Modules & Services
04-governance (GOV) - Governance & Processes
05-operations (OPS) - Operations & Runtime
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

class GeneticFiveCategoryOrganizer:
    """
    Organizes files using genetic composition analysis + 5-category schema
    """

    def __init__(self):
        # Category classification rules based on genetic patterns
        self.category_genetic_signatures = {
            '01-standards': {
                'code': 'STD',
                'genetic_patterns': ['⚡³', '⚡²', 'γ²', 'γ³', '⚙²', '⚙³'],  # Security/requirements dominant
                'keywords': ['specification', 'standard', 'requirement', 'compliance', 'policy'],
                'file_patterns': ['*SPEC*', '*POLICY*', '*STANDARD*', '*COMPLIANCE*']
            },
            '02-frameworks': {
                'code': 'FRW',
                'genetic_patterns': ['∑³', '∑²', '∇³', '∇²', '∆²'],  # UI/design dominant
                'keywords': ['framework', 'layout', 'design', 'system', 'grid', 'canvas'],
                'file_patterns': ['*DESIGN*', '*LAYOUT*', '*CANVAS*', '*FRAMEWORK*']
            },
            '03-modules': {
                'code': 'MOD',
                'genetic_patterns': ['Ⅰ³', 'Ⅰ²', '♦²', '♦³', 'α²'],  # Implementation/agent dominant
                'keywords': ['module', 'agent', 'component', 'engine', 'service'],
                'file_patterns': [r'^\d{2}_', r'^0\.\d_']  # Numbered modules
            },
            '04-governance': {
                'code': 'GOV',
                'genetic_patterns': ['β³', '⬢²', '⬢³', '☑²'],  # Documentation/meta dominant
                'keywords': ['governance', 'roadmap', 'report', 'completion', 'analysis'],
                'file_patterns': ['*ROADMAP*', '*REPORT*', '*COMPLETION*', '*ANALYSIS*']
            },
            '05-operations': {
                'code': 'OPS',
                'genetic_patterns': ['⚙³', '✓²', '⟹²'],  # Config/process dominant
                'keywords': ['operation', 'deployment', 'build', 'runtime', 'infrastructure'],
                'file_patterns': ['*CONFIG*', '*BUILD*', '*DEPLOY*', '*RUNTIME*']
            }
        }

        # Ordering properties for each category
        self.ordering_properties = {
            '01-standards': [
                ('security_dominance', 'DESC'),  # Most security-critical first
                ('requirement_density', 'DESC'), # Most requirements-heavy first
                ('compliance_score', 'DESC')     # Most compliant first
            ],
            '02-frameworks': [
                ('ui_complexity', 'DESC'),       # Most UI-complex first
                ('design_completeness', 'DESC'), # Most design-complete first
                ('framework_breadth', 'DESC')    # Broadest frameworks first
            ],
            '03-modules': [
                ('implementation_readiness', 'DESC'), # Most implementation-ready first
                ('agent_autonomy', 'DESC'),           # Most autonomous agents first
                ('module_number', 'ASC')              # Numerical order
            ],
            '04-governance': [
                ('documentation_completeness', 'DESC'), # Most complete docs first
                ('strategic_importance', 'DESC'),       # Most strategic first
                ('analysis_depth', 'DESC')              # Most analytical first
            ],
            '05-operations': [
                ('operational_complexity', 'DESC'), # Most complex operations first
                ('automation_level', 'DESC'),       # Most automated first
                ('infrastructure_impact', 'DESC')   # Highest infrastructure impact first
            ]
        }

    def load_file_data(self):
        """Load file data with genetic analysis"""
        print("📊 Loading file data for genetic categorization...")

        # Load meaningful section report for genetic data
        with open("MEANINGFUL_SECTION_REPORT.md", 'r') as f:
            content = f.read()

        # Parse file sections and calculate genetic properties
        self.file_genetic_data = {}

        file_sections = re.split(r'### ([^#\n]+\.md)', content)[1:]

        for i in range(0, len(file_sections), 2):
            if i + 1 < len(file_sections):
                file_name = file_sections[i].strip()
                file_content = file_sections[i + 1]

                # Extract total metrics
                total_match = re.search(r'\*\*Total:\*\* (\d+) tokens, (\d+) lines', file_content)
                if total_match:
                    total_tokens = int(total_match.group(1))
                    total_lines = int(total_match.group(2))
                else:
                    continue

                # Extract sections
                sections = {}
                section_matches = re.findall(
                    r'- \*\*([^*]+)\*\* \([^)]+\) - (\d+) tokens \(([0-9.]+)%\)',
                    file_content
                )

                for section_name, tokens, percentage in section_matches:
                    sections[section_name] = {
                        'tokens': int(tokens),
                        'percentage': float(percentage)
                    }

                # Calculate genetic properties
                genetic_properties = self._calculate_genetic_properties(file_name, sections, total_tokens, total_lines)
                self.file_genetic_data[file_name] = genetic_properties

        print(f"   ✅ Genetic data calculated for {len(self.file_genetic_data)} files")

    def _calculate_genetic_properties(self, file_name: str, sections: dict, total_tokens: int, total_lines: int) -> dict:
        """Calculate comprehensive genetic properties for a file"""

        properties = {
            'file_name': file_name,
            'total_tokens': total_tokens,
            'total_lines': total_lines,
            'section_count': len(sections),

            # Core genetic metrics
            'implementation_readiness': 0,
            'ui_complexity': 0,
            'security_dominance': 0,
            'requirement_density': 0,
            'agent_autonomy': 0,

            # Advanced metrics
            'documentation_completeness': 0,
            'strategic_importance': 0,
            'operational_complexity': 0,
            'compliance_score': 0,
            'business_impact': 0,

            # Structural metrics
            'genetic_diversity': len(sections),
            'content_density': total_tokens / len(sections) if sections else 0,
            'specialization_index': 0
        }

        # Calculate genetic metrics based on section composition
        for section_name, section_data in sections.items():
            percentage = section_data['percentage']

            # Implementation readiness
            if 'implementation' in section_name or 'typescript' in section_name or 'production' in section_name:
                properties['implementation_readiness'] += percentage

            # UI complexity
            if 'ui_component' in section_name or 'interface' in section_name:
                properties['ui_complexity'] += percentage

            # Security dominance
            if 'security' in section_name:
                properties['security_dominance'] += percentage

            # Requirements density
            if 'requirements' in section_name or 'functional' in section_name:
                properties['requirement_density'] += percentage

            # Agent autonomy
            if 'agent' in section_name or 'orchestration' in section_name:
                properties['agent_autonomy'] += percentage

            # Documentation completeness
            if 'documentation' in section_name or 'comprehensive' in section_name:
                properties['documentation_completeness'] += percentage

            # Strategic importance (architecture, roadmap content)
            if 'architecture' in section_name or 'specification' in section_name:
                properties['strategic_importance'] += percentage

            # Operational complexity
            if 'testing' in section_name or 'validation' in section_name or 'configuration' in section_name:
                properties['operational_complexity'] += percentage

        # Calculate derived metrics
        properties['compliance_score'] = properties['security_dominance'] + properties['requirement_density']
        properties['business_impact'] = (properties['implementation_readiness'] + properties['ui_complexity']) / 2
        properties['specialization_index'] = max(properties[key] for key in [
            'implementation_readiness', 'ui_complexity', 'security_dominance', 'agent_autonomy'
        ])

        # Module number extraction for numerical ordering
        if re.match(r'^\d{2}_', file_name):
            properties['module_number'] = int(file_name[:2])
        elif re.match(r'^0\.\d_', file_name):
            properties['module_number'] = float(file_name[:3])
        else:
            properties['module_number'] = 999  # Non-numbered files last

        return properties

    def classify_file_into_category(self, file_name: str, genetic_properties: dict) -> str:
        """Classify file into one of the 5 categories using genetic analysis"""

        # Score each category
        category_scores = {}

        for category, criteria in self.category_genetic_signatures.items():
            score = 0

            # Check file pattern matches
            for pattern in criteria['file_patterns']:
                if pattern.startswith('^') and pattern.endswith('_'):
                    # Regex pattern
                    if re.match(pattern, file_name):
                        score += 10
                else:
                    # Keyword pattern
                    if pattern.replace('*', '').lower() in file_name.lower():
                        score += 5

            # Check genetic signatures (would need actual genetic strings)
            # For now, use calculated properties

            # Modules: High implementation + agent content
            if category == '03-modules':
                if genetic_properties['implementation_readiness'] > 20:
                    score += 8
                if genetic_properties['agent_autonomy'] > 5:
                    score += 5
                if genetic_properties['module_number'] < 100:
                    score += 10

            # Standards: High security/requirements
            elif category == '01-standards':
                if genetic_properties['security_dominance'] > 15:
                    score += 8
                if genetic_properties['requirement_density'] > 10:
                    score += 5
                if genetic_properties['compliance_score'] > 20:
                    score += 7

            # Frameworks: High UI complexity
            elif category == '02-frameworks':
                if genetic_properties['ui_complexity'] > 15:
                    score += 8
                if 'design' in file_name.lower() or 'canvas' in file_name.lower():
                    score += 5

            # Governance: High documentation/strategic
            elif category == '04-governance':
                if genetic_properties['documentation_completeness'] > 10:
                    score += 6
                if genetic_properties['strategic_importance'] > 15:
                    score += 8
                if 'COMPLETE' in file_name or 'ROADMAP' in file_name:
                    score += 7

            # Operations: High operational complexity
            elif category == '05-operations':
                if genetic_properties['operational_complexity'] > 10:
                    score += 8
                if 'CANVAS' in file_name or 'REGISTRY' in file_name:
                    score += 5

            category_scores[category] = score

        # Return category with highest score
        best_category = max(category_scores.items(), key=lambda x: x[1])
        return best_category[0]

    def organize_files_by_genetic_categories(self) -> dict:
        """Organize all files by genetic 5-category schema"""

        print("🧬 GENETIC FIVE-CATEGORY ORGANIZER - ENGAGING")
        print("📊 Organizing files by genetic properties and proven categories")
        print("=" * 65)

        self.load_file_data()

        organization = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'organization_schema': 'five_category_genetic',
                'total_files_organized': len(self.file_genetic_data)
            },
            'categories': {
                '01-standards': {'code': 'STD', 'files': []},
                '02-frameworks': {'code': 'FRW', 'files': []},
                '03-modules': {'code': 'MOD', 'files': []},
                '04-governance': {'code': 'GOV', 'files': []},
                '05-operations': {'code': 'OPS', 'files': []}
            },
            'ordering_analysis': {},
            'category_genetics': {}
        }

        # Classify and organize each file
        for file_name, genetic_properties in self.file_genetic_data.items():
            print(f"🧬 Classifying: {file_name}")

            category = self.classify_file_into_category(file_name, genetic_properties)

            # Add to category
            organization['categories'][category]['files'].append({
                'file_name': file_name,
                'genetic_properties': genetic_properties,
                'genetic_signature': self._generate_genetic_signature(genetic_properties)
            })

        # Order files within each category by meaningful properties
        print("📊 Ordering files by genetic properties...")
        for category, category_data in organization['categories'].items():
            if category_data['files']:
                ordered_files = self._order_files_by_genetic_properties(
                    category_data['files'], category
                )
                organization['categories'][category]['files'] = ordered_files

        # Generate category genetics analysis
        print("🔬 Analyzing category genetic patterns...")
        organization['category_genetics'] = self._analyze_category_genetics(organization['categories'])

        print("✅ Genetic organization complete!")
        return organization

    def _generate_genetic_signature(self, genetic_properties: dict) -> str:
        """Generate compact genetic signature for file"""

        # Create signature based on dominant properties
        signature_parts = []

        # Implementation level
        impl = genetic_properties['implementation_readiness']
        if impl > 20:
            signature_parts.append('Ⅰ³')
        elif impl > 10:
            signature_parts.append('Ⅰ²')
        elif impl > 5:
            signature_parts.append('Ⅰ¹')

        # UI complexity
        ui = genetic_properties['ui_complexity']
        if ui > 15:
            signature_parts.append('∑³')
        elif ui > 8:
            signature_parts.append('∑²')
        elif ui > 3:
            signature_parts.append('∑¹')

        # Security level
        security = genetic_properties['security_dominance']
        if security > 15:
            signature_parts.append('⚡³')
        elif security > 5:
            signature_parts.append('⚡²')
        elif security > 1:
            signature_parts.append('⚡¹')

        # Agent autonomy
        agent = genetic_properties['agent_autonomy']
        if agent > 10:
            signature_parts.append('♦³')
        elif agent > 3:
            signature_parts.append('♦²')
        elif agent > 1:
            signature_parts.append('♦¹')

        return ''.join(signature_parts) if signature_parts else '○'

    def _order_files_by_genetic_properties(self, files: list, category: str) -> list:
        """Order files within category by their most meaningful genetic properties"""

        if category == '03-modules':
            # Order by: Module number → Implementation readiness → Agent autonomy
            return sorted(files, key=lambda f: (
                f['genetic_properties']['module_number'],
                -f['genetic_properties']['implementation_readiness'],
                -f['genetic_properties']['agent_autonomy']
            ))

        elif category == '01-standards':
            # Order by: Security dominance → Compliance score → Requirements density
            return sorted(files, key=lambda f: (
                -f['genetic_properties']['security_dominance'],
                -f['genetic_properties']['compliance_score'],
                -f['genetic_properties']['requirement_density']
            ))

        elif category == '02-frameworks':
            # Order by: UI complexity → Design completeness → Framework breadth
            return sorted(files, key=lambda f: (
                -f['genetic_properties']['ui_complexity'],
                -f['genetic_properties']['content_density'],
                -f['genetic_properties']['genetic_diversity']
            ))

        elif category == '04-governance':
            # Order by: Strategic importance → Documentation completeness → Analysis depth
            return sorted(files, key=lambda f: (
                -f['genetic_properties']['strategic_importance'],
                -f['genetic_properties']['documentation_completeness'],
                -f['genetic_properties']['total_tokens']
            ))

        elif category == '05-operations':
            # Order by: Operational complexity → File size → Genetic diversity
            return sorted(files, key=lambda f: (
                -f['genetic_properties']['operational_complexity'],
                -f['genetic_properties']['total_tokens'],
                -f['genetic_properties']['genetic_diversity']
            ))

        else:
            # Default alphabetical
            return sorted(files, key=lambda f: f['file_name'])

    def _analyze_category_genetics(self, categories: dict) -> dict:
        """Analyze genetic patterns within each category"""

        category_genetics = {}

        for category_name, category_data in categories.items():
            if not category_data['files']:
                continue

            files = category_data['files']

            # Calculate category genetic metrics
            avg_implementation = sum(f['genetic_properties']['implementation_readiness'] for f in files) / len(files)
            avg_ui_complexity = sum(f['genetic_properties']['ui_complexity'] for f in files) / len(files)
            avg_security = sum(f['genetic_properties']['security_dominance'] for f in files) / len(files)
            avg_tokens = sum(f['genetic_properties']['total_tokens'] for f in files) / len(files)

            # Most common genetic signatures
            signatures = [f['genetic_signature'] for f in files]
            common_signatures = Counter(signatures).most_common(3)

            category_genetics[category_name] = {
                'file_count': len(files),
                'average_metrics': {
                    'implementation_readiness': round(avg_implementation, 2),
                    'ui_complexity': round(avg_ui_complexity, 2),
                    'security_dominance': round(avg_security, 2),
                    'content_volume': round(avg_tokens)
                },
                'common_genetic_signatures': common_signatures,
                'category_dna_pattern': self._extract_category_dna_pattern(files)
            }

        return category_genetics

    def _extract_category_dna_pattern(self, files: list) -> str:
        """Extract the typical DNA pattern for a category"""

        # Aggregate genetic markers across all files in category
        marker_totals = defaultdict(float)

        for file_data in files:
            properties = file_data['genetic_properties']

            # Weight markers by their presence
            if properties['implementation_readiness'] > 10:
                marker_totals['Ⅰ'] += properties['implementation_readiness']
            if properties['ui_complexity'] > 5:
                marker_totals['∑'] += properties['ui_complexity']
            if properties['security_dominance'] > 3:
                marker_totals['⚡'] += properties['security_dominance']
            if properties['agent_autonomy'] > 3:
                marker_totals['♦'] += properties['agent_autonomy']

        # Create representative pattern
        sorted_markers = sorted(marker_totals.items(), key=lambda x: x[1], reverse=True)
        pattern_parts = []

        for marker, strength in sorted_markers[:5]:
            avg_strength = strength / len(files)
            if avg_strength > 15:
                pattern_parts.append(f"{marker}³")
            elif avg_strength > 8:
                pattern_parts.append(f"{marker}²")
            elif avg_strength > 3:
                pattern_parts.append(f"{marker}¹")

        return ''.join(pattern_parts) if pattern_parts else '○'

    def generate_genetic_organization_report(self, output_file: str = "GENETIC_FIVE_CATEGORY_ORGANIZATION.md"):
        """Generate comprehensive genetic organization report"""

        organization_data = self.organize_files_by_genetic_categories()

        with open(output_file, 'w') as f:
            f.write("# 🧬 GENETIC FIVE-CATEGORY ORGANIZATION\n")
            f.write("**Files Organized by Genetic Properties + Proven 5-Category Schema**\n\n")
            f.write(f"Generated: {organization_data['metadata']['generated_at']}\n\n")
            f.write("---\n\n")

            # Category overview
            f.write("## 📊 CATEGORY DISTRIBUTION\n\n")
            f.write("| Category | Code | Files | Avg Tokens | Genetic Pattern |\n")
            f.write("|----------|------|-------|------------|------------------|\n")

            for category, data in organization_data['categories'].items():
                if data['files']:
                    genetics = organization_data['category_genetics'][category]
                    avg_tokens = genetics['average_metrics']['content_volume']
                    pattern = genetics['category_dna_pattern']
                    f.write(f"| {category} | {data['code']} | {genetics['file_count']} | {avg_tokens:,} | `{pattern}` |\n")
            f.write("\n")

            # Detailed category breakdown
            for category, data in organization_data['categories'].items():
                if not data['files']:
                    continue

                f.write(f"## 🧬 {category.upper()} CATEGORY ({data['code']})\n\n")

                genetics = organization_data['category_genetics'][category]
                f.write(f"**Files:** {genetics['file_count']}\n")
                f.write(f"**Category DNA Pattern:** `{genetics['category_dna_pattern']}`\n")
                f.write(f"**Average Implementation Readiness:** {genetics['average_metrics']['implementation_readiness']:.1f}%\n")
                f.write(f"**Average UI Complexity:** {genetics['average_metrics']['ui_complexity']:.1f}%\n")
                f.write(f"**Average Security:** {genetics['average_metrics']['security_dominance']:.1f}%\n\n")

                f.write("**Files Ordered by Genetic Properties:**\n\n")
                f.write("| Rank | File | Genetic Signature | Tokens | Key Properties |\n")
                f.write("|------|------|-------------------|--------|----------------|\n")

                for i, file_data in enumerate(data['files'], 1):
                    props = file_data['genetic_properties']
                    signature = file_data['genetic_signature']

                    # Key properties based on category
                    if category == '03-modules':
                        key_props = f"Impl:{props['implementation_readiness']:.1f}% Agent:{props['agent_autonomy']:.1f}%"
                    elif category == '01-standards':
                        key_props = f"Sec:{props['security_dominance']:.1f}% Req:{props['requirement_density']:.1f}%"
                    elif category == '02-frameworks':
                        key_props = f"UI:{props['ui_complexity']:.1f}% Density:{props['content_density']:.0f}"
                    elif category == '04-governance':
                        key_props = f"Strategic:{props['strategic_importance']:.1f}% Doc:{props['documentation_completeness']:.1f}%"
                    else:
                        key_props = f"Ops:{props['operational_complexity']:.1f}% Size:{props['total_tokens']}"

                    f.write(f"| {i:2} | {file_data['file_name']} | `{signature}` | {props['total_tokens']:,} | {key_props} |\n")

                f.write("\n")

        print(f"📋 Genetic organization report generated: {output_file}")
        return organization_data

def main():
    """Execute genetic five-category organization"""

    organizer = GeneticFiveCategoryOrganizer()
    organization_data = organizer.generate_genetic_organization_report()

    print("\n🧬 GENETIC FIVE-CATEGORY ORGANIZATION COMPLETE!")
    print("📊 Files classified by genetic composition analysis")
    print("🎯 Files ordered by most meaningful properties within categories")
    print("🔬 Genetic signatures generated for mathematical comparison!")

if __name__ == "__main__":
    main()