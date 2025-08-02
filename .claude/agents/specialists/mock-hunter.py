#!/usr/bin/env python3
"""
Mock Hunter Agent - Implementation
Hunts down mocks, stubs, and partially implemented features
"""

import os
import re
import ast
import json
from typing import Dict, List, Set, Tuple, Any
from dataclasses import dataclass
from pathlib import Path
import time

@dataclass
class MockFinding:
    """Represents a discovered mock or incomplete implementation"""
    file_path: str
    line_number: int
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    category: str  # mock, stub, todo, hardcoded, etc.
    description: str
    code_snippet: str
    suggested_fix: str

class MockHunterAgent:
    """The Mock Hunter - Relentlessly finds all mocks and stubs"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.findings: List[MockFinding] = []
        self.scan_stats = {
            "files_scanned": 0,
            "functions_analyzed": 0,
            "mocks_found": 0,
            "scan_duration": 0
        }
        
        # Mock patterns to detect
        self.mock_patterns = {
            "obvious_mocks": [
                r'\bTODO\b', r'\bFIXME\b', r'\bHACK\b', r'\bXXX\b',
                r'\bmock\b', r'\bstub\b', r'\bplaceholder\b', r'\bdummy\b'
            ],
            "placeholder_returns": [
                r'return\s+True\s*$', r'return\s+False\s*$',
                r'return\s+None\s*$', r'return\s+\{\}\s*$',
                r'return\s+\[\]\s*$', r'return\s+".*"\s*$',
                r'pass\s*$'
            ],
            "fake_data": [
                r'test@example\.com', r'admin@test\.com',
                r'John\s+Doe', r'Jane\s+Doe', r'Test\s+User',
                r'123456', r'password123', r'secret',
                r'dummy', r'sample', r'demo'
            ],
            "error_suppressors": [
                r'except:\s*pass', r'except\s+.*:\s*pass',
                r'catch\s*\([^)]*\)\s*\{\s*\}',
                r'//\s*ignore', r'#\s*ignore'
            ]
        }
        
    def scan(self, mode: str = "deep") -> Dict[str, Any]:
        """
        Perform a mock hunt scan
        
        Args:
            mode: "quick" (<30s), "deep" (2-5min), or "continuous"
            
        Returns:
            Scan results with findings and recommendations
        """
        start_time = time.time()
        self.findings = []
        
        if mode == "quick":
            self._quick_scan()
        elif mode == "deep":
            self._deep_scan()
        elif mode == "continuous":
            self._continuous_monitor()
            
        self.scan_stats["scan_duration"] = time.time() - start_time
        self.scan_stats["mocks_found"] = len(self.findings)
        
        return self._generate_report()
    
    def _quick_scan(self):
        """Fast pattern-based scan for obvious mocks"""
        for file_path in self._get_python_files():
            self._scan_file_patterns(file_path)
            
    def _deep_scan(self):
        """Comprehensive scan including behavioral analysis"""
        # First do pattern scan
        self._quick_scan()
        
        # Then behavioral analysis
        for file_path in self._get_python_files():
            self._analyze_file_behavior(file_path)
            
        # Integration testing
        self._check_integration_points()
        
    def _continuous_monitor(self):
        """Set up continuous monitoring (placeholder for now)"""
        # In real implementation, this would set up file watchers
        pass
    
    def _get_python_files(self) -> List[Path]:
        """Get all Python files in project"""
        return list(self.project_root.rglob("*.py"))
    
    def _scan_file_patterns(self, file_path: Path):
        """Scan a file for mock patterns"""
        self.scan_stats["files_scanned"] += 1
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                lines = content.split('\n')
                
            # Check each pattern category
            for category, patterns in self.mock_patterns.items():
                for pattern in patterns:
                    for match in re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE):
                        line_num = content[:match.start()].count('\n') + 1
                        self._add_finding(
                            file_path, line_num, category,
                            lines[line_num-1].strip() if line_num <= len(lines) else "",
                            pattern
                        )
                        
        except Exception as e:
            # Skip files that can't be read
            pass
    
    def _analyze_file_behavior(self, file_path: Path):
        """Analyze file for behavioral mock indicators"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            # Parse AST to analyze functions
            tree = ast.parse(content)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    self.scan_stats["functions_analyzed"] += 1
                    self._analyze_function(node, file_path, content)
                    
        except Exception as e:
            # Skip files that can't be parsed
            pass
    
    def _analyze_function(self, func_node: ast.FunctionDef, file_path: Path, content: str):
        """Analyze a function for mock behavior"""
        # Check for suspiciously simple functions
        if len(func_node.body) == 1:
            stmt = func_node.body[0]
            
            # Functions that just return a constant
            if isinstance(stmt, ast.Return) and isinstance(stmt.value, (ast.Constant, ast.Dict, ast.List)):
                self._add_finding(
                    file_path, func_node.lineno, "behavioral",
                    f"def {func_node.name}(...): return constant",
                    "constant_return"
                )
                
            # Functions that just pass
            elif isinstance(stmt, ast.Pass):
                self._add_finding(
                    file_path, func_node.lineno, "behavioral", 
                    f"def {func_node.name}(...): pass",
                    "empty_function"
                )
    
    def _check_integration_points(self):
        """Check common integration points for mocks"""
        # Check for database operations
        self._check_database_mocks()
        
        # Check for API endpoints
        self._check_api_mocks()
        
        # Check for authentication
        self._check_auth_mocks()
    
    def _check_database_mocks(self):
        """Look for mocked database operations"""
        db_files = self.project_root.rglob("*database*.py")
        for file_path in db_files:
            self._scan_file_patterns(file_path)
    
    def _check_api_mocks(self):
        """Look for mocked API endpoints"""
        api_files = list(self.project_root.rglob("*api*.py")) + \
                   list(self.project_root.rglob("*route*.py")) + \
                   list(self.project_root.rglob("*endpoint*.py"))
        for file_path in api_files:
            self._scan_file_patterns(file_path)
    
    def _check_auth_mocks(self):
        """Look for mocked authentication"""
        auth_files = list(self.project_root.rglob("*auth*.py")) + \
                    list(self.project_root.rglob("*login*.py"))
        for file_path in auth_files:
            self._scan_file_patterns(file_path)
    
    def _add_finding(self, file_path: Path, line_num: int, category: str, 
                    code_snippet: str, pattern: str):
        """Add a mock finding"""
        severity = self._calculate_severity(category, str(file_path))
        
        finding = MockFinding(
            file_path=str(file_path.relative_to(self.project_root)),
            line_number=line_num,
            severity=severity,
            category=category,
            description=self._get_description(category, pattern),
            code_snippet=code_snippet,
            suggested_fix=self._get_suggested_fix(category, code_snippet)
        )
        
        self.findings.append(finding)
    
    def _calculate_severity(self, category: str, file_path: str) -> str:
        """Calculate severity based on category and location"""
        critical_paths = ["auth", "payment", "security", "api", "database"]
        
        if any(critical in file_path.lower() for critical in critical_paths):
            if category in ["obvious_mocks", "placeholder_returns"]:
                return "CRITICAL"
            return "HIGH"
            
        if category == "obvious_mocks":
            return "HIGH"
        elif category in ["placeholder_returns", "behavioral"]:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _get_description(self, category: str, pattern: str) -> str:
        """Get human-readable description"""
        descriptions = {
            "obvious_mocks": "Found mock/TODO/FIXME marker",
            "placeholder_returns": "Function returns placeholder value",
            "fake_data": "Hardcoded test data detected",
            "error_suppressors": "Error handling suppressed",
            "behavioral": "Suspicious function behavior",
            "constant_return": "Function always returns same value",
            "empty_function": "Empty function implementation"
        }
        return descriptions.get(category, f"Mock pattern detected: {pattern}")
    
    def _get_suggested_fix(self, category: str, code_snippet: str) -> str:
        """Suggest how to fix the mock"""
        if "auth" in code_snippet.lower():
            return "Implement proper authentication with password hashing"
        elif "payment" in code_snippet.lower():
            return "Integrate real payment gateway (Stripe/PayPal)"
        elif "email" in code_snippet.lower():
            return "Configure SMTP or email service provider"
        elif "database" in code_snippet.lower():
            return "Implement actual database operations"
        elif category == "placeholder_returns":
            return "Replace with actual business logic"
        elif category == "fake_data":
            return "Use dynamic data from database or configuration"
        else:
            return "Implement actual functionality"
    
    def _generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive mock hunt report"""
        # Group findings by severity
        critical = [f for f in self.findings if f.severity == "CRITICAL"]
        high = [f for f in self.findings if f.severity == "HIGH"]
        medium = [f for f in self.findings if f.severity == "MEDIUM"]
        low = [f for f in self.findings if f.severity == "LOW"]
        
        # Calculate mock percentage
        total_functions = self.scan_stats["functions_analyzed"]
        mock_percentage = (len(self.findings) / total_functions * 100) if total_functions > 0 else 0
        
        report = {
            "summary": {
                "scan_duration": f"{self.scan_stats['scan_duration']:.2f}s",
                "files_scanned": self.scan_stats["files_scanned"],
                "functions_analyzed": self.scan_stats["functions_analyzed"],
                "mocks_found": len(self.findings),
                "mock_percentage": f"{mock_percentage:.1f}%",
                "severity_breakdown": {
                    "critical": len(critical),
                    "high": len(high),
                    "medium": len(medium),
                    "low": len(low)
                }
            },
            "findings": {
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low
            },
            "recommendations": self._get_recommendations(critical, high),
            "ready_for_production": len(critical) == 0 and len(high) < 3
        }
        
        return report
    
    def _get_recommendations(self, critical: List[MockFinding], high: List[MockFinding]) -> List[str]:
        """Generate action recommendations"""
        recommendations = []
        
        if critical:
            recommendations.append("🚨 URGENT: Fix all CRITICAL mocks before any deployment")
            
        if any("auth" in f.file_path for f in critical + high):
            recommendations.append("🔐 Implement proper authentication immediately")
            
        if any("payment" in f.file_path for f in critical + high):
            recommendations.append("💳 Connect real payment processing")
            
        if any("api" in f.file_path for f in critical + high):
            recommendations.append("🔌 Wire up API endpoints to actual services")
            
        if not recommendations:
            recommendations.append("✅ No critical issues found - good to deploy!")
            
        return recommendations

# CLI Interface
if __name__ == "__main__":
    import sys
    
    hunter = MockHunterAgent()
    
    if len(sys.argv) > 1:
        mode = sys.argv[1]
    else:
        mode = "deep"
        
    print("🔍 Mock Hunter Agent - Starting scan...")
    report = hunter.scan(mode)
    
    print(f"\n📊 Scan Complete in {report['summary']['scan_duration']}")
    print(f"Found {report['summary']['mocks_found']} mocks in {report['summary']['files_scanned']} files")
    print(f"Mock density: {report['summary']['mock_percentage']}")
    
    if report['findings']['critical']:
        print("\n🚨 CRITICAL FINDINGS:")
        for finding in report['findings']['critical'][:3]:
            print(f"  - {finding.file_path}:{finding.line_number} - {finding.description}")
            
    print("\n📋 Recommendations:")
    for rec in report['recommendations']:
        print(f"  {rec}")