/**
 * SidebarPanel - T009
 * Agent A (UI Velocity Specialist)
 *
 * Revolutionary sidebar agent panel with IPC integration, OKLCH design tokens,
 * and real-time agent collaboration features
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type {
  AgentProposal,
  SidebarState,
  ContextMenuItem,
  SidebarProps,
  SidebarMode,
  AgentStatus,
  ActivityLogEntry,
} from '../sidebar/types';
import {
  tokens,
  createGridStyles,
  createGridItemVariant,
  applyTheme,
  type GridTheme
} from '../utils/tokenIntegration';
import { sidebarIPClient } from '../utils/ipcIntegration';

// Internal sidebar components
const AgentProposalItem: React.FC<{
  proposal: AgentProposal;
  isActive: boolean;
  onSelect: (proposal: AgentProposal) => void;
  onAction: (proposalId: string, action: string) => void;
  theme: GridTheme;
}> = ({ proposal, isActive, onSelect, onAction, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    pending: tokens.colors.warning,
    approved: tokens.colors.success,
    rejected: tokens.colors.error,
    executing: tokens.colors.accent,
    completed: tokens.colors.muted,
    failed: tokens.colors.error,
  };

  const statusConfig = statusColors[proposal.status] || tokens.colors.muted;
  const gridStyles = useMemo(() => applyTheme(theme), [theme]);

  const itemStyle = useMemo(() => ({
    ...gridStyles.gridItem,
    ...createGridItemVariant(proposal.status === 'approved' ? 'success' : proposal.status === 'rejected' ? 'error' : 'default'),
    borderLeft: `4px solid ${statusConfig.border}`,
    ...(isActive && {
      backgroundColor: tokens.colors.accent.bgSubtle,
      borderColor: tokens.colors.accent.border,
    }),
    ...(isHovered && {
      transform: 'translateX(2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }),
  }), [proposal.status, isActive, isHovered, gridStyles, theme]);

  return (
    <div
      style={itemStyle}
      onClick={() => onSelect(proposal)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Proposal ${proposal.title} by ${proposal.agentName}, status: ${proposal.status}`}
      aria-selected={isActive}
    >
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        backgroundColor: statusConfig.border,
      }} />

      {/* Content */}
      <div style={{
        padding: tokens.spacing.md,
        paddingLeft: tokens.spacing.lg,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: tokens.spacing.sm,
        }}>
          <div>
            <div style={{
              ...gridStyles.text.primary,
              color: theme.colorScheme === 'dark' ? 'oklch(0.95 0.01 250)' : tokens.colors.surface.text,
              fontWeight: tokens.typography.fontWeight.semibold,
              fontSize: tokens.typography.fontSize.base,
              marginBottom: tokens.spacing.xs,
            }}>
              {proposal.title}
            </div>
            <div style={{
              ...gridStyles.text.secondary,
              color: theme.colorScheme === 'dark' ? 'oklch(0.7 0.01 250)' : tokens.colors.surface.textMuted,
              fontSize: tokens.typography.fontSize.sm,
            }}>
              {proposal.agentName} • {proposal.agentType}
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
            borderRadius: tokens.borderRadius.full,
            backgroundColor: statusConfig.bg,
            color: statusConfig.text,
            fontSize: tokens.typography.fontSize.xs,
            fontWeight: tokens.typography.fontWeight.medium,
            textTransform: 'uppercase',
          }}>
            {proposal.status}
          </div>
        </div>

        {/* Description */}
        <div style={{
          ...gridStyles.text.secondary,
          marginBottom: tokens.spacing.sm,
          lineHeight: tokens.typography.lineHeight.normal,
        }}>
          {proposal.description}
        </div>

        {/* Expected Outcome */}
        <div style={{
          padding: tokens.spacing.sm,
          backgroundColor: tokens.colors.surface.bgSubtle,
          borderRadius: tokens.borderRadius.sm,
          border: `1px solid ${tokens.colors.surface.border}`,
          marginBottom: tokens.spacing.sm,
        }}>
          <div style={{
            ...gridStyles.text.secondary,
            fontWeight: tokens.typography.fontWeight.semibold,
            marginBottom: tokens.spacing.xs,
            color: tokens.colors.surface.text,
          }}>
            Expected Outcome:
          </div>
          <div style={{
            ...gridStyles.text.secondary,
            fontSize: tokens.typography.fontSize.sm,
            color: tokens.colors.surface.textMuted,
          }}>
            {proposal.expectedOutcome}
          </div>
        </div>

        {/* Confidence and Priority */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: tokens.spacing.md,
        }}>
          <div>
            <div style={{
              ...gridStyles.text.secondary,
              fontSize: tokens.typography.fontSize.xs,
              marginBottom: tokens.spacing.xs,
            }}>
              Confidence
            </div>
            <div style={{
              ...gridStyles.text.primary,
              fontWeight: tokens.typography.fontWeight.semibold,
            }}>
              {proposal.confidence}%
            </div>
          </div>

          <div>
            <div style={{
              ...gridStyles.text.secondary,
              fontSize: tokens.typography.fontSize.xs,
              marginBottom: tokens.spacing.xs,
            }}>
              Priority
            </div>
            <div style={{
              ...gridStyles.text.primary,
              fontWeight: tokens.typography.fontWeight.semibold,
              color: proposal.priority === 'critical' ? tokens.colors.error.text : tokens.colors.surface.text,
            }}>
              {proposal.priority}
            </div>
          </div>
        </div>

        {/* Action buttons for pending proposals */}
        {proposal.status === 'pending' && (
          <div style={{
            display: 'flex',
            gap: tokens.spacing.sm,
            marginTop: tokens.spacing.md,
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(proposal.id, 'approve');
              }}
              style={{
                flex: 1,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.success.bg,
                color: tokens.colors.success.text,
                cursor: 'pointer',
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!theme.reducedMotion) {
                  e.currentTarget.style.backgroundColor = tokens.colors.success.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!theme.reducedMotion) {
                  e.currentTarget.style.backgroundColor = tokens.colors.success.bg;
                }
              }}
            >
              Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(proposal.id, 'reject');
              }}
              style={{
                flex: 1,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.error.bg,
                color: tokens.colors.error.text,
                cursor: 'pointer',
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!theme.reducedMotion) {
                  e.currentTarget.style.backgroundColor = tokens.colors.error.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!theme.reducedMotion) {
                  e.currentTarget.style.backgroundColor = tokens.colors.error.bg;
                }
              }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActions: React.FC<{
  onCreateProposal: () => void;
  onRefreshProposals: () => void;
  onToggleSidebar: () => void;
  onSettings: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  theme: GridTheme;
}> = ({
  onCreateProposal,
  onRefreshProposals,
  onToggleSidebar,
  onSettings,
  isLoading = false,
  disabled = false,
  theme,
}) => {
  const gridStyles = useMemo(() => applyTheme(theme), [theme]);

  return (
    <div style={{
      display: 'flex',
      gap: tokens.spacing.sm,
      padding: tokens.spacing.md,
      backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
      borderRadius: tokens.borderRadius.lg,
      border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
    }}>
      <button
        onClick={onCreateProposal}
        disabled={disabled}
        style={{
          flex: 1,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          backgroundColor: disabled
            ? tokens.colors.interactive.bgDisabled
            : tokens.colors.interactive.bg,
          color: disabled
            ? tokens.colors.interactive.textDisabled
            : tokens.colors.interactive.text,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.xs,
        }}
      >
        <span>➕</span>
        <span>New Proposal</span>
      </button>

      <button
        onClick={onRefreshProposals}
        disabled={disabled || isLoading}
        style={{
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          backgroundColor: disabled
            ? tokens.colors.interactive.bgDisabled
            : tokens.colors.muted.bg,
          color: disabled
            ? tokens.colors.interactive.textDisabled
            : tokens.colors.muted.text,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
        }}
      >
        {isLoading ? (
          <span>⟳</span>
        ) : (
          <span>↻</span>
        )}
        <span>Refresh</span>
      </button>

      <button
        onClick={onSettings}
        style={{
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          backgroundColor: tokens.colors.surface.bg,
          color: tokens.colors.surface.text,
          cursor: 'pointer',
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
        }}
      >
        <span>⚙</span>
        <span>Settings</span>
      </button>

      <button
        onClick={onToggleSidebar}
        style={{
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          backgroundColor: tokens.colors.surface.bg,
          color: tokens.colors.surface.text,
          cursor: 'pointer',
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
        }}
      >
        <span>×</span>
        <span>Close</span>
      </button>
    </div>
  );
};

