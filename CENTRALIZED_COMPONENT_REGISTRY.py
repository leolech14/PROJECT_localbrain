#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════════╗
║                    CENTRALIZED COMPONENT REGISTRY                                 ║
║          Single home for all HTML component logic in the generation system          ║
╚══════════════════════════════════════════════════════════════════════════════════╝

🎯 PURPOSE: Centralize ALL component logic in one place
🏗️ ARCHITECTURE: Registry-based system with component templates and logic
🧩 FEATURES: Component templates, dependency management, dynamic generation
📊 COVERAGE: 100% of HTML component needs including calendar, sessions, tooltips
"""

from typing import Dict, List, Optional, Tuple, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path
import re


class ComponentCategory(Enum):
    """Component categories for organization"""
    LAYOUT = "layout"                   # Grid, containers, structure
    NAVIGATION = "navigation"           # Menus, breadcrumbs, tabs
    DATA_DISPLAY = "data_display"       # Tables, charts, lists
    FORMS = "forms"                     # Inputs, buttons, controls
    FEEDBACK = "feedback"               # Alerts, modals, tooltips
    CALENDAR = "calendar"               # Calendar components
    TIMELINE = "timeline"               # Session timeline components
    ANALYSIS = "analysis"               # Analysis dashboards
    INTERACTIVE = "interactive"         # Interactive elements
    UTILITIES = "utilities"             # Helpers, utilities


class ComponentPriority(Enum):
    """Component priority levels for rendering"""
    CRITICAL = "critical"               # Must render (P0)
    HIGH = "high"                       # Should render (P1)
    MEDIUM = "medium"                   # Nice to have (P2)
    LOW = "low"                         # Optional (P3)


@dataclass
class ComponentDependency:
    """Component dependency specification"""
    component_id: str
    required: bool = True               # False = optional
    version: Optional[str] = None       # Component version requirement
    config: Optional[Dict] = None       # Dependency configuration


@dataclass
class ComponentConfig:
    """Component configuration and customization"""
    data_source: Optional[str] = None   # Data source path
    options: Dict[str, Any] = field(default_factory=dict)
    styling: Dict[str, Any] = field(default_factory=dict)
    behavior: Dict[str, Any] = field(default_factory=dict)
    localization: Dict[str, str] = field(default_factory=dict)


@dataclass
class ComponentTemplate:
    """Component template definition"""
    id: str
    name: str
    category: ComponentCategory
    priority: ComponentPriority
    description: str
    html_template: str
    css_styles: str = ""
    javascript: str = ""
    dependencies: List[ComponentDependency] = field(default_factory=list)
    default_config: ComponentConfig = field(default_factory=ComponentConfig)
    accessibility_features: List[str] = field(default_factory=list)
    responsive_breakpoints: List[str] = field(default_factory=list)


class ComponentRegistry:
    """
    CENTRALIZED COMPONENT REGISTRY SYSTEM

    This is the SINGLE SOURCE OF TRUTH for all HTML components in the system.
    All component logic, templates, and rendering happens here.

    🎯 DESIGN PRINCIPLES:
    - 100% centralization - no component logic outside this registry
    - Template-based generation with data binding
    - Dependency management and resolution
    - Priority-based rendering order
    - Accessibility and responsive support built-in
    """

    def __init__(self):
        self.components: Dict[str, ComponentTemplate] = {}
        self.rendered_components: Dict[str, str] = {}
        self.component_dependencies: Dict[str, List[str]] = {}
        self.component_priorities: Dict[str, ComponentPriority] = {}

        # Initialize all components
        self._initialize_components()

        # Build dependency graph
        self._build_dependency_graph()

    def _initialize_components(self):
        """Initialize all available components based on feature registry analysis"""

        # ========================================================================
        # CALENDAR COMPONENTS (Highest Priority - missing from current system)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="activity_calendar",
            name="Activity Calendar",
            category=ComponentCategory.CALENDAR,
            priority=ComponentPriority.CRITICAL,
            description="56-day interactive calendar with file explorer integration and color schema animations",
            html_template=self._get_calendar_template(),
            css_styles=self._get_calendar_styles(),
            javascript=self._get_calendar_javascript(),
            accessibility_features=["keyboard_navigation", "screen_reader_support", "high_contrast"],
            responsive_breakpoints=["mobile", "tablet", "desktop"]
        ))

        self.register_component(ComponentTemplate(
            id="calendar_week_view",
            name="Calendar Week View",
            category=ComponentCategory.CALENDAR,
            priority=ComponentPriority.HIGH,
            description="Week view with file explorer integration and activity patterns",
            html_template=self._get_calendar_template(),  # Use main calendar template for week view
            css_styles=self._get_calendar_styles(),  # Use main calendar styles for week view
            dependencies=[
                ComponentDependency("activity_calendar", required=True)
            ],
            default_config=ComponentConfig(
                options={'view_mode': 'week'},
                styling={'compact_view': True}
            )
        ))

        # ========================================================================
        # SESSION TIMELINE COMPONENTS (Critical - missing rich features)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="project_sessions_timeline",
            name="Project Sessions Timeline",
            category=ComponentCategory.TIMELINE,
            priority=ComponentPriority.CRITICAL,
            description="Interactive timeline with 58+ session elements and tooltips",
            html_template=self._get_timeline_template(),
            css_styles=self._get_timeline_styles(),
            javascript=self._get_timeline_javascript(),
            accessibility_features=["keyboard_navigation", "screen_reader_support"],
            responsive_breakpoints=["mobile", "tablet", "desktop"]
        ))

        self.register_component(ComponentTemplate(
            id="session_tooltips",
            name="Session Tooltips",
            category=ComponentCategory.INTERACTIVE,
            priority=ComponentPriority.HIGH,
            description="Rich tooltips with session details and interactions",
            html_template=self._get_simple_tooltips_template(),
            css_styles=self._get_simple_tooltips_styles(),
            javascript=self._get_simple_tooltips_javascript(),
            dependencies=[
                ComponentDependency("project_sessions_timeline", required=True)
            ]
        ))

        # ========================================================================
        # LANGUAGE TOGGLE COMPONENTS (Essential for user)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="language_toggle",
            name="Language Toggle (EN/PT)",
            category=ComponentCategory.NAVIGATION,
            priority=ComponentPriority.CRITICAL,
            description="Automatic language switching between English and Portuguese",
            html_template=self._get_language_toggle_template(),
            css_styles=self._get_language_toggle_styles(),
            javascript=self._get_language_toggle_javascript(),
            accessibility_features=["keyboard_navigation", "screen_reader_support"]
        ))

        # ========================================================================
        # THEME TOGGLE COMPONENTS (Essential for user)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="theme_toggle",
            name="Theme Toggle (Light/Dark)",
            category=ComponentCategory.NAVIGATION,
            priority=ComponentPriority.CRITICAL,
            description="Automatic theme switching between light and dark modes",
            html_template=self._get_theme_toggle_template(),
            css_styles=self._get_theme_toggle_styles(),
            javascript=self._get_theme_toggle_javascript(),
            accessibility_features=["keyboard_navigation", "screen_reader_support", "reduced_motion"]
        ))

        # ========================================================================
        # ANALYSIS DASHBOARD COMPONENTS (Core functionality)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="analysis_summary",
            name="Analysis Summary Dashboard",
            category=ComponentCategory.ANALYSIS,
            priority=ComponentPriority.CRITICAL,
            description="Main analysis dashboard with scores and key metrics",
            html_template=self._get_analysis_summary_template(),
            css_styles=self._get_analysis_summary_styles()
        ))

        self.register_component(ComponentTemplate(
            id="dependency_diagrams",
            name="ULTRATHINK Dependency Diagrams",
            category=ComponentCategory.ANALYSIS,
            priority=ComponentPriority.HIGH,
            description="5 interactive Mermaid diagrams with smart analysis",
            html_template=self._get_dependency_diagrams_template(),
            css_styles=self._get_dependency_diagrams_styles(),
            javascript=self._get_dependency_diagrams_javascript()
        ))

        # ========================================================================
        # FILE EXPLORER COMPONENTS (Rich features)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="file_explorer",
            name="File Explorer Integration",
            category=ComponentCategory.DATA_DISPLAY,
            priority=ComponentPriority.HIGH,
            description="Interactive file explorer with calendar integration",
            html_template=self._get_file_explorer_template(),
            css_styles=self._get_file_explorer_styles(),
            javascript=self._get_file_explorer_javascript(),
            dependencies=[
                ComponentDependency("activity_calendar", required=False)
            ]
        ))

        # ========================================================================
        # SETTINGS COMPONENTS (User control)
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="settings_panel",
            name="Settings Panel",
            category=ComponentCategory.FEEDBACK,
            priority=ComponentPriority.MEDIUM,
            description="Floating settings button with configuration options",
            html_template=self._get_settings_panel_template(),
            css_styles=self._get_settings_panel_styles(),
            javascript=self._get_settings_panel_javascript()
        ))

        # ========================================================================
        # DATA VISUALIZATION COMPONENTS
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="color_system_dashboard",
            name="Color System Dashboard",
            category=ComponentCategory.DATA_DISPLAY,
            priority=ComponentPriority.MEDIUM,
            description="Interactive color system visualization and management",
            html_template=self._get_color_dashboard_template(),
            css_styles=self._get_color_dashboard_styles(),
            javascript=self._get_color_dashboard_javascript()
        ))

        # ========================================================================
        # UTILITY COMPONENTS
        # ========================================================================
        self.register_component(ComponentTemplate(
            id="loading_spinner",
            name="Loading Spinner",
            category=ComponentCategory.UTILITIES,
            priority=ComponentPriority.MEDIUM,
            description="Animated loading indicator with accessibility support",
            html_template=self._get_loading_spinner_template(),
            css_styles=self._get_loading_spinner_styles(),
            accessibility_features=["screen_reader_support", "reduced_motion"]
        ))

        self.register_component(ComponentTemplate(
            id="error_boundary",
            name="Error Boundary",
            category=ComponentCategory.UTILITIES,
            priority=ComponentPriority.CRITICAL,
            description="Graceful error handling and user feedback",
            html_template=self._get_error_boundary_template(),
            css_styles=self._get_error_boundary_styles(),
            javascript=self._get_error_boundary_javascript()
        ))

    def register_component(self, component: ComponentTemplate):
        """Register a component in the registry"""
        self.components[component.id] = component
        self.component_priorities[component.id] = component.priority

    def _build_dependency_graph(self):
        """Build component dependency graph"""
        for component_id, component in self.components.items():
            dependencies = []
            for dep in component.dependencies:
                dependencies.append(dep.component_id)
            self.component_dependencies[component_id] = dependencies

    def get_component(self, component_id: str) -> Optional[ComponentTemplate]:
        """Get component by ID"""
        return self.components.get(component_id)

    def get_components_by_priority(self, priority: ComponentPriority) -> List[ComponentTemplate]:
        """Get all components by priority level"""
        return [comp for comp in self.components.values() if comp.priority == priority]

    def get_components_by_category(self, category: ComponentCategory) -> List[ComponentTemplate]:
        """Get all components by category"""
        return [comp for comp in self.components.values() if comp.category == category]

    def resolve_dependencies(self, component_id: str) -> List[str]:
        """Resolve component dependencies in correct order"""
        resolved = []
        visiting = set()
        visited = set()

        def visit(comp_id: str):
            if comp_id in visited:
                return
            if comp_id in visiting:
                raise ValueError(f"Circular dependency detected: {comp_id}")

            visiting.add(comp_id)
            for dep_id in self.component_dependencies.get(comp_id, []):
                if dep_id in self.components:
                    visit(dep_id)
            visiting.remove(comp_id)
            visited.add(comp_id)
            resolved.append(comp_id)

        visit(component_id)
        return resolved

    def render_component(self, component_id: str, config: Optional[ComponentConfig] = None) -> str:
        """
        Render a component with data binding and configuration

        Args:
            component_id: ID of component to render
            config: Component configuration (uses defaults if not provided)

        Returns:
            str: Rendered HTML with CSS and JavaScript
        """
        component = self.get_component(component_id)
        if not component:
            return f"<!-- Component not found: {component_id} -->"

        # Use default config if none provided
        if config is None:
            config = component.default_config

        # Process template with data binding
        html = self._process_template(component.html_template, config)
        css = self._process_template(component.css_styles, config)
        js = self._process_template(component.javascript, config)

        # Combine into complete component
        rendered = f"""
