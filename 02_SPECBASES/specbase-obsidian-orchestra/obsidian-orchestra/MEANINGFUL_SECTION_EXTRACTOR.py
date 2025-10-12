#!/usr/bin/env python3
"""
🎯 MEANINGFUL SECTION EXTRACTOR
Extracts sections by their ACTUAL CONTENT MEANING with precise naming

FOCUS: What does each section ACTUALLY contain and discuss?
"""

import os
import re
from pathlib import Path
from collections import Counter, defaultdict

def extract_meaningful_sections(file_path: str) -> dict:
    """Extract sections with meaningful names based on actual content"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    total_lines = len(content.split('\n'))
    total_tokens = len(content.split())

    sections = {}

    # Extract major sections by headers
    header_pattern = r'^(#{1,6})\s+(.+)$'
    headers = []

    for match in re.finditer(header_pattern, content, re.MULTILINE):
        level = len(match.group(1))
        title = match.group(2).strip()
        start_pos = match.end()
        headers.append((level, title, start_pos))

    # Extract content for each header
    for i, (level, title, start_pos) in enumerate(headers):
        # Find section end
        end_pos = len(content)
        for j in range(i + 1, len(headers)):
            next_level, _, next_start = headers[j]
            if next_level <= level:
                end_pos = next_start
                break

        section_content = content[start_pos:end_pos].strip()

        if section_content:
            # Analyze what this section actually contains
            meaning = analyze_section_actual_meaning(title, section_content)

            section_lines = len(section_content.split('\n'))
            section_tokens = len(section_content.split())

            sections[meaning] = {
                'title': title,
                'content_preview': section_content[:200] + "..." if len(section_content) > 200 else section_content,
                'metrics': {
                    'lines': section_lines,
                    'tokens': section_tokens,
                    'percentage_lines': round((section_lines / total_lines) * 100, 1),
                    'percentage_tokens': round((section_tokens / total_tokens) * 100, 1)
                },
                'actual_content_type': determine_actual_content_type(section_content)
            }

    return {
        'file_name': os.path.basename(file_path),
        'total_lines': total_lines,
        'total_tokens': total_tokens,
        'meaningful_sections': sections
    }

def analyze_section_actual_meaning(title: str, content: str) -> str:
    """Determine what this section ACTUALLY discusses"""

    title_lower = title.lower()
    content_lower = content.lower()

    # Analyze title for semantic clues
    if 'purpose' in title_lower:
        return 'module_purpose_and_objectives'
    elif 'implementation' in title_lower:
        if 'production' in content_lower:
            return 'production_implementation_specification'
        else:
            return 'technical_implementation_details'
    elif 'security' in title_lower:
        return 'security_requirements_and_controls'
    elif 'api' in title_lower:
        return 'api_interface_definitions'
    elif 'user' in title_lower and ('interface' in title_lower or 'ui' in title_lower):
        return 'user_interface_design_specification'
    elif 'data' in title_lower:
        if 'model' in content_lower:
            return 'data_model_specifications'
        else:
            return 'data_processing_logic'
    elif 'test' in title_lower:
        return 'testing_validation_procedures'

    # Analyze content for actual meaning
    if content.count('```mermaid') > 0:
        diagram_type = analyze_mermaid_diagram_meaning(content)
        return f'architectural_diagram_{diagram_type}'
    elif content.count('```typescript') > 0 or content.count('```javascript') > 0:
        return 'typescript_implementation_code'
    elif content.count('```json') > 0 or content.count('```yaml') > 0:
        return 'configuration_data_structures'
    elif content.count('- [ ]') > 5:
        return 'implementation_task_checklist'
    elif content.count('- [x]') > 5:
        return 'completed_implementation_verification'
    elif re.search(r'^\s*\d+\.', content, re.MULTILINE):
        return 'sequential_implementation_procedure'
    elif content.count('•') > 10 or content.count('-') > 10:
        task_nature = analyze_list_actual_content(content)
        return f'{task_nature}_specifications'

    # Fallback to content analysis
    if 'requirement' in content_lower:
        return 'functional_requirements_definition'
    elif 'agent' in content_lower and 'orchestrat' in content_lower:
        return 'agent_orchestration_logic'
    elif 'database' in content_lower or 'sql' in content_lower:
        return 'database_integration_specification'
    elif 'ui' in content_lower or 'component' in content_lower:
        return 'ui_component_behavioral_specification'
    else:
        return 'comprehensive_technical_documentation'

def analyze_mermaid_diagram_meaning(content: str) -> str:
    """Analyze what a Mermaid diagram actually represents"""

    mermaid_content = re.search(r'```mermaid\n(.*?)\n```', content, re.DOTALL)
    if not mermaid_content:
        return 'unknown_diagram'

    diagram = mermaid_content.group(1).lower()

    if 'journey' in diagram:
        return 'user_experience_journey_flow'
    elif 'flowchart' in diagram and 'business' in diagram:
        return 'business_process_workflow'
    elif 'graph td' in diagram or 'graph tb' in diagram:
        return 'hierarchical_system_architecture'
    elif 'graph lr' in diagram:
        return 'process_dependency_chain'
    elif 'mindmap' in diagram:
        return 'conceptual_relationship_mapping'
    elif 'c4context' in diagram:
        return 'system_context_boundaries'
    else:
        return 'technical_system_visualization'

def analyze_list_actual_content(content: str) -> str:
    """Analyze what a list actually describes"""

    # Get first few list items to understand purpose
    list_items = re.findall(r'^\s*[-\*\+]\s+(.+)$', content, re.MULTILINE)[:10]
    combined = ' '.join(list_items).lower()

    if any(word in combined for word in ['endpoint', 'api', 'GET', 'POST']):
        return 'api_endpoint_catalog'
    elif any(word in combined for word in ['component', 'widget', 'ui', 'interface']):
        return 'ui_component_inventory'
    elif any(word in combined for word in ['feature', 'functionality', 'capability']):
        return 'feature_capability_catalog'
    elif any(word in combined for word in ['requirement', 'must', 'shall']):
        return 'functional_requirement'
    elif any(word in combined for word in ['security', 'auth', 'permission']):
        return 'security_control'
    elif any(word in combined for word in ['test', 'validate', 'verify']):
        return 'validation_criteria'
    elif any(word in combined for word in ['config', 'setting', 'parameter']):
        return 'configuration_parameter'
    elif any(word in combined for word in ['data', 'model', 'schema']):
        return 'data_structure_definition'
    else:
        return 'implementation_specification'

def determine_actual_content_type(content: str) -> str:
    """Determine what type of content this section actually contains"""

    if '```mermaid' in content:
        return 'architectural_visualization'
    elif '```typescript' in content or '```javascript' in content:
        return 'implementation_source_code'
    elif '```json' in content or '```yaml' in content:
        return 'structured_configuration_data'
    elif '```bash' in content or '```shell' in content:
        return 'deployment_automation_scripts'
    elif re.search(r'^\s*\d+\.', content, re.MULTILINE):
        return 'sequential_procedural_steps'
    elif content.count('- [ ]') > 3:
        return 'implementation_task_tracker'
    elif content.count('- [x]') > 3:
        return 'completion_verification_tracker'
    elif re.search(r'^\s*[-\*\+]', content, re.MULTILINE):
        return 'structured_specification_catalog'
    else:
        return 'narrative_technical_documentation'

def generate_meaningful_analysis():
    """Generate analysis with meaningful section names"""

    print("🎯 MEANINGFUL SECTION EXTRACTOR - ENGAGING")
    print("🧠 Extracting ACTUAL SEMANTIC MEANING from all sections")
    print("=" * 60)

    all_analyses = []

    # Analyze all markdown files
    for md_file in sorted(Path('.').glob('*.md')):
        if md_file.name.startswith('.'):
            continue

        print(f"🧠 Extracting meaning: {md_file.name}")
        analysis = extract_meaningful_sections(str(md_file))
        all_analyses.append(analysis)

    # Generate patterns
    print("🔍 Analyzing semantic patterns across specifications...")

    # Group by file type patterns
    module_files = [a for a in all_analyses if re.match(r'^\d{2}_', a['file_name'])]
    orchestration_files = [a for a in all_analyses if re.match(r'^0\.\d_', a['file_name'])]
    master_docs = [a for a in all_analyses if '_' in a['file_name'] and a['file_name'].isupper()]

    print(f"📊 Found patterns:")
    print(f"   📱 Module Files: {len(module_files)}")
    print(f"   🎭 Orchestration Files: {len(orchestration_files)}")
    print(f"   📋 Master Documents: {len(master_docs)}")

    # Analyze common sections in modules
    if module_files:
        print(f"\n🏗️ MODULE PATTERN ANALYSIS ({len(module_files)} files):")
        module_sections = Counter()
        for analysis in module_files:
            for section_name in analysis['meaningful_sections'].keys():
                module_sections[section_name] += 1

        print("   Most common MEANINGFUL sections in modules:")
        for section, count in module_sections.most_common(10):
            percentage = round((count / len(module_files)) * 100, 1)
            print(f"   • {section}: {count}/{len(module_files)} files ({percentage}%)")

    # Write detailed report
    with open('MEANINGFUL_SECTION_REPORT.md', 'w') as f:
        f.write("# 🧠 MEANINGFUL SECTION ANALYSIS REPORT\n")
        f.write("**Semantic Content Meaning Extraction**\n\n")
        f.write("## 📊 SEMANTIC SECTION BREAKDOWN\n\n")

        for analysis in sorted(all_analyses, key=lambda x: x['total_tokens'], reverse=True):
            f.write(f"### {analysis['file_name']}\n")
            f.write(f"**Total:** {analysis['total_tokens']} tokens, {analysis['total_lines']} lines\n\n")

            if analysis['meaningful_sections']:
                f.write("**MEANINGFUL SECTIONS:**\n")
                for section_name, section_data in analysis['meaningful_sections'].items():
                    metrics = section_data['metrics']
                    content_type = section_data['actual_content_type']
                    f.write(f"- **{section_name}** ({content_type}) - {metrics['tokens']} tokens ({metrics['percentage_tokens']}%)\n")
                    f.write(f"  *Content Preview:* {section_data['content_preview'][:100]}...\n")
            f.write("\n")

    print("✅ Meaningful section analysis complete!")
    print("📋 Report generated: MEANINGFUL_SECTION_REPORT.md")

    return all_analyses

if __name__ == "__main__":
    generate_meaningful_analysis()