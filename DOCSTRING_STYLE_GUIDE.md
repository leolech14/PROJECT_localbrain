# 📘 GOOGLE STYLE DOCSTRING QUICK REFERENCE
## mr-fix-my-project-please.py Implementation Guide

**Date**: 2025-10-10
**Standard**: Google Python Style Guide
**Compatibility**: Sphinx, pdoc, pydoc

---

## 🎯 CORE TEMPLATE

### Basic Structure
```python
def function_name(param1: Type1, param2: Type2 = default) -> ReturnType:
    """
    One-line summary in imperative mood (< 80 chars).

    Extended description providing context and behavior details.
    Can span multiple paragraphs if needed.

    Args:
        param1: Description of first parameter.
        param2: Description of second parameter. Defaults to default.

    Returns:
        Description of return value and structure.

    Raises:
        ExceptionType: When/why this exception is raised.

    Example:
        >>> result = function_name("value", 42)
        >>> print(result)
        'processed value'
    """
```

---

## 📋 SECTION TEMPLATES

### 1. Summary Line
```python
"""Execute comprehensive analysis and generate HTML report."""
```

**Rules:**
- ✅ Imperative mood: "Execute", "Generate", "Calculate" (not "Executes", "Generating")
- ✅ Single line, < 80 characters
- ✅ End with period
- ✅ No parameter details in summary
- ❌ Never: "This method does X" or "Function to do X"

**Examples:**
```python
# GOOD
"""Generate Mermaid diagram for core architecture visualization."""
"""Calculate Shannon diversity index from file type distribution."""
"""Scan project directory and build comprehensive dependency graph."""

# BAD
"""This function generates a Mermaid diagram."""  # Not imperative
"""Generates diagrams"""  # Too vague
"""Generate Mermaid diagram for core architecture visualization with smart node filtering"""  # Too long
```

---

### 2. Extended Description
```python
"""
One-line summary.

Extended description providing additional context about the method's
purpose, behavior, and important considerations. Can span multiple
lines and paragraphs.

Key behaviors:
- Behavior 1
- Behavior 2
- Behavior 3
"""
```

**When to Include:**
- ✅ Complex algorithms that need explanation
- ✅ Important side effects or state changes
- ✅ Performance characteristics worth noting
- ✅ Business logic or domain concepts
- ❌ Don't repeat obvious information

**Examples:**
```python
"""
Generate 5 focused Mermaid diagrams for comprehensive dependency visualization.

Creates strategic diagram suite optimized for different analysis perspectives:
1. 🎯 Main Core Architecture - Central components and key relationships
2. 🔥 Critical Dependency Paths - High-impact connections and bottlenecks
3. 📦 Component Clusters - Logical groupings by file type/purpose
4. 🏗️ Service Layers - Architectural layer separation
5. ⚠️ Risk Analysis - Complexity hotspots and fragile areas

Each diagram is optimized for readability with node limits and intelligent
filtering to highlight most important relationships.
"""
```

---

### 3. Args Section
```python
"""
Args:
    param_name: Brief description of parameter purpose and expected values.
    complex_param: More detailed description.
        Can span multiple lines with 4-space indent continuation.
        Use when structure needs explanation.
    optional_param: Description here. Defaults to None.
    **kwargs: Additional keyword arguments:
        - key1 (str): Description
        - key2 (int): Description
"""
```

**Formatting Rules:**
- ✅ Each param on new line
- ✅ No type in description (use type hints instead)
- ✅ Mention default values for optional params
- ✅ Use 4-space indent for continuation lines
- ✅ Use bullet lists for complex structures

**Examples:**
```python
"""
Args:
    project_path: Absolute or relative path to project root directory.
    sampling_rate: Fraction of files to analyze (0.0-1.0). Defaults to 1.0.
    enhanced_data: Project analysis data with keys:
        - nodes: list[dict] - Files/components with metadata
        - relationships: list[dict] - Import/dependency edges
        - file_types: dict[str, int] - Extension counts
    include_tests: Whether to include test files in analysis. Defaults to True.
"""
```