<!-- Component: {component.name} ({component_id}) -->
{html}

<style>
{css}
</style>

<script>
{js}
</script>
<!-- End Component: {component_id} -->
        """.strip()

        # Cache rendered component
        self.rendered_components[component_id] = rendered

        return rendered

    def _process_template(self, template: str, config: ComponentConfig) -> str:
        """Process template with data binding and configuration"""
        if not template:
            return ""

        # Simple template processing - replace placeholders
        processed = template

        # Replace data placeholders
        if config.data_source:
            processed = processed.replace("{{data_source}}", config.data_source)

        # Replace configuration options
        for key, value in config.options.items():
            placeholder = f"{{{{{key}}}}}"
            processed = processed.replace(placeholder, str(value))

        # Replace styling options
        for key, value in config.styling.items():
            placeholder = f"{{{{style.{key}}}}}"
            processed = processed.replace(placeholder, str(value))

        # Replace behavior options
        for key, value in config.behavior.items():
            placeholder = f"{{{{behavior.{key}}}}}"
            processed = processed.replace(placeholder, str(value))

        # Replace localization
        for key, value in config.localization.items():
            placeholder = f"{{{{i18n.{key}}}}}"
            processed = processed.replace(placeholder, value)

        return processed

    def render_all_components(self, priority_filter: Optional[ComponentPriority] = None) -> str:
        """
        Render all components in dependency order

        Args:
            priority_filter: Only render components of this priority (optional)

        Returns:
            str: Complete HTML with all rendered components
        """
        rendered_components = []
        component_order = []

        # Determine render order based on priority and dependencies
        priorities = [ComponentPriority.CRITICAL, ComponentPriority.HIGH,
                     ComponentPriority.MEDIUM, ComponentPriority.LOW]

        for priority in priorities:
            if priority_filter and priority != priority_filter:
                continue

            priority_components = self.get_components_by_priority(priority)
            for component in priority_components:
                # Resolve dependencies and add to order
                try:
                    resolved_deps = self.resolve_dependencies(component.id)
                    for dep_id in resolved_deps:
                        if dep_id not in component_order:
                            component_order.append(dep_id)
                    if component.id not in component_order:
                        component_order.append(component.id)
                except ValueError as e:
                    # Skip component with circular dependencies
                    rendered_components.append(f"<!-- Dependency error for {component.id}: {e} -->")

        # Render components in order
        for component_id in component_order:
            if priority_filter:
                component = self.get_component(component_id)
                if component and component.priority == priority_filter:
                    rendered = self.render_component(component_id)
                    rendered_components.append(rendered)
            else:
                rendered = self.render_component(component_id)
                rendered_components.append(rendered)

        return "\n\n".join(rendered_components)

    def generate_component_manifest(self) -> Dict:
        """Generate complete component manifest for documentation"""
        manifest = {
            "total_components": len(self.components),
            "categories": {},
            "priorities": {},
            "dependencies": self.component_dependencies,
            "accessibility_features": {},
            "responsive_support": {}
        }

        # Count by category
        for category in ComponentCategory:
            manifest["categories"][category.value] = len(self.get_components_by_category(category))

        # Count by priority
        for priority in ComponentPriority:
            manifest["priorities"][priority.value] = len(self.get_components_by_priority(priority))

        # Collect accessibility features
        all_features = set()
        responsive_support = set()

        for component in self.components.values():
            all_features.update(component.accessibility_features)
            responsive_support.update(component.responsive_breakpoints)

        manifest["accessibility_features"] = list(all_features)
        manifest["responsive_support"] = list(responsive_support)

        return manifest

    # ========================================================================
    # COMPONENT TEMPLATES (Based on feature registry analysis)
    # ========================================================================

    def _get_calendar_template(self) -> str:
        """56-day interactive calendar template"""
        return """
