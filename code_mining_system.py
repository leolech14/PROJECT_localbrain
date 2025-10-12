#!/usr/bin/env python3
"""
🧬 CODE MINING SYSTEM - TOTALITY AND COMPLETENESS
Extracts ALL different code implementations from ALL HTML versions
For comprehensive synthesis of best features from ALL variants
"""

import re
import json
from pathlib import Path

class CodeMiningSystem:
    def __init__(self):
        self.html_files = list(Path('.').glob('*.html'))
        self.implementations = {
            'calendar_systems': [],
            'session_timelines': [],
            'color_schemas': [],
            'tooltip_systems': [],
            'interactive_elements': [],
            'css_variables': [],
            'javascript_functions': []
        }

    def extract_calendar_implementations(self):
        """Extract ALL different calendar implementations"""
        print("🗓️ EXTRACTING CALENDAR IMPLEMENTATIONS FROM ALL HTMLS...")

        for html_file in self.html_files:
            print(f"\n📄 Mining: {html_file.name}")

            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract calendar grid structures
            calendar_grids = re.findall(r'<div[^>]*calendar-grid[^>]*>.*?</div>', content, re.DOTALL)
            calendar_days = re.findall(r'<div[^>]*calendar-day[^>]*>.*?</div>', content, re.DOTALL)

            # Extract calendar JavaScript functions
            calendar_functions = re.findall(r'function[^{]*calendar[^{]*\{[^}]*\}', content, re.DOTALL)
            calendar_js = re.findall(r'selectCalendarDay[^}]+\}', content, re.DOTALL)

            if calendar_days or calendar_functions:
                implementation = {
                    'source_file': html_file.name,
                    'file_size': len(content),
                    'calendar_days_count': len(calendar_days),
                    'calendar_functions_count': len(calendar_functions),
                    'has_grid': len(calendar_grids) > 0,
                    'sample_calendar_day': calendar_days[0] if calendar_days else None,
                    'sample_function': calendar_functions[0] if calendar_functions else None,
                    'javascript_snippet': calendar_js[0] if calendar_js else None
                }
                self.implementations['calendar_systems'].append(implementation)
                print(f"  ✅ Found {len(calendar_days)} calendar days, {len(calendar_functions)} functions")

    def extract_session_implementations(self):
        """Extract ALL different session timeline implementations"""
        print("\n⏱️ EXTRACTING SESSION TIMELINE IMPLEMENTATIONS...")

        for html_file in self.html_files:
            print(f"\n📄 Mining: {html_file.name}")

            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract session tables
            session_tables = re.findall(r'<table[^>]*>.*?(?:session|work).*?</table>', content, re.DOTALL | re.IGNORECASE)
            session_rows = re.findall(r'<tr[^>]*>.*?(?:session|work|duration|files).*?</tr>', content, re.DOTALL | re.IGNORECASE)

            # Extract session data patterns
            session_data = re.findall(r'(\d+[h ]\d+m[in]*).*?(\d+ files)', content, re.IGNORECASE)
            session_starts = re.findall(r'(TODAY|YESTERDAY|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)', content, re.IGNORECASE)

            if session_tables or session_rows or session_data:
                implementation = {
                    'source_file': html_file.name,
                    'file_size': len(content),
                    'session_tables_count': len(session_tables),
                    'session_rows_count': len(session_rows),
                    'session_data_count': len(session_data),
                    'has_session_starts': len(session_starts) > 0,
                    'sample_table': session_tables[0] if session_tables else None,
                    'sample_data': session_data[:5] if session_data else None,
                    'sample_row': session_rows[0] if session_rows else None
                }
                self.implementations['session_timelines'].append(implementation)
                print(f"  ✅ Found {len(session_tables)} tables, {len(session_data)} data points")

    def extract_color_schema_implementations(self):
        """Extract ALL different color schema implementations"""
        print("\n🎨 EXTRACTING COLOR SCHEMA IMPLEMENTATIONS...")

        for html_file in self.html_files:
            print(f"\n📄 Mining: {html_file.name}")

            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract color schema buttons
            schema_buttons = re.findall(r'<button[^>]*schema[^>]*>.*?</button>', content, re.IGNORECASE)

            # Extract color variables
            color_vars = re.findall(r'--[a-z-]+:\s*oklch\([^)]+\)', content)
            temperature_colors = re.findall(r'--temperature-[a-z]+:\s*oklch\([^)]+\)', content)
            github_colors = re.findall(r'--github-[a-z]+:\s*oklch\([^)]+\)', content)
            plasma_colors = re.findall(r'--plasma-[a-z]+:\s*oklch\([^)]+\)', content)

            # Extract color switching functions
            switch_functions = re.findall(r'switchColorSchema[^}]+\}', content)
            color_objects = re.findall(r'colorSchemas[^=]*=[^}]*\}', content)

            if schema_buttons or color_vars or switch_functions:
                implementation = {
                    'source_file': html_file.name,
                    'file_size': len(content),
                    'schema_buttons_count': len(schema_buttons),
                    'color_vars_count': len(color_vars),
                    'temperature_colors_count': len(temperature_colors),
                    'github_colors_count': len(github_colors),
                    'plasma_colors_count': len(plasma_colors),
                    'switch_functions_count': len(switch_functions),
                    'color_objects_count': len(color_objects),
                    'has_temperature': len(temperature_colors) > 0,
                    'has_github': len(github_colors) > 0,
                    'has_plasma': len(plasma_colors) > 0,
                    'sample_button': schema_buttons[0] if schema_buttons else None,
                    'sample_function': switch_functions[0] if switch_functions else None,
                    'sample_object': color_objects[0] if color_objects else None
                }
                self.implementations['color_schemas'].append(implementation)
                print(f"  ✅ Found {len(color_vars)} color vars, {len(schema_buttons)} buttons")

    def extract_tooltip_systems(self):
        """Extract ALL different tooltip implementations"""
        print("\n💬 EXTRACTING TOOLTIP SYSTEMS...")

        for html_file in self.html_files:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract tooltip structures
            tooltips = re.findall(r'<div[^>]*tooltip[^>]*>.*?</div>', content, re.DOTALL)
            tooltip_arrows = re.findall(r'tooltip-arrow[^>]*>[^<]*<', content)

            # Extract tooltip JavaScript
            tooltip_functions = re.findall(r'function[^{]*tooltip[^{]*\{[^}]*\}', content, re.DOTALL)

            if tooltips:
                implementation = {
                    'source_file': html_file.name,
                    'tooltips_count': len(tooltips),
                    'tooltip_functions_count': len(tooltip_functions),
                    'sample_tooltip': tooltips[0] if tooltips else None,
                    'sample_function': tooltip_functions[0] if tooltip_functions else None
                }
                self.implementations['tooltip_systems'].append(implementation)

    def generate_comprehensive_report(self):
        """Generate comprehensive report of ALL implementations"""
        print("\n📊 GENERATING COMPREHENSIVE CODE MINING REPORT...")

        report = {
            'mining_date': '2025-10-10',
            'total_html_files': len(self.html_files),
            'implementations_found': {}
        }

        for category, implementations in self.implementations.items():
            report['implementations_found'][category] = {
                'count': len(implementations),
                'sources': [impl['source_file'] for impl in implementations],
                'total_features': sum([
                    impl.get('calendar_days_count', 0) +
                    impl.get('session_tables_count', 0) +
                    impl.get('color_vars_count', 0) +
                    impl.get('tooltips_count', 0)
                    for impl in implementations
                ])
            }

        # Save detailed report
        with open('CODE_MINING_REPORT.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

        # Save implementations data
        with open('ALL_IMPLEMENTATIONS.json', 'w', encoding='utf-8') as f:
            json.dump(self.implementations, f, indent=2)

        print(f"\n✅ CODE MINING COMPLETE!")
        print(f"📄 Report saved: CODE_MINING_REPORT.json")
        print(f"📄 Implementations saved: ALL_IMPLEMENTATIONS.json")

        return report

    def run_complete_extraction(self):
        """Run complete code extraction from ALL HTML files"""
        print("🧬 STARTING COMPREHENSIVE CODE MINING...")
        print(f"📁 Processing {len(self.html_files)} HTML files")

        self.extract_calendar_implementations()
        self.extract_session_implementations()
        self.extract_color_schema_implementations()
        self.extract_tooltip_systems()

        report = self.generate_comprehensive_report()

        return report

if __name__ == "__main__":
    miner = CodeMiningSystem()
    report = miner.run_complete_extraction()

    print("\n🎯 MINING SUMMARY:")
    for category, data in report['implementations_found'].items():
        print(f"  {category}: {data['count']} implementations from {data['count']} sources")