/**
 * Task Parser - Extracts tasks from CENTRAL_TASK_REGISTRY.md
 * Simple markdown parsing, no dependencies needed
 */

import * as fs from 'fs';
import * as path from 'path';

export interface Task {
  id: string;
  title: string;
  agent: string;
  status: string;
  priority: string;
  timeline: string;
  dependencies: string[];
  acceptanceCriteria: string[];
  filesToCreate: string[];
  location?: string;
  description: string;
}

export function parseMarkdown(registryPath: string): Task[] {
  const content = fs.readFileSync(registryPath, 'utf-8');
  const tasks: Task[] = [];

  // Match task blocks: ### **T001 - Title**
  const taskRegex = /### \*\*T(\d+) - (.+?)\*\*/g;
  const matches = [...content.matchAll(taskRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const taskId = `T${match[1]}`;
    const title = match[2].replace(/\s+⚡.*$/, '').replace(/\s+🔥.*$/, '').trim();

    // Extract section for this task
    const startIdx = match.index!;
    const endIdx = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    const section = content.substring(startIdx, endIdx);

    // Extract fields
    const agent = extractField(section, 'Agent') || 'Unknown';
    const status = extractStatus(section);
    const priority = extractField(section, 'Priority') || 'P2';
    const timeline = extractField(section, 'Timeline') || 'Unknown';
    const dependencies = extractDependencies(section);
    const acceptanceCriteria = extractAcceptanceCriteria(section);
    const files = extractFiles(section);
    const location = extractField(section, 'Location');

    // Build description from deliverables
    const description = extractDescription(section);

    tasks.push({
      id: taskId,
      title,
      agent,
      status,
      priority,
      timeline,
      dependencies,
      acceptanceCriteria,
      filesToCreate: files,
      location,
      description
    });
  }

  return tasks;
}

function extractField(section: string, field: string): string | undefined {
  const regex = new RegExp(`- \\*\\*${field}\\*\\*:\\s*(.+?)(?:\\n|$)`, 'i');
  const match = section.match(regex);
  return match ? match[1].trim().replace(/[🟢🟡❌✅⚡🔥]/g, '').trim() : undefined;
}

function extractStatus(section: string): string {
  const statusMatch = section.match(/- \*\*Status\*\*:\s*(.+)/);
  if (!statusMatch) return 'UNKNOWN';

  const status = statusMatch[1];
  if (status.includes('COMPLETE')) return 'COMPLETE';
  if (status.includes('IN_PROGRESS')) return 'IN_PROGRESS';
  if (status.includes('CLAIMED')) return 'CLAIMED';
  if (status.includes('AVAILABLE')) return 'AVAILABLE';
  if (status.includes('BLOCKED')) return 'BLOCKED';
  return 'UNKNOWN';
}

function extractDependencies(section: string): string[] {
  const depsMatch = section.match(/- \*\*Dependencies\*\*:\s*DEPS:\s*\[([^\]]*)\]/);
  if (!depsMatch || !depsMatch[1].trim()) return [];

  return depsMatch[1]
    .split(',')
    .map(d => d.trim().replace(/✅/g, '').trim())
    .filter(d => d.length > 0);
}

function extractAcceptanceCriteria(section: string): string[] {
  const criteria: string[] = [];
  const lines = section.split('\n');

  let inCriteriaSection = false;
  for (const line of lines) {
    if (line.includes('**Acceptance Criteria**')) {
      inCriteriaSection = true;
      continue;
    }

    if (inCriteriaSection) {
      if (line.match(/^  - \[x\]/) || line.match(/^  - \[ \]/)) {
        const criterion = line.replace(/^  - \[[x ]\]\s*/, '').trim();
        if (criterion) criteria.push(criterion);
      } else if (line.match(/^- \*\*/) || line.match(/^###/)) {
        break; // End of criteria section
      }
    }
  }

  return criteria;
}

function extractFiles(section: string): string[] {
  const files: string[] = [];
  const lines = section.split('\n');

  let inFilesSection = false;
  for (const line of lines) {
    if (line.includes('**Files Created**') || line.includes('**Deliverables**')) {
      inFilesSection = true;
      continue;
    }

    if (inFilesSection) {
      // Match file paths like: - `src/index.ts` or - src/index.ts
      const fileMatch = line.match(/^\s*[-•]\s*`?([a-zA-Z0-9_\-/.]+\.[a-zA-Z]+)`?/);
      if (fileMatch) {
        files.push(fileMatch[1]);
      } else if (line.match(/^- \*\*/) || line.match(/^###/)) {
        break; // End of files section
      }
    }
  }

  return files;
}

function extractDescription(section: string): string {
  const deliverables: string[] = [];
  const lines = section.split('\n');

  let inDeliverables = false;
  for (const line of lines) {
    if (line.includes('**Deliverables**')) {
      inDeliverables = true;
      continue;
    }

    if (inDeliverables) {
      if (line.match(/^  - /)) {
        const item = line.replace(/^  - /, '').replace(/✅/g, '').trim();
        if (item) deliverables.push(item);
      } else if (line.match(/^- \*\*/) || line.match(/^###/)) {
        break;
      }
    }
  }

  return deliverables.join('\n') || 'No description available';
}

export function allDependenciesSatisfied(dependencies: string[], allTasks: Task[]): boolean {
  if (dependencies.length === 0) return true;

  for (const depId of dependencies) {
    const depTask = allTasks.find(t => t.id === depId);
    if (!depTask || depTask.status !== 'COMPLETE') {
      return false;
    }
  }

  return true;
}