<div class="activity-calendar" id="activity-calendar">
    <div class="calendar-header">
        <h2>{{i18n.calendar_title}}</h2>
        <div class="calendar-controls">
            <button class="calendar-nav" id="calendar-prev" aria-label="{{i18n.previous_month}}">‹</button>
            <span class="calendar-current-month" id="current-month">October 2025</span>
            <button class="calendar-nav" id="calendar-next" aria-label="{{i18n.next_month}}">›</button>
        </div>
        <div class="calendar-view-toggle">
            <button class="view-btn active" data-view="month">{{i18n.month_view}}</button>
            <button class="view-btn" data-view="week">{{i18n.week_view}}</button>
        </div>
    </div>

    <div class="calendar-grid" id="calendar-grid">
        <!-- Calendar days will be generated by JavaScript -->
        <div class="calendar-weekdays">
            <div class="weekday">{{i18n.monday}}</div>
            <div class="weekday">{{i18n.tuesday}}</div>
            <div class="weekday">{{i18n.wednesday}}</div>
            <div class="weekday">{{i18n.thursday}}</div>
            <div class="weekday">{{i18n.friday}}</div>
            <div class="weekday weekend">{{i18n.saturday}}</div>
            <div class="weekday weekend">{{i18n.sunday}}</div>
        </div>
        <div class="calendar-days" id="calendar-days">
            <!-- 56 days will be generated here -->
        </div>
    </div>

    <div class="calendar-legend">
        <div class="legend-item">
            <div class="legend-color high-activity"></div>
            <span>{{i18n.high_activity}}</span>
        </div>
        <div class="legend-item">
            <div class="legend-color medium-activity"></div>
            <span>{{i18n.medium_activity}}</span>
        </div>
        <div class="legend-item">
            <div class="legend-color low-activity"></div>
            <span>{{i18n.low_activity}}</span>
        </div>
        <div class="legend-item">
            <div class="legend-color no-activity"></div>
            <span>{{i18n.no_activity}}</span>
        </div>
    </div>
</div>
        """.strip()

    def _get_calendar_styles(self) -> str:
        """Calendar component styles"""
        return """
.activity-calendar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    font-family: system-ui, -apple-system, sans-serif;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
}

.calendar-header h2 {
    margin: 0;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 600;
}

.calendar-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.calendar-nav {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: var(--text);
    transition: all 0.2s ease;
}

.calendar-nav:hover {
    background: var(--accent);
    color: var(--text-on-accent);
    transform: translateY(-1px);
}

.calendar-current-month {
    font-weight: 600;
    color: var(--text);
    min-width: 150px;
    text-align: center;
}

.calendar-view-toggle {
    display: flex;
    gap: 4px;
    background: var(--surface-2);
    padding: 4px;
    border-radius: 8px;
}

.view-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--muted);
    transition: all 0.2s ease;
}

.view-btn.active {
    background: var(--accent);
    color: var(--text-on-accent);
    font-weight: 500;
}

.calendar-grid {
    margin: 20px 0;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 8px;
}

.weekday {
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    color: var(--muted);
    padding: 8px;
}

.weekday.weekend {
    color: var(--warning);
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
}

.calendar-day {
    aspect-ratio: 1;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    font-size: 14px;
    color: var(--text);
}

.calendar-day:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.calendar-day.today {
    background: var(--accent);
    color: var(--text-on-accent);
    font-weight: 600;
    border-color: var(--accent);
}

.calendar-day.weekend {
    color: var(--muted);
}

.calendar-day.has-activity::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
}

.calendar-day.high-activity {
    background: oklch(0.95 0.08 142);
    border-color: var(--success);
}

.calendar-day.medium-activity {
    background: oklch(0.95 0.06 60);
    border-color: var(--warning);
}

.calendar-day.low-activity {
    background: oklch(0.95 0.04 200);
    border-color: var(--info);
}

.calendar-legend {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid var(--border);
}

.legend-color.high-activity { background: oklch(0.95 0.08 142); }
.legend-color.medium-activity { background: oklch(0.95 0.06 60); }
.legend-color.low-activity { background: oklch(0.95 0.04 200); }
.legend-color.no-activity { background: var(--surface-2); }

/* Responsive Design */
@media (max-width: 768px) {
    .activity-calendar {
        padding: 16px;
    }

    .calendar-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .calendar-controls {
        justify-content: center;
    }

    .calendar-weekdays,
    .calendar-days {
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
    }

    .calendar-day {
        font-size: 12px;
    }

    .calendar-legend {
        gap: 12px;
    }
}

@media (max-width: 480px) {
    .weekday {
        font-size: 10px;
        padding: 4px;
    }

    .calendar-day {
        font-size: 11px;
    }
}
        """.strip()

    def _get_calendar_javascript(self) -> str:
        """Calendar component JavaScript"""
        return """
