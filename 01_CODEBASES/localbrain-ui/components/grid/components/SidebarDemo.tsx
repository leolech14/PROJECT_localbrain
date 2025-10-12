/**
 * SidebarDemo - T009
 * Agent A (UI Velocity Specialist)
 *
 * Complete demonstration of the revolutionary sidebar agent panel with IPC integration,
 * OKLCH design tokens, and real-time agent collaboration features
 */

import React, { useState, useCallback } from 'react';
import type { AgentProposal, SidebarState } from '../sidebar/types';
import { createNewProposal, updateProposalStatus } from '../sidebar/types';
import SidebarPanel from './SidebarPanel';
import { tokens, applyTheme, type GridTheme } from '../utils/tokenIntegration';
import { sidebarIPClient } from '../utils/ipcIntegration';

// Mock agent data for demonstration
const mockProposals: AgentProposal[] = [
  createNewProposal(
    'agent-a',
    'Agent A (UI Velocity)',
    'ground',
    'Implement Responsive Grid System',
    'Create a 12-column responsive grid system with drag-and-drop functionality, FLIP animations, and keyboard navigation support.',
    'Complete grid component with collision detection, smooth animations, and accessibility compliance.'
  ),
  createNewProposal(
    'agent-b',
    'Agent B (Design System)',
    'specialist',
    'OKLCH Color System Integration',
    'Integrate the OKLCH perceptually uniform color space with APCA contrast validation for WCAG 2.2 AA compliance.',
    'Accessible color system with automatic contrast validation and theme switching capabilities.'
  ),
  createNewProposal(
    'agent-c',
    'Agent C (Backend Services)',
    'ground',
    'API Infrastructure Setup',
    'Build the backend API infrastructure with proper error handling, rate limiting, and authentication.',
    'Production-ready API with comprehensive logging and monitoring capabilities.'
  ),
];

// Update proposals with different statuses for demo
mockProposals[0] = updateProposalStatus(mockProposals[0], 'approved', {
  approvedBy: 'demo-user',
  approvedAt: new Date().toISOString()
});
mockProposals[1] = updateProposalStatus(mockProposals[1], 'executing', {
  startedAt: new Date().toISOString()
});
mockProposals[2] = updateProposalStatus(mockProposals[2], 'pending');

