/**
 * Sidebar Component Types - T009
 * Agent A (UI Velocity Specialist)
 *
 * Type definitions for the sidebar agent panel with IPC integration
 * Integrates with Agent D's IPC system and Agent B's design tokens
 */

// Agent proposal data structure
export interface AgentProposal {
  id: string;
  agentId: string;
  agentName: string;
  agentType: 'ground' | 'specialist' | 'supervisor' | 'strategic';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  reasoning: string;
  expectedOutcome: string;
  estimatedTime: string; // ISO duration
  created: string; // ISO timestamp
  updated: string; // ISO timestamp
  metadata?: Record<string, any>;
  actions?: AgentAction[];
  dependencies?: string[];
}

// Agent action within proposal
export interface AgentAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'EXECUTE';
  target: string;
  parameters?: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

// Sidebar state management
export interface SidebarState {
  isOpen: boolean;
  mode: 'overlay' | 'push' | 'inline';
  activeTab: 'proposals' | 'agents' | 'activity' | 'settings';
  proposals: AgentProposal[];
  activeProposal: AgentProposal | null;
  isLoading: boolean;
  error?: string;
  animations: {
    toggle: boolean;
    transitions: boolean;
  };
  focusManagement: {
    focusedItem: string | null;
    keyboardNavigation: boolean;
  };
}

// Sidebar display modes
export type SidebarMode = 'overlay' | 'push' | 'inline';

// Sidebar positioning
export interface SidebarPosition {
  width: number;
  collapsedWidth: number;
  position: 'left' | 'right';
  zIndex: number;
}

// Animation configurations
export interface SidebarAnimations {
  toggle: {
    duration: number; // milliseconds
    easing: string;
  };
  transitions: {
    duration: number; // milliseconds
    easing: string;
  };
  reducedMotion: boolean;
}

// Context menu items
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

// Agent status display
export interface AgentStatus {
  agentId: string;
  agentName: string;
  status: 'active' | 'idle' | 'busy' | 'offline' | 'error';
  lastActivity: string;
  currentTask?: string;
  capabilities: string[];
}

// Activity log entry
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'proposal_created' | 'proposal_approved' | 'proposal_rejected' | 'action_executed' | 'error' | 'info';
  message: string;
  agentId?: string;
  proposalId?: string;
  metadata?: Record<string, any>;
}

// IPC message types for sidebar integration
export interface SidebarIPCMessage {
  type: 'SIDEBAR_TOGGLE' | 'PROPOSAL_CREATE' | 'PROPOSAL_UPDATE' | 'PROPOSAL_APPROVE' | 'PROPOSAL_REJECT' | 'AGENT_STATUS_UPDATE' | 'ACTIVITY_LOG';
  data: any;
  timestamp: string;
  requestId?: string;
}

// Sidebar component props
export interface SidebarProps {
  state: SidebarState;
  proposals: AgentProposal[];
  onToggle: (isOpen: boolean) => void;
  onProposalAction: (proposalId: string, action: string, data?: any) => void;
  onContextAction: (action: string, data?: any) => void;
  onAgentSelect?: (agentId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Sidebar container props
export interface SidebarContainerProps {
  isOpen: boolean;
  mode: SidebarMode;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  width?: number;
  collapsedWidth?: number;
  position?: 'left' | 'right';
  animations?: SidebarAnimations;
  enableKeyboardNav?: boolean;
  enableFocusTrap?: boolean;
  reducedMotion?: boolean;
}

// Agent proposal list props
export interface AgentProposalListProps {
  proposals: AgentProposal[];
  activeProposal?: AgentProposal | null;
  onProposalSelect: (proposal: AgentProposal) => void;
  onProposalAction: (proposalId: string, action: string, data?: any) => void;
  isLoading?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  className?: string;
}

// Context menu props
export interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  className?: string;
  keyboardNav?: boolean;
}

// Quick actions props
export interface QuickActionsProps {
  onCreateProposal: () => void;
  onRefreshProposals: () => void;
  onToggleSidebar: () => void;
  onSettings: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Settings panel props
export interface SettingsPanelProps {
  sidebarState: Partial<SidebarState>;
  onUpdateSetting: (key: keyof SidebarState, value: any) => void;
  onResetSettings: () => void;
  className?: string;
}

// Constants
export const SIDEBAR_DEFAULTS = {
  width: 320,
  collapsedWidth: 64,
  position: 'right' as const,
  zIndex: 1000,
  animations: {
    toggle: { duration: 200, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
    transitions: { duration: 150, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
    reducedMotion: false,
  },
} as const;

export const PROPOSAL_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXECUTING: 'executing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const AGENT_TYPES = {
  GROUND: 'ground',
  SPECIALIST: 'specialist',
  SUPERVISOR: 'supervisor',
  STRATEGIC: 'strategic',
} as const;

export const AGENT_STATUSES = {
  ACTIVE: 'active',
  IDLE: 'idle',
  BUSY: 'busy',
  OFFLINE: 'offline',
  ERROR: 'error',
} as const;

// Utility functions
export function createNewProposal(
  agentId: string,
  agentName: string,
  agentType: AgentProposal['agentType'],
  title: string,
  description: string,
  expectedOutcome: string
): AgentProposal {
  const id = `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  return {
    id,
    agentId,
    agentName,
    agentType,
    title,
    description,
    status: PROPOSAL_STATUSES.PENDING,
    priority: 'medium',
    confidence: 80,
    reasoning: 'Default reasoning - to be updated by agent',
    expectedOutcome,
    estimatedTime: 'PT5M',
    created: now,
    updated: now,
  };
}

export function updateProposalStatus(
  proposal: AgentProposal,
  status: AgentProposal['status'],
  metadata?: Record<string, any>
): AgentProposal {
  return {
    ...proposal,
    status,
    updated: new Date().toISOString(),
    ...(metadata && { metadata: { ...proposal.metadata, ...metadata } }),
  };
}

export function isValidProposal(proposal: any): proposal is AgentProposal {
  return (
    proposal &&
    typeof proposal.id === 'string' &&
    typeof proposal.agentId === 'string' &&
    typeof proposal.title === 'string' &&
    Object.values(PROPOSAL_STATUSES).includes(proposal.status) &&
    typeof proposal.confidence === 'number' &&
    proposal.confidence >= 0 &&
    proposal.confidence <= 100
  );
}