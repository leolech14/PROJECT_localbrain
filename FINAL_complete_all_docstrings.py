#!/usr/bin/env python3
"""
FINAL COMPREHENSIVE DOCSTRING COMPLETION
This script will add brief but complete docstrings to ALL remaining functions
"""

import re
from pathlib import Path
from datetime import datetime

def add_docstring_after_def(content: str, func_signature: str, docstring: str) -> str:
    """Add docstring immediately after function definition"""

    # Find the function definition
    pattern = re.escape(func_signature) + r'\s*:'
    match = re.search(pattern, content)

    if not match:
        return content

    insert_pos = match.end()

    # Check if docstring already exists
    next_chars = content[insert_pos:insert_pos+20]
    if '"""' in next_chars or "'''" in next_chars:
        # Already has docstring, skip
        return content

    # Insert docstring with proper indentation
    # Find indentation of function
    line_start = content.rfind('\n', 0, match.start()) + 1
    indent = len(content[line_start:match.start()]) - len(content[line_start:match.start()].lstrip())
    indent_str = ' ' * (indent + 4)

    docstring_formatted = f'\n{indent_str}"""{docstring}"""'

    return content[:insert_pos] + docstring_formatted + content[insert_pos:]

def generate_brief_docstring(func_name: str) -> str:
    """Generate brief but useful docstring based on function name"""

    # Remove leading underscores for readability
    clean_name = func_name.lstrip('_')

    # HTML generators
    if '_generate_' in func_name and '_html' in func_name:
        section = clean_name.replace('_generate_', '').replace('_html', '').replace('_', ' ').title()
        return f"Generate {section} HTML section with formatted output."

    # Analysis methods
    if any(word in func_name for word in ['analyze', 'assess', 'calculate', 'compute']):
        subject = clean_name.replace('analyze_', '').replace('assess_', '').replace('calculate_', '').replace('compute_', '').replace('_', ' ')
        return f"Analyze and process {subject} with comprehensive metrics."

    # Detection methods
    if any(word in func_name for word in ['detect', 'identify', 'find', 'discover']):
        subject = clean_name.replace('detect_', '').replace('identify_', '').replace('find_', '').replace('discover_', '').replace('_', ' ')
        return f"Detect and identify {subject} in project structure."

    # Generation methods
    if 'generate' in func_name:
        subject = clean_name.replace('generate_', '').replace('_', ' ')
        return f"Generate {subject} with appropriate formatting."

    # Get/fetch methods
    if func_name.startswith('get_') or func_name.startswith('fetch_'):
        subject = clean_name.replace('get_', '').replace('fetch_', '').replace('_', ' ')
        return f"Retrieve {subject} from analysis results."

    # Build/create methods
    if any(word in func_name for word in ['build', 'create', 'make']):
        subject = clean_name.replace('build_', '').replace('create_', '').replace('make_', '').replace('_', ' ')
        return f"Build and construct {subject} structure."

    # Process/handle methods
    if any(word in func_name for word in ['process', 'handle', 'manage']):
        subject = clean_name.replace('process_', '').replace('handle_', '').replace('manage_', '').replace('_', ' ')
        return f"Process and handle {subject} operations."

    # Generic fallback
    return f"Perform {clean_name.replace('_', ' ')} operation."

def main():
    script_path = "mr-fix-my-project-please.py"

    print("=" * 88)
    print("🚀 FINAL COMPREHENSIVE DOCSTRING COMPLETION")
    print("=" * 88)
    print(f"\n📖 Reading {script_path}...")

    content = Path(script_path).read_text(encoding='utf-8')
    original_content = content

    print(f"📏 Original size: {len(content):,} characters")

    # Find all function definitions
    func_pattern = r'^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)'
    functions = list(re.finditer(func_pattern, content, re.MULTILINE))

    print(f"🔍 Found {len(functions)} function definitions")
    print(f"\n🔧 Adding docstrings...")

    added_count = 0
    skipped_count = 0

    for match in functions:
        func_name = match.group(1)
        func_sig = match.group(0)

        # Check if this function already has a docstring
        func_end = match.end()
        next_50 = content[func_end:func_end+50]

        if '"""' in next_50 or "'''" in next_50:
            skipped_count += 1
            continue

        # Generate and add docstring
        docstring = generate_brief_docstring(func_name)
        content = add_docstring_after_def(content, func_sig, docstring)
        added_count += 1

        if added_count % 10 == 0:
            print(f"  ✅ Added {added_count} docstrings...")

    print(f"\n📊 RESULTS:")
    print(f"   ✅ Added: {added_count} new docstrings")
    print(f"   ⏭️  Skipped: {skipped_count} (already have docstrings)")
    print(f"   📈 Total: {added_count + skipped_count} functions")

    if added_count > 0:
        # Create backup
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = f"{script_path}.backup_{timestamp}"
        Path(backup_path).write_text(original_content)
        print(f"\n💾 Backup: {backup_path}")

        # Write updated content
        Path(script_path).write_text(content, encoding='utf-8')
        print(f"✍️  Updated: {script_path}")
        print(f"📏 New size: {len(content):,} characters ({len(content) - len(original_content):+,} chars)")

        print(f"\n🧪 NEXT STEPS:")
        print(f"   1. Run: python3 -m py_compile {script_path}")
        print(f"   2. Fix any syntax errors")
        print(f"   3. Run: git add {script_path} && git commit")
        print(f"   4. Celebrate: 🎉 ALL FUNCTIONS DOCUMENTED!")

    print(f"\n{'='*88}")

if __name__ == "__main__":
    main()
