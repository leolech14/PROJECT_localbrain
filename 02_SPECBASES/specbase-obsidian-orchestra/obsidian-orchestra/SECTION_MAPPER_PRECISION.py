#!/usr/bin/env python3
"""
🎯 PRECISION SECTION MAPPER
Analyze all markdown specifications to map sections with precise metrics

CAPABILITIES:
- Section-by-section analysis with exact metrics
- Token counting and LOC analysis
- Percentage calculations within files
- Pattern recognition across similar specification types
- Structural DNA mapping of all modules
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any, Tuple
from collections import defaultdict, Counter
from datetime import datetime

class PrecisionSectionMapper:
    """
    Precision Section Mapper for comprehensive specification analysis
    Maps sections with exact metrics: name, type, category, purpose, tokens, LOC, percentages
    """

    def __init__(self):
        self.section_patterns = {
            # Front Matter Sections
            'front_matter': r'^---\n(.*?)\n---',
            'module_identity': r'# ===== MODULE IDENTITY =====\n(.*?)(?=\n# =====|\n## |\Z)',
            'systematic_scaffolding': r'# ===== SYSTEMATIC SCAFFOLDING =====\n(.*?)(?=\n# =====|\n## |\Z)',
            'promotion_gates': r'# ===== PROMOTION GATES =====\n(.*?)(?=\n# =====|\n## |\Z)',

            # Main Content Sections
            'purpose': r'## Purpose\n(.*?)(?=\n## |\Z)',
            'description': r'## Description\n(.*?)(?=\n## |\Z)',
            'technical_spec': r'## Technical Specification\n(.*?)(?=\n## |\Z)',
            'implementation': r'## Implementation\n(.*?)(?=\n## |\Z)',
            'api_specification': r'## API Specification\n(.*?)(?=\n## |\Z)',

            # Specialized Sections
            'user_interface': r'## User Interface\n(.*?)(?=\n## |\Z)',
            'data_models': r'## Data Models\n(.*?)(?=\n## |\Z)',
            'security_requirements': r'## Security Requirements\n(.*?)(?=\n## |\Z)',
            'integration_points': r'## Integration Points\n(.*?)(?=\n## |\Z)',
            'testing_strategy': r'## Testing Strategy\n(.*?)(?=\n## |\Z)',

            # Production Readiness
            'production_implementation': r'🚀 PRODUCTION IMPLEMENTATION.*?\n(.*?)(?=\n## |\n# |\Z)',
            'chatgpt_enhancement': r'ChatGPT.*?Enhancement.*?\n(.*?)(?=\n## |\n# |\Z)',

            # Code Examples
            'code_blocks': r'```[\w]*\n(.*?)\n```',
            'mermaid_diagrams': r'```mermaid\n(.*?)\n```',

            # Lists and Structures
            'bullet_lists': r'^\s*[-\*\+]\s+(.+)$',
            'numbered_lists': r'^\s*\d+\.\s+(.+)$',
            'todo_items': r'- \[ \]\s+(.+)$',
            'completed_items': r'- \[x\]\s+(.+)$'
        }

        self.file_classifications = {
            'modules': r'^\d{2}_[A-Z_]+\.md$',  # 00_MAIN_PAGE.md, etc.
            'orchestration': r'^0\.\d_[A-Z_]+\.md$',  # 0.3_ORCHESTRATOR_MAESTRO.md
            'master_docs': r'^[A-Z_]+_[A-Z_]+\.md$',  # COMPLETE_FINANCIAL_INTELLIGENCE...
            'components': r'^\d{2}_[A-Z_]+_COMPONENT\.md$',  # UI components
            'engines': r'^\d{2}_[A-Z_]+_ENGINE\.md$',  # Processing engines
            'systems': r'[A-Z_]+_SYSTEM\.md$',  # System specifications
            'strategies': r'[A-Z_]+_STRATEGY\.md$',  # Strategy documents
            'plans': r'[A-Z_]+_PLAN\.md$'  # Planning documents
        }

    def analyze_file_sections(self, file_path: str) -> Dict:
        """Analyze all sections in a single file with precise metrics"""

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            lines = content.split('\n')
            total_lines = len(lines)
            total_tokens = len(content.split())
            total_chars = len(content)

            # Extract all sections
            sections = {}

            for section_name, pattern in self.section_patterns.items():
                matches = re.findall(pattern, content, re.DOTALL | re.MULTILINE)

                if matches:
                    for i, match in enumerate(matches):
                        section_key = f"{section_name}_{i}" if len(matches) > 1 else section_name

                        section_lines = len(match.split('\n'))
                        section_tokens = len(match.split())
                        section_chars = len(match)

                        sections[section_key] = {
                            'content': match.strip(),
                            'metrics': {
                                'lines': section_lines,
                                'tokens': section_tokens,
                                'characters': section_chars,
                                'percentage_lines': round((section_lines / total_lines) * 100, 2),
                                'percentage_tokens': round((section_tokens / total_tokens) * 100, 2),
                                'percentage_chars': round((section_chars / total_chars) * 100, 2)
                            },
                            'analysis': {
                                'density': round(section_tokens / section_lines, 2) if section_lines > 0 else 0,
                                'complexity': self._assess_section_complexity(match),
                                'type': self._classify_section_type(section_name, match),
                                'purpose': self._extract_section_purpose(match)
                            }
                        }

            # Calculate unaccounted content
            total_accounted_tokens = sum(s['metrics']['tokens'] for s in sections.values())
            unaccounted_percentage = round(((total_tokens - total_accounted_tokens) / total_tokens) * 100, 2)

            return {
                'file_path': file_path,
                'file_name': os.path.basename(file_path),
                'file_classification': self._classify_file_type(os.path.basename(file_path)),
                'total_metrics': {
                    'lines': total_lines,
                    'tokens': total_tokens,
                    'characters': total_chars
                },
                'sections': sections,
                'coverage_analysis': {
                    'sections_identified': len(sections),
                    'unaccounted_percentage': unaccounted_percentage,
                    'section_coverage': round(100 - unaccounted_percentage, 2)
                }
            }

        except Exception as e:
            return {'error': str(e), 'file_path': file_path}

    def _classify_file_type(self, filename: str) -> str:
        """Classify file type based on naming patterns"""
        for file_type, pattern in self.file_classifications.items():
            if re.match(pattern, filename):
                return file_type
        return 'miscellaneous'

    def _assess_section_complexity(self, content: str) -> str:
        """Assess complexity of a section based on content indicators"""

        # Count complexity indicators
        code_blocks = content.count('```')
        technical_terms = len(re.findall(r'\b[A-Z][A-Z_]+[A-Z]\b', content))
        bullet_points = len(re.findall(r'^\s*[-\*\+]\s+', content, re.MULTILINE))
        links = content.count('[')

        complexity_score = (
            code_blocks * 2 +
            technical_terms * 0.5 +
            bullet_points * 0.2 +
            links * 0.1
        )

        if complexity_score > 10:
            return "very_high"
        elif complexity_score > 5:
            return "high"
        elif complexity_score > 2:
            return "medium"
        else:
            return "low"

    def _classify_section_type(self, section_name: str, content: str) -> str:
        """Classify the type/nature of a section"""

        if 'front_matter' in section_name or 'identity' in section_name:
            return "metadata"
        elif 'implementation' in section_name or 'production' in section_name:
            return "implementation"
        elif 'purpose' in section_name or 'description' in section_name:
            return "documentation"
        elif 'technical' in section_name or 'api' in section_name:
            return "technical"
        elif 'code_blocks' in section_name or 'mermaid' in section_name:
            return "code"
        elif 'security' in section_name:
            return "security"
        elif 'test' in section_name:
            return "testing"
        else:
            return "content"

    def _extract_section_purpose(self, content: str) -> str:
        """Extract the apparent purpose of a section"""

        # Look for purpose indicators in first few lines
        first_lines = content.split('\n')[:3]
        combined_start = ' '.join(first_lines).lower()

        if any(word in combined_start for word in ['define', 'specify', 'establish']):
            return "definition"
        elif any(word in combined_start for word in ['implement', 'create', 'build']):
            return "implementation"
        elif any(word in combined_start for word in ['configure', 'setup', 'initialize']):
            return "configuration"
        elif any(word in combined_start for word in ['test', 'validate', 'verify']):
            return "validation"
        elif any(word in combined_start for word in ['analyze', 'review', 'examine']):
            return "analysis"
        else:
            return "information"

    def map_all_specifications(self, directory: str = ".") -> Dict:
        """Map all specification files with complete section analysis"""

        print("🎯 PRECISION SECTION MAPPER - ENGAGING")
        print("🔍 Mapping all specification sections with atomic precision")
        print("=" * 60)

        complete_mapping = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'directory_analyzed': directory,
                'total_files_processed': 0
            },
            'file_analyses': [],
            'pattern_analysis': {},
            'structural_insights': {}
        }

        # Analyze all markdown files
        md_files = list(Path(directory).glob('*.md'))
        md_files = [f for f in md_files if not f.name.startswith('.')]

        print(f"📋 Found {len(md_files)} specification files to analyze")

        for md_file in sorted(md_files):
            print(f"🎯 Mapping sections: {md_file.name}")

            file_analysis = self.analyze_file_sections(str(md_file))
            if 'error' not in file_analysis:
                complete_mapping['file_analyses'].append(file_analysis)
                complete_mapping['metadata']['total_files_processed'] += 1

        # Analyze patterns across similar files
        print("🔍 Analyzing structural patterns...")
        complete_mapping['pattern_analysis'] = self._analyze_structural_patterns(complete_mapping['file_analyses'])

        # Generate insights
        print("💡 Generating structural insights...")
        complete_mapping['structural_insights'] = self._generate_structural_insights(complete_mapping['file_analyses'])

        print("✅ Section mapping complete!")
        return complete_mapping

    def _analyze_structural_patterns(self, file_analyses: List[Dict]) -> Dict:
        """Analyze patterns across files of similar types"""

        patterns = {}

        # Group by file classification
        by_classification = defaultdict(list)
        for analysis in file_analyses:
            classification = analysis['file_classification']
            by_classification[classification].append(analysis)

        # Analyze each group
        for classification, files in by_classification.items():
            if len(files) < 2:  # Skip single-file classifications
                continue

            print(f"   🔍 Analyzing {classification} pattern ({len(files)} files)")

            # Common sections analysis
            section_frequency = Counter()
            section_metrics = defaultdict(list)

            for file_analysis in files:
                for section_name, section_data in file_analysis['sections'].items():
                    base_section = section_name.split('_')[0]  # Remove indices
                    section_frequency[base_section] += 1
                    section_metrics[base_section].append(section_data['metrics'])

            # Calculate pattern statistics
            common_sections = {name: freq for name, freq in section_frequency.items()
                             if freq >= len(files) * 0.5}  # Present in at least 50% of files

            pattern_stats = {}
            for section_name, metrics_list in section_metrics.items():
                if section_name in common_sections:
                    avg_tokens = sum(m['tokens'] for m in metrics_list) / len(metrics_list)
                    avg_lines = sum(m['lines'] for m in metrics_list) / len(metrics_list)
                    avg_percentage = sum(m['percentage_tokens'] for m in metrics_list) / len(metrics_list)

                    pattern_stats[section_name] = {
                        'frequency': section_frequency[section_name],
                        'frequency_percentage': round((section_frequency[section_name] / len(files)) * 100, 1),
                        'avg_tokens': round(avg_tokens, 1),
                        'avg_lines': round(avg_lines, 1),
                        'avg_file_percentage': round(avg_percentage, 1)
                    }

            patterns[classification] = {
                'file_count': len(files),
                'common_sections': pattern_stats,
                'structural_consistency': self._calculate_structural_consistency(files)
            }

        return patterns

    def _calculate_structural_consistency(self, files: List[Dict]) -> float:
        """Calculate how structurally consistent files are within a classification"""

        if len(files) < 2:
            return 1.0

        # Compare section presence across files
        all_sections = set()
        file_sections = []

        for file_analysis in files:
            file_section_set = set(s.split('_')[0] for s in file_analysis['sections'].keys())
            all_sections.update(file_section_set)
            file_sections.append(file_section_set)

        # Calculate Jaccard similarity across all files
        similarities = []
        for i in range(len(file_sections)):
            for j in range(i + 1, len(file_sections)):
                intersection = len(file_sections[i] & file_sections[j])
                union = len(file_sections[i] | file_sections[j])
                similarity = intersection / union if union > 0 else 0
                similarities.append(similarity)

        return round(sum(similarities) / len(similarities), 3) if similarities else 1.0

    def _generate_structural_insights(self, file_analyses: List[Dict]) -> Dict:
        """Generate insights about structural patterns"""

        insights = {
            'total_sections_identified': 0,
            'most_common_sections': {},
            'largest_sections_by_tokens': [],
            'section_type_distribution': Counter(),
            'complexity_distribution': Counter(),
            'coverage_analysis': {}
        }

        # Aggregate all sections
        all_sections = []
        section_names = Counter()

        for file_analysis in file_analyses:
            insights['total_sections_identified'] += len(file_analysis['sections'])

            for section_name, section_data in file_analysis['sections'].items():
                base_name = section_name.split('_')[0]
                section_names[base_name] += 1

                all_sections.append({
                    'file': file_analysis['file_name'],
                    'section': section_name,
                    'base_section': base_name,
                    'metrics': section_data['metrics'],
                    'analysis': section_data['analysis']
                })

                insights['section_type_distribution'][section_data['analysis']['type']] += 1
                insights['complexity_distribution'][section_data['analysis']['complexity']] += 1

        # Most common sections
        insights['most_common_sections'] = dict(section_names.most_common(10))

        # Largest sections by tokens
        largest_sections = sorted(all_sections, key=lambda x: x['metrics']['tokens'], reverse=True)
        insights['largest_sections_by_tokens'] = [
            {
                'file': s['file'],
                'section': s['section'],
                'tokens': s['metrics']['tokens'],
                'lines': s['metrics']['lines'],
                'percentage': s['metrics']['percentage_tokens']
            }
            for s in largest_sections[:15]
        ]

        # Coverage analysis
        coverage_stats = []
        for file_analysis in file_analyses:
            coverage_stats.append(file_analysis['coverage_analysis']['section_coverage'])

        insights['coverage_analysis'] = {
            'average_coverage': round(sum(coverage_stats) / len(coverage_stats), 2),
            'high_coverage_files': len([c for c in coverage_stats if c > 80]),
            'low_coverage_files': len([c for c in coverage_stats if c < 50])
        }

        return insights

    def generate_precision_report(self, output_file: str = "PRECISION_SECTION_ANALYSIS.md"):
        """Generate comprehensive section mapping report"""

        mapping_data = self.map_all_specifications()

        with open(output_file, 'w') as f:
            f.write("# 🎯 PRECISION SECTION MAPPING ANALYSIS\n")
            f.write("**Complete Structural DNA of Financial Intelligence Platform**\n\n")
            f.write(f"Generated: {mapping_data['metadata']['generated_at']}\n\n")
            f.write("---\n\n")

            # Executive Summary
            f.write("## 📊 EXECUTIVE SUMMARY\n\n")
            f.write(f"**Files Analyzed:** {mapping_data['metadata']['total_files_processed']}\n")
            f.write(f"**Sections Identified:** {mapping_data['structural_insights']['total_sections_identified']}\n")
            f.write(f"**Average Coverage:** {mapping_data['structural_insights']['coverage_analysis']['average_coverage']}%\n\n")

            # Pattern Analysis by File Type
            f.write("## 🏗️ STRUCTURAL PATTERNS BY FILE TYPE\n\n")

            for classification, pattern_data in mapping_data['pattern_analysis'].items():
                f.write(f"### {classification.title().replace('_', ' ')} Pattern\n")
                f.write(f"**Files:** {pattern_data['file_count']}\n")
                f.write(f"**Structural Consistency:** {pattern_data['structural_consistency']:.1%}\n\n")

                f.write("**Common Section Patterns:**\n")
                for section, stats in pattern_data['common_sections'].items():
                    f.write(f"- **{section}:** {stats['frequency']}/{pattern_data['file_count']} files ")
                    f.write(f"({stats['frequency_percentage']}%) | ")
                    f.write(f"Avg: {stats['avg_tokens']} tokens, {stats['avg_lines']} lines, ")
                    f.write(f"{stats['avg_file_percentage']}% of file\n")
                f.write("\n")

            # Section Insights
            f.write("## 🔍 SECTION INTELLIGENCE\n\n")

            f.write("### Most Common Sections Across All Files:\n")
            for section, count in mapping_data['structural_insights']['most_common_sections'].items():
                f.write(f"- **{section}:** {count} files\n")

            f.write("\n### Largest Sections by Content Volume:\n")
            for section_info in mapping_data['structural_insights']['largest_sections_by_tokens']:
                f.write(f"- **{section_info['file']}** → {section_info['section']}: ")
                f.write(f"{section_info['tokens']} tokens ({section_info['percentage']}% of file)\n")

            # Section Type Distribution
            f.write(f"\n### Section Type Distribution:\n")
            for section_type, count in mapping_data['structural_insights']['section_type_distribution'].items():
                f.write(f"- **{section_type.title()}:** {count} sections\n")

            # Complexity Distribution
            f.write(f"\n### Complexity Distribution:\n")
            for complexity, count in mapping_data['structural_insights']['complexity_distribution'].items():
                f.write(f"- **{complexity.title()}:** {count} sections\n")

            # Individual File Analysis
            f.write("\n## 📋 INDIVIDUAL FILE SECTION BREAKDOWN\n\n")

            for file_analysis in sorted(mapping_data['file_analyses'],
                                       key=lambda x: x['total_metrics']['tokens'], reverse=True):
                f.write(f"### {file_analysis['file_name']}\n")
                f.write(f"**Type:** {file_analysis['file_classification']} | ")
                f.write(f"**Total:** {file_analysis['total_metrics']['tokens']} tokens, ")
                f.write(f"{file_analysis['total_metrics']['lines']} lines | ")
                f.write(f"**Coverage:** {file_analysis['coverage_analysis']['section_coverage']}%\n\n")

                if file_analysis['sections']:
                    f.write("**Sections:**\n")
                    for section_name, section_data in file_analysis['sections'].items():
                        metrics = section_data['metrics']
                        analysis = section_data['analysis']
                        f.write(f"- `{section_name}` ({analysis['type']}) - ")
                        f.write(f"{metrics['tokens']} tokens ({metrics['percentage_tokens']}%) | ")
                        f.write(f"{metrics['lines']} lines | {analysis['complexity']} complexity\n")
                f.write("\n")

        print(f"📋 Precision analysis report generated: {output_file}")
        return mapping_data

    def export_section_database(self, output_file: str = "SECTION_DATABASE.json"):
        """Export complete section database for programmatic use"""

        mapping_data = self.map_all_specifications()

        with open(output_file, 'w') as f:
            json.dump(mapping_data, f, indent=2, ensure_ascii=False)

        print(f"💾 Section database exported: {output_file}")
        return mapping_data

def main():
    """Execute precision section mapping"""

    mapper = PrecisionSectionMapper()

    # Generate comprehensive analysis
    mapping_data = mapper.generate_precision_report()

    # Export database
    mapper.export_section_database()

    print("\n🎯 PRECISION SECTION MAPPING COMPLETE!")
    print("🔍 All specifications mapped with atomic section precision")
    print("📊 Structural patterns identified across file classifications")
    print("💡 Ready for architectural pattern analysis!")

if __name__ == "__main__":
    main()