export const SidebarDemo: React.FC = () => {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isOpen: true,
    mode: 'overlay',
    activeTab: 'proposals',
    proposals: mockProposals,
    activeProposal: null,
    isLoading: false,
    animations: {
      toggle: true,
      transitions: true,
    },
    focusManagement: {
      focusedItem: null,
      keyboardNavigation: true,
    },
  });

  const [proposals, setProposals] = useState<AgentProposal[]>(mockProposals);
  const [theme, setTheme] = useState<GridTheme>({
    colorScheme: 'light',
    reducedMotion: false,
    highContrast: false,
  });

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback((isOpen: boolean) => {
    setSidebarState(prev => ({ ...prev, isOpen }));

    // Also toggle via IPC if available
    if (sidebarIPClient.isReady()) {
      sidebarIPClient.toggleSidebar(isOpen, 'overlay')
        .then(success => {
          if (success) {
            console.log('Sidebar toggle confirmed via IPC');
          }
        })
        .catch(error => {
          console.warn('IPC toggle failed, using local state only:', error);
        });
    }
  }, []);

  // Handle proposal actions
  const handleProposalAction = useCallback(async (proposalId: string, action: string, data?: any) => {
    setSidebarState(prev => ({ ...prev, isLoading: true }));

    try {
      switch (action) {
        case 'approve':
          const approvedProposal = updateProposalStatus(
            proposals.find(p => p.id === proposalId)!,
            'approved',
            { approvedBy: 'demo-user', approvedAt: new Date().toISOString() }
          );
          setProposals(prev => prev.map(p => p.id === proposalId ? approvedProposal : p));

          // Send approval via IPC
          if (sidebarIPClient.isReady()) {
            await sidebarIPClient.approveProposal(proposalId, 'Approved via demo');
            await sidebarIPClient.logActivity({
              type: 'proposal_approved',
              message: `Proposal "${approvedProposal.title}" approved`,
              agentId: 'demo-user',
              proposalId,
            });
          }
          break;

        case 'reject':
          const rejectedProposal = updateProposalStatus(
            proposals.find(p => p.id === proposalId)!,
            'rejected',
            { rejectedBy: 'demo-user', rejectedAt: new Date().toISOString() }
          );
          setProposals(prev => prev.map(p => p.id === proposalId ? rejectedProposal : p));

          // Send rejection via IPC
          if (sidebarIPClient.isReady()) {
            await sidebarIPClient.rejectProposal(proposalId, 'Rejected via demo');
            await sidebarIPClient.logActivity({
              type: 'proposal_rejected',
              message: `Proposal "${rejectedProposal.title}" rejected`,
              agentId: 'demo-user',
              proposalId,
            });
          }
          break;

        case 'create':
          const newProposal = createNewProposal(
            'demo-agent',
            'Demo Agent',
            'ground',
            data?.title || 'New Demo Proposal',
            data?.description || 'This is a new proposal created from the demo interface.',
            data?.expectedOutcome || 'Expected outcome will be determined by agent execution.'
          );
          setProposals(prev => [...prev, newProposal]);

          // Send creation via IPC
          if (sidebarIPClient.isReady()) {
            await sidebarIPClient.createProposal({
              agentId: newProposal.agentId,
              title: newProposal.title,
              description: newProposal.description,
              expectedOutcome: newProposal.expectedOutcome,
              priority: newProposal.priority,
              confidence: newProposal.confidence,
            });
            await sidebarIPClient.logActivity({
              type: 'proposal_created',
              message: `New proposal "${newProposal.title}" created`,
              agentId: newProposal.agentId,
              proposalId: newProposal.id,
            });
          }
          break;

        default:
          console.warn('Unknown proposal action:', action);
      }
    } catch (error) {
      console.error('Failed to execute proposal action:', error);
    } finally {
      setSidebarState(prev => ({ ...prev, isLoading: false }));
    }
  }, [proposals]);

  // Handle context actions
  const handleContextAction = useCallback((action: string, data?: any) => {
    console.log('Context action:', action, data);

    switch (action) {
      case 'refresh':
        // Simulate refresh
        setSidebarState(prev => ({ ...prev, isLoading: true }));
        setTimeout(() => {
          setSidebarState(prev => ({ ...prev, isLoading: false }));
        }, 1000);
        break;
      case 'settings':
        setSidebarState(prev => ({ ...prev, activeTab: 'settings' }));
        break;
      case 'help':
        alert('T009 Sidebar Demo Help:\n\n' +
              '• Click proposals to view details\n' +
              '• Use action buttons to approve/reject proposals\n' +
              '• Switch tabs to view agents, activity, and settings\n' +
              '• Try context menu (right-click) for additional actions\n' +
              '• IPC integration available when connected to Swift backend');
        break;
    }
  }, []);

  // Handle agent selection
  const handleAgentSelect = useCallback((agentId: string) => {
    console.log('Agent selected:', agentId);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.1 0.02 250)' : tokens.colors.surface.bg,
      color: theme.colorScheme === 'dark' ? 'oklch(0.9 0.01 250)' : tokens.colors.surface.text,
      fontFamily: tokens.typography.fontFamily.base,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Demo Header */}
      <div style={{
        padding: tokens.spacing.xl,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.2 0.02 250)' : tokens.colors.surface.border}`,
        backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.12 0.02 250)' : tokens.colors.surface.bgSubtle,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: tokens.typography.fontSize['3xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.md,
          }}>
            <span>🎯</span>
            <span>T009 Sidebar Agent Panel Demo</span>
          </h1>

          <div style={{
            display: 'flex',
            gap: tokens.spacing.xl,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.sm,
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: sidebarIPClient.isReady() ? tokens.colors.success.bg : tokens.colors.error.bg,
              }} />
              <span style={{
                fontSize: tokens.typography.fontSize.sm,
                color: theme.colorScheme === 'dark' ? 'oklch(0.8 0.01 250)' : tokens.colors.surface.textMuted,
              }}>
                IPC Status: {sidebarIPClient.isReady() ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div style={{
              fontSize: tokens.typography.fontSize.sm,
              color: theme.colorScheme === 'dark' ? 'oklch(0.8 0.01 250)' : tokens.colors.surface.textMuted,
            }}>
              Mode: {sidebarState.mode} • {proposals.length} Proposals
            </div>

            <button
              onClick={() => handleSidebarToggle(!sidebarState.isOpen)}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.interactive.bg,
                color: tokens.colors.interactive.text,
                cursor: 'pointer',
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
              }}
            >
              {sidebarState.isOpen ? 'Hide' : 'Show'} Sidebar
            </button>

            <button
              onClick={() => {
                setTheme(prev => ({
                  ...prev,
                  colorScheme: prev.colorScheme === 'light' ? 'dark' : 'light'
                }));
              }}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.muted.bg,
                color: tokens.colors.muted.text,
                cursor: 'pointer',
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                transition: theme.reducedMotion ? 'none' : 'all 0.2s ease',
              }}
            >
              {theme.colorScheme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div style={{
        padding: tokens.spacing.xl,
        maxWidth: '1200px',
        margin: '0 auto',
        transition: theme.reducedMotion ? 'none' : 'margin-right 0.2s ease',
        marginRight: sidebarState.isOpen && sidebarState.mode === 'push' ? '400px' : '0',
      }}>
        <div style={{
          backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
          padding: tokens.spacing.xl,
          borderRadius: tokens.borderRadius.lg,
          border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.semibold,
            marginBottom: tokens.spacing.lg,
          }}>
            Agent Collaboration Features
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: tokens.spacing.lg,
            marginBottom: tokens.spacing.xl,
          }}>
            {[
              {
                title: '🤝 Real-time Proposals',
                description: 'Agents submit proposals for review and approval. Track status, priority, and confidence scores.',
                status: '✅ Implemented'
              },
              {
                title: '🔄 IPC Integration',
                description: 'Full Swift ↔ Electron communication via SwiftBridgeClient for cross-platform agent coordination.',
                status: sidebarIPClient.isReady() ? '✅ Connected' : '⚠️ Disconnected'
              },
              {
                title: '🎨 OKLCH Design System',
                description: 'Perceptually uniform color space with APCA contrast validation for WCAG 2.2 AA compliance.',
                status: '✅ Integrated'
              },
              {
                title: '⌨️ Keyboard Navigation',
                description: 'Full keyboard accessibility with ARIA labels and focus management for screen readers.',
                status: '✅ Implemented'
              },
              {
                title: '📱 Responsive Design',
                description: 'Fluid layouts that work across desktop, tablet, and mobile with touch-friendly interactions.',
                status: '✅ Implemented'
              },
              {
                title: '🎬 Smooth Animations',
                description: 'FLIP animations with reduced motion support and performance-optimized transitions.',
                status: '✅ Implemented'
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: tokens.spacing.lg,
                  backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.12 0.02 250)' : tokens.colors.surface.bg,
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.2 0.02 250)' : tokens.colors.surface.border}`,
                }}
              >
                <h3 style={{
                  margin: 0,
                  fontSize: tokens.typography.fontSize.lg,
                  fontWeight: tokens.typography.fontWeight.semibold,
                  marginBottom: tokens.spacing.sm,
                  color: theme.colorScheme === 'dark' ? 'oklch(0.95 0.01 250)' : tokens.colors.surface.text,
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: tokens.typography.fontSize.sm,
                  lineHeight: tokens.typography.lineHeight.normal,
                  color: theme.colorScheme === 'dark' ? 'oklch(0.75 0.01 250)' : tokens.colors.surface.textMuted,
                  marginBottom: tokens.spacing.sm,
                }}>
                  {feature.description}
                </p>
                <div style={{
                  fontSize: tokens.typography.fontSize.xs,
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: feature.status.includes('✅') ? tokens.colors.success.text :
                         feature.status.includes('⚠️') ? tokens.colors.warning.text :
                         tokens.colors.muted.text,
                }}>
                  {feature.status}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.accent.bgSubtle,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.accent.border}`,
          }}>
            <h3 style={{
              margin: 0,
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: tokens.typography.fontWeight.semibold,
              marginBottom: tokens.spacing.md,
              color: tokens.colors.accent.text,
            }}>
              🚀 Try It Out
            </h3>
            <div style={{
              fontSize: tokens.typography.fontSize.sm,
              lineHeight: tokens.typography.lineHeight.normal,
              color: theme.colorScheme === 'dark' ? 'oklch(0.8 0.01 250)' : tokens.colors.surface.textMuted,
              marginBottom: tokens.spacing.md,
            }}>
              <p style={{ margin: 0, marginBottom: tokens.spacing.sm }}>
                • Open the sidebar to see active agent proposals
              </p>
              <p style={{ margin: 0, marginBottom: tokens.spacing.sm }}>
                • Click "New Proposal" to create a demo proposal
              </p>
              <p style={{ margin: 0, marginBottom: tokens.spacing.sm }}>
                • Approve or reject pending proposals to see state changes
              </p>
              <p style={{ margin: 0, marginBottom: tokens.spacing.sm }}>
                • Switch between tabs to explore different features
              </p>
              <p style={{ margin: 0, marginBottom: tokens.spacing.sm }}>
                • Right-click in the sidebar for context menu options
              </p>
              <p style={{ margin: 0 }}>
                • Toggle light/dark theme to see OKLCH color system in action
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Panel */}
      <SidebarPanel
        state={sidebarState}
        proposals={proposals}
        onToggle={handleSidebarToggle}
        onProposalAction={handleProposalAction}
        onContextAction={handleContextAction}
        onAgentSelect={handleAgentSelect}
        style={{
          backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bg,
        }}
      />
    </div>
  );
};

export default SidebarDemo;