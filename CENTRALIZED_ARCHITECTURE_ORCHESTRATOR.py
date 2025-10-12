#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════════╗
║                    CENTRALIZED ARCHITECTURE ORCHESTRATOR                           ║
║        Ultimate unified system connecting all centralized layers and components       ║
╚══════════════════════════════════════════════════════════════════════════════════╝

🎯 PURPOSE: Orchestrate all centralized systems into a unified HTML generation engine
🏗️ ARCHITECTURE: Layer-based architecture with interconnected systems
🚀 FEATURES: Single-entry point, data flow management, system integration
📊 COVERAGE: 100% of HTML generation needs through centralized coordination
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from pathlib import Path
import json
import datetime
from enum import Enum

# Import our centralized systems
from CENTRALIZED_OKLCH_COLOR_MANAGER import OKLCHColorManager, ColorSchema
from CENTRALIZED_COMPONENT_REGISTRY import ComponentRegistry, ComponentConfig


class OutputFormat(Enum):
    """Supported output formats"""
    HTML_COMPLETE = "html_complete"        # Full HTML with all features
    HTML_MINIMAL = "html_minimal"         # Minimal HTML for testing
    JSON_DATA = "json_data"              # Pure data export
    PDF_REPORT = "pdf_report"            # PDF generation (future)
    STATIC_SITE = "static_site"          # Static site generation


class RenderMode(Enum):
    """Rendering modes for different use cases"""
    PRODUCTION = "production"             # Full-featured production build
    DEVELOPMENT = "development"           # Development mode with debugging
    PREVIEW = "preview"                  # Quick preview mode
    ANALYSIS = "analysis"                # Analysis-focused output


@dataclass
class GenerationRequest:
    """HTML generation request configuration"""
    project_path: Path
    output_format: OutputFormat = OutputFormat.HTML_COMPLETE
    render_mode: RenderMode = RenderMode.PRODUCTION
    color_schema: ColorSchema = ColorSchema.TEMPERATURE
    language: str = "en"
    include_components: List[str] = field(default_factory=list)
    exclude_components: List[str] = field(default_factory=list)
    custom_data: Dict[str, Any] = field(default_factory=dict)
    output_path: Optional[Path] = None


@dataclass
class GenerationResult:
    """HTML generation result"""
    success: bool
    html_content: str = ""
    file_path: Optional[Path] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    performance_metrics: Dict[str, float] = field(default_factory=dict)


