#!/usr/bin/env python3
"""
DOCSTRING INSERTION TOOL - Phase 1
Automatically adds comprehensive docstrings to Phase 1 functions
"""

import re
from pathlib import Path

# Phase 1 docstring replacements
DOCSTRING_REPLACEMENTS = {
    # Function 1: create_separator_line
    'def create_separator_line(char="═", width=MAX_WIDTH):\n    """Create a separator line at exactly MAX_WIDTH characters"""':
    '''def create_separator_line(char="═", width=MAX_WIDTH):
    """
    Create a separator line at exactly MAX_WIDTH characters.

    Generates comment line filled with specified character for visual
    separation between code sections. Maintains exact 88-char width
    for Black formatter compatibility.

    Args:
        char: Character to repeat for line fill. Defaults to '═'.
        width: Total line width including '# ' prefix. Defaults to 88.

    Returns:
        str: Formatted separator line like '# ═════════════════...'

    Example:
        >>> create_separator_line("═", 88)
        '# ══════════════════════════════════════════════════════════════════════════════════'
        >>> create_separator_line("─", 88)
        '# ──────────────────────────────────────────────────────────────────────────────────'
    """''',

    # Function 2: create_box_header
    'def create_box_header(title, icon="", width=MAX_WIDTH):\n    """\n    Create ASCII box header with title centered\n    Format: # ═══ ICON TITLE ═══\n    """':
    '''def create_box_header(title, icon="", width=MAX_WIDTH):
    """
    Create ASCII box header with title centered.

    Generates box header line with optional icon and title centered
    within equals signs. Used for section headers in ASCII art boxes.

    Args:
        title: Text to display in box header.
        icon: Optional emoji icon before title. Defaults to empty string.
        width: Total box width. Defaults to MAX_WIDTH (88).

    Returns:
        str: Formatted box header line like '# ═══ 📦 TITLE ═══'

    Example:
        >>> create_box_header("DEPENDENCIES", "📦", 88)
        '# ═══════════════════════ 📦 DEPENDENCIES ═══════════════════════'
        >>> create_box_header("UTILITIES", "", 88)
        '# ══════════════════════════ UTILITIES ══════════════════════════'
    """''',

    # Function 3: create_closed_box
    'def create_closed_box(lines_content, width=MAX_WIDTH):\n    """\n    Create a CLOSED ASCII box with proper walls on all sides':
    '''def create_closed_box(lines_content, width=MAX_WIDTH):
    """
    Create a closed ASCII box with proper walls on all sides.

    Generates complete box structure with top border, content lines
    padded to exact width, and bottom border. All lines maintain
    exact 88-character width for visual consistency.

    Args:
        lines_content: List of strings to display inside box.
        width: Total box width. Defaults to MAX_WIDTH (88).

    Returns:
        str: Multi-line box with format:
            # ╔════════════════════════════════════════╗
            # ║ Content line 1                         ║
            # ║ Content line 2                         ║
            # ╚════════════════════════════════════════╝

    Example:
        >>> box = create_closed_box(["Line 1", "Line 2"], 88)
        >>> print(box)
        # ╔══════════════════════════════════════════════════════════════════════════════════╗
        # ║ Line 1                                                                           ║
        # ║ Line 2                                                                           ║
        # ╚══════════════════════════════════════════════════════════════════════════════════╝
    """''',

    # Function 4: create_section_box
    'def create_section_box(title, content_lines, width=MAX_WIDTH):\n    """\n    Create a titled section box with content':
    '''def create_section_box(title, content_lines, width=MAX_WIDTH):
    """
    Create a titled section box with content.

    Generates complete box with centered title, separator line, and
    content area. Used for major section divisions in script output.

    Args:
        title: Section title to display at top.
        content_lines: List of strings for box content.
        width: Total box width. Defaults to MAX_WIDTH (88).

    Returns:
        str: Multi-line box with centered title and content.

    Example:
        >>> box = create_section_box("RESULTS", ["Score: 95%"], 88)
        >>> print(box)
        # ╔══════════════════════════════════════════════════════════════════════════════════╗
        # ║                                    RESULTS                                       ║
        # ╠══════════════════════════════════════════════════════════════════════════════════╣
        # ║ Score: 95%                                                                       ║
        # ╚══════════════════════════════════════════════════════════════════════════════════╝
    """''',

    # Function 5: create_zone_marker
    'def create_zone_marker(zone_num, zone_name, icon="📦", width=MAX_WIDTH):\n    """\n    Create standardized zone marker':
    '''def create_zone_marker(zone_num, zone_name, icon="📦", width=MAX_WIDTH):
    """
    Create standardized zone marker for script organization.

    Generates zone header used to separate major sections of the script.
    Self-healing system uses these markers to detect and validate zones.

    Args:
        zone_num: Zone number (1, 2, 3, etc.).
        zone_name: Descriptive name of zone (e.g., "DEPENDENCIES").
        icon: Emoji icon for zone. Defaults to "📦".
        width: Total marker width. Defaults to MAX_WIDTH (88).

    Returns:
        str: Three-line zone marker with separators and title.

    Example:
        >>> marker = create_zone_marker(1, "DEPENDENCIES", "📦", 88)
        >>> print(marker)
        # ════════════════════════════════════════════════════════════════════════════════════
        # 📦 ZONE 1: DEPENDENCIES
        # ════════════════════════════════════════════════════════════════════════════════════

    Note:
        Zone markers are detected by SelfHealingCodeManager for structural
        validation and line counting.
    """''',
}

def add_phase1_docstrings(script_path: str):
    """Add Phase 1 docstrings to mr-fix-my-project-please.py"""

    print("🔧 Reading script...")
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    replacements_made = 0

    print("\n📝 Adding comprehensive docstrings...")
    for old, new in DOCSTRING_REPLACEMENTS.items():
        if old in content:
            content = content.replace(old, new)
            replacements_made += 1
            print(f"  ✅ Replaced docstring #{replacements_made}")
        else:
            print(f"  ⚠️  Could not find pattern for replacement #{replacements_made + 1}")

    if replacements_made > 0:
        # Create backup
        backup_path = f"{script_path}.backup-phase1-{int(__import__('time').time())}"
        print(f"\n💾 Creating backup: {backup_path}")
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)

        # Write updated content
        print(f"✍️  Writing updated script...")
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"\n✅ SUCCESS! Added {replacements_made} comprehensive docstrings")
        print(f"📦 Backup saved to: {backup_path}")
        print("\n🧪 Test with: python3 -m py_compile mr-fix-my-project-please.py")
    else:
        print("\n❌ No replacements made - patterns may have changed")
        print("💡 Try manual method instead")

if __name__ == "__main__":
    script_path = "mr-fix-my-project-please.py"

    if not Path(script_path).exists():
        print(f"❌ Script not found: {script_path}")
        print("💡 Run this from the LocalBrain directory")
        exit(1)

    print("=" * 88)
    print("🚀 PHASE 1 DOCSTRING INSERTION TOOL")
    print("=" * 88)
    print("\nThis will add comprehensive docstrings to 5 top-level functions:")
    print("  1. create_separator_line()")
    print("  2. create_box_header()")
    print("  3. create_closed_box()")
    print("  4. create_section_box()")
    print("  5. create_zone_marker()")
    print("\n⚠️  Backup will be created automatically")

    response = input("\n❓ Continue? (yes/no): ").strip().lower()

    if response in ['yes', 'y']:
        add_phase1_docstrings(script_path)
    else:
        print("\n❌ Cancelled by user")
