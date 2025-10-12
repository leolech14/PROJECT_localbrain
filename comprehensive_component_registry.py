#!/usr/bin/env python3
"""
🧬 COMPREHENSIVE COMPONENT REGISTRY SYSTEM
Analyzes ALL downloaded HTMLs to create UNDUPLICATED registry
Shows features across all versions with occurrence counts
"""

import re
import json
from pathlib import Path
from collections import defaultdict, Counter

class ComprehensiveComponentRegistry:
    def __init__(self):
        self.html_files = list(Path('.').glob('*.html'))
        self.component_registry = {
            'features': defaultdict(list),  # feature_name: [occurrences]
            'components': defaultdict(list),  # component_type: [instances]
            'sections': defaultdict(list),    # section_name: [occurrences]
            'interactive_elements': defaultdict(list),
            'data_visualizations': defaultdict(list),
            'javascript_functions': defaultdict(list),
            'css_classes': defaultdict(list),
            'color_schemas': defaultdict(list),
            'layout_patterns': defaultdict(list)
        }
        self.feature_occurrences = Counter()
        self.source_mapping = {}  # feature -> list of source files

    def analyze_html_file(self, html_file):
        """Analyze a single HTML file comprehensively"""
        print(f"\n📄 Analyzing: {html_file.name}")

        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"   ❌ Error reading {html_file.name}: {e}")
            return

        file_size = len(content)
        print(f"   📊 Size: {file_size:,} bytes")

        # 🔍 EXTRACT ALL POSSIBLE FEATURES AND COMPONENTS

        # 1. HEADERS AND TITLES
        headers = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', content, re.IGNORECASE | re.DOTALL)
        for header in headers:
            clean_header = re.sub(r'<[^>]+>', '', header).strip()
            if clean_header and len(clean_header) > 3:
                self._register_feature('header', clean_header, html_file.name)

        # 2. SECTIONS AND DIVS WITH IDs/CLASSES
        sections = re.findall(r'<(?:section|div)[^>]*(?:id|class)=["\']([^"\']+)["\'][^>]*>(.*?)</(?:section|div)>', content, re.IGNORECASE | re.DOTALL)
        for section_id, section_content in sections:
            if section_id and len(section_id) > 2:
                self._register_feature('section', section_id, html_file.name)

                # Look for sub-features within sections
                self._analyze_section_content(section_id, section_content, html_file.name)

        # 3. CALENDAR SYSTEMS
        calendar_patterns = [
            r'calendar[^>]*>(.*?)</(?:div|section)',
            r'day[^>]*>(.*?)</div>',
            r'calendar-day[^>]*>(.*?)</div>',
            r'week[^>]*>(.*?)</div>',
            r'month[^>]*>(.*?)</div>'
        ]
        for pattern in calendar_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if 'calendar' in match.lower() or 'day' in match.lower():
                    self._register_feature('calendar_system', 'calendar_element', html_file.name)

        # 4. SESSION TIMELINES
        session_patterns = [
            r'session[^>]*>(.*?)</(?:div|table|tr)',
            r'timeline[^>]*>(.*?)</div>',
            r'work[^>]*>(.*?)</div>',
            r'time[^>]*>(.*?)</div>',
            r'duration[^>]*>(.*?)</div>'
        ]
        for pattern in session_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['session', 'timeline', 'duration', 'work']):
                    self._register_feature('session_timeline', 'session_element', html_file.name)

        # 5. COLOR SCHEMAS
        color_patterns = [
            r'color[^>]*>(.*?)</div>',
            r'schema[^>]*>(.*?)</div>',
            r'theme[^>]*>(.*?)</div>',
            r'temperature[^>]*>(.*?)</div>',
            r'github[^>]*>(.*?)</div>',
            r'plasma[^>]*>(.*?)</div>'
        ]
        for pattern in color_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['color', 'schema', 'theme', 'temperature', 'github', 'plasma']):
                    self._register_feature('color_schema', 'color_element', html_file.name)

        # 6. TOOLTIPS
        tooltip_patterns = [
            r'tooltip[^>]*>(.*?)</div>',
            r'tip[^>]*>(.*?)</div>',
            r'hover[^>]*>(.*?)</div>'
        ]
        for pattern in tooltip_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if 'tooltip' in match.lower() or 'tip' in match.lower():
                    self._register_feature('tooltip', 'tooltip_element', html_file.name)

        # 7. BUTTONS AND CONTROLS
        button_patterns = [
            r'<button[^>]*>(.*?)</button>',
            r'<input[^>]*type=["\'](?:button|submit|reset)["\'][^>]*>',
            r'onclick[^=]*=[^>]*>',
            r'control[^>]*>(.*?)</div>',
            r'toggle[^>]*>(.*?)</div>',
            r'switch[^>]*>(.*?)</div>'
        ]
        for pattern in button_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['button', 'toggle', 'switch', 'control']):
                    self._register_feature('button_control', 'button_element', html_file.name)

        # 8. SETTINGS PANELS
        setting_patterns = [
            r'setting[^>]*>(.*?)</div>',
            r'panel[^>]*>(.*?)</div>',
            r'config[^>]*>(.*?)</div>',
            r'option[^>]*>(.*?)</div>'
        ]
        for pattern in setting_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['setting', 'panel', 'config', 'option']):
                    self._register_feature('settings_panel', 'settings_element', html_file.name)

        # 9. LANGUAGE TOGGLES
        lang_patterns = [
            r'lang[^>]*>(.*?)</div>',
            r'en[^>]*>(.*?)</div>',
            r'pt[^>]*>(.*?)</div>',
            r'language[^>]*>(.*?)</div>'
        ]
        for pattern in lang_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['lang', 'en', 'pt', 'language']):
                    self._register_feature('language_toggle', 'language_element', html_file.name)

        # 10. DATA VISUALIZATIONS
        viz_patterns = [
            r'chart[^>]*>(.*?)</div>',
            r'graph[^>]*>(.*?)</div>',
            r'visualiz[^>]*>(.*?)</div>',
            r'mermaid[^>]*>(.*?)</div>',
            r'diagram[^>]*>(.*?)</div>'
        ]
        for pattern in viz_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['chart', 'graph', 'visualiz', 'mermaid', 'diagram']):
                    self._register_feature('data_visualization', 'viz_element', html_file.name)

        # 11. FILE EXPLORERS
        file_patterns = [
            r'file[^>]*>(.*?)</div>',
            r'explorer[^>]*>(.*?)</div>',
            r'directory[^>]*>(.*?)</div>',
            r'folder[^>]*>(.*?)</div>'
        ]
        for pattern in file_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['file', 'explorer', 'directory', 'folder']):
                    self._register_feature('file_explorer', 'file_element', html_file.name)

        # 12. TABLES AND LISTS
        table_patterns = [
            r'<table[^>]*>.*?</table>',
            r'<tbody[^>]*>.*?</tbody>',
            r'<thead[^>]*>.*?</thead>',
            r'<tr[^>]*>.*?</tr>',
            r'<ul[^>]*>.*?</ul>',
            r'<ol[^>]*>.*?</ol>'
        ]
        for pattern in table_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                self._register_feature('table_list', 'table_element', html_file.name)

        # 13. FORMS AND INPUTS
        form_patterns = [
            r'<form[^>]*>.*?</form>',
            r'<input[^>]*>',
            r'<select[^>]*>.*?</select>',
            r'<textarea[^>]*>.*?</textarea>',
            r'<label[^>]*>.*?</label>'
        ]
        for pattern in form_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                self._register_feature('form_input', 'form_element', html_file.name)

        # 14. NAVIGATION ELEMENTS
        nav_patterns = [
            r'<nav[^>]*>.*?</nav>',
            r'menu[^>]*>(.*?)</div>',
            r'navbar[^>]*>(.*?)</div>',
            r'navigation[^>]*>(.*?)</div>'
        ]
        for pattern in nav_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['nav', 'menu', 'navbar', 'navigation']):
                    self._register_feature('navigation', 'nav_element', html_file.name)

        # 15. STATISTICS AND METRICS
        stat_patterns = [
            r'stat[^>]*>(.*?)</div>',
            r'metric[^>]*>(.*?)</div>',
            r'score[^>]*>(.*?)</div>',
            r'health[^>]*>(.*?)</div>',
            r'progress[^>]*>(.*?)</div>'
        ]
        for pattern in stat_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['stat', 'metric', 'score', 'health', 'progress']):
                    self._register_feature('statistics_metric', 'stat_element', html_file.name)

        # 16. MODALS AND DIALOGS
        modal_patterns = [
            r'modal[^>]*>(.*?)</div>',
            r'dialog[^>]*>(.*?)</div>',
            r'popup[^>]*>(.*?)</div>',
            r'overlay[^>]*>(.*?)</div>'
        ]
        for pattern in modal_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['modal', 'dialog', 'popup', 'overlay']):
                    self._register_feature('modal_dialog', 'modal_element', html_file.name)

        # 17. DASHBOARD ELEMENTS
        dashboard_patterns = [
            r'dashboard[^>]*>(.*?)</div>',
            r'card[^>]*>(.*?)</div>',
            r'widget[^>]*>(.*?)</div>',
            r'tile[^>]*>(.*?)</div>'
        ]
        for pattern in dashboard_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['dashboard', 'card', 'widget', 'tile']):
                    self._register_feature('dashboard_element', 'dash_element', html_file.name)

        # 18. JAVASCRIPT FUNCTIONS
        js_functions = re.findall(r'function\s+(\w+)[^}]*\{[^}]*\}', content)
        for func in js_functions:
            if func and len(func) > 2:
                self._register_feature('javascript_function', func, html_file.name)

        # 19. CSS CLASSES
        css_classes = re.findall(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', content)
        for css_class in css_classes:
            if css_class and len(css_class) > 2:
                self._register_feature('css_class', css_class, html_file.name)

        # 20. OKLCH COLOR VARIABLES
        oklch_vars = re.findall(r'--[a-zA-Z0-9_-]*:\s*oklch\([^)]+\)', content)
        for var in oklch_vars:
            if var:
                self._register_feature('oklch_variable', var.split(':')[0], html_file.name)

        print(f"   ✅ Analysis complete for {html_file.name}")

    def _analyze_section_content(self, section_id, content, source_file):
        """Analyze content within a specific section"""
        # Look for specific patterns in section content
        if 'calendar' in content.lower():
            self._register_feature('calendar_section', section_id, source_file)
        if 'session' in content.lower() or 'timeline' in content.lower():
            self._register_feature('session_section', section_id, source_file)
        if 'color' in content.lower() or 'schema' in content.lower() or 'theme' in content.lower():
            self._register_feature('color_section', section_id, source_file)
        if 'setting' in content.lower() or 'config' in content.lower():
            self._register_feature('settings_section', section_id, source_file)

    def _register_feature(self, feature_type, feature_name, source_file):
        """Register a feature occurrence"""
        # Clean up feature name
        clean_name = re.sub(r'\s+', ' ', feature_name.strip())
        clean_name = re.sub(r'[^\w\s\-_]', '', clean_name)

        if clean_name and len(clean_name) > 2:
            # Add to feature registry
            self.component_registry['features'][clean_name].append({
                'type': feature_type,
                'source': source_file,
                'count': 1
            })

            # Track occurrences
            self.feature_occurrences[clean_name] += 1

            # Track source mapping
            if clean_name not in self.source_mapping:
                self.source_mapping[clean_name] = []
            if source_file not in self.source_mapping[clean_name]:
                self.source_mapping[clean_name].append(source_file)

    def analyze_all_htmls(self):
        """Analyze all HTML files in the directory"""
        print("🧬 COMPREHENSIVE COMPONENT REGISTRY ANALYSIS")
        print("=" * 60)
        print(f"📁 Analyzing {len(self.html_files)} HTML files...")

        for html_file in self.html_files:
            if html_file.stat().st_size > 1000:  # Only analyze files > 1KB
                self.analyze_html_file(html_file)
            else:
                print(f"\n📄 Skipping {html_file.name} (too small: {html_file.stat().st_size} bytes)")

    def generate_comprehensive_registry(self):
        """Generate the comprehensive component registry"""
        print("\n📊 GENERATING COMPREHENSIVE COMPONENT REGISTRY...")

        registry = {
            'analysis_date': '2025-10-10',
            'total_html_files': len([f for f in self.html_files if f.stat().st_size > 1000]),
            'total_features_found': len(self.feature_occurrences),
            'feature_registry': {},
            'component_categories': {},
            'occurrence_statistics': {},
            'source_distribution': {},
            'unduplicated_features': []
        }

        # Build feature registry with occurrence counts
        for feature_name, count in self.feature_occurrences.most_common():
            sources = self.source_mapping.get(feature_name, [])
            feature_info = self.component_registry['features'].get(feature_name, [])
            feature_types = list(set([item['type'] for item in feature_info]))

            registry['feature_registry'][feature_name] = {
                'occurrences': count,
                'sources': sources,
                'source_count': len(sources),
                'feature_types': feature_types,
                'first_seen_in': sources[0] if sources else None
            }

        # Build component categories
        for feature_name, details in registry['feature_registry'].items():
            for feature_type in details['feature_types']:
                if feature_type not in registry['component_categories']:
                    registry['component_categories'][feature_type] = {
                        'features': [],
                        'total_occurrences': 0,
                        'unique_sources': set()
                    }

                registry['component_categories'][feature_type]['features'].append(feature_name)
                registry['component_categories'][feature_type]['total_occurrences'] += details['occurrences']
                registry['component_categories'][feature_type]['unique_sources'].update(details['sources'])

        # Convert sets to lists for JSON serialization
        for category in registry['component_categories']:
            registry['component_categories'][category]['unique_sources'] = list(registry['component_categories'][category]['unique_sources'])
            registry['component_categories'][category]['source_count'] = len(registry['component_categories'][category]['unique_sources'])

        # Generate occurrence statistics
        occurrence_ranges = {
            'rare (1 occurrence)': 0,
            'uncommon (2-5 occurrences)': 0,
            'common (6-10 occurrences)': 0,
            'very common (11+ occurrences)': 0
        }

        for feature_name, details in registry['feature_registry'].items():
            count = details['occurrences']
            if count == 1:
                occurrence_ranges['rare (1 occurrence)'] += 1
            elif count <= 5:
                occurrence_ranges['uncommon (2-5 occurrences)'] += 1
            elif count <= 10:
                occurrence_ranges['common (6-10 occurrences)'] += 1
            else:
                occurrence_ranges['very common (11+ occurrences)'] += 1

        registry['occurrence_statistics'] = occurrence_ranges

        # Generate unduplicated features list
        registry['unduplicated_features'] = list(self.feature_occurrences.keys())

        return registry

    def save_registry(self, registry):
        """Save the registry to files"""
        print(f"\n💾 SAVING REGISTRY DATA...")

        # Save comprehensive registry
        with open('COMPREHENSIVE_COMPONENT_REGISTRY.json', 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2)

        # Save unduplicated features list
        with open('UNDUPLICATED_FEATURES_LIST.json', 'w', encoding='utf-8') as f:
            json.dump(registry['unduplicated_features'], f, indent=2)

        # Save component categories
        with open('COMPONENT_CATEGORIES.json', 'w', encoding='utf-8') as f:
            json.dump(registry['component_categories'], f, indent=2)

        print(f"   ✅ Registry saved: COMPREHENSIVE_COMPONENT_REGISTRY.json")
        print(f"   ✅ Features list saved: UNDUPLICATED_FEATURES_LIST.json")
        print(f"   ✅ Categories saved: COMPONENT_CATEGORIES.json")

    def print_summary(self, registry):
        """Print a comprehensive summary of the analysis"""
        print("\n" + "=" * 80)
        print("🧬 COMPREHENSIVE COMPONENT REGISTRY SUMMARY")
        print("=" * 80)

        print(f"\n📊 ANALYSIS OVERVIEW:")
        print(f"   • Total HTML files analyzed: {registry['total_html_files']}")
        print(f"   • Total unique features found: {registry['total_features_found']}")
        print(f"   • Component categories: {len(registry['component_categories'])}")

        print(f"\n🎯 TOP 20 MOST COMMON FEATURES:")
        for i, (feature, details) in enumerate(list(registry['feature_registry'].items())[:20], 1):
            print(f"   {i:2d}. {feature:<30} ({details['occurrences']} occurrences, {details['source_count']} sources)")

        print(f"\n📋 COMPONENT CATEGORIES:")
        for category, details in registry['component_categories'].items():
            print(f"   • {category:<25}: {len(details['features'])} features, {details['total_occurrences']} total occurrences")

        print(f"\n📈 OCCURRENCE DISTRIBUTION:")
        for range_name, count in registry['occurrence_statistics'].items():
            print(f"   • {range_name:<30}: {count} features")

        print(f"\n🔍 FEATURE DIVERSITY:")
        multi_source_features = [f for f, d in registry['feature_registry'].items() if d['source_count'] > 1]
        print(f"   • Features in multiple sources: {len(multi_source_features)}")
        print(f"   • Single-source features: {len(registry['unduplicated_features']) - len(multi_source_features)}")

        print(f"\n🏆 MOST DIVERSE FEATURES (appear in most sources):")
        most_diverse = sorted(registry['feature_registry'].items(), key=lambda x: x[1]['source_count'], reverse=True)[:10]
        for feature, details in most_diverse:
            print(f"   • {feature:<30}: appears in {details['source_count']} different HTML files")

    def run_comprehensive_analysis(self):
        """Run the complete comprehensive analysis"""
        self.analyze_all_htmls()
        registry = self.generate_comprehensive_registry()
        self.save_registry(registry)
        self.print_summary(registry)

        return registry

if __name__ == "__main__":
    analyzer = ComprehensiveComponentRegistry()
    registry = analyzer.run_comprehensive_analysis()

    print(f"\n🎉 COMPREHENSIVE ANALYSIS COMPLETE!")
    print(f"📄 Check the generated JSON files for detailed feature breakdowns")