const ActivityLog: React.FC<{
  entries: ActivityLogEntry[];
  theme: GridTheme;
}> = ({ entries, theme }) => {
  const gridStyles = useMemo(() => applyTheme(theme), [theme]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.sm,
      maxHeight: '300px',
      overflowY: 'auto',
      padding: tokens.spacing.md,
      backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
      borderRadius: tokens.borderRadius.lg,
      border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
    }}>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          style={{
            padding: tokens.spacing.sm,
            backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.12 0.02 250)' : tokens.colors.surface.bg,
            borderRadius: tokens.borderRadius.sm,
            border: `1px solid ${tokens.colors.surface.border}`,
            fontSize: tokens.typography.fontSize.xs,
            lineHeight: tokens.typography.lineHeight.tight,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: tokens.spacing.xs,
          }}>
            <span style={{
              color: tokens.colors.surface.textMuted,
              fontSize: tokens.typography.fontSize.xs,
            }}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span
              style={{
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                borderRadius: tokens.borderRadius.full,
                backgroundColor:
                  entry.type === 'error'
                    ? tokens.colors.error.bg
                    : entry.type === 'success'
                    ? tokens.colors.success.bg
                    : tokens.colors.muted.bg,
                color:
                  entry.type === 'error'
                    ? tokens.colors.error.text
                    : entry.type === 'success'
                    ? tokens.colors.success.text
                    : tokens.colors.muted.text,
                fontSize: tokens.typography.fontSize.xs,
                fontWeight: tokens.typography.fontWeight.medium,
                textTransform: 'uppercase',
              }}
            >
              {entry.type}
            </span>
          </div>
          <div style={{
            color: theme.colorScheme === 'dark' ? 'oklch(0.9 0.01 250)' : tokens.colors.surface.text,
            fontSize: tokens.typography.fontSize.sm,
          }}>
            {entry.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SidebarPanel: React.FC<SidebarProps> = ({
  state,
  proposals,
  onToggle,
  onProposalAction,
  onContextAction,
  onAgentSelect,
  className,
  style,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<'proposals' | 'agents' | 'activity' | 'settings'>('proposals');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: { x: number; y: number };
    items: ContextMenuItem[];
  }>({ show: false, position: { x: 0, y: 0 }, items: [] });

  // Apply design tokens
  const gridStyles = useMemo(() => applyTheme({
    colorScheme: state.animations.transitions ? 'light' : 'dark',
    reducedMotion: state.animations.reducedMotion,
    highContrast: false,
  }), [state.animations.transitions, state.animations.reducedMotion]);

  const sidebarWidth = state.isOpen ? gridStyles.gridItem.width || 320 : 64;
  const sidebarTransform = state.mode === 'push' ? 'translateX(0)' : 'translateX(100%)';

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items: ContextMenuItem[] = [
      {
        id: 'refresh',
        label: 'Refresh Proposals',
        icon: '↻',
        action: () => {
          // Refresh logic would go here
          setContextMenu({ show: false, position: { x: 0, y: 0 }, items: [] });
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: '⚙',
        action: () => {
          // Settings logic would go here
          setContextMenu({ show: false, position: { x: 0, y: 0 }, items: [] });
        },
      },
      {
        id: 'help',
        label: 'Help',
        icon: '?',
        action: () => {
          // Help logic would go here
          setContextMenu({ show: false, position: { x: 0, y: 0 }, items: [] });
        },
      },
      {
        id: 'separator',
        label: '',
        separator: true,
        action: () => {},
      },
    ];

    setContextMenu({
      show: true,
      position: { x: e.clientX, y: e.clientY },
      items,
    });
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu({ show: false, position: { x: 0, y: 0 }, items: [] });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.show]);

  // Handle sidebar animations
  useEffect(() => {
    if (sidebarRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [state.isOpen, state.mode]);

  return (
    <>
      <div
        ref={sidebarRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: `${sidebarWidth}px`,
          zIndex: 1000,
          backgroundColor: gridStyles.gridItem.backgroundColor,
          borderColor: gridStyles.gridItem.borderColor,
          borderLeft: `1px solid ${gridStyles.gridItem.borderColor}`,
          transform: sidebarTransform,
          transition: state.animations.transitions && !isAnimating
            ? `transform ${gridStyles.gridItem.transition}, width ${gridStyles.gridItem.transition}`
            : state.animations.reducedMotion
            ? 'none'
            : 'all 0.2s ease',
          boxShadow: state.isOpen
            ? '0 4px 24px rgba(0, 0, 0, 0.15)'
            : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
        role="complementary"
        aria-label="Agent collaboration sidebar"
        aria-hidden={!state.isOpen}
      >
        {/* Header */}
        <div style={{
          padding: tokens.spacing.lg,
          borderBottom: `1px solid ${gridStyles.gridItem.borderColor}`,
          backgroundColor: gridStyles.gridItem.backgroundColor,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: tokens.spacing.md,
          }}>
            <h3 style={{
              margin: 0,
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.surface.text,
            }}>
              Agent Panel
            </h3>

            <div style={{
              display: 'flex',
              gap: tokens.spacing.sm,
              alignItems: 'center',
            }}>
              <span
                style={{
                  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                  borderRadius: tokens.borderRadius.full,
                  backgroundColor: proposals.length > 0 ? tokens.colors.success.bg : tokens.colors.muted.bg,
                  color: proposals.length > 0 ? tokens.colors.success.text : tokens.colors.muted.text,
                  fontSize: tokens.typography.fontSize.xs,
                  fontWeight: tokens.typography.fontWeight.medium,
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {proposals.length}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions
            onCreateProposal={() => {
              // Create proposal logic would use sidebarIPClient
            }}
            onRefreshProposals={() => {
              // Refresh logic would use sidebarIPClient
            }}
            onToggleSidebar={() => onToggle(!state.isOpen)}
            onSettings={() => {
              setActiveTab('settings');
            }}
            isLoading={state.isLoading}
            disabled={!state.isOpen}
            theme={{
              colorScheme: 'light',
              reducedMotion: state.animations.reducedMotion,
              highContrast: false,
            }}
          />

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: tokens.spacing.sm,
            marginBottom: tokens.spacing.lg,
            borderBottom: `1px solid ${gridStyles.gridItem.borderColor}`,
            paddingBottom: tokens.spacing.md,
          }}>
            {[
              { id: 'proposals', label: 'Proposals', count: proposals.length },
              { id: 'agents', label: 'Agents', count: 0 },
              { id: 'activity', label: 'Activity', count: 0 },
              { id: 'settings', label: 'Settings', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  border: 'none',
                  borderRadius: tokens.borderRadius.md,
                  backgroundColor:
                    activeTab === tab.id
                      ? tokens.colors.accent.bg
                      : 'transparent',
                  color:
                    activeTab === tab.id
                      ? tokens.colors.accent.text
                      : tokens.colors.surface.textMuted,
                  cursor: 'pointer',
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight:
                    activeTab === tab.id
                      ? tokens.typography.fontWeight.semibold
                      : tokens.typography.fontWeight.medium,
                  transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor:
                        activeTab === tab.id
                          ? tokens.colors.interactive.bg
                          : tokens.colors.error.bg,
                      color:
                        activeTab === tab.id
                          ? tokens.colors.interactive.text
                          : tokens.colors.interactive.textDisabled,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: tokens.typography.fontWeight.bold,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeTab === 'proposals' && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: tokens.spacing.md,
              }}
            >
              {propososals.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: tokens.spacing.xl,
                    color: tokens.colors.surface.textMuted,
                  }}
                >
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: tokens.spacing.md,
                  }}>
                    📋
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: tokens.typography.fontSize.lg,
                      fontWeight: tokens.typography.fontWeight.semibold,
                    }}
                  >
                    No Active Proposals
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: tokens.typography.fontSize.base,
                      lineHeight: tokens.typography.lineHeight.normal,
                    }}
                  >
                    Agents will submit proposals here for your review and action.
                  </p>
                </div>
              ) : (
                proposals.map((proposal) => (
                  <AgentProposalItem
                    key={proposal.id}
                    proposal={proposal}
                    isActive={state.activeProposal?.id === proposal.id}
                    onSelect={(selectedProposal) => {
                      // Handle selection logic
                    }}
                    onAction={onProposalAction}
                    theme={{
                      colorScheme: 'light',
                      reducedMotion: state.animations.reducedMotion,
                      highContrast: false,
                    }}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: tokens.spacing.md,
              }}
            >
              <ActivityLog
                entries={[]}
                theme={{
                  colorScheme: 'light',
                  reducedMotion: state.animations.reducedMotion,
                  highContrast: false,
                }}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: tokens.spacing.md,
              }}
            >
              <div style={{
                marginBottom: tokens.spacing.lg,
              }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: tokens.typography.fontSize.lg,
                    fontWeight: tokens.typography.fontWeight.semibold,
                  }}
                >
                  Settings
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: tokens.colors.surface.textMuted,
                    fontSize: tokens.typography.fontSize.sm,
                  }}
                >
                  Configure your sidebar preferences and display options.
                </p>
              </div>

              {/* Settings options would go here */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.md,
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.md,
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={state.animations.transitions}
                    onChange={(e) => {
                      // Update animations
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <span>Enable Animations</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.md,
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={state.animations.reducedMotion}
                    onChange={(e) => {
                      // Update reduced motion
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <span>Reduced Motion</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.md,
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={state.focusManagement.keyboardNavigation}
                    onChange={(e) => {
                      // Update keyboard navigation
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <span>Keyboard Navigation</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: tokens.spacing.lg,
            borderTop: `1px solid ${gridStyles.gridItem.borderColor}`,
            backgroundColor: gridStyles.gridItem.backgroundColor,
            fontSize: tokens.typography.fontSize.xs,
            color: tokens.colors.surface.textMuted,
            textAlign: 'center',
          }}
        >
          <div>
            <strong>Connected:</strong> {sidebarIPClient.isReady() ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Mode:</strong> {state.mode}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.position.x,
            top: contextMenu.position.y,
            zIndex: 2000,
            backgroundColor: gridStyles.gridItem.backgroundColor,
            border: `1px solid ${gridStyles.gridItem.borderColor}`,
            borderRadius: tokens.borderRadius.md,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            padding: tokens.spacing.xs,
            zIndex: 2000,
          }}
          onClick={() => {
            setContextMenu({ show: false, position: { x: 0, y: 0 }, items: [] });
          }}
        >
          {contextMenu.items.map((item) =>
            item.separator ? (
              <hr
                key={item.id}
                style={{
                  margin: `${tokens.spacing.xs} 0`,
                  border: 'none',
                  borderTop: `1px solid ${gridStyles.gridItem.borderColor}`,
                }}
              />
            ) : (
              <button
                key={item.id}
                onClick={() => item.action()}
                style={{
                  width: '100%',
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: tokens.colors.surface.text,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: tokens.typography.fontSize.sm,
                  transition: 'all 0.1s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.sm,
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
        </div>
      )}

      {/* Overlay for overlay mode */}
      {state.mode === 'overlay' && state.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            onClick={() => onToggle(false),
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default SidebarPanel;