#!/usr/bin/env python3
"""
🧬 COMPLETE PATCHWORK EXTRACTION SYSTEM
Extracts ALL components, features, and code patterns from ALL 18 HTML variants
Creates the ultimate comprehensive HTML by assembling every unique feature
"""

import re
import json
from pathlib import Path

class PatchworkExtractor:
    def __init__(self):
        self.html_files = list(Path('.').glob('*.html'))
        self.components = {
            'headers': [],
            'navigation': [],
            'dashboards': [],
            'calendars': [],
            'sessions': [],
            'color_schemas': [],
            'tooltips': [],
            'charts': [],
            'tables': [],
            'cards': [],
            'forms': [],
            'modals': [],
            'tabs': [],
            'accordions': [],
            'progress_bars': [],
            'badges': [],
            'buttons': [],
            'javascript_functions': [],
            'css_styles': [],
            'data_visualizations': [],
            'file_explorers': [],
            'dependency_maps': [],
            'mermaid_diagrams': [],
            'code_blocks': [],
            'statistics': [],
            'health_indicators': [],
            'file_type_distributions': [],
            'naming_patterns': [],
            'project_evolution': []
        }

    def extract_component_pattern(self, content, pattern_name, regex_pattern):
        """Extract components using regex patterns"""
        try:
            matches = re.findall(regex_pattern, content, re.DOTALL | re.IGNORECASE)
            return matches
        except Exception as e:
            print(f"Error extracting {pattern_name}: {e}")
            return []

    def extract_all_components(self):
        """Extract ALL possible components from ALL HTML files"""
        print("🧬 STARTING COMPLETE PATCHWORK EXTRACTION...")
        print(f"📁 Processing {len(self.html_files)} HTML files")

        for html_file in self.html_files:
            print(f"\n📄 Extracting from: {html_file.name}")

            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                file_size = len(content)
                print(f"   📊 File size: {file_size:,} bytes")

                # Extract Headers
                headers = self.extract_component_pattern(
                    content, 'headers',
                    r'<header[^>]*>.*?</header>|<div[^>]*header[^>]*>.*?</div>|<h1[^>]*>.*?</h1>'
                )
                if headers:
                    self.components['headers'].extend([{
                        'source': html_file.name,
                        'component': header,
                        'size': len(header)
                    } for header in headers])
                    print(f"   ✅ Found {len(headers)} headers")

                # Extract Navigation
                navigation = self.extract_component_pattern(
                    content, 'navigation',
                    r'<nav[^>]*>.*?</nav>|<div[^>]*nav[^>]*>.*?</div>|<ul[^>]*navigation[^>]*>.*?</ul>'
                )
                if navigation:
                    self.components['navigation'].extend([{
                        'source': html_file.name,
                        'component': nav,
                        'size': len(nav)
                    } for nav in navigation])
                    print(f"   ✅ Found {len(navigation)} navigation elements")

                # Extract Dashboards
                dashboards = self.extract_component_pattern(
                    content, 'dashboards',
                    r'<div[^>]*dashboard[^>]*>.*?</div>|<section[^>]*dashboard[^>]*>.*?</section>'
                )
                if dashboards:
                    self.components['dashboards'].extend([{
                        'source': html_file.name,
                        'component': dashboard,
                        'size': len(dashboard)
                    } for dashboard in dashboards])
                    print(f"   ✅ Found {len(dashboards)} dashboard elements")

                # Extract Calendars
                calendars = self.extract_component_pattern(
                    content, 'calendars',
                    r'<div[^>]*calendar[^>]*>.*?</div>|<section[^>]*calendar[^>]*>.*?</section>'
                )
                if calendars:
                    self.components['calendars'].extend([{
                        'source': html_file.name,
                        'component': calendar,
                        'size': len(calendar)
                    } for calendar in calendars])
                    print(f"   ✅ Found {len(calendars)} calendar elements")

                # Extract Sessions
                sessions = self.extract_component_pattern(
                    content, 'sessions',
                    r'<div[^>]*session[^>]*>.*?</div>|<table[^>]*session[^>]*>.*?</table>'
                )
                if sessions:
                    self.components['sessions'].extend([{
                        'source': html_file.name,
                        'component': session,
                        'size': len(session)
                    } for session in sessions])
                    print(f"   ✅ Found {len(sessions)} session elements")

                # Extract Color Schemas
                color_schemas = self.extract_component_pattern(
                    content, 'color_schemas',
                    r'<div[^>]*schema[^>]*>.*?</div>|<button[^>]*schema[^>]*>.*?</button>'
                )
                if color_schemas:
                    self.components['color_schemas'].extend([{
                        'source': html_file.name,
                        'component': schema,
                        'size': len(schema)
                    } for schema in color_schemas])
                    print(f"   ✅ Found {len(color_schemas)} color schema elements")

                # Extract Tooltips
                tooltips = self.extract_component_pattern(
                    content, 'tooltips',
                    r'<div[^>]*tooltip[^>]*>.*?</div>'
                )
                if tooltips:
                    self.components['tooltips'].extend([{
                        'source': html_file.name,
                        'component': tooltip,
                        'size': len(tooltip)
                    } for tooltip in tooltips])
                    print(f"   ✅ Found {len(tooltips)} tooltip elements")

                # Extract Charts
                charts = self.extract_component_pattern(
                    content, 'charts',
                    r'<canvas[^>]*>.*?</canvas>|<div[^>]*chart[^>]*>.*?</div>|<svg[^>]*>.*?</svg>'
                )
                if charts:
                    self.components['charts'].extend([{
                        'source': html_file.name,
                        'component': chart,
                        'size': len(chart)
                    } for chart in charts])
                    print(f"   ✅ Found {len(charts)} chart elements")

                # Extract Tables
                tables = self.extract_component_pattern(
                    content, 'tables',
                    r'<table[^>]*>.*?</table>'
                )
                if tables:
                    self.components['tables'].extend([{
                        'source': html_file.name,
                        'component': table,
                        'size': len(table)
                    } for table in tables])
                    print(f"   ✅ Found {len(tables)} table elements")

                # Extract Cards
                cards = self.extract_component_pattern(
                    content, 'cards',
                    r'<div[^>]*card[^>]*>.*?</div>|<article[^>]*>.*?</article>'
                )
                if cards:
                    self.components['cards'].extend([{
                        'source': html_file.name,
                        'component': card,
                        'size': len(card)
                    } for card in cards])
                    print(f"   ✅ Found {len(cards)} card elements")

                # Extract Forms
                forms = self.extract_component_pattern(
                    content, 'forms',
                    r'<form[^>]*>.*?</form>'
                )
                if forms:
                    self.components['forms'].extend([{
                        'source': html_file.name,
                        'component': form,
                        'size': len(form)
                    } for form in forms])
                    print(f"   ✅ Found {len(forms)} form elements")

                # Extract Modals
                modals = self.extract_component_pattern(
                    content, 'modals',
                    r'<div[^>]*modal[^>]*>.*?</div>|<dialog[^>]*>.*?</dialog>'
                )
                if modals:
                    self.components['modals'].extend([{
                        'source': html_file.name,
                        'component': modal,
                        'size': len(modal)
                    } for modal in modals])
                    print(f"   ✅ Found {len(modals)} modal elements")

                # Extract Tabs
                tabs = self.extract_component_pattern(
                    content, 'tabs',
                    r'<div[^>]*tab[^>]*>.*?</div>|<ul[^>]*tab[^>]*>.*?</ul>'
                )
                if tabs:
                    self.components['tabs'].extend([{
                        'source': html_file.name,
                        'component': tab,
                        'size': len(tab)
                    } for tab in tabs])
                    print(f"   ✅ Found {len(tabs)} tab elements")

                # Extract JavaScript Functions
                js_functions = self.extract_component_pattern(
                    content, 'javascript_functions',
                    r'function[^{]+\{[^}]*\}|const[^=]+=[^=]*function[^{]*\{[^}]*\}'
                )
                if js_functions:
                    self.components['javascript_functions'].extend([{
                        'source': html_file.name,
                        'component': func,
                        'size': len(func)
                    } for func in js_functions])
                    print(f"   ✅ Found {len(js_functions)} JavaScript functions")

                # Extract CSS Styles
                css_styles = self.extract_component_pattern(
                    content, 'css_styles',
                    r'<style[^>]*>.*?</style>|\.([^{]+)\{[^}]*\}'
                )
                if css_styles:
                    self.components['css_styles'].extend([{
                        'source': html_file.name,
                        'component': style,
                        'size': len(style)
                    } for style in css_styles])
                    print(f"   ✅ Found {len(css_styles)} CSS style blocks")

                # Extract Data Visualizations
                data_viz = self.extract_component_pattern(
                    content, 'data_visualizations',
                    r'<div[^>]*visualiz[^>]*>.*?</div>|<div[^>]*graph[^>]*>.*?</div>|<div[^>]*metric[^>]*>.*?</div>'
                )
                if data_viz:
                    self.components['data_visualizations'].extend([{
                        'source': html_file.name,
                        'component': viz,
                        'size': len(viz)
                    } for viz in data_viz])
                    print(f"   ✅ Found {len(data_viz)} data visualization elements")

                # Extract File Explorers
                file_explorers = self.extract_component_pattern(
                    content, 'file_explorers',
                    r'<div[^>]*explorer[^>]*>.*?</div>|<div[^>]*file[^>]*>.*?</div>'
                )
                if file_explorers:
                    self.components['file_explorers'].extend([{
                        'source': html_file.name,
                        'component': explorer,
                        'size': len(explorer)
                    } for explorer in file_explorers])
                    print(f"   ✅ Found {len(file_explorers)} file explorer elements")

                # Extract Mermaid Diagrams
                mermaid_diagrams = self.extract_component_pattern(
                    content, 'mermaid_diagrams',
                    r'<div[^>]*mermaid[^>]*>.*?</div>|<pre[^>]*mermaid[^>]*>.*?</pre>'
                )
                if mermaid_diagrams:
                    self.components['mermaid_diagrams'].extend([{
                        'source': html_file.name,
                        'component': diagram,
                        'size': len(diagram)
                    } for diagram in mermaid_diagrams])
                    print(f"   ✅ Found {len(mermaid_diagrams)} Mermaid diagrams")

                # Extract Statistics
                statistics = self.extract_component_pattern(
                    content, 'statistics',
                    r'<div[^>]*stat[^>]*>.*?</div>|<div[^>]*metric[^>]*>.*?</div>'
                )
                if statistics:
                    self.components['statistics'].extend([{
                        'source': html_file.name,
                        'component': stat,
                        'size': len(stat)
                    } for stat in statistics])
                    print(f"   ✅ Found {len(statistics)} statistics elements")

                # Extract Health Indicators
                health_indicators = self.extract_component_pattern(
                    content, 'health_indicators',
                    r'<div[^>]*health[^>]*>.*?</div>|<div[^>]*score[^>]*>.*?</div>'
                )
                if health_indicators:
                    self.components['health_indicators'].extend([{
                        'source': html_file.name,
                        'component': indicator,
                        'size': len(indicator)
                    } for indicator in health_indicators])
                    print(f"   ✅ Found {len(health_indicators)} health indicator elements")

            except Exception as e:
                print(f"   ❌ Error processing {html_file.name}: {e}")

    def generate_patchwork_report(self):
        """Generate comprehensive report of all extracted components"""
        print("\n📊 GENERATING PATCHWORK REPORT...")

        report = {
            'extraction_date': '2025-10-10',
            'total_files_processed': len(self.html_files),
            'components_summary': {}
        }

        total_components = 0
        for category, components in self.components.items():
            count = len(components)
            total_size = sum(comp['size'] for comp in components)
            sources = list(set(comp['source'] for comp in components))

            report['components_summary'][category] = {
                'count': count,
                'total_size': total_size,
                'unique_sources': len(sources),
                'sources': sources[:5]  # Show first 5 sources
            }
            total_components += count

        report['total_components_extracted'] = total_components

        # Save detailed report
        with open('PATCHWORK_EXTRACTION_REPORT.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

        # Save all components
        with open('ALL_PATCHWORK_COMPONENTS.json', 'w', encoding='utf-8') as f:
            json.dump(self.components, f, indent=2)

        print(f"\n✅ PATCHWORK EXTRACTION COMPLETE!")
        print(f"📄 Report saved: PATCHWORK_EXTRACTION_REPORT.json")
        print(f"📄 Components saved: ALL_PATCHWORK_COMPONENTS.json")
        print(f"🧬 Total components extracted: {total_components}")

        return report

    def run_complete_extraction(self):
        """Run complete patchwork extraction"""
        self.extract_all_components()
        return self.generate_patchwork_report()

if __name__ == "__main__":
    extractor = PatchworkExtractor()
    report = extractor.run_complete_extraction()

    print("\n🎯 PATCHWORK SUMMARY:")
    for category, data in report['components_summary'].items():
        if data['count'] > 0:
            print(f"  {category}: {data['count']} components from {data['unique_sources']} sources")