---

### 4. Returns Section
```python
"""
Returns:
    Brief description of return value.

    For complex structures, detail the shape:
    {
        'key1': value_type,  # Description
        'key2': value_type,  # Description
        'nested': {
            'subkey': value_type
        }
    }
"""
```

**When to Include Structure:**
- ✅ Dictionaries with specific keys
- ✅ Lists with specific structure
- ✅ Tuples with positional meaning
- ✅ Complex objects with multiple attributes
- ❌ Simple types (str, int, bool) - just describe purpose

**Examples:**
```python
"""
Returns:
    Dependency analysis with structure:
    {
        'dependency_graph': {
            'file_path': {
                'imports': list[str],
                'imported_by': list[str],
                'importance_score': float
            }
        },
        'ripple_analysis': {
            'file_path': {
                'direct_impact': int,
                'indirect_impact': int,
                'risk_level': str  # 'low', 'medium', 'high', 'critical'
            }
        },
        'critical_files': list[dict],
        'total_files_analyzed': int
    }
"""

# Simple return - no structure needed
"""
Returns:
    str: HTML-formatted report containing all analysis results.
"""

"""
Returns:
    bool: True if project passes health checks, False otherwise.
"""
```

---

### 5. Raises Section
```python
"""
Raises:
    ExceptionType: Brief description of when/why raised.
    AnotherException: Another scenario description.
"""
```

**Common Exceptions:**
- `ValueError`: Invalid parameter values
- `KeyError`: Missing required dictionary keys
- `FileNotFoundError`: File/directory not found
- `PermissionError`: Insufficient permissions
- `MemoryError`: Resource exhaustion
- `RuntimeError`: General runtime failures

**Examples:**
```python
"""
Raises:
    ValueError: If project_path does not exist or is not a directory.
    KeyError: If enhanced_data missing required keys (nodes/relationships).
    MemoryError: If project too large for available memory (>10GB).
"""

# Only document exceptions method explicitly raises
# Don't document every possible exception
"""
Raises:
    FileNotFoundError: If script file not found at self.script_path.
    PermissionError: If cannot write backup or updated file.
"""
```

---

### 6. Example Section
```python
"""
Example:
    >>> obj = ClassName()
    >>> result = obj.method_name("value", 42)
    >>> print(result)
    {'status': 'success', 'value': 42}

    Multiple examples can be shown:

    >>> # Edge case example
    >>> result = obj.method_name("", 0)
    >>> print(result)
    {'status': 'error', 'message': 'Invalid input'}
"""
```

**Best Practices:**
- ✅ Use doctest format (`>>>` prefix)
- ✅ Show realistic usage
- ✅ Include expected output
- ✅ Show common use cases
- ✅ Can show edge cases
- ❌ Don't show every possible combination

**Examples:**
```python
"""
Example:
    >>> maximizer = UltraThinkMermaidMaximizer('/path/to/project')
    >>> data = load_project_data()
    >>> diagrams = maximizer.generate_smart_diagrams(data)
    >>> print(f"Generated {len(diagrams)} diagrams")
    Generated 5 diagrams
    >>> print(diagrams[0]['title'])
    🎯 Main Core Architecture
"""

"""
Example:
    >>> analyzer = MrFixMyProjectPlease('/path/to/project')
    >>> analyzer.start_memory_monitor()
    >>> results = analyzer.run_analysis()
    >>> print(f"Health score: {results['health_score']:.1f}%")
    Health score: 87.3%
"""
```

---

### 7. Note/Warning Sections
```python
"""
Note:
    Additional information about usage, performance, or behavior.
    Can reference related methods or provide context.

Warning:
    Critical information about dangerous behavior or deprecated features.
    Should be used sparingly for truly important warnings.
"""
```