class ArchitectureOrchestrator:
    """
    CENTRALIZED ARCHITECTURE ORCHESTRATOR

    This is the MAIN ENTRY POINT for the entire centralized HTML generation system.
    It orchestrates all layers: Color Manager, Component Registry, Data Processing,
    and ensures seamless integration between all systems.

    🎯 DESIGN PRINCIPLES:
    - Single entry point for all HTML generation
    - Layer-based architecture with clear separation of concerns
    - Data flow management and system integration
    - Performance optimization and error handling
    - Extensible and maintainable architecture
    """

    def __init__(self):
        # Initialize all centralized systems
        self.color_manager = OKLCHColorManager()
        self.component_registry = ComponentRegistry()

        # Data processing layer
        self.data_processor = DataProcessor()

        # HTML orchestration layer
        self.html_orchestrator = HTMLOrchestrator(self.color_manager, self.component_registry)

        # Performance tracking
        self.performance_tracker = PerformanceTracker()

        # Error handling
        self.error_handler = ErrorHandler()

        # System state
        self.is_initialized = False

    def initialize(self):
        """Initialize all systems and verify integration"""
        try:
            # Test color manager
            self.color_manager.get_color('primary')
            self.color_manager.generate_css_variables()

            # Test component registry
            self.component_registry.get_component('activity_calendar')

            # Test data processor
            self.data_processor.validate_system()

            # Mark as initialized
            self.is_initialized = True

            return True
        except Exception as e:
            self.error_handler.handle_initialization_error(e)
            return False

    def generate_html(self, request: GenerationRequest) -> GenerationResult:
        """
        Generate HTML using the centralized architecture

        Args:
            request: Generation request with all configuration

        Returns:
            GenerationResult: Complete generation result with HTML and metadata
        """
        start_time = datetime.datetime.now()

        # Initialize if not already done
        if not self.is_initialized:
            if not self.initialize():
                return GenerationResult(
                    success=False,
                    errors=["Failed to initialize architecture orchestrator"]
                )

        try:
            # Step 1: Process project data
            processed_data = self.data_processor.process_project(request.project_path)

            # Step 2: Configure color system
            self.color_manager.set_schema(request.color_schema)

            # Step 3: Configure component registry
            components_to_render = self._determine_components_to_render(request)

            # Step 4: Generate HTML orchestration
            html_content = self.html_orchestrator.generate_html(
                data=processed_data,
                components=components_to_render,
                config=request
            )

            # Step 5: Apply post-processing
            final_html = self._post_process_html(html_content, request)

            # Step 6: Save to file if requested
            output_path = None
            if request.output_path:
                output_path = self._save_html(final_html, request.output_path)

            # Calculate performance metrics
            end_time = datetime.datetime.now()
            processing_time = (end_time - start_time).total_seconds()

            # Build metadata
            metadata = self._build_metadata(request, processed_data, processing_time)

            return GenerationResult(
                success=True,
                html_content=final_html,
                file_path=output_path,
                metadata=metadata,
                performance_metrics={
                    'processing_time_seconds': processing_time,
                    'components_rendered': len(components_to_render),
                    'data_points_processed': len(processed_data.get('files', [])),
                    'color_schema': request.color_schema.value,
                    'render_mode': request.render_mode.value
                }
            )

        except Exception as e:
            return GenerationResult(
                success=False,
                errors=[str(e)],
                performance_metrics={
                    'processing_time_seconds': (datetime.datetime.now() - start_time).total_seconds()
                }
            )

    def _determine_components_to_render(self, request: GenerationRequest) -> List[str]:
        """Determine which components to render based on request"""
        if request.include_components:
            # Use explicit inclusion list
            components = request.include_components.copy()
        else:
            # Use all components, filtered by exclusions
            all_components = list(self.component_registry.components.keys())
            components = [c for c in all_components if c not in request.exclude_components]

        # Filter by render mode
        if request.render_mode == RenderMode.PREVIEW:
            # Only critical components
            critical_components = self.component_registry.get_components_by_priority(
                ComponentPriority.CRITICAL
            )
            components = [c.id for c in critical_components if c.id in components]

        return components

    def _post_process_html(self, html_content: str, request: GenerationRequest) -> str:
        """Apply post-processing to generated HTML"""
        processed = html_content

        # Add timestamp-based naming to prevent overwrites
        timestamp = datetime.datetime.now()
        weekday_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        timestamp_name = f"{request.project_path.name}_{timestamp.hour:02d}{weekday_names[timestamp.weekday()]}{timestamp.day}{month_names[timestamp.month-1]}{timestamp.year}"

        # Add metadata to HTML
        metadata_html = f"""
<!-- Generated by Centralized Architecture Orchestrator -->
<!-- Project: {request.project_path.name} -->
<!-- Timestamp: {timestamp.isoformat()} -->
<!-- Color Schema: {request.color_schema.value} -->
<!-- Language: {request.language} -->
<!-- Render Mode: {request.render_mode.value} -->
        """

        # Inject metadata after <head>
        processed = processed.replace('<head>', f'<head>\n{metadata_html}')

        # Add development mode enhancements
        if request.render_mode == RenderMode.DEVELOPMENT:
            processed += """
<!-- Development Mode Enhancements -->
<script>
window.centralizedArchitecture = {
    colorManager: window.colorManager,
    componentRegistry: window.componentRegistry,
    debugMode: true
};
</script>
            """

        return processed

    def _save_html(self, html_content: str, output_path: Path) -> Path:
        """Save HTML content to file"""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        return output_path

    def _build_metadata(self, request: GenerationRequest, data: Dict, processing_time: float) -> Dict:
        """Build comprehensive metadata for the generation result"""
        return {
            'generation_info': {
                'timestamp': datetime.datetime.now().isoformat(),
                'project_name': request.project_path.name,
                'output_format': request.output_format.value,
                'render_mode': request.render_mode.value,
                'color_schema': request.color_schema.value,
                'language': request.language,
                'processing_time_seconds': processing_time
            },
            'project_statistics': {
                'total_files': len(data.get('files', [])),
                'total_directories': len(data.get('directories', [])),
                'total_size_bytes': data.get('total_size', 0),
                'file_types': list(set(f.get('extension', '') for f in data.get('files', [])))
            },
            'system_components': {
                'color_manager_schema': request.color_schema.value,
                'components_rendered': len(self._determine_components_to_render(request)),
                'component_categories': list(set(
                    self.component_registry.get_component(c).category.value
                    for c in self._determine_components_to_render(request)
                ))
            },
            'performance_metrics': {
                'files_processed_per_second': len(data.get('files', [])) / max(processing_time, 0.001),
                'components_rendered_per_second': len(self._determine_components_to_render(request)) / max(processing_time, 0.001)
            }
        }


