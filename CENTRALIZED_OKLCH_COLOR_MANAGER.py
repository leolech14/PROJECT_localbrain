#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════════╗
║                    CENTRALIZED OKLCH COLOR MANAGER                              ║
║  Single home for 100% of color configuration logic in the HTML generation system ║
╚══════════════════════════════════════════════════════════════════════════════════╝

🎯 PURPOSE: Centralize ALL color management logic in one place
🏗️ ARCHITECTURE: Schema-based system with OKLCH color space
🎨 FEATURES: Multiple color themes, automatic CSS generation, accessibility compliance
📊 COVERAGE: 100% of color needs for HTML generation
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json


class ColorSchema(Enum):
    """Available color schemas for the HTML system"""
    TEMPERATURE = "temperature"      # Hot/Cold temperature mapping
    GITHUB = "github"               # GitHub-inspired dark/light theme
    PLASMA = "plasma"               # Vibrant plasma color scheme
    OCEAN = "ocean"                 # Ocean blues and teals
    FOREST = "forest"               # Natural greens and earth tones
    SUNSET = "sunset"               # Warm sunset colors
    MONOCHROME = "monochrome"       # Grayscale theme


@dataclass
class ColorToken:
    """Individual color token with OKLCH values"""
    name: str
    lightness: float  # 0.0 to 1.0
    chroma: float     # 0.0 to 0.37 (OKLCH limit)
    hue: float        # 0.0 to 360.0 degrees
    description: str = ""

    def to_oklch_string(self) -> str:
        """Convert to OKLCH CSS string"""
        return f"oklch({self.lightness:.2f} {self.chroma:.3f} {self.hue:.0f})"

    def to_rgb_string(self) -> str:
        """Convert to RGB for fallback (approximation)"""
        # Simplified OKLCH to RGB conversion
        # In production, use proper color conversion library
        import colorsys
        rgb = colorsys.hsv_to_rgb(self.hue / 360, min(self.chroma * 2, 1.0), self.lightness)
        return f"rgb({int(rgb[0]*255)}, {int(rgb[1]*255)}, {int(rgb[2]*255)})"