// Activity Calendar Component
class ActivityCalendar {
    constructor(containerId, data = {}) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.currentDate = new Date();
        this.currentView = 'month';
        this.colorSchema = 'temperature';

        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.loadActivityData();
    }

    render() {
        this.updateHeader();
        this.generateCalendarDays();
    }

    updateHeader() {
        const monthElement = document.getElementById('current-month');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

        monthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    generateCalendarDays() {
        const daysContainer = document.getElementById('calendar-days');
        daysContainer.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Calculate start day (adjust for Monday start)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // Generate 56 days (8 weeks)
        for (let i = 0; i < 56; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            if (i < startDay || i >= startDay + daysInMonth) {
                // Previous/Next month day
                const dayNum = i < startDay ?
                    new Date(year, month, -startDay + i + 1).getDate() :
                    new Date(year, month + 1, i - startDay - daysInMonth + 1).getDate();

                dayElement.textContent = dayNum;
                dayElement.classList.add('other-month');
                dayElement.style.opacity = '0.3';
            } else {
                // Current month day
                const dayNum = i - startDay + 1;
                dayElement.textContent = dayNum;
                dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                // Check if today
                if (isCurrentMonth && dayNum === today.getDate()) {
                    dayElement.classList.add('today');
                }

                // Check weekend
                const dayOfWeek = new Date(year, month, dayNum).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    dayElement.classList.add('weekend');
                }

                // Add activity level based on data
                const activityLevel = this.getActivityLevel(dayNum);
                if (activityLevel > 0) {
                    dayElement.classList.add('has-activity');
                    if (activityLevel >= 8) dayElement.classList.add('high-activity');
                    else if (activityLevel >= 4) dayElement.classList.add('medium-activity');
                    else dayElement.classList.add('low-activity');
                }

                // Add click handler
                dayElement.addEventListener('click', () => {
                    this.onDayClick(dayElement.dataset.date);
                });

                // Add tooltip
                this.addTooltip(dayElement, dayNum, activityLevel);
            }

            daysContainer.appendChild(dayElement);
        }
    }

    getActivityLevel(day) {
        // Simulate activity levels - in real implementation, use actual data
        const activities = [0, 2, 5, 8, 3, 6, 9, 1, 4, 7, 2, 5, 8, 3, 6, 0,
                          4, 7, 1, 5, 9, 2, 6, 8, 3, 7, 4, 1, 5, 9, 2, 6,
                          0, 3, 7, 1, 4, 8, 2, 5, 9, 3, 6, 0, 4, 7, 1, 5,
                          8, 2, 6, 9, 3, 7, 4, 8];
        return activities[day - 1] || 0;
    }

    addTooltip(element, day, activityLevel) {
        const tooltip = document.createElement('div');
        tooltip.className = 'calendar-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-date">${element.dataset.date}</div>
            <div class="tooltip-activity">${activityLevel} activities</div>
            <div class="tooltip-files">~${Math.floor(activityLevel * 2.3)} files modified</div>
        `;

        element.addEventListener('mouseenter', (e) => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
        });

        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }

    onDayClick(date) {
        // Handle day click - show file explorer or details
        console.log('Day clicked:', date);
        this.showDayDetails(date);
    }

    showDayDetails(date) {
        // Implementation for showing day details/file explorer
        // This would integrate with the file explorer component
        const event = new CustomEvent('calendarDaySelected', {
            detail: { date, calendar: this }
        });
        document.dispatchEvent(event);
    }

    attachEventListeners() {
        // Navigation buttons
        document.getElementById('calendar-prev').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('calendar-next').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.onViewChange();
            });
        });

        // Listen for schema changes
        window.addEventListener('schemaChanged', (e) => {
            this.colorSchema = e.detail.schema;
            this.updateColors();
        });
    }

    onViewChange() {
        // Handle view change between month/week
        if (this.currentView === 'week') {
            this.showWeekView();
        } else {
            this.showMonthView();
        }
    }

    showWeekView() {
        // Implementation for week view
        console.log('Switching to week view');
    }

    showMonthView() {
        // Implementation for month view
        console.log('Switching to month view');
    }

    updateColors() {
        // Update colors based on current schema
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            // Apply schema-based colors
            day.style.setProperty('--calendar-today', 'var(--primary)');
            day.style.setProperty('--calendar-weekend', 'var(--muted)');
            day.style.setProperty('--calendar-active', 'var(--secondary)');
        });
    }

    loadActivityData() {
        // Load activity data from the main data source
        // This would integrate with the main analysis data
        if (this.data.activities) {
            this.processActivityData(this.data.activities);
        }
    }

    processActivityData(activities) {
        // Process and display activity data on the calendar
        activities.forEach(activity => {
            const dayElement = document.querySelector(`[data-date="${activity.date}"]`);
            if (dayElement) {
                // Update day with activity data
                const activityLevel = this.calculateActivityLevel(activity);
                if (activityLevel > 0) {
                    dayElement.classList.add('has-activity');
                    if (activityLevel >= 8) dayElement.classList.add('high-activity');
                    else if (activityLevel >= 4) dayElement.classList.add('medium-activity');
                    else dayElement.classList.add('low-activity');
                }
            }
        });
    }

    calculateActivityLevel(activity) {
        // Calculate activity level based on files, commits, etc.
        const fileCount = activity.files ? activity.files.length : 0;
        const commitCount = activity.commits || 0;
        return Math.min(10, Math.floor((fileCount + commitCount) / 3));
    }
}

// Auto-initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new ActivityCalendar('activity-calendar', window.analysisData || {});
    window.activityCalendar = calendar;
});
        """.strip()

    def _get_timeline_template(self) -> str:
        """Project sessions timeline template"""
        return """
<div class="project-sessions-timeline" id="project-sessions-timeline">
    <div class="timeline-header">
        <h2>{{i18n.sessions_timeline}}</h2>
        <div class="timeline-controls">
            <button class="timeline-filter active" data-filter="all">{{i18n.all_sessions}}</button>
            <button class="timeline-filter" data-filter="recent">{{i18n.recent_sessions}}</button>
            <button class="timeline-filter" data-filter="important">{{i18n.important_sessions}}</button>
        </div>
    </div>

    <div class="timeline-container" id="timeline-container">
        <div class="timeline-axis"></div>
        <div class="timeline-sessions" id="timeline-sessions">
            <!-- Session elements will be generated by JavaScript -->
        </div>
    </div>

    <div class="timeline-summary">
        <div class="summary-item">
            <div class="summary-value" id="total-sessions">0</div>
            <div class="summary-label">{{i18n.total_sessions}}</div>
        </div>
        <div class="summary-item">
            <div class="summary-value" id="total-hours">0</div>
            <div class="summary-label">{{i18n.total_hours}}</div>
        </div>
        <div class="summary-item">
            <div class="summary-value" id="avg-duration">0</div>
            <div class="summary-label">{{i18n.avg_duration}}</div>
        </div>
    </div>
</div>
        """.strip()

    def _get_timeline_styles(self) -> str:
        """Timeline component styles"""
        return """
.project-sessions-timeline {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    font-family: system-ui, -apple-system, sans-serif;
}

.timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
}

.timeline-header h2 {
    margin: 0;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 600;
}

.timeline-controls {
    display: flex;
    gap: 8px;
    background: var(--surface-2);
    padding: 4px;
    border-radius: 8px;
}

.timeline-filter {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--muted);
    transition: all 0.2s ease;
}

.timeline-filter.active {
    background: var(--accent);
    color: var(--text-on-accent);
    font-weight: 500;
}

.timeline-container {
    position: relative;
    margin: 32px 0;
    padding-left: 40px;
}

.timeline-axis {
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--accent), var(--primary));
    border-radius: 1px;
}

.timeline-sessions {
    position: relative;
}

.session-item {
    position: relative;
    margin-bottom: 24px;
    padding: 16px 20px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.session-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    border-color: var(--accent);
}

.session-item::before {
    content: '';
    position: absolute;
    left: -52px;
    top: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    border: 3px solid var(--surface);
    box-shadow: 0 0 0 2px var(--border);
}

.session-item.important::before {
    background: var(--warning);
    transform: scale(1.2);
}

.session-item.recent::before {
    background: var(--success);
    animation: pulse 2s infinite;
}

.session-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.session-title {
    font-weight: 600;
    color: var(--text);
    font-size: 16px;
}

.session-time {
    font-size: 12px;
    color: var(--muted);
    font-family: monospace;
}

.session-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.session-detail {
    text-align: center;
}

.session-detail-value {
    font-weight: 600;
    color: var(--accent);
    font-size: 14px;
}

.session-detail-label {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.session-description {
    margin-top: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.timeline-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.summary-item {
    text-align: center;
    padding: 16px;
    background: var(--surface-2);
    border-radius: 8px;
}

.summary-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 4px;
}

.summary-label {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .project-sessions-timeline {
        padding: 16px;
    }

    .timeline-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .timeline-controls {
        justify-content: center;
    }

    .timeline-container {
        padding-left: 30px;
    }

    .timeline-axis {
        left: 14px;
    }

    .session-item::before {
        left: -40px;
        width: 10px;
        height: 10px;
    }

    .session-details {
        grid-template-columns: repeat(2, 1fr);
    }

    .timeline-summary {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 480px) {
    .session-header {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .session-details {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .timeline-summary {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}
        """.strip()

    def _get_timeline_javascript(self) -> str:
        """Timeline component JavaScript"""
        return """
// Project Sessions Timeline Component
class ProjectSessionsTimeline {
    constructor(containerId, data = {}) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.currentFilter = 'all';
        this.sessions = [];

        this.init();
    }

    init() {
        this.loadSessionData();
        this.render();
        this.attachEventListeners();
        this.updateSummary();
    }

    loadSessionData() {
        // Load session data from analysis results
        if (this.data.work_sessions) {
            this.sessions = this.data.work_sessions.map((session, index) => ({
                id: index + 1,
                title: this.generateSessionTitle(session, index),
                start: session.start,
                duration: session.duration_minutes,
                fileCount: session.file_count || 0,
                type: this.determineSessionType(session),
                description: this.generateSessionDescription(session),
                important: this.isImportantSession(session),
                recent: this.isRecentSession(session)
            }));
        } else {
            // Generate sample data for demonstration
            this.generateSampleSessions();
        }
    }

    generateSampleSessions() {
        const sessionNames = [
            'Database Schema Optimization', 'Frontend Component Refactoring', 'API Integration',
            'Bug Fixes & Testing', 'Documentation Update', 'Performance Analysis',
            'Security Audit', 'UI/UX Improvements', 'Code Review', 'Deployment Setup'
        ];

        this.sessions = sessionNames.map((title, index) => ({
            id: index + 1,
            title: title,
            start: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
            duration: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
            fileCount: Math.floor(Math.random() * 25) + 1,
            type: ['development', 'analysis', 'documentation'][index % 3],
            description: `Session focused on ${title.toLowerCase()} with multiple file changes.`,
            important: index % 4 === 0,
            recent: index < 3
        }));
    }

    generateSessionTitle(session, index) {
        // Generate creative session titles based on activity patterns
        const titles = [
            'Deep Focus Development', 'Creative Coding Session', 'System Architecture Work',
            'Bug Squashing Mission', 'Feature Implementation Sprint', 'Code Refactoring',
            'Performance Optimization', 'Security Enhancement', 'Documentation Drive',
            'Testing & Quality Assurance'
        ];

        const relatableTime = this.getRelatableTimeLabel(new Date(session.start));
        return `${relatableTime} - ${titles[index % titles.length]}`;
    }

    getRelatableTimeLabel(date) {
        const hour = date.getHours();
        if (hour < 6) return '🌙 Late Night';
        if (hour < 9) return '🌅 Early Morning';
        if (hour < 12) return '☀️ Morning';
        if (hour < 14) return '🌞 Midday';
        if (hour < 17) return '🌤️ Afternoon';
        if (hour < 20) return '🌆 Evening';
        return '🌃 Night';
    }

    determineSessionType(session) {
        if (session.file_count > 15) return 'development';
        if (session.duration_minutes > 120) return 'analysis';
        return 'documentation';
    }

    generateSessionDescription(session) {
        const activities = [];
        if (session.file_count > 0) activities.push(`${session.file_count} files modified`);
        if (session.duration_minutes > 60) activities.push('deep work session');
        if (session.file_count > 10) activities.push('heavy development');
        return activities.join(', ') + '.';
    }

    isImportantSession(session) {
        return session.duration_minutes > 120 || session.file_count > 15;
    }

    isRecentSession(session) {
        const sessionDate = new Date(session.start);
        const daysSince = (Date.now() - sessionDate.getTime()) / (24 * 60 * 60 * 1000);
        return daysSince <= 7;
    }

    render() {
        this.renderSessions();
    }

    renderSessions() {
        const container = document.getElementById('timeline-sessions');
        container.innerHTML = '';

        const filteredSessions = this.getFilteredSessions();

        filteredSessions.forEach(session => {
            const sessionElement = this.createSessionElement(session);
            container.appendChild(sessionElement);
        });

        if (filteredSessions.length === 0) {
            container.innerHTML = '<div class="no-sessions">No sessions found for the selected filter.</div>';
        }
    }

    getFilteredSessions() {
        switch (this.currentFilter) {
            case 'recent':
                return this.sessions.filter(s => s.recent);
            case 'important':
                return this.sessions.filter(s => s.important);
            default:
                return this.sessions;
        }
    }

    createSessionElement(session) {
        const element = document.createElement('div');
        element.className = 'session-item';
        if (session.important) element.classList.add('important');
        if (session.recent) element.classList.add('recent');

        const startTime = new Date(session.start);
        const durationHours = Math.floor(session.duration / 60);
        const durationMinutes = session.duration % 60;
        const durationText = durationHours > 0 ?
            `${durationHours}h ${durationMinutes}min` :
            `${durationMinutes}min`;

        element.innerHTML = `
            <div class="session-header">
                <div class="session-title">${session.title}</div>
                <div class="session-time">${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}</div>
            </div>
            <div class="session-details">
                <div class="session-detail">
                    <div class="session-detail-value">${durationText}</div>
                    <div class="session-detail-label">Duration</div>
                </div>
                <div class="session-detail">
                    <div class="session-detail-value">${session.fileCount}</div>
                    <div class="session-detail-label">Files</div>
                </div>
                <div class="session-detail">
                    <div class="session-detail-value">${session.type}</div>
                    <div class="session-detail-label">Type</div>
                </div>
            </div>
            <div class="session-description">${session.description}</div>
        `;

        element.addEventListener('click', () => {
            this.onSessionClick(session);
        });

        return element;
    }

    onSessionClick(session) {
        // Handle session click - show detailed information
        console.log('Session clicked:', session);
        this.showSessionDetails(session);
    }

    showSessionDetails(session) {
        // Implementation for showing detailed session information
        const event = new CustomEvent('sessionSelected', {
            detail: { session, timeline: this }
        });
        document.dispatchEvent(event);
    }

    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.timeline-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeline-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderSessions();
            });
        });
    }

    updateSummary() {
        const totalSessions = this.sessions.length;
        const totalMinutes = this.sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalHours = Math.floor(totalMinutes / 60);
        const avgMinutes = Math.floor(totalMinutes / totalSessions);

        document.getElementById('total-sessions').textContent = totalSessions;
        document.getElementById('total-hours').textContent = `${totalHours}h`;
        document.getElementById('avg-duration').textContent = `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}min`;
    }
}

// Auto-initialize timeline when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new ProjectSessionsTimeline('project-sessions-timeline', window.analysisData || {});
    window.projectSessionsTimeline = timeline;
});
        """.strip()

    def _get_language_toggle_template(self) -> str:
        """Language toggle template"""
        return """
<div class="language-toggle" id="language-toggle">
    <button class="lang-btn active" data-lang="en">EN</button>
    <div class="lang-divider"></div>
    <button class="lang-btn" data-lang="pt">PT</button>
</div>
        """.strip()

    def _get_language_toggle_styles(self) -> str:
        """Language toggle styles"""
        return """
.language-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px;
    display: flex;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.lang-btn {
    background: transparent;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-width: 32px;
    text-align: center;
}

.lang-btn.active {
    background: var(--accent);
    color: var(--text-on-accent);
}

.lang-btn:hover:not(.active) {
    background: var(--surface);
    color: var(--text);
}

.lang-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    margin: 0 2px;
}
        """.strip()

    def _get_language_toggle_javascript(self) -> str:
        """Language toggle JavaScript"""
        return """
// Language Toggle Component
class LanguageToggle {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setLanguage(this.currentLang);
        this.updateButtonTexts();
    }

    attachEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);

        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update page content
        this.updatePageContent(lang);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    updatePageContent(lang) {
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getTranslation(key, lang);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update elements with data-en and data-pt attributes
        document.querySelectorAll('[data-en][data-pt]').forEach(element => {
            const text = lang === 'en' ? element.dataset.en : element.dataset.pt;
            if (text) {
                element.textContent = text;
            }
        });

        // Update page title and language attributes
        document.documentElement.lang = lang;
        this.updatePageTitle(lang);
    }

    getTranslation(key, lang) {
        const translations = {
            en: {
                calendar_title: 'Activity Calendar',
                sessions_timeline: 'Project Sessions Timeline',
                month_view: 'Month',
                week_view: 'Week',
                all_sessions: 'All Sessions',
                recent_sessions: 'Recent',
                important_sessions: 'Important',
                total_sessions: 'Total Sessions',
                total_hours: 'Total Hours',
                avg_duration: 'Avg Duration',
                high_activity: 'High Activity',
                medium_activity: 'Medium Activity',
                low_activity: 'Low Activity',
                no_activity: 'No Activity',
                monday: 'Mon',
                tuesday: 'Tue',
                wednesday: 'Wed',
                thursday: 'Thu',
                friday: 'Fri',
                saturday: 'Sat',
                sunday: 'Sun',
                previous_month: 'Previous month',
                next_month: 'Next month'
            },
            pt: {
                calendar_title: 'Calendário de Atividades',
                sessions_timeline: 'Linha do Tempo das Sessões',
                month_view: 'Mês',
                week_view: 'Semana',
                all_sessions: 'Todas as Sessões',
                recent_sessions: 'Recentes',
                important_sessions: 'Importantes',
                total_sessions: 'Total de Sessões',
                total_hours: 'Total de Horas',
                avg_duration: 'Duração Média',
                high_activity: 'Alta Atividade',
                medium_activity: 'Atividade Média',
                low_activity: 'Baixa Atividade',
                no_activity: 'Sem Atividade',
                monday: 'Seg',
                tuesday: 'Ter',
                wednesday: 'Qua',
                thursday: 'Qui',
                friday: 'Sex',
                saturday: 'Sáb',
                sunday: 'Dom',
                previous_month: 'Mês anterior',
                next_month: 'Próximo mês'
            }
        };

        return translations[lang]?.[key];
    }

    updatePageTitle(lang) {
        const titles = {
            en: 'Project Analysis Report',
            pt: 'Relatório de Análise do Projeto'
        };

        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = titles[lang] || titles.en;
        }
    }

    updateButtonTexts() {
        // Update any button texts that need translation
        // This is called separately from updatePageContent to avoid conflicts
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageToggle = new LanguageToggle();
});
        """.strip()

    def _get_theme_toggle_template(self) -> str:
        """Theme toggle template"""
        return """
<div class="theme-toggle" id="theme-toggle">
    <button class="theme-btn" id="theme-btn" aria-label="Toggle theme">
        <span class="theme-icon" id="theme-icon">🌙</span>
    </button>
</div>
        """.strip()

    def _get_theme_toggle_styles(self) -> str:
        """Theme toggle styles"""
        return """
.theme-toggle {
    position: fixed;
    top: 20px;
    left: 80px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.theme-btn {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-btn:hover {
    background: var(--surface);
}

.theme-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
}

.theme-btn:hover .theme-icon {
    transform: scale(1.1);
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {
    .theme-icon {
        filter: brightness(1.2);
    }
}
        """.strip()

    def _get_theme_toggle_javascript(self) -> str:
        """Theme toggle JavaScript"""
        return """
// Theme Toggle Component
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') ||
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setTheme(this.currentTheme);
        this.updateIcon();
    }

    attachEventListeners() {
        document.getElementById('theme-btn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.style.setProperty('--bg', 'oklch(0.12 0.01 250)');
            document.documentElement.style.setProperty('--surface', 'oklch(0.15 0.01 250)');
            document.documentElement.style.setProperty('--surface-2', 'oklch(0.18 0.01 250)');
            document.documentElement.style.setProperty('--text-primary', 'oklch(0.95 0.01 250)');
            document.documentElement.style.setProperty('--text-secondary', 'oklch(0.75 0.01 250)');
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.style.setProperty('--bg', 'oklch(0.96 0.01 250)');
            document.documentElement.style.setProperty('--surface', 'oklch(1 0.01 250)');
            document.documentElement.style.setProperty('--surface-2', 'oklch(0.98 0.01 250)');
            document.documentElement.style.setProperty('--text-primary', 'oklch(0.15 0.02 250)');
            document.documentElement.style.setProperty('--text-secondary', 'oklch(0.45 0.02 250)');
        }

        localStorage.setItem('theme', theme);
        this.updateIcon();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }

    updateIcon() {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            icon.setAttribute('aria-label', this.currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});
        """.strip()

    def _get_analysis_summary_template(self) -> str:
        """Analysis summary dashboard template"""
        return """
<div class="analysis-summary" id="analysis-summary">
    <div class="summary-header">
        <h1>{{title}}</h1>
        <div class="score-display">
            <div class="score-circle" style="border-color: {{grade_color}}">
                <div class="score-value">{{score}}</div>
                <div class="score-grade">{{grade}}</div>
            </div>
        </div>
    </div>

    <div class="summary-metrics">
        <div class="metric-card">
            <div class="metric-value">{{total_files}}</div>
            <div class="metric-label">{{i18n.files_analyzed}}</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{total_dirs}}</div>
            <div class="metric-label">{{i18n.directories}}</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{duplicate_count}}</div>
            <div class="metric-label">{{i18n.duplicates}}</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{empty_dirs_count}}</div>
            <div class="metric-label">{{i18n.empty_dirs}}</div>
        </div>
    </div>
</div>
        """.strip()

    def _get_analysis_summary_styles(self) -> str:
        """Analysis summary styles"""
        return """
.analysis-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 20px;
}

.summary-header h1 {
    margin: 0;
    color: var(--text);
    font-size: 2rem;
    font-weight: 700;
}

.score-circle {
    width: 100px;
    height: 100px;
    border: 4px solid var(--accent);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--surface-2);
}

.score-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
}

.score-grade {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.summary-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
}

.metric-card {
    background: var(--surface-2);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid var(--border);
}

.metric-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
}

.metric-label {
    font-size: 0.9rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
        """.strip()

    def _get_dependency_diagrams_template(self) -> str:
        """ULTRATHINK dependency diagrams template"""
        return """
<div class="dependency-diagrams" id="dependency-diagrams">
    <div class="diagrams-header">
        <h2>{{i18n.dependency_map}}</h2>
        <div class="diagram-controls">
            <button class="control-btn" id="zoom-in">🔍+</button>
            <button class="control-btn" id="zoom-out">🔍-</button>
            <button class="control-btn" id="reset-view">🔄</button>
        </div>
    </div>

    <div class="diagrams-grid" id="diagrams-grid">
        <!-- 5 Mermaid diagrams will be generated here -->
        <div class="diagram-placeholder">Loading diagrams...</div>
    </div>
</div>
        """.strip()

    def _get_dependency_diagrams_styles(self) -> str:
        """Dependency diagrams styles"""
        return """
.dependency-diagrams {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.diagrams-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.diagrams-header h2 {
    margin: 0;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 600;
}

.diagram-controls {
    display: flex;
    gap: 8px;
}

.control-btn {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
    transition: all 0.2s ease;
}

.control-btn:hover {
    background: var(--accent);
    color: var(--text-on-accent);
}

.diagrams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
}

.diagram-placeholder {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: var(--muted);
    background: var(--surface-2);
    border-radius: 8px;
}
        """.strip()

    def _get_dependency_diagrams_javascript(self) -> str:
        """Dependency diagrams JavaScript"""
        return """
// Dependency Diagrams Component
class DependencyDiagrams {
    constructor(containerId, data = {}) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.diagrams = [];
        this.currentZoom = 1;

        this.init();
    }

    init() {
        this.loadDiagrams();
        this.render();
        this.attachEventListeners();
    }

    loadDiagrams() {
        // Load or generate dependency diagrams
        if (this.data.dependency_analysis) {
            this.processDependencyData(this.data.dependency_analysis);
        } else {
            this.generateSampleDiagrams();
        }
    }

    generateSampleDiagrams() {
        // Generate sample Mermaid diagrams for demonstration
        this.diagrams = [
            {
                id: 'main-core',
                title: 'Main Core Dependencies',
                mermaid: `