class DataProcessor:
    """Data processing layer for project analysis"""

    def __init__(self):
        self.processors = {
            'file_system': FileSystemProcessor(),
            'code_analysis': CodeAnalysisProcessor(),
            'dependency_analysis': DependencyAnalysisProcessor(),
            'temporal_analysis': TemporalAnalysisProcessor()
        }

    def process_project(self, project_path: Path) -> Dict[str, Any]:
        """Process project and return comprehensive data"""
        data = {
            'project_info': self._extract_project_info(project_path),
            'files': [],
            'directories': [],
            'analysis': {},
            'dependencies': {},
            'temporal_data': {},
            'custom_data': {}
        }

        # Process through all processors
        for processor_name, processor in self.processors.items():
            try:
                processor_data = processor.process(project_path)
                data['analysis'][processor_name] = processor_data
            except Exception as e:
                print(f"Warning: Processor {processor_name} failed: {e}")

        return data

    def _extract_project_info(self, project_path: Path) -> Dict[str, Any]:
        """Extract basic project information"""
        return {
            'name': project_path.name,
            'path': str(project_path),
            'size_bytes': sum(f.stat().st_size for f in project_path.rglob('*') if f.is_file()),
            'file_count': len(list(project_path.rglob('*'))),
            'last_modified': datetime.datetime.now().isoformat()
        }

    def validate_system(self):
        """Validate data processing system"""
        for processor_name, processor in self.processors.items():
            if not hasattr(processor, 'process'):
                raise ValueError(f"Processor {processor_name} missing process method")


class FileSystemProcessor:
    """File system data processor"""

    def process(self, project_path: Path) -> Dict[str, Any]:
        """Process file system data"""
        files = []
        directories = []

        for item in project_path.rglob('*'):
            if item.is_file():
                files.append({
                    'path': str(item.relative_to(project_path)),
                    'name': item.name,
                    'extension': item.suffix,
                    'size_bytes': item.stat().st_size,
                    'last_modified': datetime.datetime.fromtimestamp(item.stat().st_mtime).isoformat()
                })
            elif item.is_dir():
                directories.append({
                    'path': str(item.relative_to(project_path)),
                    'name': item.name,
                    'file_count': len(list(item.iterdir()))
                })

        return {
            'files': files,
            'directories': directories,
            'total_files': len(files),
            'total_directories': len(directories)
        }


class CodeAnalysisProcessor:
    """Code analysis data processor"""

    def process(self, project_path: Path) -> Dict[str, Any]:
        """Process code analysis data"""
        # This would integrate with the actual code analysis from the megalithic script
        return {
            'languages': {
                'Python': len(list(project_path.rglob('*.py'))),
                'JavaScript': len(list(project_path.rglob('*.js'))),
                'TypeScript': len(list(project_path.rglob('*.ts'))),
                'HTML': len(list(project_path.rglob('*.html'))),
                'CSS': len(list(project_path.rglob('*.css')))
            },
            'total_lines_of_code': 0,  # Would be calculated
            'complexity_metrics': {}
        }