class OKLCHColorManager:
    """
    CENTRALIZED COLOR MANAGEMENT SYSTEM

    This is the SINGLE SOURCE OF TRUTH for all colors in the HTML generation system.
    All color decisions, theming, and CSS generation happens here.

    🎯 DESIGN PRINCIPLES:
    - 100% centralization - no color logic outside this class
    - OKLCH color space for perceptual uniformity
    - Schema-based theming system
    - Automatic accessibility compliance
    - CSS variable generation
    """

    def __init__(self, default_schema: ColorSchema = ColorSchema.TEMPERATURE):
        self.default_schema = default_schema
        self.current_schema = default_schema

        # Initialize color schemas
        self._init_color_schemas()

        # Component-specific color mappings
        self._init_component_colors()

        # Semantic color mappings
        self._init_semantic_colors()

    def _init_color_schemas(self):
        """Initialize all available color schemas"""
        self.schemas = {
            ColorSchema.TEMPERATURE: {
                'primary': ColorToken("primary", 0.65, 0.08, 240, "Main accent blue"),
                'secondary': ColorToken("secondary", 0.55, 0.06, 280, "Secondary purple"),
                'success': ColorToken("success", 0.65, 0.08, 142, "Success green"),
                'warning': ColorToken("warning", 0.75, 0.08, 60, "Warning amber"),
                'danger': ColorToken("danger", 0.65, 0.08, 20, "Danger red"),
                'info': ColorToken("info", 0.65, 0.08, 200, "Info cyan"),
                'surface': ColorToken("surface", 0.98, 0.01, 250, "Light surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 250, "Darker surface"),
                'text': ColorToken("text", 0.15, 0.02, 250, "Primary text"),
                'muted': ColorToken("muted", 0.45, 0.02, 250, "Muted text"),
                'border': ColorToken("border", 0.85, 0.02, 250, "Border color"),
            },

            ColorSchema.GITHUB: {
                'primary': ColorToken("primary", 0.65, 0.08, 210, "GitHub blue"),
                'secondary': ColorToken("secondary", 0.35, 0.04, 210, "GitHub gray"),
                'success': ColorToken("success", 0.65, 0.08, 142, "GitHub green"),
                'warning': ColorToken("warning", 0.75, 0.08, 45, "GitHub yellow"),
                'danger': ColorToken("danger", 0.65, 0.08, 0, "GitHub red"),
                'info': ColorToken("info", 0.65, 0.08, 200, "GitHub cyan"),
                'surface': ColorToken("surface", 0.98, 0.01, 210, "GitHub light surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 210, "GitHub darker surface"),
                'text': ColorToken("text", 0.15, 0.02, 210, "GitHub text"),
                'muted': ColorToken("muted", 0.45, 0.02, 210, "GitHub muted"),
                'border': ColorToken("border", 0.85, 0.02, 210, "GitHub border"),
            },

            ColorSchema.PLASMA: {
                'primary': ColorToken("primary", 0.65, 0.12, 300, "Plasma purple"),
                'secondary': ColorToken("secondary", 0.60, 0.10, 340, "Plasma magenta"),
                'success': ColorToken("success", 0.65, 0.08, 150, "Plasma green"),
                'warning': ColorToken("warning", 0.75, 0.10, 45, "Plasma gold"),
                'danger': ColorToken("danger", 0.65, 0.10, 0, "Plasma red"),
                'info': ColorToken("info", 0.65, 0.10, 200, "Plasma cyan"),
                'surface': ColorToken("surface", 0.98, 0.01, 300, "Plasma surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 300, "Plasma darker surface"),
                'text': ColorToken("text", 0.15, 0.02, 300, "Plasma text"),
                'muted': ColorToken("muted", 0.45, 0.02, 300, "Plasma muted"),
                'border': ColorToken("border", 0.85, 0.02, 300, "Plasma border"),
            },

            ColorSchema.OCEAN: {
                'primary': ColorToken("primary", 0.65, 0.08, 200, "Ocean blue"),
                'secondary': ColorToken("secondary", 0.55, 0.06, 180, "Ocean teal"),
                'success': ColorToken("success", 0.65, 0.08, 160, "Ocean turquoise"),
                'warning': ColorToken("warning", 0.75, 0.08, 40, "Ocean sand"),
                'danger': ColorToken("danger", 0.65, 0.08, 10, "Ocean coral"),
                'info': ColorToken("info", 0.65, 0.08, 210, "Ocean sky"),
                'surface': ColorToken("surface", 0.98, 0.01, 200, "Ocean surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 200, "Ocean deeper surface"),
                'text': ColorToken("text", 0.15, 0.02, 200, "Ocean text"),
                'muted': ColorToken("muted", 0.45, 0.02, 200, "Ocean muted"),
                'border': ColorToken("border", 0.85, 0.02, 200, "Ocean border"),
            },

            ColorSchema.FOREST: {
                'primary': ColorToken("primary", 0.65, 0.08, 120, "Forest green"),
                'secondary': ColorToken("secondary", 0.55, 0.06, 90, "Forest olive"),
                'success': ColorToken("success", 0.65, 0.08, 140, "Forest lime"),
                'warning': ColorToken("warning", 0.75, 0.08, 60, "Forest amber"),
                'danger': ColorToken("danger", 0.65, 0.08, 20, "Forest red"),
                'info': ColorToken("info", 0.65, 0.08, 200, "Forest sky"),
                'surface': ColorToken("surface", 0.98, 0.01, 120, "Forest surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 120, "Forest darker surface"),
                'text': ColorToken("text", 0.15, 0.02, 120, "Forest text"),
                'muted': ColorToken("muted", 0.45, 0.02, 120, "Forest muted"),
                'border': ColorToken("border", 0.85, 0.02, 120, "Forest border"),
            },

            ColorSchema.SUNSET: {
                'primary': ColorToken("primary", 0.65, 0.08, 20, "Sunset red"),
                'secondary': ColorToken("secondary", 0.60, 0.08, 340, "Sunset pink"),
                'success': ColorToken("success", 0.65, 0.08, 120, "Sunset green"),
                'warning': ColorToken("warning", 0.75, 0.08, 45, "Sunset gold"),
                'danger': ColorToken("danger", 0.65, 0.08, 0, "Sunset deep red"),
                'info': ColorToken("info", 0.65, 0.08, 200, "Sunset purple"),
                'surface': ColorToken("surface", 0.98, 0.01, 20, "Sunset surface"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 20, "Sunset darker surface"),
                'text': ColorToken("text", 0.15, 0.02, 20, "Sunset text"),
                'muted': ColorToken("muted", 0.45, 0.02, 20, "Sunset muted"),
                'border': ColorToken("border", 0.85, 0.02, 20, "Sunset border"),
            },

            ColorSchema.MONOCHROME: {
                'primary': ColorToken("primary", 0.50, 0.01, 0, "Mono dark gray"),
                'secondary': ColorToken("secondary", 0.40, 0.01, 0, "Mono medium gray"),
                'success': ColorToken("success", 0.60, 0.02, 120, "Mono green tint"),
                'warning': ColorToken("warning", 0.70, 0.02, 60, "Mono amber tint"),
                'danger': ColorToken("danger", 0.60, 0.02, 0, "Mono red tint"),
                'info': ColorToken("info", 0.60, 0.02, 210, "Mono blue tint"),
                'surface': ColorToken("surface", 0.98, 0.01, 0, "Mono white"),
                'surface_2': ColorToken("surface_2", 0.95, 0.01, 0, "Mono light gray"),
                'text': ColorToken("text", 0.15, 0.01, 0, "Mono black"),
                'muted': ColorToken("muted", 0.45, 0.01, 0, "Mono gray"),
                'border': ColorToken("border", 0.80, 0.01, 0, "Mono border"),
            }
        }

    def _init_component_colors(self):
        """Initialize component-specific color mappings"""
        self.component_colors = {
            # Navigation components
            'nav_bg': 'surface',
            'nav_text': 'text',
            'nav_active': 'primary',
            'nav_hover': 'surface_2',

            # Card components
            'card_bg': 'surface',
            'card_border': 'border',
            'card_shadow': 'muted',
            'card_header': 'text',
            'card_body': 'text',

            # Button components
            'button_primary_bg': 'primary',
            'button_primary_text': 'surface',
            'button_secondary_bg': 'surface_2',
            'button_secondary_text': 'text',
            'button_danger_bg': 'danger',
            'button_danger_text': 'surface',

            # Form components
            'input_bg': 'surface',
            'input_border': 'border',
            'input_text': 'text',
            'input_placeholder': 'muted',
            'input_focus_border': 'primary',

            # Status indicators
            'status_success': 'success',
            'status_warning': 'warning',
            'status_danger': 'danger',
            'status_info': 'info',

            # Calendar components
            'calendar_today': 'primary',
            'calendar_weekend': 'muted',
            'calendar_active': 'secondary',
            'calendar_bg': 'surface',
            'calendar_border': 'border',

            # Session timeline components
            'timeline_dot': 'primary',
            'timeline_line': 'border',
            'timeline_text': 'text',
            'timeline_background': 'surface_2',

            # Tooltip components
            'tooltip_bg': 'text',
            'tooltip_text': 'surface',
            'tooltip_border': 'border',

            # Table components
            'table_header_bg': 'surface_2',
            'table_header_text': 'text',
            'table_row_bg': 'surface',
            'table_row_text': 'text',
            'table_row_hover': 'surface_2',
            'table_border': 'border',

            # Modal components
            'modal_overlay': 'text',
            'modal_bg': 'surface',
            'modal_border': 'border',
            'modal_text': 'text',

            # Loading components
            'loading_primary': 'primary',
            'loading_secondary': 'muted',

            # Progress components
            'progress_bg': 'surface_2',
            'progress_fill': 'primary',
            'progress_text': 'text',
        }

    def _init_semantic_colors(self):
        """Initialize semantic color mappings for dynamic use"""
        self.semantic_colors = {
            # Health/quality indicators
            'excellent': ('success', 0.8),
            'good': ('success', 0.6),
            'average': ('warning', 0.6),
            'below_average': ('warning', 0.8),
            'poor': ('danger', 0.8),
            'critical': ('danger', 1.0),

            # Priority indicators
            'priority_high': ('danger', 0.8),
            'priority_medium': ('warning', 0.6),
            'priority_low': ('info', 0.6),
            'priority_info': ('info', 0.4),

            # Status indicators
            'active': ('success', 0.7),
            'inactive': ('muted', 0.5),
            'pending': ('warning', 0.6),
            'completed': ('success', 0.8),
            'failed': ('danger', 0.8),

            # Score-based coloring
            'score_a': ('success', 0.8),
            'score_b': ('success', 0.6),
            'score_c': ('warning', 0.6),
            'score_d': ('warning', 0.8),
            'score_f': ('danger', 0.8),
        }

    def get_color(self, color_key: str, schema: Optional[ColorSchema] = None) -> ColorToken:
        """
        Get a color token by key from specified schema

        Args:
            color_key: Color identifier (e.g., 'primary', 'success', 'nav_bg')
            schema: Color schema to use (defaults to current_schema)

        Returns:
            ColorToken: The requested color token
        """
        schema = schema or self.current_schema
        schema_colors = self.schemas[schema]

        # Direct schema color
        if color_key in schema_colors:
            return schema_colors[color_key]

        # Component color mapping
        if color_key in self.component_colors:
            mapped_key = self.component_colors[color_key]
            return schema_colors[mapped_key]

        # Fallback to primary
        return schema_colors['primary']

    def get_semantic_color(self, semantic_key: str, schema: Optional[ColorSchema] = None) -> ColorToken:
        """
        Get semantic color based on state/quality

        Args:
            semantic_key: Semantic identifier (e.g., 'excellent', 'priority_high')
            schema: Color schema to use (defaults to current_schema)

        Returns:
            ColorToken: The appropriate semantic color
        """
        schema = schema or self.current_schema
        schema_colors = self.schemas[schema]

        if semantic_key in self.semantic_colors:
            base_color, intensity_modifier = self.semantic_colors[semantic_key]
            base_token = schema_colors[base_color]

            # Create modified token with adjusted intensity
            return ColorToken(
                name=f"{semantic_key}_{base_color.name}",
                lightness=base_token.lightness * (0.8 + intensity_modifier * 0.2),
                chroma=base_token.chroma * intensity_modifier,
                hue=base_token.hue,
                description=f"Semantic color for {semantic_key}"
            )

        # Fallback
        return schema_colors['primary']

    def set_schema(self, schema: ColorSchema):
        """Set the active color schema"""
        self.current_schema = schema

    def get_available_schemas(self) -> List[ColorSchema]:
        """Get list of available color schemas"""
        return list(ColorSchema)

    def generate_css_variables(self, schema: Optional[ColorSchema] = None) -> str:
        """
        Generate CSS variables for the specified schema

        Args:
            schema: Color schema to generate variables for (defaults to current_schema)

        Returns:
            str: CSS variable definitions
        """
        schema = schema or self.current_schema
        schema_colors = self.schemas[schema]

        css_vars = ["  :root {"]

        # Base colors
        for key, token in schema_colors.items():
            css_vars.append(f"    --{key}: {token.to_oklch_string()};")

        # Component colors
        for comp_key, mapped_key in self.component_colors.items():
            token = schema_colors[mapped_key]
            css_vars.append(f"    --{comp_key}: {token.to_oklch_string()};")

        # Surface-aware text tokens
        css_vars.extend([
            f"    --text-primary: {schema_colors['text'].to_oklch_string()};",
            f"    --text-secondary: {schema_colors['muted'].to_oklch_string()};",
            f"    --text-on-surface: {schema_colors['text'].to_oklch_string()};",
            f"    --text-on-surface-2: {schema_colors['text'].to_oklch_string()};",
            f"    --text-on-accent: oklch(1 0 0);",  # White text on accent
            f"    --text-interactive: {schema_colors['muted'].to_oklch_string()};",
        ])

        css_vars.append("  }")

        # Dark mode override
        css_vars.extend([
            "",
            "  @media (prefers-color-scheme: dark) {",
            "    :root {",
            f"      --bg: oklch(0.12 0.01 {schema_colors['primary'].hue});",
            f"      --surface: oklch(0.15 0.01 {schema_colors['primary'].hue});",
            f"      --surface-2: oklch(0.18 0.01 {schema_colors['primary'].hue});",
            "      --text-primary: oklch(0.95 0.01 250);",
            "      --text-secondary: oklch(0.75 0.01 250);",
            "      --text-on-surface: oklch(0.95 0.01 250);",
            "      --text-on-surface-2: oklch(0.95 0.01 250);",
            "      --text-on-accent: oklch(0.05 0.01 0);",  # Dark text on accent in dark mode
            "      --text-interactive: oklch(0.85 0.01 250);",
            "    }",
            "  }",
        ])

        return "\n".join(css_vars)

    def generate_theme_switcher_js(self) -> str:
        """
        Generate JavaScript for theme switching functionality

        Returns:
            str: JavaScript code for theme switching
        """
        return f"""
// COLOR SCHEMA MANAGER - Generated by OKLCH Color Manager
class ColorSchemaManager {{
    constructor() {{
        this.currentSchema = '{self.current_schema.value}';
        this.availableSchemas = {[s.value for s in ColorSchema]};
        this.init();
    }}

    init() {{
        // Load saved schema
        const saved = localStorage.getItem('colorSchema');
        if (saved && this.availableSchemas.includes(saved)) {{
            this.setSchema(saved);
        }}

        // Add schema switcher to page if not exists
        this.ensureSchemaSwitcher();
    }}

    setSchema(schemaName) {{
        if (!this.availableSchemas.includes(schemaName)) {{
            console.error('Unknown schema:', schemaName);
            return;
        }}

        this.currentSchema = schemaName;

        // Update CSS variables
        this.updateCSSVariables(schemaName);

        // Save preference
        localStorage.setItem('colorSchema', schemaName);

        // Update calendar colors if calendar exists
        this.updateCalendarColors(schemaName);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('schemaChanged', {{
            detail: {{ schema: schemaName }}
        }}));
    }}

    updateCSSVariables(schemaName) {{
        // Get CSS variables for the schema
        const cssVariables = this.getCSSVariables(schemaName);

        // Apply to root element
        const root = document.documentElement;
        Object.entries(cssVariables).forEach(([key, value]) => {{
            root.style.setProperty(key, value);
        }});
    }}

    getCSSVariables(schemaName) {{
        const schemas = {{
            {self._generate_js_schema_definitions()}
        }};

        return schemas[schemaName] || schemas['temperature'];
    }}

    updateCalendarColors(schemaName) {{
        const calendarDays = document.querySelectorAll('.calendar-day');
        if (calendarDays.length === 0) return;

        // Update calendar-specific colors
        const schemaColors = this.getSchemaColors(schemaName);

        calendarDays.forEach(day => {{
            // Update based on schema
            day.style.setProperty('--calendar-today', schemaColors.today);
            day.style.setProperty('--calendar-weekend', schemaColors.weekend);
            day.style.setProperty('--calendar-active', schemaColors.active);
        }});
    }}

    getSchemaColors(schemaName) {{
        const colors = {{
            {self._generate_js_color_definitions()}
        }};

        return colors[schemaName] || colors['temperature'];
    }}

    ensureSchemaSwitcher() {{
        if (document.getElementById('schema-switcher')) return;

        const switcher = document.createElement('div');
        switcher.id = 'schema-switcher';
        switcher.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;

        const label = document.createElement('label');
        label.textContent = 'Color Schema: ';
        label.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-right: 8px;
            color: var(--text);
        `;

        const select = document.createElement('select');
        select.style.cssText = `
            padding: 6px 12px;
            border: 1px solid var(--border);
            border-radius: 4px;
            background: var(--surface);
            color: var(--text);
            font-size: 14px;
        `;

        this.availableSchemas.forEach(schema => {{
            const option = document.createElement('option');
            option.value = schema;
            option.textContent = schema.charAt(0).toUpperCase() + schema.slice(1);
            option.selected = schema === this.currentSchema;
            select.appendChild(option);
        }});

        select.addEventListener('change', (e) => {{
            this.setSchema(e.target.value);
        }});

        switcher.appendChild(label);
        switcher.appendChild(select);
        document.body.appendChild(switcher);
    }}
}}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {{
    window.colorManager = new ColorSchemaManager();
}});
"""

    def _generate_js_schema_definitions(self) -> str:
        """Generate JavaScript schema definitions for theme switcher"""
        definitions = []

        for schema in ColorSchema:
            schema_colors = self.schemas[schema]
            css_vars = {}

            for key, token in schema_colors.items():
                css_vars[f'--{key}'] = f"'{token.to_oklch_string()}'"

            definitions.append(f"""
            '{schema.value}': {{
                {', '.join([f'{k}: {v}' for k, v in css_vars.items()])}
            }}""".strip())

        return ',\n'.join(definitions)

    def _generate_js_color_definitions(self) -> str:
        """Generate JavaScript color definitions for calendar theming"""
        definitions = []

        for schema in ColorSchema:
            schema_colors = self.schemas[schema]
            colors = {
                'today': f"'{schema_colors['primary'].to_oklch_string()}'",
                'weekend': f"'{schema_colors['muted'].to_oklch_string()}'",
                'active': f"'{schema_colors['secondary'].to_oklch_string()}'",
            }

            definitions.append(f"""
            '{schema.value}': {{
                {', '.join([f'{k}: {v}' for k, v in colors.items()])}
            }}""".strip())

        return ',\n'.join(definitions)

    def export_schema(self, schema: ColorSchema) -> Dict:
        """Export schema configuration as dictionary"""
        schema_colors = self.schemas[schema]
        return {
            'name': schema.value,
            'colors': {
                key: {
                    'oklch': token.to_oklch_string(),
                    'rgb': token.to_rgb_string(),
                    'lightness': token.lightness,
                    'chroma': token.chroma,
                    'hue': token.hue,
                    'description': token.description
                }
                for key, token in schema_colors.items()
            },
            'component_mappings': self.component_colors,
            'semantic_mappings': self.semantic_colors
        }

    def validate_accessibility(self, schema: Optional[ColorSchema] = None) -> Dict:
        """
        Validate color accessibility for a schema

        Args:
            schema: Color schema to validate (defaults to current_schema)

        Returns:
            dict: Accessibility validation results
        """
        schema = schema or self.current_schema
        schema_colors = self.schemas[schema]

        results = {
            'schema': schema.value,
            'valid_contrast_ratios': [],
            'poor_contrast_ratios': [],
            'warnings': [],
            'overall_score': 0
        }

        # Check critical contrast ratios
        contrast_checks = [
            ('text', 'surface', 4.5),      # Normal text on background
            ('text', 'surface_2', 4.5),    # Text on darker surface
            ('muted', 'surface', 3.0),     # Secondary text
            ('primary', 'surface', 4.5),   # Interactive elements
        ]

        # Simplified contrast calculation (would use proper library in production)
        for text_key, bg_key, required_ratio in contrast_checks:
            text_token = schema_colors[text_key]
            bg_token = schema_colors[bg_key]

            # Approximate contrast ratio calculation
            # In production, use proper WCAG contrast calculation
            contrast = self._calculate_contrast(text_token, bg_token)

            if contrast >= required_ratio:
                results['valid_contrast_ratios'].append({
                    'combination': f'{text_key}_on_{bg_key}',
                    'ratio': contrast
                })
            else:
                results['poor_contrast_ratios'].append({
                    'combination': f'{text_key}_on_{bg_key}',
                    'ratio': contrast,
                    'required': required_ratio
                })

        # Calculate overall score
        total_checks = len(contrast_checks)
        valid_checks = len(results['valid_contrast_ratios'])
        results['overall_score'] = (valid_checks / total_checks) * 100

        return results

    def _calculate_contrast(self, text_token: ColorToken, bg_token: ColorToken) -> float:
        """
        Calculate approximate contrast ratio between two colors
        In production, use proper WCAG contrast calculation library
        """
        # Simplified calculation - use relative luminance difference
        text_luminance = text_token.lightness
        bg_luminance = bg_token.lightness

        lighter = max(text_luminance, bg_luminance)
        darker = min(text_luminance, bg_luminance)

        return (lighter + 0.05) / (darker + 0.05)


# ============================================================================
# EXAMPLE USAGE AND DEMONSTRATION
# ============================================================================

def demo_color_manager():
    """Demonstrate the OKLCH Color Manager capabilities"""
    print("🎨 OKLCH COLOR MANAGER DEMONSTRATION")
    print("=" * 60)

    # Initialize manager
    manager = OKLCHColorManager()

    # Test color retrieval
    print("\n🔍 COLOR RETRIEVAL TESTS:")
    print(f"Primary color (Temperature): {manager.get_color('primary').to_oklch_string()}")
    print(f"Success color (GitHub): {manager.get_color('success', ColorSchema.GITHUB).to_oklch_string()}")
    print(f"Card background: {manager.get_color('card_bg').to_oklch_string()}")
    print(f"Semantic 'excellent': {manager.get_semantic_color('excellent').to_oklch_string()}")

    # Test CSS generation
    print("\n📄 CSS VARIABLES GENERATION:")
    css_vars = manager.generate_css_variables()
    print(f"Generated {len(css_vars.split())} characters of CSS variables")

    # Test accessibility validation
    print("\n✅ ACCESSIBILITY VALIDATION:")
    accessibility = manager.validate_accessibility()
    print(f"Overall score: {accessibility['overall_score']:.1f}%")
    print(f"Valid contrast ratios: {len(accessibility['valid_contrast_ratios'])}")
    print(f"Poor contrast ratios: {len(accessibility['poor_contrast_ratios'])}")

    # Export schema
    print("\n💾 SCHEMA EXPORT:")
    exported = manager.export_schema(ColorSchema.TEMPERATURE)
    print(f"Exported '{exported['name']}' schema with {len(exported['colors'])} colors")

    print("\n🎉 DEMONSTRATION COMPLETE!")
    return manager


if __name__ == "__main__":
    # Run demonstration
    demo_color_manager()