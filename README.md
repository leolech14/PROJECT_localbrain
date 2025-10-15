# LocalBrain - macOS Native Operations System

## Overview

LocalBrain is a macOS-exclusive operations system designed for local machine management, system control, and development environment automation. It provides native integration with macOS frameworks and advanced hardware interfacing capabilities.

## Key Features

### System Management
- **File Operations**: Advanced file indexing, search, and batch operations
- **Process Control**: Native macOS process monitoring and management
- **System Preferences**: Programmatic system settings management
- **Terminal Automation**: Command execution and automation

### Development Tools
- **Xcode Integration**: Build automation and project management
- **Git Operations**: Local repository management and automation
- **Docker Management**: Local container orchestration
- **Node Services**: Service management and monitoring

### Hardware Interface
- **USB Device Management**: Device detection and control
- **Network Configuration**: Interface management and monitoring
- **Bluetooth Control**: Device pairing and management
- **Display Management**: Resolution and configuration control

### macOS Integration
- **Spotlight Search**: Native file indexing integration
- **AppleScript Support**: Automation scripting capabilities
- **Cocoa Frameworks**: Direct API integration
- **Core Foundation**: System framework access

## Installation

### Prerequisites
- macOS 13.0 (Ventura) or later
- Xcode 14.0 or later
- Python 3.9 or later
- Homebrew package manager

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-org/LocalBrain.git
cd LocalBrain

# Install dependencies
brew install python@3.9 node@18
pip3 install -r requirements.txt
npm install

# Build native modules
xcodebuild -project LocalBrain.xcodeproj -scheme LocalBrain build

# Install system components
sudo python3 setup.py install
```

## Quick Start

### File Operations
```python
from localbrain import FileOperations

# Initialize file operations
file_ops = FileOperations()

# Search for files
results = file_ops.search_files(
    pattern="*.py",
    directory="/Users/username/Projects",
    recursive=True
)

# Batch rename files
file_ops.batch_rename(
    directory="/path/to/files",
    pattern="old_(.*).txt",
    replacement="new_\\1.txt"
)
```

### Process Management
```python
from localbrain import ProcessManager

# Initialize process manager
pm = ProcessManager()

# Get running processes
processes = pm.get_running_processes()

# Monitor specific process
pm.monitor_process("Safari", callback=process_update_handler)

# Terminate process
pm.terminate_process("unwanted_app")
```

### System Preferences
```python
from localbrain import SystemPreferences

# Initialize preferences manager
prefs = SystemPreferences()

# Get preference value
show_hidden = prefs.get_preference("com.apple.finder", "AppleShowAllFiles")

# Set preference value
prefs.set_preference("com.apple.finder", "AppleShowAllFiles", True)

# Apply changes (restart Finder)
prefs.apply_changes("com.apple.finder")
```

## Architecture

### Core Components

```
LocalBrain/
├── Sources/
│   ├── SystemControl/          # System management
│   ├── FileOperations/         # File handling
│   ├── ProcessManager/         # Process control
│   ├── HardwareInterface/      # Hardware communication
│   ├── DevelopmentTools/       # Development environment
│   └── AppleIntegration/       # macOS-specific APIs
├── Scripts/                    # Utility scripts
├── Tests/                      # Test suite
├── Documentation/              # API documentation
└── Examples/                   # Usage examples
```

### Technical Stack

- **Languages**: Swift, Python, JavaScript
- **Frameworks**: Cocoa, Core Foundation, AppKit
- **Databases**: SQLite, Core Data
- **Networking**: URLSession, Network.framework
- **Testing**: XCTest, PyTest

## API Reference

### File Operations

#### FileSearcher
```python
class FileSearcher:
    def find_files(self, pattern: str, directory: str, **filters) -> List[FileInfo]:
        """Search for files matching pattern and filters"""
        pass

    def get_file_metadata(self, file_path: str) -> FileMetadata:
        """Get detailed file metadata"""
        pass

    def watch_directory(self, directory: str, callback: Callable) -> Watcher:
        """Watch directory for changes"""
        pass
