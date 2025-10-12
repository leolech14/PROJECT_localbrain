#!/usr/bin/env python3
"""
🎯 SEMANTIC SECTION MAPPER
Maps sections by their ACTUAL CONTENT MEANING, not just format types

REVOLUTIONARY APPROACH:
- Extract semantic meaning from each section
- Name sections by their actual purpose/content
- Analyze what each section ACTUALLY DISCUSSES
- Create meaningful taxonomies based on content essence
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
from collections import Counter

class SemanticSectionMapper:
    """
    Maps sections by semantic meaning and actual content purpose
    """

    def __init__(self):
        # Semantic content indicators for meaningful naming
        self.content_semantics = {
            # Technical Implementation
            'api_endpoints': ['endpoint', 'api', 'route', 'method', 'GET', 'POST', 'PUT', 'DELETE'],
            'data_schemas': ['schema', 'model', 'interface', 'type', 'structure', 'format'],
            'authentication_flow': ['auth', 'login', 'token', 'jwt', 'oauth', 'security', 'permission'],
            'database_design': ['database', 'table', 'collection', 'query', 'sql', 'nosql'],
            'integration_patterns': ['integration', 'webhook', 'sync', 'connector', 'adapter'],

            # Business Logic
            'financial_calculations': ['calculation', 'formula', 'algorithm', 'compute', 'math'],
            'transaction_processing': ['transaction', 'payment', 'transfer', 'processing', 'execute'],
            'budget_management': ['budget', 'limit', 'threshold', 'goal', 'target', 'allocation'],
            'revenue_tracking': ['revenue', 'income', 'earnings', 'profit', 'billing'],
            'expense_analysis': ['expense', 'cost', 'spending', 'expenditure', 'analysis'],

            # Agent & AI Systems
            'agent_orchestration': ['orchestrator', 'maestro', 'conductor', 'routing', 'dispatch'],
            'ai_decision_making': ['decision', 'intelligence', 'analysis', 'reasoning', 'logic'],
            'autonomous_behavior': ['autonomous', 'automatic', 'self', 'independent'],
            'conversation_management': ['conversation', 'chat', 'dialogue', 'communication'],

            # Security & Compliance
            'policy_enforcement': ['policy', 'rule', 'enforcement', 'compliance', 'validation'],
            'audit_tracking': ['audit', 'trail', 'log', 'tracking', 'history', 'forensics'],
            'access_control': ['access', 'permission', 'role', 'authorization', 'rbac'],
            'encryption_security': ['encryption', 'decrypt', 'cipher', 'secure', 'cryptographic'],

            # User Experience
            'interface_design': ['interface', 'ui', 'ux', 'design', 'layout', 'responsive'],
            'user_workflow': ['workflow', 'flow', 'journey', 'process', 'steps'],
            'visualization_systems': ['chart', 'graph', 'visualization', 'display', 'render'],
            'interaction_patterns': ['interaction', 'gesture', 'click', 'hover', 'keyboard'],

            # System Architecture
            'microservices_design': ['microservice', 'service', 'distributed', 'scalable'],
            'data_flow_architecture': ['flow', 'pipeline', 'stream', 'transformation'],
            'performance_optimization': ['performance', 'optimization', 'cache', 'speed'],
            'monitoring_observability': ['monitoring', 'observability', 'metrics', 'alerts'],

            # Configuration & Setup
            'environment_config': ['environment', 'config', 'configuration', 'settings'],
            'deployment_strategy': ['deployment', 'deploy', 'production', 'staging'],
            'dependency_management': ['dependency', 'package', 'library', 'module'],

            # Testing & Quality
            'testing_strategy': ['test', 'testing', 'validation', 'verification', 'qa'],
            'quality_assurance': ['quality', 'standard', 'guideline', 'best_practice'],

            # Documentation Types
            'requirements_specification': ['requirement', 'specification', 'spec', 'must', 'shall'],
            'implementation_guide': ['implementation', 'guide', 'how_to', 'tutorial'],
            'architectural_decision': ['decision', 'rationale', 'choice', 'alternative'],
            'troubleshooting_guide': ['troubleshoot', 'debug', 'error', 'issue', 'problem']
        }

    def extract_section_semantic_meaning(self, content: str, section_context: str = "") -> str:
        """Extract the actual semantic meaning of a section"""

        content_lower = content.lower()

        # Score content against semantic categories
        semantic_scores = {}
        for meaning, keywords in self.content_semantics.items():
            score = sum(1 for keyword in keywords if keyword in content_lower)
            if score > 0:
                semantic_scores[meaning] = score

        # If we found semantic matches, use the highest scoring one
        if semantic_scores:
            best_match = max(semantic_scores.items(), key=lambda x: x[1])
            return best_match[0]

        # Fallback: analyze content structure and first lines for clues
        return self._analyze_content_structure_for_meaning(content, section_context)

    def _analyze_content_structure_for_meaning(self, content: str, section_context: str) -> str:
        """Analyze content structure to determine meaning when keywords don't match"""

        first_lines = content.split('\n')[:3]
        combined_text = ' '.join(first_lines).lower()

        # Check for specific patterns in opening lines
        if any(word in combined_text for word in ['define', 'specification', 'requirement']):
            return 'requirements_definition'
        elif any(word in combined_text for word in ['implement', 'create', 'build', 'develop']):
            return 'implementation_instructions'
        elif any(word in combined_text for word in ['configure', 'setup', 'install']):
            return 'configuration_guidance'
        elif any(word in combined_text for word in ['purpose', 'goal', 'objective']):
            return 'purpose_statement'
        elif any(word in combined_text for word in ['architecture', 'design', 'structure']):
            return 'architectural_design'
        elif any(word in combined_text for word in ['security', 'protect', 'secure']):
            return 'security_considerations'
        elif any(word in combined_text for word in ['test', 'validate', 'verify']):
            return 'validation_procedures'
        elif any(word in combined_text for word in ['user', 'interface', 'experience']):
            return 'user_experience_design'
        elif re.search(r'^\s*-|\*|\+', content, re.MULTILINE):
            # If it's primarily a list, analyze what the list is about
            return self._analyze_list_content_meaning(content)
        elif '```' in content:
            # If it's primarily code, analyze what kind of code
            return self._analyze_code_content_meaning(content)
        else:
            return 'general_content'

    def _analyze_list_content_meaning(self, content: str) -> str:
        """Analyze what a list is actually about"""

        # Extract the first few list items to understand the list's purpose
        list_items = re.findall(r'^\s*[-\*\+]\s+(.+)$', content, re.MULTILINE)[:5]
        combined_items = ' '.join(list_items).lower()

        if any(word in combined_items for word in ['feature', 'functionality', 'capability']):
            return 'feature_specifications'
        elif any(word in combined_items for word in ['requirement', 'must', 'shall', 'should']):
            return 'requirements_list'
        elif any(word in combined_items for word in ['step', 'process', 'procedure']):
            return 'process_steps'
        elif any(word in combined_items for word in ['component', 'module', 'element']):
            return 'component_inventory'
        elif any(word in combined_items for word in ['test', 'check', 'verify']):
            return 'validation_checklist'
        elif any(word in combined_items for word in ['todo', 'task', 'implement']):
            return 'implementation_tasks'
        elif any(word in combined_items for word in ['api', 'endpoint', 'service']):
            return 'api_specifications'
        elif any(word in combined_items for word in ['config', 'setting', 'parameter']):
            return 'configuration_options'
        else:
            return 'structured_information_list'

    def _analyze_code_content_meaning(self, content: str) -> str:
        """Analyze what type of code/technical content is present"""

        # Extract code blocks
        code_blocks = re.findall(r'```(\w*)\n(.*?)\n```', content, re.DOTALL)

        for lang, code in code_blocks:
            code_lower = code.lower()

            if lang == 'mermaid':
                if 'graph' in code_lower:
                    return 'system_architecture_diagram'
                elif 'journey' in code_lower:
                    return 'user_journey_diagram'
                elif 'flowchart' in code_lower:
                    return 'process_flow_diagram'
                elif 'mindmap' in code_lower:
                    return 'concept_mindmap'
                else:
                    return 'technical_diagram'
            elif lang in ['typescript', 'javascript', 'ts', 'js']:
                if 'interface' in code_lower or 'type' in code_lower:
                    return 'type_definitions'
                elif 'function' in code_lower or 'const' in code_lower:
                    return 'implementation_code'
                elif 'test' in code_lower or 'describe' in code_lower:
                    return 'test_specifications'
                else:
                    return 'javascript_implementation'
            elif lang in ['json', 'yaml', 'yml']:
                return 'configuration_data'
            elif lang == 'bash' or lang == 'shell':
                return 'shell_commands'
            elif lang == 'sql':
                return 'database_queries'
            else:
                return 'technical_code_examples'

        return 'mixed_technical_content'

    def analyze_file_semantic_sections(self, file_path: str) -> Dict:
        """Analyze file with semantic section naming"""

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            lines = content.split('\n')
            total_lines = len(lines)
            total_tokens = len(content.split())

            # Split content into meaningful sections
            sections = {}

            # Extract YAML front matter first
            front_matter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
            if front_matter_match:
                front_matter_content = front_matter_match.group(1)
                sections['yaml_metadata_configuration'] = self._create_section_analysis(
                    front_matter_content, total_lines, total_tokens, 'metadata'
                )

            # Extract main headers and their content
            header_pattern = r'^(#{1,6})\s+(.+)$'
            headers = []
            for match in re.finditer(header_pattern, content, re.MULTILINE):
                level = len(match.group(1))
                title = match.group(2)
                start_pos = match.end()
                headers.append((level, title, start_pos))

            # Extract content for each header section
            for i, (level, title, start_pos) in enumerate(headers):
                # Find end position (next header of same or higher level)
                end_pos = len(content)
                for j in range(i + 1, len(headers)):
                    next_level, _, next_start = headers[j]
                    if next_level <= level:
                        end_pos = next_start
                        break

                section_content = content[start_pos:end_pos].strip()
                if section_content:
                    semantic_name = self._extract_semantic_section_name(title, section_content)
                    sections[semantic_name] = self._create_section_analysis(
                        section_content, total_lines, total_tokens, 'content', title
                    )

            # Extract special content types
            self._extract_special_content_sections(content, sections, total_lines, total_tokens)

            return {
                'file_path': file_path,
                'file_name': os.path.basename(file_path),
                'total_metrics': {
                    'lines': total_lines,
                    'tokens': total_tokens,
                    'characters': len(content)
                },
                'semantic_sections': sections,
                'content_summary': self._generate_content_summary(sections)
            }

        except Exception as e:
            return {'error': str(e), 'file_path': file_path}

    def _extract_semantic_section_name(self, title: str, content: str) -> str:
        """Extract semantic meaning from section title and content"""

        title_lower = title.lower().strip('#= ')
        content_sample = content[:200].lower()

        # First, check if title gives us clear semantic meaning
        if any(word in title_lower for word in ['purpose', 'objective', 'goal']):
            return 'module_purpose_definition'
        elif any(word in title_lower for word in ['implementation', 'technical']):
            actual_meaning = self.extract_section_semantic_meaning(content)
            return f'technical_{actual_meaning}'
        elif any(word in title_lower for word in ['security', 'compliance']):
            return 'security_compliance_requirements'
        elif any(word in title_lower for word in ['api', 'interface']):
            return 'api_interface_specification'
        elif any(word in title_lower for word in ['user', 'ui', 'ux']):
            return 'user_experience_design'
        elif any(word in title_lower for word in ['test', 'validation']):
            return 'testing_validation_strategy'
        elif any(word in title_lower for word in ['production', 'deployment']):
            return 'production_deployment_specification'

        # If title doesn't give clear meaning, analyze content
        semantic_meaning = self.extract_section_semantic_meaning(content, title)

        # Create meaningful name combining title context with content analysis
        clean_title = re.sub(r'[^\w\s]', '', title_lower).replace(' ', '_')[:20]
        return f"{clean_title}_{semantic_meaning}"

    def _create_section_analysis(self, content: str, total_lines: int, total_tokens: int,
                                section_type: str, title: str = "") -> Dict:
        """Create comprehensive section analysis with semantic understanding"""

        section_lines = len(content.split('\n'))
        section_tokens = len(content.split())

        # Extract what this section actually contains
        content_elements = self._analyze_section_elements(content)

        return {
            'semantic_title': title,
            'content_elements': content_elements,
            'actual_purpose': self._determine_actual_purpose(content, content_elements),
            'metrics': {
                'lines': section_lines,
                'tokens': section_tokens,
                'characters': len(content),
                'percentage_lines': round((section_lines / total_lines) * 100, 2),
                'percentage_tokens': round((section_tokens / total_tokens) * 100, 2)
            },
            'semantic_analysis': {
                'primary_content_type': self._identify_primary_content_type(content_elements),
                'key_concepts': self._extract_key_concepts(content),
                'implementation_readiness': self._assess_implementation_readiness(content),
                'business_value': self._assess_business_value(content)
            }
        }

    def _analyze_section_elements(self, content: str) -> Dict:
        """Analyze what elements are actually present in the section"""

        elements = {
            'mermaid_diagrams': [],
            'code_examples': [],
            'api_definitions': [],
            'configuration_blocks': [],
            'requirement_lists': [],
            'process_steps': [],
            'technical_specifications': [],
            'business_rules': []
        }

        # Extract Mermaid diagrams with their actual purpose
        mermaid_matches = re.findall(r'```mermaid\n(.*?)\n```', content, re.DOTALL)
        for diagram in mermaid_matches:
            diagram_type = self._classify_mermaid_diagram(diagram)
            elements['mermaid_diagrams'].append(diagram_type)

        # Extract code blocks with their actual purpose
        code_matches = re.findall(r'```(\w*)\n(.*?)\n```', content, re.DOTALL)
        for lang, code in code_matches:
            if lang != 'mermaid':
                code_purpose = self._classify_code_purpose(code, lang)
                elements['code_examples'].append(f"{lang}_{code_purpose}")

        # Extract structured lists and their meanings
        bullet_items = re.findall(r'^\s*[-\*\+]\s+(.+)$', content, re.MULTILINE)
        if bullet_items:
            list_purpose = self._classify_list_purpose(bullet_items)
            elements['requirement_lists'].append(list_purpose)

        # Extract numbered procedures
        numbered_items = re.findall(r'^\s*\d+\.\s+(.+)$', content, re.MULTILINE)
        if numbered_items:
            process_purpose = self._classify_process_purpose(numbered_items)
            elements['process_steps'].append(process_purpose)

        return elements

    def _classify_mermaid_diagram(self, diagram_content: str) -> str:
        """Classify what a Mermaid diagram actually shows"""

        diagram_lower = diagram_content.lower()

        if 'journey' in diagram_lower:
            return 'user_journey_mapping'
        elif 'flowchart' in diagram_lower and 'user' in diagram_lower:
            return 'user_process_flow'
        elif 'flowchart' in diagram_lower and any(word in diagram_lower for word in ['data', 'process']):
            return 'data_processing_flow'
        elif 'graph' in diagram_lower and any(word in diagram_lower for word in ['architecture', 'system']):
            return 'system_architecture_diagram'
        elif 'mindmap' in diagram_lower:
            return 'concept_relationship_map'
        elif 'c4context' in diagram_lower:
            return 'system_context_architecture'
        elif any(word in diagram_lower for word in ['subgraph', 'layer']):
            return 'layered_architecture_diagram'
        else:
            return 'technical_workflow_diagram'

    def _classify_code_purpose(self, code_content: str, language: str) -> str:
        """Classify what the code example actually demonstrates"""

        code_lower = code_content.lower()

        if language in ['typescript', 'javascript', 'ts', 'js']:
            if 'interface' in code_lower or 'type' in code_lower:
                return 'type_system_definitions'
            elif 'function' in code_lower and 'test' in code_lower:
                return 'test_implementation'
            elif 'function' in code_lower:
                return 'business_logic_implementation'
            elif 'const' in code_lower and 'config' in code_lower:
                return 'configuration_setup'
            else:
                return 'implementation_example'
        elif language in ['json', 'yaml']:
            if 'config' in code_lower:
                return 'configuration_data'
            elif 'schema' in code_lower:
                return 'data_schema_definition'
            else:
                return 'structured_data_example'
        elif language in ['bash', 'shell']:
            return 'deployment_commands'
        elif language == 'sql':
            return 'database_operations'
        else:
            return 'technical_reference'

    def _classify_list_purpose(self, list_items: List[str]) -> str:
        """Classify what a bullet list is actually describing"""

        combined_items = ' '.join(list_items[:5]).lower()

        if any(word in combined_items for word in ['must', 'shall', 'required', 'mandatory']):
            return 'mandatory_requirements'
        elif any(word in combined_items for word in ['feature', 'capability', 'function']):
            return 'feature_catalog'
        elif any(word in combined_items for word in ['step', 'first', 'then', 'next']):
            return 'procedural_steps'
        elif any(word in combined_items for word in ['endpoint', 'api', 'method']):
            return 'api_endpoint_specifications'
        elif any(word in combined_items for word in ['component', 'widget', 'element']):
            return 'ui_component_specifications'
        elif any(word in combined_items for word in ['security', 'auth', 'permission']):
            return 'security_control_specifications'
        elif any(word in combined_items for word in ['data', 'model', 'schema']):
            return 'data_model_specifications'
        elif any(word in combined_items for word in ['test', 'validate', 'check']):
            return 'testing_criteria'
        else:
            return 'specification_details'

    def _classify_process_purpose(self, numbered_items: List[str]) -> str:
        """Classify what a numbered process is actually describing"""

        combined_items = ' '.join(numbered_items[:3]).lower()

        if any(word in combined_items for word in ['install', 'setup', 'configure']):
            return 'installation_procedure'
        elif any(word in combined_items for word in ['implement', 'create', 'build']):
            return 'implementation_procedure'
        elif any(word in combined_items for word in ['deploy', 'release', 'production']):
            return 'deployment_procedure'
        elif any(word in combined_items for word in ['test', 'validate', 'verify']):
            return 'validation_procedure'
        elif any(word in combined_items for word in ['user', 'login', 'signup']):
            return 'user_workflow_steps'
        else:
            return 'sequential_process_steps'

    def _determine_actual_purpose(self, content: str, content_elements: Dict) -> str:
        """Determine the actual purpose of the section based on its elements"""

        # Analyze dominant content types
        element_counts = {
            'diagrams': len(content_elements['mermaid_diagrams']),
            'code': len(content_elements['code_examples']),
            'requirements': len(content_elements['requirement_lists']),
            'processes': len(content_elements['process_steps'])
        }

        dominant_type = max(element_counts.items(), key=lambda x: x[1])[0]

        if dominant_type == 'diagrams':
            return 'visual_architecture_documentation'
        elif dominant_type == 'code':
            return 'technical_implementation_guidance'
        elif dominant_type == 'requirements':
            return 'specification_requirements_definition'
        elif dominant_type == 'processes':
            return 'procedural_implementation_guide'
        else:
            return 'comprehensive_technical_documentation'

    def _extract_key_concepts(self, content: str) -> List[str]:
        """Extract the key concepts actually discussed in the section"""

        # Extract technical terms and important concepts
        technical_terms = re.findall(r'\b[A-Z][A-Z_]*[A-Z]\b', content)
        quoted_terms = re.findall(r'"([^"]+)"', content)
        emphasized_terms = re.findall(r'\*\*([^*]+)\*\*', content)

        # Combine and deduplicate
        all_concepts = technical_terms + quoted_terms + emphasized_terms
        unique_concepts = list(set(all_concepts))

        # Return most relevant concepts (by frequency)
        concept_freq = Counter(all_concepts)
        return [concept for concept, _ in concept_freq.most_common(10)]

    def _extract_special_content_sections(self, content: str, sections: Dict, total_lines: int, total_tokens: int):
        """Extract special content sections with semantic meaning"""

        # Extract production implementation sections
        prod_pattern = r'🚀\s*PRODUCTION\s+IMPLEMENTATION.*?\n(.*?)(?=\n#{1,3}\s|\Z)'
        prod_matches = re.findall(prod_pattern, content, re.DOTALL | re.IGNORECASE)
        for i, match in enumerate(prod_matches):
            semantic_name = f'production_ready_implementation_{i}' if len(prod_matches) > 1 else 'production_ready_implementation'
            sections[semantic_name] = self._create_section_analysis(match, total_lines, total_tokens, 'implementation')

        # Extract ChatGPT enhancement sections
        chatgpt_pattern = r'ChatGPT.*?Enhancement.*?\n(.*?)(?=\n#{1,3}\s|\Z)'
        chatgpt_matches = re.findall(chatgpt_pattern, content, re.DOTALL | re.IGNORECASE)
        for i, match in enumerate(chatgpt_matches):
            semantic_name = f'ai_enhancement_specification_{i}' if len(chatgpt_matches) > 1 else 'ai_enhancement_specification'
            sections[semantic_name] = self._create_section_analysis(match, total_lines, total_tokens, 'ai_enhancement')

    def _identify_primary_content_type(self, content_elements: Dict) -> str:
        """Identify what this section primarily contains"""

        total_elements = sum(len(elements) if isinstance(elements, list) else 1
                           for elements in content_elements.values())

        if total_elements == 0:
            return 'narrative_text'

        # Find dominant element type
        element_counts = {}
        for element_type, elements in content_elements.items():
            if isinstance(elements, list):
                element_counts[element_type] = len(elements)

        if element_counts:
            dominant = max(element_counts.items(), key=lambda x: x[1])
            return dominant[0]
        else:
            return 'mixed_content'

    def _assess_implementation_readiness(self, content: str) -> str:
        """Assess how implementation-ready the content is"""

        implementation_indicators = [
            'production', 'implement', 'code', 'api', 'function',
            'deploy', 'configure', 'setup', 'install'
        ]

        content_lower = content.lower()
        readiness_score = sum(1 for indicator in implementation_indicators if indicator in content_lower)

        if readiness_score > 5:
            return 'production_ready'
        elif readiness_score > 3:
            return 'implementation_ready'
        elif readiness_score > 1:
            return 'specification_ready'
        else:
            return 'conceptual_stage'

    def _assess_business_value(self, content: str) -> str:
        """Assess the business value/importance of the content"""

        high_value_indicators = [
            'critical', 'essential', 'core', 'foundation', 'key',
            'revenue', 'cost', 'user', 'security', 'compliance'
        ]

        content_lower = content.lower()
        value_score = sum(1 for indicator in high_value_indicators if indicator in content_lower)

        if value_score > 4:
            return 'high_business_value'
        elif value_score > 2:
            return 'medium_business_value'
        else:
            return 'supporting_value'

    def _generate_content_summary(self, sections: Dict) -> Dict:
        """Generate summary of what this file actually contains"""

        total_sections = len(sections)

        # Categorize sections by their actual purpose
        purpose_categories = Counter()
        content_types = Counter()

        for section_name, section_data in sections.items():
            purpose = section_data['actual_purpose']
            content_type = section_data['semantic_analysis']['primary_content_type']

            purpose_categories[purpose] += 1
            content_types[content_type] += 1

        return {
            'total_semantic_sections': total_sections,
            'primary_purposes': dict(purpose_categories.most_common(3)),
            'dominant_content_types': dict(content_types.most_common(3)),
            'overall_classification': self._classify_overall_file_purpose(purpose_categories, content_types)
        }

    def _classify_overall_file_purpose(self, purposes: Counter, content_types: Counter) -> str:
        """Classify what this entire file is actually for"""

        top_purpose = purposes.most_common(1)[0][0] if purposes else 'unknown'

        if 'architecture' in top_purpose:
            return 'architectural_specification'
        elif 'implementation' in top_purpose:
            return 'implementation_specification'
        elif 'requirements' in top_purpose:
            return 'requirements_specification'
        elif 'visual' in top_purpose:
            return 'visual_design_specification'
        elif 'procedure' in top_purpose:
            return 'procedural_specification'
        else:
            return 'comprehensive_specification'

    def generate_semantic_analysis_report(self, output_file: str = "SEMANTIC_SECTION_ANALYSIS.md"):
        """Generate comprehensive semantic analysis report"""

        print("🎯 SEMANTIC SECTION MAPPER - ENGAGING")
        print("🧠 Extracting ACTUAL MEANING from all specification sections")
        print("=" * 65)

        # Analyze all files
        all_analyses = []
        md_files = [f for f in Path('.').glob('*.md') if not f.name.startswith('.')]

        for md_file in sorted(md_files):
            print(f"🧠 Semantic analysis: {md_file.name}")
            analysis = self.analyze_file_semantic_sections(str(md_file))
            if 'error' not in analysis:
                all_analyses.append(analysis)

        # Generate patterns across semantic meanings
        semantic_patterns = self._analyze_semantic_patterns(all_analyses)

        # Write comprehensive report
        with open(output_file, 'w') as f:
            f.write("# 🧠 SEMANTIC SECTION ANALYSIS\n")
            f.write("**Actual Content Meaning Extraction from Financial Intelligence Platform**\n\n")
            f.write(f"Generated: {datetime.now().isoformat()}\n\n")
            f.write("---\n\n")

            # Executive Summary
            f.write("## 📊 SEMANTIC INTELLIGENCE SUMMARY\n\n")
            f.write(f"**Files Analyzed:** {len(all_analyses)}\n")
            total_sections = sum(a['content_summary']['total_semantic_sections'] for a in all_analyses)
            f.write(f"**Semantic Sections Mapped:** {total_sections}\n\n")

            # Semantic patterns by file type
            f.write("## 🧬 SEMANTIC PATTERNS BY CONTENT MEANING\n\n")

            for pattern_name, pattern_data in semantic_patterns.items():
                f.write(f"### {pattern_name.replace('_', ' ').title()}\n")
                f.write(f"**Files:** {pattern_data['file_count']}\n")
                f.write(f"**Common Section Types:**\n")

                for section_type, frequency in pattern_data['common_section_types'].items():
                    f.write(f"- {section_type.replace('_', ' ').title()}: {frequency} files\n")
                f.write("\n")

            # Individual file semantic breakdown
            f.write("## 📋 INDIVIDUAL FILE SEMANTIC BREAKDOWN\n\n")

            for analysis in sorted(all_analyses, key=lambda x: x['total_metrics']['tokens'], reverse=True):
                f.write(f"### {analysis['file_name']}\n")
                f.write(f"**Overall Classification:** {analysis['content_summary']['overall_classification']}\n")
                f.write(f"**Primary Purposes:** {analysis['content_summary']['primary_purposes']}\n\n")

                f.write("**Semantic Sections:**\n")
                for section_name, section_data in analysis['semantic_sections'].items():
                    purpose = section_data['actual_purpose']
                    tokens = section_data['metrics']['tokens']
                    percentage = section_data['metrics']['percentage_tokens']
                    key_concepts = ', '.join(section_data['semantic_analysis']['key_concepts'][:3])

                    f.write(f"- `{section_name}` → {purpose} | {tokens} tokens ({percentage}%) | Concepts: {key_concepts}\n")
                f.write("\n")

        print(f"📋 Semantic analysis report generated: {output_file}")
        return all_analyses

    def _analyze_semantic_patterns(self, all_analyses: List[Dict]) -> Dict:
        """Analyze semantic patterns across all files"""

        patterns = {}

        # Group files by their overall semantic classification
        by_classification = defaultdict(list)
        for analysis in all_analyses:
            classification = analysis['content_summary']['overall_classification']
            by_classification[classification].append(analysis)

        for classification, files in by_classification.items():
            if len(files) >= 2:  # Only analyze patterns with multiple files

                # Collect section types across files in this classification
                section_types = Counter()
                for file_analysis in files:
                    for section_data in file_analysis['semantic_sections'].values():
                        section_types[section_data['actual_purpose']] += 1

                patterns[classification] = {
                    'file_count': len(files),
                    'common_section_types': dict(section_types.most_common(5))
                }

        return patterns

def main():
    """Execute semantic section mapping"""

    mapper = SemanticSectionMapper()
    analyses = mapper.generate_semantic_analysis_report()

    print("\n🎯 SEMANTIC SECTION MAPPING COMPLETE!")
    print("🧠 All sections mapped by their ACTUAL CONTENT MEANING")
    print("📊 Semantic patterns identified across specification types")
    print("💡 Ready for content-based architectural insights!")

if __name__ == "__main__":
    main()