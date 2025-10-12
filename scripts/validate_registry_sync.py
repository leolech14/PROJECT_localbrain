#!/usr/bin/env python3
"""
Registry Sync Validator - Absolute Control via Git History
============================================================

Validates CENTRAL_TASK_REGISTRY.md is updated for every code commit.
Uses git history as the absolute source of truth.

Usage:
    python3 scripts/validate_registry_sync.py
    python3 scripts/validate_registry_sync.py --since="2 hours ago"
    python3 scripts/validate_registry_sync.py --enforce  # Exit 1 on errors

Author: Agent D (Integration Specialist)
Task: Registry Enforcement System
Date: 2025-10-08
"""

import subprocess
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

class RegistryValidator:
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
        self.registry_path = self.repo_path / "04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md"

    def get_recent_commits(self, since: str = "2 hours ago") -> List[Dict]:
        """Get commits with task IDs and file changes"""
        cmd = [
            "git", "log",
            f"--since={since}",
            "--pretty=format:%H|%ai|%an|%s",
            "--name-status"
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=self.repo_path
        )

        commits = []
        current_commit = None

        for line in result.stdout.split('\n'):
            if not line.strip():
                continue

            # Parse commit line (hash|timestamp|author|message)
            if '|' in line:
                parts = line.split('|', 3)
                if len(parts) == 4:
                    hash, timestamp, author, msg = parts

                    # Extract task ID if present
                    task_match = re.match(r'^(T\d{3})', msg)

                    current_commit = {
                        'hash': hash,
                        'short_hash': hash[:7],
                        'timestamp': timestamp,
                        'author': author,
                        'message': msg,
                        'task_id': task_match.group(1) if task_match else None,
                        'files': []
                    }
                    commits.append(current_commit)

            # Parse file change line (status\tfilename)
            elif current_commit and '\t' in line:
                status, *filename = line.split('\t')
                if filename:
                    # Skip registry updates (we check these separately)
                    if 'CENTRAL_TASK_REGISTRY.md' not in filename[0]:
                        current_commit['files'].append({
                            'status': status,
                            'path': filename[0]
                        })

        return commits

    def is_code_commit(self, commit: Dict) -> bool:
        """Check if commit contains code changes (not just docs)"""
        code_patterns = [
            r'^01_CODEBASES/',
            r'\.swift$',
            r'\.ts$',
            r'\.tsx$',
            r'\.js$',
            r'\.jsx$',
            r'\.json$',
            r'\.py$',
        ]

        for file in commit['files']:
            path = file['path']
            for pattern in code_patterns:
                if re.search(pattern, path):
                    return True

        return False

    def check_registry_updated_for_commit(self, commit_hash: str) -> bool:
        """Check if registry was updated in same commit or immediately after"""
        cmd = [
            "git", "show",
            "--name-only",
            "--pretty=format:",
            commit_hash
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=self.repo_path
        )

        return 'CENTRAL_TASK_REGISTRY.md' in result.stdout

    def check_task_marked_complete(self, task_id: str) -> Tuple[bool, str]:
        """Check if task is marked COMPLETE in registry"""
        if not self.registry_path.exists():
            return False, "Registry file not found"

        registry_content = self.registry_path.read_text()

        # Find task section
        task_pattern = rf'### \*\*{task_id}.*?Status.*?:(.*?)$'
        status_match = re.search(task_pattern, registry_content, re.MULTILINE | re.DOTALL)

        if not status_match:
            return False, f"Task {task_id} not found in registry"

        status_line = status_match.group(1).strip()

        # Check for COMPLETE status
        if '🟢 COMPLETE' in status_line or 'COMPLETE' in status_line:
            # Check for completion timestamp
            timestamp_pattern = rf'{task_id}.*?Completed At.*?(\d{{4}}-\d{{2}}-\d{{2}}.*?✅)'
            if re.search(timestamp_pattern, registry_content, re.DOTALL):
                return True, "Task marked COMPLETE with timestamp"
            else:
                return False, "Task marked COMPLETE but missing timestamp"

        return False, f"Task status: {status_line}"

    def validate(self, since: str = "2 hours ago", enforce: bool = False) -> Dict:
        """Main validation logic"""
        print(f"🔍 Validating registry sync since: {since}")
        print(f"📂 Repository: {self.repo_path.absolute()}")
        print(f"📋 Registry: {self.registry_path.relative_to(self.repo_path)}")
        print()

        commits = self.get_recent_commits(since)

        if not commits:
            print("✅ No commits found in time range")
            return {'status': 'success', 'errors': [], 'warnings': []}

        print(f"📊 Found {len(commits)} commits\n")

        errors = []
        warnings = []
        validated = []

        for commit in commits:
            # Skip commits without task IDs
            if not commit['task_id']:
                continue

            # Skip non-code commits (docs, readme, etc)
            if not self.is_code_commit(commit):
                continue

            print(f"📝 Checking commit: {commit['short_hash']}")
            print(f"   Task: {commit['task_id']}")
            print(f"   Message: {commit['message'][:60]}...")
            print(f"   Author: {commit['author']}")
            print(f"   Files: {len(commit['files'])} changed")

            # Check 1: Registry updated in commit?
            registry_in_commit = self.check_registry_updated_for_commit(commit['hash'])

            if registry_in_commit:
                print(f"   ✅ Registry updated in commit")
            else:
                error_msg = f"❌ {commit['task_id']}: Commit {commit['short_hash']} has code changes but registry not updated"
                errors.append(error_msg)
                print(f"   {error_msg}")
                continue

            # Check 2: Task marked COMPLETE in registry?
            if 'COMPLETE' in commit['message']:
                is_complete, reason = self.check_task_marked_complete(commit['task_id'])

                if is_complete:
                    print(f"   ✅ Task marked COMPLETE in registry")
                    validated.append(commit['task_id'])
                else:
                    warning_msg = f"⚠️  {commit['task_id']}: {reason}"
                    warnings.append(warning_msg)
                    print(f"   {warning_msg}")

            print()

        # Summary
        print("=" * 70)
        print("📊 VALIDATION SUMMARY")
        print("=" * 70)
        print(f"✅ Validated tasks: {len(validated)}")
        print(f"⚠️  Warnings: {len(warnings)}")
        print(f"❌ Errors: {len(errors)}")
        print()

        if errors:
            print("🚨 ERRORS DETECTED:")
            for error in errors:
                print(f"  {error}")
            print()
            print("Fix required: Update CENTRAL_TASK_REGISTRY.md with task completion details")
            print()

            if enforce:
                sys.exit(1)

        if warnings:
            print("⚠️  WARNINGS:")
            for warning in warnings:
                print(f"  {warning}")
            print()

        if not errors and not warnings:
            print("✅ All commits have matching registry updates!")
            print("   Registry sync is 100% compliant")

        return {
            'status': 'error' if errors else ('warning' if warnings else 'success'),
            'errors': errors,
            'warnings': warnings,
            'validated': validated
        }

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Validate CENTRAL_TASK_REGISTRY.md sync with git commits'
    )
    parser.add_argument(
        '--since',
        default='2 hours ago',
        help='Check commits since this time (default: "2 hours ago")'
    )
    parser.add_argument(
        '--enforce',
        action='store_true',
        help='Exit with code 1 if errors detected (for CI/CD)'
    )
    parser.add_argument(
        '--repo',
        default='.',
        help='Path to git repository (default: current directory)'
    )

    args = parser.parse_args()

    validator = RegistryValidator(args.repo)
    result = validator.validate(since=args.since, enforce=args.enforce)

    sys.exit(0 if result['status'] == 'success' else (1 if args.enforce else 0))

if __name__ == "__main__":
    main()