class DependencyAnalysisProcessor:
    """Dependency analysis data processor"""

    def process(self, project_path: Path) -> Dict[str, Any]:
        """Process dependency analysis data"""
        return {
            'import_dependencies': [],
            'package_dependencies': [],
            'dependency_graph': {},
            'circular_dependencies': []
        }


class TemporalAnalysisProcessor:
    """Temporal analysis data processor"""

    def process(self, project_path: Path) -> Dict[str, Any]:
        """Process temporal analysis data"""
        return {
            'work_sessions': [],
            'activity_timeline': {},
            'productivity_metrics': {},
            'evolution_patterns': {}
        }


class HTMLOrchestrator:
    """HTML generation orchestration layer"""

    def __init__(self, color_manager: OKLCHColorManager, component_registry: ComponentRegistry):
        self.color_manager = color_manager
        self.component_registry = component_registry

    def generate_html(self, data: Dict[str, Any], components: List[str], config: GenerationRequest) -> str:
        """Generate complete HTML using centralized systems"""
        # Build HTML structure
        html_parts = [
            self._generate_html_head(config),
            self._generate_html_body(data, components, config),
            self._generate_html_footer()
        ]

        return '\n'.join(html_parts)

    def _generate_html_head(self, config: GenerationRequest) -> str:
        """Generate HTML head section"""
        return f"""<!DOCTYPE html>
<html lang="{config.language}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Analysis Report - {config.project_path.name}</title>

    <!-- Color Variables -->
    <style>
    {self.color_manager.generate_css_variables()}
    </style>

    <!-- Global Styles -->
    <style>
    {self._generate_global_styles()}
    </style>

    <!-- Mermaid for diagrams -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head>"""

    def _generate_html_body(self, data: Dict[str, Any], components: List[str], config: GenerationRequest) -> str:
        """Generate HTML body section"""
        body_parts = [
            '<body>',
            self._generate_page_header(config),
            self._generate_main_content(data, components, config),
            '</body>'
        ]

        return '\n'.join(body_parts)

    def _generate_page_header(self, config: GenerationRequest) -> str:
        """Generate page header with controls"""
        return f"""
        <header class="page-header">
            <div class="header-content">
                <h1>Project Analysis Report</h1>
                <div class="header-controls">
                    <!-- Language Toggle -->
                    {self.component_registry.render_component('language_toggle')}

                    <!-- Theme Toggle -->
                    {self.component_registry.render_component('theme_toggle')}

                    <!-- Settings Panel -->
                    {self.component_registry.render_component('settings_panel')}
                </div>
            </div>
        </header>
        """

    def _generate_main_content(self, data: Dict[str, Any], components: List[str], config: GenerationRequest) -> str:
        """Generate main content area"""
        content_parts = ['<main class="main-content">']

        # Add components in dependency order
        for component_id in components:
            try:
                # Create component configuration with data
                component_config = ComponentConfig(
                    data_source='analysis_data',
                    options={'project_data': data},
                    localization={'language': config.language},
                    styling={'color_schema': config.color_schema.value}
                )

                component_html = self.component_registry.render_component(component_id, component_config)
                content_parts.append(f'        {component_html}')
            except Exception as e:
                # Add error component if available
                error_html = f'        <!-- Error rendering component {component_id}: {e} -->'
                content_parts.append(error_html)

        content_parts.append('</main>')
        return '\n'.join(content_parts)

    def _generate_html_footer(self) -> str:
        """Generate HTML footer section"""
        return """
<!-- Generated by Centralized Architecture Orchestrator -->
<div class="footer">
    <p>Generated with Centralized Architecture Orchestrator</p>
</div>
</body>
</html>
        """

    def _generate_global_styles(self) -> str:
        """Generate global CSS styles"""
        return """
/* Global Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg);
    transition: all 0.3s ease;
}

.page-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

.header-content h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
}

.header-controls {
    display: flex;
    gap: 12px;
    align-items: center;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.footer {
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    padding: 20px;
    text-align: center;
    margin-top: 40px;
    color: var(--muted);
    font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: stretch;
    }

    .main-content {
        padding: 16px;
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    :root {
        --border: oklch(0.2 0.02 250);
        --muted: oklch(0.3 0.02 250);
    }
}
        """


