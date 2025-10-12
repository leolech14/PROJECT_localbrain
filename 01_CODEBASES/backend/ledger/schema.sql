-- ============================================================================
-- LocalBrain Change-Set Ledger Database Schema
-- ============================================================================
-- Purpose: Comprehensive change-set ledger system for AI-initiated state changes
-- Agent: C (Backend Services Specialist)
-- Version: 1.0.0
-- Database: PostgreSQL (recommended) / SQLite (compatible)
-- ============================================================================

-- ============================================================================
-- EXTENSIONS AND CONFIGURATION
-- ============================================================================

-- PostgreSQL specific extensions (comment out for SQLite)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Change-Set Status Enum
CREATE TYPE change_set_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'APPLIED',
    'REJECTED',
    'ROLLED_BACK'
);

-- Priority Level Enum
CREATE TYPE priority_level AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'CRITICAL'
);

-- Application Mode Enum
CREATE TYPE application_mode AS ENUM (
    'AUTO',
    'MANUAL',
    'ROLLBACK'
);

-- Approval Decision Enum
CREATE TYPE approval_decision AS ENUM (
    'APPROVED',
    'REJECTED',
    'ABSTAINED'
);

-- Agent Type Enum
CREATE TYPE agent_type AS ENUM (
    'UI_VELOCITY_SPECIALIST',
    'DESIGN_SYSTEM_SPECIALIST',
    'BACKEND_SERVICES_SPECIALIST',
    'INTEGRATION_SPECIALIST'
);

-- Operation Type Enum
CREATE TYPE operation_type AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'MOVE',
    'RESIZE',
    'RENAME',
    'REORDER',
    'CHANGE_PROPERTY',
    'ADD_CHILD',
    'REMOVE_CHILD'
);

-- Target Type Enum
CREATE TYPE target_type AS ENUM (
    'COMPONENT',
    'LAYOUT',
    'API_ENDPOINT',
    'CONFIG',
    'POLICY',
    'SCHEMA',
    'FILE',
    'DIRECTORY',
    'WIDGET',
    'STYLESHEET'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Change-Set Header Table
CREATE TABLE change_sets (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_set_id TEXT UNIQUE NOT NULL, -- Human-readable ID (e.g., "CS-2025-0108-001")

    -- Basic Information
    title TEXT NOT NULL,
    description TEXT,

    -- Agent Information
    agent_id TEXT NOT NULL,
    agent_type agent_type NOT NULL,

    -- Status and Workflow
    status change_set_status NOT NULL DEFAULT 'DRAFT',
    priority priority_level DEFAULT 'NORMAL',

    -- Policy and Governance
    policy_evaluations JSONB, -- Results of policy engine evaluation
    required_approvals INTEGER DEFAULT 1,
    received_approvals INTEGER DEFAULT 0,
    approval_chain JSONB, -- List of required approvers and their status

    -- Categorization
    metadata JSONB, -- Agent-specific metadata
    tags TEXT[], -- Searchable tags
    category TEXT, -- UI_LAYOUT, API_CHANGE, CONFIG_UPDATE, etc.

    -- Audit Trail
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT,

    -- Hash Chain Integrity
    previous_hash TEXT, -- Hash of previous change-set for chain integrity
    current_hash TEXT NOT NULL, -- Hash of this change-set
    signature TEXT, -- Digital signature for authenticity

    -- Version Control
    version INTEGER DEFAULT 1,
    parent_change_set_id UUID REFERENCES change_sets(id), -- For branching

    -- Performance Metrics
    creation_duration_ms INTEGER,
    validation_duration_ms INTEGER,

    -- Constraints
    CONSTRAINT valid_priority CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),
    CONSTRAINT positive_approvals CHECK (required_approvals >= 0 AND received_approvals >= 0),
    CONSTRAINT approval_not_exceed_required CHECK (received_approvals <= required_approvals),
    CONSTRAINT positive_version CHECK (version > 0)
);