```

#### FileManager
```python
class FileManager:
    def batch_rename(self, directory: str, pattern: str, replacement: str) -> int:
        """Batch rename files using regex pattern"""
        pass

    def organize_files(self, source: str, destination: str, rules: Dict) -> int:
        """Organize files according to rules"""
        pass

    def duplicate_finder(self, directory: str) -> List[DuplicateGroup]:
        """Find duplicate files"""
        pass
```

### Process Management

#### ProcessManager
```python
class ProcessManager:
    def get_running_processes(self) -> List[ProcessInfo]:
        """Get list of running processes"""
        pass

    def monitor_process(self, name: str, callback: Callable) -> Monitor:
        """Monitor process for changes"""
        pass

    def terminate_process(self, name: str, force: bool = False) -> bool:
        """Terminate specified process"""
        pass

    def get_process_resources(self, pid: int) -> ResourceUsage:
        """Get process resource usage"""
        pass
```

### System Integration

#### PreferencesManager
```python
class PreferencesManager:
    def get_preference(self, domain: str, key: str) -> Any:
        """Get system preference value"""
        pass

    def set_preference(self, domain: str, key: str, value: Any) -> bool:
        """Set system preference value"""
        pass

    def apply_changes(self, domain: str) -> bool:
        """Apply preference changes"""
        pass
```

## Configuration

### Settings File
Configuration is managed through `~/.localbrain/config.json`:

```json
{
  "file_operations": {
    "indexing_enabled": true,
    "search_depth": 10,
    "batch_operation_limit": 1000
  },
  "process_monitoring": {
    "refresh_interval": 5,
    "resource_threshold": 80,
    "auto_terminate": false
  },
  "system_integration": {
    "require_admin": false,
    "backup_preferences": true,
    "auto_apply_changes": false
  }
}
```

### Environment Variables
- `LOCALBRAIN_HOME`: Custom installation directory
- `LOCALBRAIN_LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)
- `LOCALBRAIN_CONFIG_PATH`: Custom configuration file path

## Security

### Permissions
LocalBrain requires the following macOS permissions:
- **Full Disk Access**: For file operations and system integration
- **Accessibility**: For UI automation and system control
- **Automation**: For AppleScript execution
- **Administrator**: For system preference changes

### Security Features
- **Code Signing**: All binaries are properly signed
- **Sandboxing**: App sandbox compliance where applicable
- **Keychain Integration**: Secure credential storage
- **Audit Logging**: Comprehensive activity logging

## Troubleshooting

### Common Issues

#### Permission Denied Errors
```bash
# Grant Full Disk Access
# System Preferences → Security & Privacy → Privacy → Full Disk Access
# Add LocalBrain to the list
```

#### Process Monitoring Issues
```bash
# Check Accessibility permissions
# System Preferences → Security & Privacy → Privacy → Accessibility
# Add LocalBrain to the list
```

#### File Operation Failures
```bash
# Check file permissions
ls -la /path/to/file

# Fix permissions if needed
chmod 644 /path/to/file
```

### Debug Mode
Enable debug logging:

```bash
export LOCALBRAIN_LOG_LEVEL=DEBUG
localbrain --debug
```

### Logs
Application logs are stored in:
- `~/Library/Logs/LocalBrain/`
- `/var/log/localbrain.log` (system-wide)

## Development

### Building from Source
```bash
# Clone repository
git clone https://github.com/your-org/LocalBrain.git
cd LocalBrain

# Build Swift components
swift build

# Run tests
swift test
pytest

# Build documentation
swift run jazzy
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- **Swift**: Follow Swift API design guidelines
- **Python**: Follow PEP 8 style guide
- **Documentation**: Use docstrings for all public APIs

## License

LocalBrain is released under the MIT License. See [LICENSE](LICENSE) for details.

## Support

- **Documentation**: [LocalBrain Documentation](https://localbrain.dev/docs)
- **Issues**: [GitHub Issues](https://github.com/your-org/LocalBrain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/LocalBrain/discussions)

---

*LocalBrain v2.0 - macOS Native Operations System*
*Last Updated: 2025-10-14*
*Platform: macOS 13.0+*