**Use Cases:**
```python
"""
Note:
    Analysis can take 30-120 seconds for large projects (>500 files).
    Use perform_optimized_surface_scan() first for quick overview.
"""

"""
Warning:
    This method modifies the source file in place. Always creates
    timestamped backup but ensure critical work is committed first.
"""

"""
Note:
    Diagrams use dark color scheme compatible with Mermaid 10.6.1.
    Node limits: Core=30, Critical=20, Clusters=25, Layers=30, Risks=15.
"""
```

---

## 🔧 SPECIAL CASES

### Class Docstrings
```python
class ClassName:
    """
    One-line summary of class purpose.

    Extended description of class responsibilities, design patterns,
    and usage scenarios.

    Attributes:
        attr1: Description of instance attribute.
        attr2: Description of another attribute.

    Example:
        >>> obj = ClassName(param="value")
        >>> result = obj.main_method()
    """
```

### Property Docstrings
```python
@property
def value(self) -> str:
    """str: Brief description of property value."""
    return self._value
```

### Private Method Docstrings
```python
def _private_method(self, param: str) -> dict:
    """
    Brief description - can be shorter than public methods.

    Args:
        param: Description.

    Returns:
        Description.
    """
```

**Private methods (_method) can have:**
- ✅ Shorter descriptions
- ✅ Skip examples if usage is obvious
- ✅ Focus on Args and Returns
- ❌ Still need clear documentation

### Constructor (__init__) Docstrings
```python
def __init__(self, project_path: str):
    """
    Initialize analyzer with project path and configuration.

    Validates project path exists, loads configuration, initializes
    internal state, and prepares analysis environment.

    Args:
        project_path: Absolute or relative path to project root.

    Raises:
        ValueError: If project_path does not exist.
        PermissionError: If insufficient permissions to read project.

    Example:
        >>> analyzer = MrFixMyProjectPlease('/path/to/project')
        >>> analyzer.run_analysis()
    """
```

---

## ✅ QUALITY CHECKLIST

Before committing docstring additions:

### Content Requirements
- [ ] Summary line in imperative mood
- [ ] Summary line < 80 characters
- [ ] All parameters documented
- [ ] Return value documented
- [ ] Exceptions documented
- [ ] At least one example for public methods
- [ ] Extended description for complex methods

### Formatting Requirements
- [ ] Proper indentation (4 spaces)
- [ ] Blank lines between sections
- [ ] Consistent quote style (triple double-quotes)
- [ ] No trailing whitespace
- [ ] Proper capitalization and punctuation

### Accuracy Requirements
- [ ] Docstring matches actual behavior
- [ ] Type hints match Args descriptions
- [ ] Examples are runnable
- [ ] No copy-paste errors from templates
- [ ] No outdated information

---

## 🚫 COMMON MISTAKES

### Mistake 1: Not Using Imperative Mood
❌ **BAD:**
```python
"""This function generates a report."""
"""Generating comprehensive HTML report."""
"""Generator for HTML reports."""
```

✅ **GOOD:**
```python
"""Generate comprehensive HTML report."""
```

### Mistake 2: Repeating Type Information
❌ **BAD:**
```python
def calculate(value: int) -> float:
    """
    Args:
        value (int): The integer value to calculate.

    Returns:
        float: A floating point result.
    """
```

✅ **GOOD:**
```python
def calculate(value: int) -> float:
    """
    Args:
        value: Input number for calculation.

    Returns:
        Calculated result with decimal precision.
    """
```

### Mistake 3: Vague Descriptions
❌ **BAD:**
```python
"""
Args:
    data: The data.
    config: Configuration.

Returns:
    The result.
"""
```

✅ **GOOD:**
```python
"""
Args:
    data: Project analysis results including file counts and dependencies.
    config: Analysis configuration with sampling rate and filters.

Returns:
    HTML-formatted report with visualizations and recommendations.
"""
```

### Mistake 4: Missing Structure Details
❌ **BAD:**
```python
"""
Returns:
    dict: Analysis results.
"""
```

