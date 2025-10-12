/**
 * Sidebar Agent Panel - T009
 * Agent A (UI Velocity Specialist)
 *
 * Complete export index for the revolutionary sidebar agent panel with IPC integration,
 * OKLCH design tokens, and real-time agent collaboration features
 */

// Main components
export { default as SidebarPanel } from '../grid/components/SidebarPanel';
export { default as SidebarDemo } from '../grid/components/SidebarDemo';

// Types and interfaces
export type {
  AgentProposal,
  AgentAction,
  SidebarState,
  SidebarMode,
  SidebarPosition,
  SidebarAnimations,
  ContextMenuItem,
  AgentStatus,
  ActivityLogEntry,
  SidebarIPCMessage,
  SidebarProps,
  SidebarContainerProps,
  AgentProposalListProps,
  ContextMenuProps,
  QuickActionsProps,
  SettingsPanelProps,
} from './types';

// Utility functions
export {
  createNewProposal,
  updateProposalStatus,
  isValidProposal,
  SIDEBAR_DEFAULTS,
  PROPOSAL_STATUSES,
  AGENT_TYPES,
  AGENT_STATUSES,
} from './types';

// IPC integration
export {
  SidebarIPIClient,
  sidebarIPClient,
  type SidebarIPCMessage as IPCMessage,
  type ProposalIPCMessage,
  type SidebarToggleMessage,
  type AgentStatusMessage,
} from '../grid/utils/ipcIntegration';

// Design token integration
export {
  tokens,
  createGridStyles,
  createGridItemVariant,
  applyTheme,
  validateAPCAContrast,
  getOptimalTextColor,
  type GridTheme,
} from '../grid/utils/tokenIntegration';

// Default exports for convenience
export default SidebarPanel;