class PerformanceTracker:
    """Performance tracking and optimization"""

    def __init__(self):
        self.metrics = {}

    def track_operation(self, operation_name: str, duration: float):
        """Track operation performance"""
        if operation_name not in self.metrics:
            self.metrics[operation_name] = []
        self.metrics[operation_name].append(duration)

    def get_average_time(self, operation_name: str) -> float:
        """Get average time for operation"""
        times = self.metrics.get(operation_name, [])
        return sum(times) / len(times) if times else 0

    def get_performance_report(self) -> Dict[str, float]:
        """Get performance report"""
        return {
            operation: self.get_average_time(operation)
            for operation in self.metrics
        }


class ErrorHandler:
    """Centralized error handling"""

    def __init__(self):
        self.errors = []
        self.warnings = []

    def handle_initialization_error(self, error: Exception):
        """Handle initialization errors"""
        self.errors.append(f"Initialization failed: {error}")
        print(f"ERROR: {error}")

    def handle_component_error(self, component_id: str, error: Exception):
        """Handle component rendering errors"""
        self.errors.append(f"Component {component_id} failed: {error}")
        print(f"ERROR in component {component_id}: {error}")

    def handle_warning(self, message: str):
        """Handle warnings"""
        self.warnings.append(message)
        print(f"WARNING: {message}")

    def get_error_report(self) -> Dict[str, List[str]]:
        """Get error and warning report"""
        return {
            'errors': self.errors.copy(),
            'warnings': self.warnings.copy()
        }


# ============================================================================
# DEMONSTRATION AND USAGE EXAMPLES
# ============================================================================

def demo_architecture_orchestrator():
    """Demonstrate the Architecture Orchestrator capabilities"""
    print("🏗️ ARCHITECTURE ORCHESTRATOR DEMONSTRATION")
    print("=" * 60)

    # Initialize orchestrator
    orchestrator = ArchitectureOrchestrator()

    # Test initialization
    print("\n🚀 INITIALIZATION:")
    if orchestrator.initialize():
        print("✅ All systems initialized successfully")
    else:
        print("❌ Initialization failed")
        return

    # Create sample generation request
    from pathlib import Path
    project_path = Path(".")  # Current directory

    request = GenerationRequest(
        project_path=project_path,
        output_format=OutputFormat.HTML_COMPLETE,
        render_mode=RenderMode.PRODUCTION,
        color_schema=ColorSchema.TEMPERATURE,
        language="en",
        output_path=Path("demo_output.html")
    )

    # Generate HTML
    print("\n🎨 HTML GENERATION:")
    print(f"Project: {project_path.name}")
    print(f"Color Schema: {request.color_schema.value}")
    print(f"Render Mode: {request.render_mode.value}")

    result = orchestrator.generate_html(request)

    if result.success:
        print(f"✅ HTML generated successfully!")
        print(f"📄 Output: {result.file_path}")
        print(f"📊 Processing time: {result.performance_metrics.get('processing_time_seconds', 0):.2f}s")
        print(f"🧩 Components rendered: {result.performance_metrics.get('components_rendered', 0)}")
        print(f"📁 Data points processed: {result.performance_metrics.get('data_points_processed', 0)}")
    else:
        print(f"❌ Generation failed: {result.errors}")

    # Show system capabilities
    print("\n🎯 SYSTEM CAPABILITIES:")
    print(f"Color schemas: {[s.value for s in orchestrator.color_manager.get_available_schemas()]}")
    print(f"Total components: {len(orchestrator.component_registry.components)}")
    print(f"Component categories: {list(set(c.category.value for c in orchestrator.component_registry.components.values()))}")

    print("\n🎉 DEMONSTRATION COMPLETE!")
    return orchestrator


if __name__ == "__main__":
    # Run demonstration
    demo_architecture_orchestrator()