✅ **GOOD:**
```python
"""
Returns:
    Analysis results with structure:
    {
        'health_score': float,
        'risk_factors': list[dict],
        'recommendations': list[str]
    }
"""
```

### Mistake 5: Documenting Implementation Details
❌ **BAD:**
```python
"""
Iterate through all files using os.walk and append each file to a list,
then call process_file on each element of the list using a for loop,
storing results in a dictionary initialized as empty dict.
"""
```

✅ **GOOD:**
```python
"""
Scan project directory recursively and analyze each source file.

Processes Python, JavaScript, and TypeScript files to extract
dependencies, calculate complexity, and assess quality metrics.
"""
```

---

## 📚 REFERENCE EXAMPLES

### Minimal (Simple Function)
```python
def get_grade(score: float) -> str:
    """
    Convert numeric score to letter grade.

    Args:
        score: Numeric score from 0.0 to 100.0.

    Returns:
        Letter grade: 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'.

    Example:
        >>> get_grade(95.0)
        'A+'
        >>> get_grade(72.5)
        'B'
    """
```

### Moderate (Method with Side Effects)
```python
def start_memory_monitor(self) -> None:
    """
    Start background thread monitoring memory usage.

    Launches daemon thread that checks memory consumption every 30 seconds
    and triggers emergency shutdown if usage exceeds 90% of available RAM.
    Stores readings in self.memory_readings for later analysis.

    Note:
        Thread automatically stops when main process exits.
        See check_time_limit() for coordinated resource monitoring.

    Example:
        >>> analyzer = MrFixMyProjectPlease('/path')
        >>> analyzer.start_memory_monitor()
        >>> # Memory monitoring now active
    """
```

### Complex (Full Documentation)
```python
def generate_dependency_analysis(self) -> dict:
    """
    Generate comprehensive dependency analysis including graphs and ripple effects.

    Scans all source files in project to build complete dependency graph,
    calculating import relationships, critical paths, and potential ripple
    effects of changes. Identifies hub files and architectural weak points.

    The analysis covers:
    - Python: import/from statements
    - JavaScript/TypeScript: import/require statements
    - Generic: string-based dependency patterns

    Returns:
        Dependency analysis with structure:
        {
            'dependency_graph': {
                'file_path': {
                    'imports': list[str],
                    'imported_by': list[str],
                    'importance_score': float
                }
            },
            'ripple_analysis': {
                'file_path': {
                    'direct_impact': int,
                    'indirect_impact': int,
                    'total_reach': int,
                    'risk_level': str  # 'low', 'medium', 'high', 'critical'
                }
            },
            'critical_files': list[dict],
            'total_files_analyzed': int,
            'analysis_time_seconds': float
        }

    Raises:
        ValueError: If project path does not exist or contains no source files.
        MemoryError: If project too large for available memory.

    Example:
        >>> analyzer = MrFixMyProjectPlease('/path/to/project')
        >>> deps = analyzer.generate_dependency_analysis()
        >>> critical = deps['critical_files']
        >>> print(f"Found {len(critical)} critical files")
        Found 12 critical files

    Note:
        Analysis can take 30-120 seconds for large projects (>500 files).
        Use perform_optimized_surface_scan() first for quick overview.
    """
```

---

## 🎓 LEARNING RESOURCES

### Official Documentation
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)
- [Sphinx Documentation](https://www.sphinx-doc.org/en/master/usage/extensions/napoleon.html)

### Tools for Validation
```bash
# Check docstring format
pydocstyle mr-fix-my-project-please.py

# Generate documentation
pdoc --html mr-fix-my-project-please.py

# Run doctests
python3 -m doctest mr-fix-my-project-please.py -v
```

---

**Keep This Open While Adding Docstrings!**

Refer to templates and examples frequently to maintain consistency.
When in doubt, check the "Complex (Full Documentation)" example above.