-- Change-Set Items Table (Individual Operations)
CREATE TABLE change_set_items (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_set_id UUID NOT NULL REFERENCES change_sets(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL, -- Order within the change-set

    -- Operation Details
    operation_type operation_type NOT NULL,
    target_type target_type NOT NULL,
    target_id TEXT NOT NULL, -- Specific target identifier
    target_path TEXT, -- Path for file-based targets
    target_namespace TEXT, -- Namespace for scoping (e.g., 'ui.components', 'api.endpoints')

    -- Change Data
    before_state JSONB, -- State before the change
    after_state JSONB, -- State after the change
    diff_data JSONB, -- Structured diff (using T003 scene-diff schema)

    -- Validation Results
    validation_result JSONB, -- Schema validation results
    policy_check_result JSONB, -- Policy validation for this specific item
    security_scan_result JSONB, -- Security scan results

    -- Rollback Information
    rollback_operation JSONB, -- Operation needed to rollback this change
    rollback_data JSONB, -- Data needed for rollback
    rollback_dependencies JSONB, -- Dependencies for rollback

    -- Metadata and Performance
    metadata JSONB,
    execution_duration_ms INTEGER,
    rollback_duration_ms INTEGER,

    -- Dependencies
    depends_on_items INTEGER[], -- Other items this item depends on
    blocks_items INTEGER[], -- Items this item blocks

    -- Constraints
    CONSTRAINT unique_item_sequence UNIQUE (change_set_id, item_sequence),
    CONSTRAINT positive_sequence CHECK (item_sequence > 0),
    CONSTRAINT valid_execution_duration CHECK (execution_duration_ms IS NULL OR execution_duration_ms >= 0),
    CONSTRAINT valid_rollback_duration CHECK (rollback_duration_ms IS NULL OR rollback_duration_ms >= 0)
);

-- Change-Set Application Log
CREATE TABLE change_set_applications (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_set_id UUID NOT NULL REFERENCES change_sets(id),
    application_sequence SERIAL NOT NULL,

    -- Application Details
    applied_at TIMESTAMP DEFAULT NOW(),
    applied_by TEXT NOT NULL,
    application_mode application_mode NOT NULL,
    success BOOLEAN NOT NULL,

    -- Results Summary
    applied_items INTEGER DEFAULT 0, -- Number of items successfully applied
    failed_items INTEGER DEFAULT 0, -- Number of items that failed
    skipped_items INTEGER DEFAULT 0, -- Number of items skipped
    error_messages JSONB, -- Array of error messages
    warning_messages JSONB, -- Array of warning messages

    -- Performance Metrics
    application_duration_ms INTEGER,
    validation_duration_ms INTEGER,
    policy_check_duration_ms INTEGER,
    rollback_duration_ms INTEGER,

    -- System State
    system_snapshot JSONB, -- System state snapshot before application
    rollback_snapshot JSONB, -- System state snapshot for rollback

    -- Environment Context
    environment_variables JSONB,
    agent_versions JSONB, -- Versions of agents involved
    system_resources JSONB, -- Resource usage during application

    -- Constraints
    CONSTRAINT valid_application_mode CHECK (application_mode IN ('AUTO', 'MANUAL', 'ROLLBACK')),
    CONSTRAINT positive_applied_items CHECK (applied_items >= 0),
    CONSTRAINT positive_failed_items CHECK (failed_items >= 0),
    CONSTRAINT positive_skipped_items CHECK (skipped_items >= 0),
    CONSTRAINT valid_application_duration CHECK (application_duration_ms IS NULL OR application_duration_ms >= 0),
    CONSTRAINT valid_validation_duration CHECK (validation_duration_ms IS NULL OR validation_duration_ms >= 0),
    CONSTRAINT valid_policy_check_duration CHECK (policy_check_duration_ms IS NULL OR policy_check_duration_ms >= 0),
    CONSTRAINT valid_rollback_duration CHECK (rollback_duration_ms IS NULL OR rollback_duration_ms >= 0)
);

-- Approval Records
CREATE TABLE change_set_approvals (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_set_id UUID NOT NULL REFERENCES change_sets(id),
    approver_id TEXT NOT NULL,
    approver_role TEXT NOT NULL,

    -- Approval Details
    decision approval_decision NOT NULL,
    decision_at TIMESTAMP DEFAULT NOW(),
    decision_reason TEXT,
    decision_metadata JSONB,

    -- Context
    approval_context JSONB, -- Context in which decision was made
    reviewer_comments TEXT,

    -- Delegation
    delegated_by TEXT, -- If approval was delegated
    delegation_reason TEXT,

    -- Constraints
    CONSTRAINT unique_approver UNIQUE (change_set_id, approver_id),
    CONSTRAINT valid_decision CHECK (decision IN ('APPROVED', 'REJECTED', 'ABSTAINED'))
);

-- ============================================================================
-- GOVERNANCE AND SECURITY TABLES
-- ============================================================================

-- Idempotency Key Management
CREATE TABLE idempotency_keys (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash TEXT UNIQUE NOT NULL, -- Hash of the idempotency key
    key_value TEXT NOT NULL, -- Original key value
    change_set_id UUID REFERENCES change_sets(id),

    -- Usage Tracking
    used_at TIMESTAMP DEFAULT NOW(),
    used_by TEXT NOT NULL,
    request_context JSONB, -- Context that created this key

    -- Expiration and Cleanup
    expires_at TIMESTAMP,
    is_expired BOOLEAN DEFAULT false,

    -- Access Tracking
    last_accessed TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 1,

    -- Constraints
    CONSTRAINT positive_access_count CHECK (access_count > 0),
    CONSTRAINT valid_expiration CHECK (expires_at IS NULL OR expires_at > used_at)
);

-- Policy Validation Cache
CREATE TABLE policy_validation_cache (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT UNIQUE NOT NULL,
    validation_result JSONB NOT NULL,

    -- Cache Management
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    hit_count INTEGER DEFAULT 0,

    -- Context
    policy_version TEXT NOT NULL,
    context_hash TEXT NOT NULL,
    agent_id TEXT,

    -- Performance
    validation_duration_ms INTEGER,

    -- Constraints
    CONSTRAINT positive_hit_count CHECK (hit_count >= 0),
    CONSTRAINT valid_validation_duration CHECK (validation_duration_ms IS NULL OR validation_duration_ms >= 0),
    CONSTRAINT future_expiration CHECK (expires_at > created_at)
);

-- Security Audit Log
CREATE TABLE security_audit_log (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event Information
    event_type TEXT NOT NULL, -- CHANGESET_CREATE, CHANGESET_APPLY, APPROVAL_GRANTED, etc.
    event_severity TEXT NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    event_category TEXT NOT NULL, -- GOVERNANCE, SECURITY, PERFORMANCE, INTEGRITY

    -- Entity Information
    entity_type TEXT NOT NULL, -- CHANGESET, APPROVAL, AGENT, etc.
    entity_id TEXT NOT NULL,

    -- Event Details
    event_description TEXT NOT NULL,
    event_data JSONB, -- Detailed event data

    -- Actor Information
    actor_id TEXT NOT NULL,
    actor_type TEXT NOT NULL, -- AGENT, HUMAN, SYSTEM
    actor_context JSONB,

    -- Timing and Location
    occurred_at TIMESTAMP DEFAULT NOW(),
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,

    -- Impact Assessment
    security_impact TEXT, -- NONE, LOW, MEDIUM, HIGH, CRITICAL
    compliance_impact TEXT, -- NONE, LOW, MEDIUM, HIGH, CRITICAL

    -- Investigation
    investigation_status TEXT DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    investigation_notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by TEXT,

    -- Constraints
    CONSTRAINT valid_severity CHECK (event_severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT valid_category CHECK (event_category IN ('GOVERNANCE', 'SECURITY', 'PERFORMANCE', 'INTEGRITY')),
    CONSTRAINT valid_impact CHECK (security_impact IS NULL OR security_impact IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT valid_compliance_impact CHECK (compliance_impact IS NULL OR compliance_impact IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT valid_investigation_status CHECK (investigation_status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    CONSTRAINT valid_timing CHECK (resolved_at IS NULL OR resolved_at >= occurred_at)
);

-- ============================================================================
-- PERFORMANCE AND MONITORING TABLES
-- ============================================================================

-- Change-Set Performance Metrics
CREATE TABLE change_set_metrics (
    -- Primary Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_set_id UUID NOT NULL REFERENCES change_sets(id),

    -- Timing Metrics
    total_creation_time_ms INTEGER,
    total_validation_time_ms INTEGER,
    total_application_time_ms INTEGER,
    total_rollback_time_ms INTEGER,

    -- Item Metrics
    item_count INTEGER,
    successful_items INTEGER,
    failed_items INTEGER,

    -- Resource Usage
    memory_usage_mb INTEGER,
    cpu_usage_percent NUMERIC(5,2),
    disk_io_mb INTEGER,
    network_io_mb INTEGER,

    -- System Load
    concurrent_operations INTEGER,
    queue_depth INTEGER,

    -- Quality Metrics
    policy_violations INTEGER,
    security_warnings INTEGER,
    performance_issues INTEGER,

    -- Timestamp
    measured_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT positive_timing CHECK (
        (total_creation_time_ms IS NULL OR total_creation_time_ms >= 0) AND
        (total_validation_time_ms IS NULL OR total_validation_time_ms >= 0) AND
        (total_application_time_ms IS NULL OR total_application_time_ms >= 0) AND
        (total_rollback_time_ms IS NULL OR total_rollback_time_ms >= 0)
    ),
    CONSTRAINT positive_counts CHECK (
        (item_count IS NULL OR item_count >= 0) AND
        (successful_items IS NULL OR successful_items >= 0) AND
        (failed_items IS NULL OR failed_items >= 0)
    ),
    CONSTRAINT positive_resources CHECK (
        (memory_usage_mb IS NULL OR memory_usage_mb >= 0) AND
        (disk_io_mb IS NULL OR disk_io_mb >= 0) AND
        (network_io_mb IS NULL OR network_io_mb >= 0)
    ),
    CONSTRAINT valid_cpu_usage CHECK (cpu_usage_percent IS NULL OR (cpu_usage_percent >= 0 AND cpu_usage_percent <= 100)),
    CONSTRAINT positive_concurrent CHECK (
        (concurrent_operations IS NULL OR concurrent_operations >= 0) AND
        (queue_depth IS NULL OR queue_depth >= 0)
    ),
    CONSTRAINT positive_quality_issues CHECK (
        (policy_violations IS NULL OR policy_violations >= 0) AND
        (security_warnings IS NULL OR security_warnings >= 0) AND
        (performance_issues IS NULL OR performance_issues >= 0)
    )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Change-Set Query Indexes
CREATE INDEX idx_change_sets_agent_id ON change_sets(agent_id);
CREATE INDEX idx_change_sets_status ON change_sets(status);
CREATE INDEX idx_change_sets_created_at ON change_sets(created_at DESC);
CREATE INDEX idx_change_sets_updated_at ON change_sets(updated_at DESC);
CREATE INDEX idx_change_sets_category ON change_sets(category);
CREATE INDEX idx_change_sets_priority ON change_sets(priority);
CREATE INDEX idx_change_sets_agent_type ON change_sets(agent_type);
CREATE INDEX idx_change_sets_tags ON change_sets USING GIN(tags);
CREATE INDEX idx_change_sets_metadata ON change_sets USING GIN(metadata);

-- Hash Chain Indexes
CREATE INDEX idx_change_sets_hash_chain ON change_sets(previous_hash, current_hash);
CREATE INDEX idx_change_sets_current_hash ON change_sets(current_hash);
CREATE INDEX idx_change_sets_version ON change_sets(version, parent_change_set_id);

-- Full-Text Search Indexes (PostgreSQL specific)
CREATE INDEX idx_change_sets_search ON change_sets USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_change_sets_id_search ON change_sets USING GIN(to_tsvector('english', change_set_id));

-- Change-Set Items Indexes
CREATE INDEX idx_change_set_items_change_set_id ON change_set_items(change_set_id);
CREATE INDEX idx_change_set_items_target ON change_set_items(target_type, target_id);
CREATE INDEX idx_change_set_items_operation ON change_set_items(operation_type);
CREATE INDEX idx_change_set_items_sequence ON change_set_items(change_set_id, item_sequence);
CREATE INDEX idx_change_set_items_namespace ON change_set_items(target_namespace);
CREATE INDEX idx_change_set_items_dependencies ON change_set_items USING GIN(depends_on_items);
CREATE INDEX idx_change_set_items_blocks ON change_set_items USING GIN(blocks_items);

-- Change-Set Items Data Indexes
CREATE INDEX idx_change_set_items_diff_data ON change_set_items USING GIN(diff_data);
CREATE INDEX idx_change_set_items_before_state ON change_set_items USING GIN(before_state);
CREATE INDEX idx_change_set_items_after_state ON change_set_items USING GIN(after_state);

-- Application Log Indexes
CREATE INDEX idx_change_set_applications_change_set_id ON change_set_applications(change_set_id);
CREATE INDEX idx_change_set_applications_applied_at ON change_set_applications(applied_at DESC);
CREATE INDEX idx_change_set_applications_success ON change_set_applications(success);
CREATE INDEX idx_change_set_applications_mode ON change_set_applications(application_mode);
CREATE INDEX idx_change_set_applications_applied_by ON change_set_applications(applied_by);

-- Approval Indexes
CREATE INDEX idx_change_set_approvals_change_set_id ON change_set_approvals(change_set_id);
CREATE INDEX idx_change_set_approvals_approver ON change_set_approvals(approver_id);
CREATE INDEX idx_change_set_approvals_decision ON change_set_approvals(decision);
CREATE INDEX idx_change_set_approvals_decision_at ON change_set_approvals(decision_at DESC);

-- Idempotency Key Indexes
CREATE INDEX idx_idempotency_keys_hash ON idempotency_keys(key_hash);
CREATE INDEX idx_idempotency_keys_expires ON idempotency_keys(expires_at);
CREATE INDEX idx_idempotency_keys_used_at ON idempotency_keys(used_at DESC);
CREATE INDEX idx_idempotency_keys_used_by ON idempotency_keys(used_by);
CREATE INDEX idx_idempotency_keys_change_set_id ON idempotency_keys(change_set_id);

-- Policy Cache Indexes
CREATE INDEX idx_policy_validation_cache_key ON policy_validation_cache(cache_key);
CREATE INDEX idx_policy_validation_cache_expires ON policy_validation_cache(expires_at);
CREATE INDEX idx_policy_validation_cache_created_at ON policy_validation_cache(created_at DESC);
CREATE INDEX idx_policy_validation_cache_policy_version ON policy_validation_cache(policy_version);
CREATE INDEX idx_policy_validation_cache_agent_id ON policy_validation_cache(agent_id);
CREATE INDEX idx_policy_validation_cache_hit_count ON policy_validation_cache(hit_count DESC);

-- Security Audit Log Indexes
CREATE INDEX idx_security_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX idx_security_audit_log_severity ON security_audit_log(event_severity);
CREATE INDEX idx_security_audit_log_category ON security_audit_log(event_category);
CREATE INDEX idx_security_audit_log_occurred_at ON security_audit_log(occurred_at DESC);
CREATE INDEX idx_security_audit_log_actor_id ON security_audit_log(actor_id);
CREATE INDEX idx_security_audit_log_entity ON security_audit_log(entity_type, entity_id);
CREATE INDEX idx_security_audit_log_investigation_status ON security_audit_log(investigation_status);

-- Performance Metrics Indexes
CREATE INDEX idx_change_set_metrics_change_set_id ON change_set_metrics(change_set_id);
CREATE INDEX idx_change_set_metrics_measured_at ON change_set_metrics(measured_at DESC);
CREATE INDEX idx_change_set_metrics_total_time ON change_set_metrics(total_application_time_ms);
CREATE INDEX idx_change_set_metrics_item_count ON change_set_metrics(item_count);
CREATE INDEX idx_change_set_metrics_success_rate ON change_set_metrics(successful_items, failed_items);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to change_sets table
CREATE TRIGGER update_change_sets_updated_at
    BEFORE UPDATE ON change_sets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Hash calculation function
CREATE OR REPLACE FUNCTION calculate_change_set_hash()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate hash based on change-set content
    NEW.current_hash = encode(
        sha256(
            NEW.id::TEXT ||
            NEW.change_set_id ||
            NEW.title ||
            NEW.agent_id ||
            COALESCE(NEW.description, '') ||
            COALESCE(NEW.previous_hash, '') ||
            EXTRACT(EPOCH FROM NEW.created_at)::TEXT
        ),
        'hex'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply hash calculation trigger
CREATE TRIGGER calculate_change_set_hash_trigger
    BEFORE INSERT ON change_sets
    FOR EACH ROW
    EXECUTE FUNCTION calculate_change_set_hash();

-- Change-set status transition validation function
CREATE OR REPLACE FUNCTION validate_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Define valid transitions
    IF OLD.status = 'DRAFT' THEN
        IF NEW.status NOT IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED') THEN
            RAISE EXCEPTION 'Invalid transition from DRAFT to %', NEW.status;
        END IF;
    ELSIF OLD.status = 'PENDING_APPROVAL' THEN
        IF NEW.status NOT IN ('APPROVED', 'REJECTED', 'DRAFT') THEN
            RAISE EXCEPTION 'Invalid transition from PENDING_APPROVAL to %', NEW.status;
        END IF;
    ELSIF OLD.status = 'APPROVED' THEN
        IF NEW.status NOT IN ('APPLIED', 'REJECTED') THEN
            RAISE EXCEPTION 'Invalid transition from APPROVED to %', NEW.status;
        END IF;
    ELSIF OLD.status = 'APPLIED' THEN
        IF NEW.status NOT IN ('ROLLED_BACK') THEN
            RAISE EXCEPTION 'Invalid transition from APPLIED to %', NEW.status;
        END IF;
    ELSIF OLD.status = 'REJECTED' THEN
        IF NEW.status NOT IN ('DRAFT') THEN
            RAISE EXCEPTION 'Invalid transition from REJECTED to %', NEW.status;
        END IF;
    ELSIF OLD.status = 'ROLLED_BACK' THEN
        IF NEW.status NOT IN ('DRAFT') THEN
            RAISE EXCEPTION 'Invalid transition from ROLLED_BACK to %', NEW.status;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply status transition validation trigger
CREATE TRIGGER validate_status_transition_trigger
    BEFORE UPDATE OF status ON change_sets
    FOR EACH ROW
    EXECUTE FUNCTION validate_status_transition();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active change-sets view
CREATE VIEW active_change_sets AS
SELECT
    cs.*,
    COUNT(csi.id) as item_count,
    MAX(csa.applied_at) as last_applied_at,
    COUNT(DISTINCT csa.id) as application_count
FROM change_sets cs
LEFT JOIN change_set_items csi ON cs.id = csi.change_set_id
LEFT JOIN change_set_applications csa ON cs.id = csa.change_set_id
WHERE cs.status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED')
GROUP BY cs.id;

-- Change-set summary view
CREATE VIEW change_set_summary AS
SELECT
    cs.id,
    cs.change_set_id,
    cs.title,
    cs.status,
    cs.agent_id,
    cs.agent_type,
    cs.category,
    cs.priority,
    cs.created_at,
    cs.updated_at,
    COUNT(csi.id) as item_count,
    COUNT(CASE WHEN csi.operation_type IN ('CREATE', 'UPDATE', 'DELETE') THEN 1 END) as core_operations,
    COUNT(DISTINCT csa.id) as application_count,
    MAX(csa.applied_at) as last_applied_at,
    COUNT(DISTINCT csa.id) FILTER (WHERE csa.success = true) as successful_applications,
    COUNT(DISTINCT csa.id) FILTER (WHERE csa.success = false) as failed_applications
FROM change_sets cs
LEFT JOIN change_set_items csi ON cs.id = csi.change_set_id
LEFT JOIN change_set_applications csa ON cs.id = csa.change_set_id
GROUP BY cs.id, cs.change_set_id, cs.title, cs.status, cs.agent_id, cs.agent_type, cs.category, cs.priority, cs.created_at, cs.updated_at;

-- Pending approvals view
CREATE VIEW pending_approvals AS
SELECT
    cs.*,
    COUNT(csi.id) as item_count,
    cs.required_approvals - cs.received_approvals as approvals_needed,
    ARRAY_AGG(csa.approver_id) FILTER (WHERE csa.decision = 'APPROVED') as approved_by,
    ARRAY_AGG(csa.approver_id) FILTER (WHERE csa.decision = 'REJECTED') as rejected_by
FROM change_sets cs
LEFT JOIN change_set_items csi ON cs.id = csi.change_set_id
LEFT JOIN change_set_approvals csa ON cs.id = csa.change_set_id
WHERE cs.status = 'PENDING_APPROVAL'
GROUP BY cs.id;

-- Agent activity view
CREATE VIEW agent_activity AS
SELECT
    cs.agent_id,
    cs.agent_type,
    COUNT(*) as total_change_sets,
    COUNT(*) FILTER (WHERE cs.status = 'APPLIED') as applied_change_sets,
    COUNT(*) FILTER (WHERE cs.status = 'REJECTED') as rejected_change_sets,
    COUNT(*) FILTER (WHERE cs.created_at >= NOW() - INTERVAL '24 hours') as last_24h_change_sets,
    COUNT(*) FILTER (WHERE cs.created_at >= NOW() - INTERVAL '7 days') as last_7d_change_sets,
    MAX(cs.created_at) as last_activity_at
FROM change_sets cs
GROUP BY cs.agent_id, cs.agent_type;

-- ============================================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ============================================================================

-- Comment out for production
/*
-- Sample agent data
INSERT INTO change_sets (
    change_set_id, title, description, agent_id, agent_type,
    status, priority, category, created_by
) VALUES
('CS-2025-0108-001', 'Add new button component', 'Create primary button component with OKLCH tokens', 'Agent-A', 'UI_VELOCITY_SPECIALIST', 'APPLIED', 'NORMAL', 'UI_LAYOUT', 'Agent-A'),
('CS-2025-0108-002', 'Update design tokens', 'Add new OKLCH color ramps for dark mode', 'Agent-B', 'DESIGN_SYSTEM_SPECIALIST', 'PENDING_APPROVAL', 'HIGH', 'DESIGN_SYSTEM', 'Agent-B'),
('CS-2025-0108-003', 'Implement policy validation', 'Add policy engine integration for change-set validation', 'Agent-C', 'BACKEND_SERVICES_SPECIALIST', 'DRAFT', 'CRITICAL', 'API_CHANGE', 'Agent-C');
*/

-- ============================================================================
-- SCHEMA VALIDATION AND CONSTRAINTS SUMMARY
-- ============================================================================

-- This schema provides:
-- 1. Complete audit trail of all AI-initiated changes
-- 2. Workflow state machine with proper validation
-- 3. Hash chain integrity verification
-- 4. Idempotency key management
-- 5. Policy validation caching
-- 6. Security audit logging
-- 7. Performance metrics collection
-- 8. Agent activity tracking
-- 9. Rollback capabilities
-- 10. Approval workflow management

-- Schema is designed to be:
-- - ACID compliant for data integrity
-- - Indexed for high performance
-- - Extensible for future requirements
-- - Compatible with PostgreSQL and SQLite
-- - Secure with proper constraints and validation
-- - Auditable with complete logging

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================

-- For SQLite:
-- 1. Remove PostgreSQL-specific extensions
-- 2. Replace UUID with TEXT primary keys
-- 3. Replace ENUM types with CHECK constraints
-- 4. Remove GIN indexes (use regular indexes)
-- 5. Replace JSONB with JSON
-- 6. Modify trigger syntax for SQLite

-- Version History:
-- v1.0.0 - Initial schema design (2025-10-08)
--   - Core change-set management
--   - Workflow state machine
--   - Hash chain integrity
--   - Idempotency system
--   - Security auditing
--   - Performance monitoring