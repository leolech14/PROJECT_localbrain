#!/usr/bin/env python3
"""
🧬 GENETIC SPECIFICATION ENCODER
Create DNA-like strings that completely describe file composition

GENETIC APPROACH:
- Each section type = genetic marker
- Section percentage = gene expression level
- File composition = complete genetic sequence
- Mathematical encoding of content + structure in single string
"""

import json
import re
from pathlib import Path
from collections import Counter
from datetime import datetime

class GeneticSpecificationEncoder:
    """
    Encodes specification files as genetic information strings
    """

    def __init__(self):
        # Genetic markers for each section type
        self.genetic_markers = {
            # CORE GENES (Greek letters)
            'module_purpose_and_objectives': 'α',
            'comprehensive_technical_documentation': 'β',
            'functional_requirements_definition': 'γ',

            # IMPLEMENTATION GENES (Roman numerals)
            'typescript_implementation_code': 'Ⅰ',
            'production_implementation_specification': 'Ⅱ',
            'implementation_task_checklist': 'Ⅲ',
            'technical_implementation_details': 'Ⅳ',

            # INTERFACE GENES (Math operators)
            'ui_component_inventory_specifications': '∑',
            'ui_component_behavioral_specification': '∆',
            'user_interface_design_specification': '∇',

            # SECURITY GENES (Protection symbols)
            'security_requirements_and_controls': '⚡',
            'security_control_specifications': '🛡',

            # DATA GENES (Flow symbols)
            'data_processing_logic': '→',
            'database_integration_specification': '⚀',
            'data_structure_definition_specifications': '◊',

            # COORDINATION GENES (Network symbols)
            'agent_orchestration_logic': '♦',
            'api_interface_definitions': '⟷',
            'api_endpoint_catalog_specifications': '⟶',

            # VALIDATION GENES (Check symbols)
            'testing_validation_procedures': '✓',
            'validation_criteria_specifications': '✗',

            # CONFIGURATION GENES (System symbols)
            'configuration_data_structures': '⚙',
            'feature_capability_catalog_specifications': '⭐',

            # PROCESS GENES (Flow symbols)
            'sequential_implementation_procedure': '⟹',
            'completed_implementation_verification': '☑',

            # ARCHITECTURAL GENES (Structure symbols)
            'architectural_diagram_hierarchical_system_architecture': '⬟',
            'implementation_specification_specifications': '⬢'
        }

        # Expression level encoding (percentage to genetic strength)
        self.expression_levels = {
            'DOMINANT': '³',    # >20% of file
            'STRONG': '²',      # 10-20% of file
            'MODERATE': '¹',    # 5-10% of file
            'PRESENT': '⁰',     # 1-5% of file
            'TRACE': '·'        # <1% of file
        }

    def load_section_data(self):
        """Load section database for genetic encoding"""
        print("🧬 Loading section data for genetic encoding...")

        with open("MEANINGFUL_SECTION_REPORT.md", 'r') as f:
            content = f.read()

        # Extract section data
        self.section_data = {}

        # Parse file sections
        file_sections = re.split(r'### ([^#\n]+\.md)', content)[1:]  # Skip header

        for i in range(0, len(file_sections), 2):
            if i + 1 < len(file_sections):
                file_name = file_sections[i].strip()
                file_content = file_sections[i + 1]

                # Extract sections with metrics
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

                if sections:
                    self.section_data[file_name] = sections

        print(f"   ✅ Genetic data loaded for {len(self.section_data)} files")

    def encode_file_genetics(self, file_name: str, sections: dict) -> str:
        """Encode file as genetic information string"""

        genetic_sequence = []

        # Sort sections by percentage (dominant genes first)
        sorted_sections = sorted(sections.items(),
                               key=lambda x: x[1]['percentage'], reverse=True)

        for section_name, metrics in sorted_sections:
            # Get genetic marker
            marker = self.genetic_markers.get(section_name, '○')

            # Determine expression level
            percentage = metrics['percentage']
            if percentage > 20:
                expression = self.expression_levels['DOMINANT']
            elif percentage > 10:
                expression = self.expression_levels['STRONG']
            elif percentage > 5:
                expression = self.expression_levels['MODERATE']
            elif percentage > 1:
                expression = self.expression_levels['PRESENT']
            else:
                expression = self.expression_levels['TRACE']

            # Create genetic code
            genetic_code = f"{marker}{expression}"
            genetic_sequence.append(genetic_code)

        # Join into complete genetic string
        complete_genetics = "".join(genetic_sequence)

        return complete_genetics

    def classify_genetic_pattern(self, genetic_string: str) -> dict:
        """Classify file type based on genetic pattern"""

        # Analyze genetic markers present
        dominant_genes = []
        strong_genes = []

        # Extract genes by expression level
        if 'Ⅰ³' in genetic_string or 'Ⅰ²' in genetic_string:
            dominant_genes.append('IMPLEMENTATION_HEAVY')
        if '∑²' in genetic_string or '∑³' in genetic_string:
            dominant_genes.append('INTERFACE_RICH')
        if '♦²' in genetic_string or '♦³' in genetic_string:
            dominant_genes.append('ORCHESTRATION_FOCUSED')
        if '⚡²' in genetic_string or '⚡³' in genetic_string:
            dominant_genes.append('SECURITY_CRITICAL')
        if '→²' in genetic_string or '→³' in genetic_string:
            dominant_genes.append('DATA_INTENSIVE')

        # Count gene diversity
        unique_markers = len(set(re.findall(r'[α-ω♦⚡→∑∆∇⟷⟶✓⚙⬟⬢☑⟹◊⚀🛡⭐✗]', genetic_string)))

        # Classification logic
        if 'ORCHESTRATION_FOCUSED' in dominant_genes and 'IMPLEMENTATION_HEAVY' in dominant_genes:
            classification = 'ORCHESTRATION_MODULE'
        elif 'INTERFACE_RICH' in dominant_genes and 'IMPLEMENTATION_HEAVY' in dominant_genes:
            classification = 'UI_MODULE'
        elif 'DATA_INTENSIVE' in dominant_genes and 'IMPLEMENTATION_HEAVY' in dominant_genes:
            classification = 'ENGINE_MODULE'
        elif 'SECURITY_CRITICAL' in dominant_genes:
            classification = 'SECURITY_MODULE'
        elif len(dominant_genes) == 0 and unique_markers > 10:
            classification = 'BALANCED_MODULE'
        elif unique_markers < 5:
            classification = 'SIMPLE_SPECIFICATION'
        else:
            classification = 'COMPLEX_MODULE'

        return {
            'classification': classification,
            'dominant_traits': dominant_genes,
            'genetic_diversity': unique_markers,
            'complexity_score': len(dominant_genes) + (unique_markers * 0.1)
        }

    def generate_genetic_manifest(self) -> dict:
        """Generate complete genetic manifest for all files"""

        print("🧬 GENETIC SPECIFICATION ENCODER - ENGAGING")
        print("🔬 Creating DNA-like strings for all specification files")
        print("=" * 60)

        self.load_section_data()

        genetic_manifest = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'encoding_system': 'genetic_specification_dna',
                'total_files_encoded': len(self.section_data),
                'genetic_marker_count': len(self.genetic_markers)
            },
            'genetic_taxonomy': self.genetic_markers,
            'expression_levels': self.expression_levels,
            'file_genetics': [],
            'genetic_patterns': {},
            'ecosystem_genetics': {}
        }

        # Encode each file
        for file_name, sections in self.section_data.items():
            print(f"🧬 Encoding genetics: {file_name}")

            genetic_string = self.encode_file_genetics(file_name, sections)
            classification = self.classify_genetic_pattern(genetic_string)

            file_genetics = {
                'file_name': file_name,
                'genetic_sequence': genetic_string,
                'sequence_length': len(genetic_string),
                'unique_markers': len(set(re.findall(r'[α-ω♦⚡→∑∆∇⟷⟶✓⚙⬟⬢☑⟹◊⚀🛡⭐✗]', genetic_string))),
                'classification': classification,
                'total_tokens': sum(s['tokens'] for s in sections.values()),
                'total_sections': len(sections)
            }

            genetic_manifest['file_genetics'].append(file_genetics)

        # Analyze genetic patterns
        print("🔬 Analyzing genetic patterns...")
        genetic_manifest['genetic_patterns'] = self._analyze_genetic_patterns(
            genetic_manifest['file_genetics']
        )

        # Generate ecosystem genetics
        print("🌱 Generating ecosystem genetics...")
        genetic_manifest['ecosystem_genetics'] = self._generate_ecosystem_genetics(
            genetic_manifest['file_genetics']
        )

        print("✅ Genetic encoding complete!")
        return genetic_manifest

    def _analyze_genetic_patterns(self, file_genetics: list) -> dict:
        """Analyze patterns in genetic sequences"""

        patterns = {
            'classification_distribution': Counter(),
            'common_genetic_motifs': Counter(),
            'genetic_diversity_stats': {},
            'expression_level_distribution': Counter()
        }

        # Collect genetic data
        genetic_diversities = []
        sequence_lengths = []

        for file_gen in file_genetics:
            # Count classifications
            classification = file_gen['classification']['classification']
            patterns['classification_distribution'][classification] += 1

            # Extract genetic motifs (2-3 symbol patterns)
            sequence = file_gen['genetic_sequence']
            motifs = []

            # Extract expression patterns
            for i in range(len(sequence) - 2):
                motif = sequence[i:i+3]
                if any(char in motif for char in '³²¹⁰·'):
                    motifs.append(motif)

            patterns['common_genetic_motifs'].update(motifs)

            # Collect diversity stats
            genetic_diversities.append(file_gen['unique_markers'])
            sequence_lengths.append(file_gen['sequence_length'])

            # Count expression levels
            for level_symbol in self.expression_levels.values():
                patterns['expression_level_distribution'][level_symbol] += sequence.count(level_symbol)

        # Calculate diversity statistics
        if genetic_diversities:
            patterns['genetic_diversity_stats'] = {
                'min_diversity': min(genetic_diversities),
                'max_diversity': max(genetic_diversities),
                'avg_diversity': round(sum(genetic_diversities) / len(genetic_diversities), 2),
                'avg_sequence_length': round(sum(sequence_lengths) / len(sequence_lengths), 1)
            }

        return patterns

    def _generate_ecosystem_genetics(self, file_genetics: list) -> dict:
        """Generate ecosystem-wide genetic analysis"""

        ecosystem = {
            'total_genetic_markers_used': set(),
            'universal_genes': [],  # Genes present in >90% of files
            'rare_genes': [],       # Genes present in <10% of files
            'ecosystem_complexity': 0
        }

        # Collect all markers used
        marker_frequencies = Counter()

        for file_gen in file_genetics:
            sequence = file_gen['genetic_sequence']
            markers = set(re.findall(r'[α-ω♦⚡→∑∆∇⟷⟶✓⚙⬟⬢☑⟹◊⚀🛡⭐✗]', sequence))

            ecosystem['total_genetic_markers_used'].update(markers)
            for marker in markers:
                marker_frequencies[marker] += 1

        total_files = len(file_genetics)

        # Identify universal and rare genes
        for marker, frequency in marker_frequencies.items():
            percentage = (frequency / total_files) * 100
            if percentage > 90:
                ecosystem['universal_genes'].append({'marker': marker, 'frequency': percentage})
            elif percentage < 10:
                ecosystem['rare_genes'].append({'marker': marker, 'frequency': percentage})

        # Calculate ecosystem complexity
        ecosystem['ecosystem_complexity'] = len(ecosystem['total_genetic_markers_used']) / len(self.genetic_markers)

        return ecosystem

    def generate_genetic_manifest_report(self, output_file: str = "GENETIC_SPECIFICATION_MANIFEST.md"):
        """Generate comprehensive genetic manifest"""

        genetic_data = self.generate_genetic_manifest()

        with open(output_file, 'w') as f:
            f.write("# 🧬 GENETIC SPECIFICATION MANIFEST\n")
            f.write("**DNA-like Strings for Complete File Composition Description**\n\n")
            f.write(f"Generated: {genetic_data['metadata']['generated_at']}\n\n")
            f.write("---\n\n")

            # Genetic marker legend
            f.write("## 🔬 GENETIC MARKER LEGEND\n\n")
            f.write("| Marker | Code | Section Type | Avg % | Nature |\n")
            f.write("|--------|------|-------------|--------|--------|\n")

            marker_stats = self._calculate_marker_statistics(genetic_data['file_genetics'])
            for section_name, marker in genetic_data['genetic_taxonomy'].items():
                stats = marker_stats.get(marker, {'avg_percentage': 0, 'frequency': 0})
                f.write(f"| {marker} | {section_name[:8].upper()} | {section_name} | {stats['avg_percentage']:.1f}% | {self._get_marker_nature(section_name)} |\n")
            f.write("\n")

            # Expression level legend
            f.write("## 🧬 EXPRESSION LEVEL ENCODING\n\n")
            f.write("| Level | Symbol | Range | Meaning |\n")
            f.write("|-------|--------|-------|----------|\n")
            f.write("| DOMINANT | ³ | >20% | Primary file characteristic |\n")
            f.write("| STRONG | ² | 10-20% | Significant presence |\n")
            f.write("| MODERATE | ¹ | 5-10% | Notable component |\n")
            f.write("| PRESENT | ⁰ | 1-5% | Minor element |\n")
            f.write("| TRACE | · | <1% | Minimal presence |\n\n")

            # File genetic sequences
            f.write("## 🧬 COMPLETE GENETIC SEQUENCES\n\n")

            # Sort by genetic complexity
            sorted_genetics = sorted(genetic_data['file_genetics'],
                                   key=lambda x: x['unique_markers'], reverse=True)

            for file_gen in sorted_genetics:
                f.write(f"### {file_gen['file_name']}\n")
                f.write(f"**Genetic Sequence:** `{file_gen['genetic_sequence']}`\n")
                f.write(f"**Classification:** {file_gen['classification']['classification']}\n")
                f.write(f"**Genetic Diversity:** {file_gen['unique_markers']} markers\n")
                f.write(f"**Content Volume:** {file_gen['total_tokens']:,} tokens ({file_gen['total_sections']} sections)\n")
                f.write(f"**Complexity Score:** {file_gen['classification']['complexity_score']:.3f}\n\n")

                # Decode genetic sequence
                f.write("**Genetic Breakdown:**\n")
                sequence = file_gen['genetic_sequence']
                self._decode_genetic_sequence(f, sequence)
                f.write("\n")

            # Genetic patterns
            patterns = genetic_data['genetic_patterns']
            f.write("## 📊 GENETIC PATTERN ANALYSIS\n\n")

            f.write("### Classification Distribution:\n")
            for classification, count in patterns['classification_distribution'].most_common():
                percentage = round((count / len(genetic_data['file_genetics'])) * 100, 1)
                f.write(f"- **{classification}:** {count} files ({percentage}%)\n")
            f.write("\n")

            f.write("### Most Common Genetic Motifs:\n")
            for motif, count in patterns['common_genetic_motifs'].most_common(10):
                f.write(f"- `{motif}` appears {count} times\n")
            f.write("\n")

            # Ecosystem genetics
            ecosystem = genetic_data['ecosystem_genetics']
            f.write("## 🌱 ECOSYSTEM GENETICS\n\n")
            f.write(f"**Total Genetic Markers Used:** {len(ecosystem['total_genetic_markers_used'])}\n")
            f.write(f"**Ecosystem Complexity:** {ecosystem['ecosystem_complexity']:.1%}\n\n")

            f.write("### Universal Genes (>90% presence):\n")
            for gene in ecosystem['universal_genes']:
                f.write(f"- `{gene['marker']}` present in {gene['frequency']:.1f}% of files\n")
            f.write("\n")

            f.write("### Rare Genes (<10% presence):\n")
            for gene in ecosystem['rare_genes']:
                f.write(f"- `{gene['marker']}` present in {gene['frequency']:.1f}% of files\n")

        print(f"📋 Genetic manifest generated: {output_file}")
        return genetic_data

    def _decode_genetic_sequence(self, f, sequence: str):
        """Decode genetic sequence into readable breakdown"""

        # Extract individual genetic elements
        genetic_elements = []
        i = 0
        while i < len(sequence):
            char = sequence[i]
            if char in self.genetic_markers.values():
                # Look for expression level
                expression = '⁰'  # Default
                if i + 1 < len(sequence):
                    next_char = sequence[i + 1]
                    if next_char in self.expression_levels.values():
                        expression = next_char
                        i += 1

                genetic_elements.append((char, expression))
            i += 1

        # Write breakdown
        for marker, expression in genetic_elements[:10]:  # Top 10 genes
            section_name = self._get_section_name_for_marker(marker)
            expression_meaning = self._get_expression_meaning(expression)
            f.write(f"  - `{marker}{expression}` {section_name} ({expression_meaning})\n")

    def _calculate_marker_statistics(self, file_genetics: list) -> dict:
        """Calculate statistics for each genetic marker"""

        marker_stats = {}

        for file_gen in file_genetics:
            sequence = file_gen['genetic_sequence']
            markers = re.findall(r'[α-ω♦⚡→∑∆∇⟷⟶✓⚙⬟⬢☑⟹◊⚀🛡⭐✗]', sequence)

            for marker in set(markers):
                if marker not in marker_stats:
                    marker_stats[marker] = {'frequencies': [], 'count': 0}
                marker_stats[marker]['count'] += 1

        # Calculate averages
        for marker in marker_stats:
            count = marker_stats[marker]['count']
            marker_stats[marker]['frequency'] = count
            marker_stats[marker]['avg_percentage'] = 0  # Would need section data for this

        return marker_stats

    def _get_section_name_for_marker(self, marker: str) -> str:
        """Get section name for genetic marker"""
        for section_name, section_marker in self.genetic_markers.items():
            if section_marker == marker:
                return section_name.replace('_', ' ').title()
        return 'Unknown Section'

    def _get_expression_meaning(self, expression: str) -> str:
        """Get meaning of expression level"""
        for level_name, level_symbol in self.expression_levels.items():
            if level_symbol == expression:
                return level_name.lower()
        return 'unknown'

    def _get_marker_nature(self, section_name: str) -> str:
        """Get the nature category of a marker"""
        if 'implementation' in section_name or 'typescript' in section_name:
            return 'IMPLEMENTATION'
        elif 'ui_component' in section_name or 'interface' in section_name:
            return 'INTERFACE'
        elif 'security' in section_name:
            return 'SECURITY'
        elif 'data' in section_name:
            return 'DATA'
        elif 'agent' in section_name or 'orchestration' in section_name:
            return 'COORDINATION'
        elif 'purpose' in section_name or 'documentation' in section_name:
            return 'CORE'
        else:
            return 'SPECIALIZED'

def main():
    """Execute genetic specification encoding"""

    encoder = GeneticSpecificationEncoder()
    genetic_data = encoder.generate_genetic_manifest_report()

    # Export genetic database
    with open("GENETIC_SPECIFICATION_DATABASE.json", 'w') as f:
        json.dump(genetic_data, f, indent=2, ensure_ascii=False)

    print("\n🧬 GENETIC SPECIFICATION ENCODING COMPLETE!")
    print("🔬 DNA-like strings generated for all specification files")
    print("📊 Genetic classification achieved with mathematical precision")
    print("🧮 Complete genetic manifest with ecosystem analysis created!")

if __name__ == "__main__":
    main()