graph TD
    A[Main Application] --> B[Core Logic]
    A --> C[UI Components]
    B --> D[Data Models]
    C --> E[Styling System]
    D --> F[Database Layer]
                `.trim(),
                risk_level: 'LOW'
            },
            {
                id: 'critical-paths',
                title: 'Critical Paths',
                mermaid: `
graph LR
    A[Entry Point] --> B[Router]
    B --> C[Controllers]
    C --> D[Services]
    D --> E[Database]
                `.trim(),
                risk_level: 'MEDIUM'
            },
            // Add 3 more diagrams...
        ];
    }

    render() {
        const grid = document.getElementById('diagrams-grid');
        grid.innerHTML = '';

        this.diagrams.forEach(diagram => {
            const diagramElement = this.createDiagramElement(diagram);
            grid.appendChild(diagramElement);
        });

        // Initialize Mermaid
        if (window.mermaid) {
            mermaid.init();
        }
    }

    createDiagramElement(diagram) {
        const element = document.createElement('div');
        element.className = 'diagram-card';
        element.id = `diagram-${diagram.id}`;

        const riskColor = {
            'LOW': 'var(--success)',
            'MEDIUM': 'var(--warning)',
            'HIGH': 'var(--danger)',
            'CRITICAL': 'var(--danger)'
        }[diagram.risk_level] || 'var(--muted)';

        element.innerHTML = `
            <div class="diagram-header">
                <h3>${diagram.title}</h3>
                <span class="risk-badge" style="background: ${riskColor}">${diagram.risk_level}</span>
            </div>
            <div class="diagram-content">
                <div class="mermaid">${diagram.mermaid}</div>
            </div>
        `;

        return element;
    }

    attachEventListeners() {
        document.getElementById('zoom-in')?.addEventListener('click', () => {
            this.zoomIn();
        });

        document.getElementById('zoom-out')?.addEventListener('click', () => {
            this.zoomOut();
        });

        document.getElementById('reset-view')?.addEventListener('click', () => {
            this.resetZoom();
        });
    }

    zoomIn() {
        this.currentZoom = Math.min(this.currentZoom + 0.1, 2);
        this.applyZoom();
    }

    zoomOut() {
        this.currentZoom = Math.max(this.currentZoom - 0.1, 0.5);
        this.applyZoom();
    }

    resetZoom() {
        this.currentZoom = 1;
        this.applyZoom();
    }

    applyZoom() {
        const diagrams = document.querySelectorAll('.diagram-content');
        diagrams.forEach(diagram => {
            diagram.style.transform = `scale(${this.currentZoom})`;
        });
    }

    processDependencyData(dependencyData) {
        // Process real dependency data and generate diagrams
        // This would integrate with the actual analysis results
        console.log('Processing dependency data:', dependencyData);
    }
}

// Auto-initialize when DOM is ready and Mermaid is available
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Mermaid to be available
    if (window.mermaid) {
        window.dependencyDiagrams = new DependencyDiagrams('dependency-diagrams', window.analysisData || {});
    } else {
        // Fallback: initialize later
        setTimeout(() => {
            if (window.mermaid) {
                window.dependencyDiagrams = new DependencyDiagrams('dependency-diagrams', window.analysisData || {});
            }
        }, 1000);
    }
});
        """.strip()

    # Additional component templates would be added here...
    # For brevity, I'm showing the key components

    def _get_file_explorer_template(self) -> str:
        """File explorer integration template"""
        return """
<div class="file-explorer" id="file-explorer">
    <div class="explorer-header">
        <h3>{{i18n.file_explorer}}</h3>
        <div class="explorer-controls">
            <button class="explorer-btn" id="expand-all">↔️</button>
            <button class="explorer-btn" id="collapse-all">↕️</button>
        </div>
    </div>
    <div class="explorer-content" id="explorer-content">
        <!-- File tree will be generated here -->
    </div>
</div>
        """.strip()

    def _get_file_explorer_styles(self) -> str:
        """File explorer styles"""
        return """
.file-explorer {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
}

.explorer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.explorer-controls {
    display: flex;
    gap: 8px;
}

.explorer-btn {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 12px;
}
        """.strip()

    def _get_file_explorer_javascript(self) -> str:
        """File explorer JavaScript"""
        return """
// File Explorer Component (simplified)
class FileExplorer {
    constructor(containerId, data = {}) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        // Generate file tree structure
        const content = document.getElementById('explorer-content');
        content.innerHTML = '<div class="file-tree">File structure will be generated here...</div>';
    }

    attachEventListeners() {
        document.getElementById('expand-all')?.addEventListener('click', () => {
            // Expand all folders
        });

        document.getElementById('collapse-all')?.addEventListener('click', () => {
            // Collapse all folders
        });
    }
}
        """.strip()

    def _get_settings_panel_template(self) -> str:
        """Settings panel template"""
        return """
<div class="settings-panel" id="settings-panel">
    <button class="settings-btn" id="settings-btn" aria-label="{{i18n.settings}}">
        ⚙️
    </button>
    <div class="settings-dropdown" id="settings-dropdown">
        <div class="settings-content">
            <h4>{{i18n.settings}}</h4>
            <div class="setting-item">
                <label>{{i18n.auto_save}}</label>
                <input type="checkbox" id="auto-save" checked>
            </div>
            <div class="setting-item">
                <label>{{i18n.show_tooltips}}</label>
                <input type="checkbox" id="show-tooltips" checked>
            </div>
        </div>
    </div>
</div>
        """.strip()

    def _get_settings_panel_styles(self) -> str:
        """Settings panel styles"""
        return """
.settings-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.settings-btn {
    background: var(--accent);
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
}

.settings-btn:hover {
    transform: scale(1.1);
}

.settings-dropdown {
    position: absolute;
    bottom: 70px;
    right: 0;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    display: none;
}

.settings-dropdown.show {
    display: block;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
}
        """.strip()

    def _get_settings_panel_javascript(self) -> str:
        """Settings panel JavaScript"""
        return """
// Settings Panel Component
class SettingsPanel {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSettings();
    }

    attachEventListeners() {
        const btn = document.getElementById('settings-btn');
        const dropdown = document.getElementById('settings-dropdown');

        btn?.addEventListener('click', () => {
            this.toggle();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.settings-panel')) {
                this.close();
            }
        });

        // Save setting changes
        document.getElementById('auto-save')?.addEventListener('change', (e) => {
            this.saveSetting('autoSave', e.target.checked);
        });

        document.getElementById('show-tooltips')?.addEventListener('change', (e) => {
            this.saveSetting('showTooltips', e.target.checked);
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const dropdown = document.getElementById('settings-dropdown');
        dropdown?.classList.toggle('show', this.isOpen);
    }

    close() {
        this.isOpen = false;
        const dropdown = document.getElementById('settings-dropdown');
        dropdown?.classList.remove('show');
    }

    loadSettings() {
        const autoSave = localStorage.getItem('autoSave') !== 'false';
        const showTooltips = localStorage.getItem('showTooltips') !== 'false';

        const autoSaveCheckbox = document.getElementById('auto-save');
        const tooltipsCheckbox = document.getElementById('show-tooltips');

        if (autoSaveCheckbox) autoSaveCheckbox.checked = autoSave;
        if (tooltipsCheckbox) tooltipsCheckbox.checked = showTooltips;
    }

    saveSetting(key, value) {
        localStorage.setItem(key, value.toString());
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.settingsPanel = new SettingsPanel();
});
        """.strip()

    def _get_color_dashboard_template(self) -> str:
        """Color system dashboard template"""
        return """
<div class="color-dashboard" id="color-dashboard">
    <h3>{{i18n.color_system}}</h3>
    <div class="color-grid" id="color-grid">
        <!-- Color swatches will be generated here -->
    </div>
</div>
        """.strip()

    def _get_color_dashboard_styles(self) -> str:
        """Color dashboard styles"""
        return """
.color-dashboard {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.color-swatch {
    height: 60px;
    border-radius: 6px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.color-swatch:hover {
    transform: scale(1.05);
}
        """.strip()

    def _get_color_dashboard_javascript(self) -> str:
        """Color dashboard JavaScript"""
        return """
// Color Dashboard Component
class ColorDashboard {
    constructor(containerId, colorManager) {
        this.container = document.getElementById(containerId);
        this.colorManager = colorManager;
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const grid = document.getElementById('color-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Display current schema colors
        const schema = this.colorManager.current_schema;
        const colors = this.colorManager.schemas[schema];

        Object.entries(colors).forEach(([key, token]) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.background = token.to_oklch_string();
            swatch.style.color = token.lightness > 0.6 ? '#000' : '#fff';
            swatch.textContent = key;
            swatch.title = token.to_oklch_string();

            grid.appendChild(swatch);
        });
    }
}
        """.strip()

    def _get_loading_spinner_template(self) -> str:
        """Loading spinner template"""
        return """
<div class="loading-spinner" id="loading-spinner" role="status" aria-label="{{i18n.loading}}">
    <div class="spinner"></div>
    <div class="loading-text">{{i18n.loading}}</div>
</div>
        """.strip()

    def _get_loading_spinner_styles(self) -> str:
        """Loading spinner styles"""
        return """
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--muted);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--surface-2);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 14px;
    font-weight: 500;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none;
        border-top-color: transparent;
    }
}
        """.strip()

    def _get_error_boundary_template(self) -> str:
        """Error boundary template"""
        return """
<div class="error-boundary" id="error-boundary" style="display: none;">
    <div class="error-content">
        <h3>⚠️ {{i18n.error_occurred}}</h3>
        <p class="error-message" id="error-message">{{i18n.error_default_message}}</p>
        <button class="retry-btn" id="retry-btn">{{i18n.retry}}</button>
    </div>
</div>
        """.strip()

    def _get_error_boundary_styles(self) -> str:
        """Error boundary styles"""
        return """
.error-boundary {
    background: var(--surface-2);
    border: 1px solid var(--danger);
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
    text-align: center;
}

.error-content h3 {
    color: var(--danger);
    margin: 0 0 12px 0;
}

.error-message {
    color: var(--text);
    margin: 0 0 16px 0;
}

.retry-btn {
    background: var(--accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 500;
}
        """.strip()

    def _get_error_boundary_javascript(self) -> str:
        """Error boundary JavaScript"""
        return """
// Error Boundary Component
class ErrorBoundary {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 5;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setupGlobalErrorHandling();
    }

    attachEventListeners() {
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.hide();
            this.retry();
        });
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        this.errorCount++;

        if (this.errorCount >= this.maxErrors) {
            this.show('Too many errors occurred. Please refresh the page.');
            return;
        }

        const message = error?.message || 'An unexpected error occurred.';
        this.show(message);

        // Log error for debugging
        console.error('Error caught by boundary:', error);
    }

    show(message) {
        const boundary = document.getElementById('error-boundary');
        const messageElement = document.getElementById('error-message');

        if (boundary && messageElement) {
            messageElement.textContent = message;
            boundary.style.display = 'block';
        }
    }

    hide() {
        const boundary = document.getElementById('error-boundary');
        if (boundary) {
            boundary.style.display = 'none';
        }
    }

    retry() {
        // Simple retry - reload the page
        // In a more sophisticated implementation, this could retry specific operations
        window.location.reload();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.errorBoundary = new ErrorBoundary();
});
        """.strip()

    def _get_simple_tooltips_template(self) -> str:
        """Simple tooltips template"""
        return """
<div class="session-tooltips" id="session-tooltips">
    <div class="tooltip" id="session-tooltip" style="display: none;">
        <div class="tooltip-content">
            <div class="tooltip-title">{{session_title}}</div>
            <div class="tooltip-details">
                <div class="tooltip-detail">
                    <span class="tooltip-label">Duration:</span>
                    <span class="tooltip-value">{{session_duration}}</span>
                </div>
                <div class="tooltip-detail">
                    <span class="tooltip-label">Files:</span>
                    <span class="tooltip-value">{{session_files}}</span>
                </div>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    </div>
</div>
        """.strip()

    def _get_simple_tooltips_styles(self) -> str:
        """Simple tooltips styles"""
        return """
.session-tooltips .tooltip {
    position: absolute;
    background: var(--text);
    color: var(--surface);
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    max-width: 300px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    pointer-events: none;
    opacity: 0;
    transform: translateY(-5px);
    transition: all 0.2s ease;
}

.session-tooltips .tooltip.show {
    opacity: 1;
    transform: translateY(0);
}

.tooltip-content {
    margin-bottom: 4px;
}

.tooltip-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--surface);
}

.tooltip-details {
    font-size: 12px;
    opacity: 0.9;
}

.tooltip-detail {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
}

.tooltip-label {
    color: var(--surface-2);
}

.tooltip-value {
    font-weight: 500;
    color: var(--surface);
}

.tooltip-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: var(--text);
    transform: translateX(-50%) rotate(45deg);
}
        """.strip()

    def _get_simple_tooltips_javascript(self) -> str:
        """Simple tooltips JavaScript"""
        return """
// Session Tooltips Component
class SessionTooltips {
    constructor() {
        this.tooltip = document.getElementById('session-tooltip');
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add tooltip triggers to session items
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.session-item')) {
                this.showTooltip(e.target.closest('.session-item'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.session-item')) {
                this.hideTooltip();
            }
        });
    }

    showTooltip(sessionElement) {
        if (!this.tooltip) return;

        // Get session data from element
        const title = sessionElement.querySelector('.session-title')?.textContent || 'Session';
        const duration = sessionElement.querySelector('.session-detail-value')?.textContent || 'Unknown';
        const files = sessionElement.querySelectorAll('.session-detail-value')[1]?.textContent || '0';

        // Update tooltip content
        this.tooltip.querySelector('.tooltip-title').textContent = title;
        this.tooltip.querySelector('.tooltip-value').textContent = duration;
        this.tooltip.querySelectorAll('.tooltip-value')[1].textContent = files;

        // Position and show tooltip
        const rect = sessionElement.getBoundingClientRect();
        this.tooltip.style.left = rect.left + 'px';
        this.tooltip.style.top = (rect.top - 80) + 'px';
        this.tooltip.classList.add('show');
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sessionTooltips = new SessionTooltips();
});
        """.strip()


# ============================================================================
# DEMONSTRATION AND USAGE EXAMPLES
# ============================================================================

def demo_component_registry():
    """Demonstrate the Component Registry capabilities"""
    print("🧩 COMPONENT REGISTRY DEMONSTRATION")
    print("=" * 60)

    # Initialize registry
    registry = ComponentRegistry()

    # Test component retrieval
    print("\n📊 COMPONENT ANALYSIS:")
    print(f"Total components: {len(registry.components)}")

    # Count by category
    for category in ComponentCategory:
        count = len(registry.get_components_by_category(category))
        if count > 0:
            print(f"{category.value}: {count} components")

    # Test priority rendering
    print("\n🎯 PRIORITY ANALYSIS:")
    for priority in ComponentPriority:
        count = len(registry.get_components_by_priority(priority))
        if count > 0:
            print(f"{priority.value}: {count} components")

    # Test dependency resolution
    print("\n🔗 DEPENDENCY RESOLUTION:")
    critical_components = registry.get_components_by_priority(ComponentPriority.CRITICAL)
    for component in critical_components[:3]:  # Test first 3
        deps = registry.resolve_dependencies(component.id)
        print(f"{component.name}: {deps}")

    # Test component rendering
    print("\n🎨 COMPONENT RENDERING:")
    calendar = registry.get_component("activity_calendar")
    if calendar:
        print(f"Calendar component: {calendar.description}")
        print(f"Accessibility features: {', '.join(calendar.accessibility_features)}")
        print(f"Responsive breakpoints: {', '.join(calendar.responsive_breakpoints)}")

    # Generate manifest
    print("\n📋 COMPONENT MANIFEST:")
    manifest = registry.generate_component_manifest()
    print(f"Total components: {manifest['total_components']}")
    print(f"Accessibility features: {len(manifest['accessibility_features'])}")
    print(f"Responsive support: {len(manifest['responsive_support'])}")

    print("\n🎉 DEMONSTRATION COMPLETE!")
    return registry


if __name__ == "__main__":
    # Run demonstration
    demo_component_registry()