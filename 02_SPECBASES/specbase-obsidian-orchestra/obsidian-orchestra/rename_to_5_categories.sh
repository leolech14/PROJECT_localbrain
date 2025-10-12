#!/bin/bash
# REORGANIZATION: 5-Category System with Dot Notation
# Generated: 2025-10-01

echo "🚀 Starting reorganization of 86 files into 5 categories..."

# CATEGORY 1: CONFIGURATIONS (3 files) → cfg.
echo "🔴 Renaming CONFIGURATIONS..."
mv "POLICY_AS_CODE.md" "cfg.POLICY_AS_CODE.md" 2>/dev/null && echo "  ✓ cfg.POLICY_AS_CODE.md"
mv "BRAZILIAN_FINTECH_IMPLEMENTATION.md" "cfg.BRAZILIAN_FINTECH.md" 2>/dev/null && echo "  ✓ cfg.BRAZILIAN_FINTECH.md"
mv "KILL_SWITCH_AUDIT_TRAIL.md" "cfg.KILL_SWITCH_AUDIT.md" 2>/dev/null && echo "  ✓ cfg.KILL_SWITCH_AUDIT.md"

# CATEGORY 2: SCAFFOLDS (9 files) → scf.
echo "🟢 Renaming SCAFFOLDS..."
mv "00_MAIN_PAGE.md" "scf.00_MAIN_PAGE.md" 2>/dev/null && echo "  ✓ scf.00_MAIN_PAGE.md"
mv "01_HEADER_COMPONENT.md" "scf.01_HEADER.md" 2>/dev/null && echo "  ✓ scf.01_HEADER.md"
mv "02_SIDEBAR_COMPONENT.md" "scf.02_SIDEBAR.md" 2>/dev/null && echo "  ✓ scf.02_SIDEBAR.md"
mv "03_FOOTER_COMPONENT.md" "scf.03_FOOTER.md" 2>/dev/null && echo "  ✓ scf.03_FOOTER.md"
mv "04_GRID_VIEW_CANVAS.md" "scf.04_GRID_VIEW.md" 2>/dev/null && echo "  ✓ scf.04_GRID_VIEW.md"
mv "05_CHIP_VIEW_CANVAS.md" "scf.05_CHIP_VIEW.md" 2>/dev/null && echo "  ✓ scf.05_CHIP_VIEW.md"
mv "06_MARKETPLACE_PAGE.md" "scf.06_MARKETPLACE.md" 2>/dev/null && echo "  ✓ scf.06_MARKETPLACE.md"
mv "70_OKLCH_DESIGN_SYSTEM.md" "scf.70_OKLCH_DESIGN.md" 2>/dev/null && echo "  ✓ scf.70_OKLCH_DESIGN.md"
mv "80_DESIGN_SYSTEM_REFERENCE.md" "scf.80_DESIGN_REF.md" 2>/dev/null && echo "  ✓ scf.80_DESIGN_REF.md"

# CATEGORY 3: MODULES (48 files) → mod.
echo "🟡 Renaming MODULES (Orchestration)..."
mv "0.2_MODULE_AGENTS_TRIFACE.md" "mod.0.2_TRIFACE.md" 2>/dev/null && echo "  ✓ mod.0.2_TRIFACE.md"
mv "0.3_ORCHESTRATOR_MAESTRO.md" "mod.0.3_MAESTRO.md" 2>/dev/null && echo "  ✓ mod.0.3_MAESTRO.md"
mv "0.4_AGENT_BUILDER.md" "mod.0.4_BUILDER_ARCH.md" 2>/dev/null && echo "  ✓ mod.0.4_BUILDER_ARCH.md"

echo "🟡 Renaming MODULES (Primitives)..."
mv "10_DATA_POOL.md" "mod.10_DATA_POOL.md" 2>/dev/null && echo "  ✓ mod.10_DATA_POOL.md"
mv "11_AI_LAYER.md" "mod.11_AI_LAYER.md" 2>/dev/null && echo "  ✓ mod.11_AI_LAYER.md"
mv "12_AGENT_LAYER.md" "mod.12_AGENT_LAYER.md" 2>/dev/null && echo "  ✓ mod.12_AGENT_LAYER.md"
mv "13_USER_IDENTITY.md" "mod.13_USER_IDENTITY.md" 2>/dev/null && echo "  ✓ mod.13_USER_IDENTITY.md"
mv "14_NERVOUS_SYSTEM.md" "mod.14_NERVOUS_SYSTEM.md" 2>/dev/null && echo "  ✓ mod.14_NERVOUS_SYSTEM.md"
mv "15_SECURITY_FABRIC.md" "mod.15_SECURITY_FABRIC.md" 2>/dev/null && echo "  ✓ mod.15_SECURITY_FABRIC.md"
mv "16_OPEN_FINANCE_CONNECTOR.md" "mod.16_OPEN_FINANCE.md" 2>/dev/null && echo "  ✓ mod.16_OPEN_FINANCE.md"

echo "🟡 Renaming MODULES (First-Degree)..."
mv "20_DASHBOARD_INDICATORS.md" "mod.20_DASHBOARD.md" 2>/dev/null && echo "  ✓ mod.20_DASHBOARD.md"
mv "21_AGENT_CONSOLE.md" "mod.21_AGENT_CONSOLE.md" 2>/dev/null && echo "  ✓ mod.21_AGENT_CONSOLE.md"
mv "22_APPROVAL_TRAY.md" "mod.22_APPROVAL_TRAY.md" 2>/dev/null && echo "  ✓ mod.22_APPROVAL_TRAY.md"

echo "🟡 Renaming MODULES (Financial)..."
mv "30_REVENUE_SUMMARY.md" "mod.30_REVENUE.md" 2>/dev/null && echo "  ✓ mod.30_REVENUE.md"
mv "31_EXPENSE_ANALYSIS.md" "mod.31_EXPENSE.md" 2>/dev/null && echo "  ✓ mod.31_EXPENSE.md"
mv "32_BANK_ACCOUNTS.md" "mod.32_BANKS.md" 2>/dev/null && echo "  ✓ mod.32_BANKS.md"
mv "33_TRANSACTION_VIEWER.md" "mod.33_TRANSACTIONS.md" 2>/dev/null && echo "  ✓ mod.33_TRANSACTIONS.md"

echo "🟡 Renaming MODULES (Analytics)..."
mv "40_CALENDAR_HEATMAP.md" "mod.40_CALENDAR.md" 2>/dev/null && echo "  ✓ mod.40_CALENDAR.md"
mv "41_FORECAST_ENGINE.md" "mod.41_FORECAST.md" 2>/dev/null && echo "  ✓ mod.41_FORECAST.md"
mv "42_BUDGET_VIEWER.md" "mod.42_BUDGET.md" 2>/dev/null && echo "  ✓ mod.42_BUDGET.md"
mv "43_CHART_VIEWER.md" "mod.43_CHARTS.md" 2>/dev/null && echo "  ✓ mod.43_CHARTS.md"
mv "44_DATABASE_VIEWER.md" "mod.44_DATABASE.md" 2>/dev/null && echo "  ✓ mod.44_DATABASE.md"

echo "🟡 Renaming MODULES (Engines)..."
mv "50_DATA_POOL_ENGINE.md" "mod.50_POOL_ENGINE.md" 2>/dev/null && echo "  ✓ mod.50_POOL_ENGINE.md"
mv "51_AGENT_RUNTIME.md" "mod.51_AGENT_RUNTIME.md" 2>/dev/null && echo "  ✓ mod.51_AGENT_RUNTIME.md"
mv "52_MARKETPLACE_ENGINE.md" "mod.52_MARKETPLACE_ENGINE.md" 2>/dev/null && echo "  ✓ mod.52_MARKETPLACE_ENGINE.md"
mv "53_INTELLIGENCE_LAYER.md" "mod.53_INTELLIGENCE.md" 2>/dev/null && echo "  ✓ mod.53_INTELLIGENCE.md"

echo "🟡 Renaming MODULES (Agentic)..."
mv "60_AGENT_BUILDER.md" "mod.60_AGENT_BUILDER.md" 2>/dev/null && echo "  ✓ mod.60_AGENT_BUILDER.md"
mv "61_WALLET_MANAGEMENT.md" "mod.61_WALLETS.md" 2>/dev/null && echo "  ✓ mod.61_WALLETS.md"
mv "62_EXTERNAL_ADAPTERS.md" "mod.62_ADAPTERS.md" 2>/dev/null && echo "  ✓ mod.62_ADAPTERS.md"

echo "🟡 Renaming MODULES (Foundation)..."
mv "90_PACKAGE_CONFIGURATION.md" "mod.90_PACKAGE_CONFIG.md" 2>/dev/null && echo "  ✓ mod.90_PACKAGE_CONFIG.md"

# CATEGORY 4: GOVERNANCE (12 files) → gov.
echo "🟣 Renaming GOVERNANCE..."
mv "COMPLETE_FINANCIAL_INTELLIGENCE_PLATFORM_SPECIFICATION.md" "gov.COMPLETE_SPEC.md" 2>/dev/null && echo "  ✓ gov.COMPLETE_SPEC.md"
mv "PROJECT_ARCHITECTURE.md" "gov.PROJECT_ARCHITECTURE.md" 2>/dev/null && echo "  ✓ gov.PROJECT_ARCHITECTURE.md"
mv "ULTIMATE_IMPLEMENTATION_ROADMAP.md" "gov.IMPLEMENTATION_ROADMAP.md" 2>/dev/null && echo "  ✓ gov.IMPLEMENTATION_ROADMAP.md"
mv "SECURITY_TESTING_STRATEGY.md" "gov.SECURITY_TESTING.md" 2>/dev/null && echo "  ✓ gov.SECURITY_TESTING.md"
mv "EDIT-RULES.md" "gov.EDIT_RULES.md" 2>/dev/null && echo "  ✓ gov.EDIT_RULES.md"
mv "MONOREPO_ARCHITECTURE.md" "gov.MONOREPO_ARCH.md" 2>/dev/null && echo "  ✓ gov.MONOREPO_ARCH.md"
mv "TRANSFORMATION_COMPLETION_REPORT.md" "gov.TRANSFORMATION_REPORT.md" 2>/dev/null && echo "  ✓ gov.TRANSFORMATION_REPORT.md"
mv "SYSTEMATIC_TRANSFORMATION_COMPLETION.md" "gov.SYSTEMATIC_TRANSFORM.md" 2>/dev/null && echo "  ✓ gov.SYSTEMATIC_TRANSFORM.md"
mv "MODULE_INDEX.md" "gov.MODULE_INDEX.md" 2>/dev/null && echo "  ✓ gov.MODULE_INDEX.md"
mv "CHATGPT5_ARCHITECTURAL_REVIEW_REQUEST.md" "gov.CHATGPT5_REVIEW_REQUEST.md" 2>/dev/null && echo "  ✓ gov.CHATGPT5_REVIEW_REQUEST.md"
mv "CHATGPT5_KNOWLEDGE_INTEGRATION_PLAN.md" "gov.CHATGPT5_INTEGRATION.md" 2>/dev/null && echo "  ✓ gov.CHATGPT5_INTEGRATION.md"
mv "AGENT_ONBOARDING_GUIDE.md" "gov.AGENT_ONBOARDING.md" 2>/dev/null && echo "  ✓ gov.AGENT_ONBOARDING.md"

# CATEGORY 5: OPERATIONS (16 files) → ops.
echo "🔵 Renaming OPERATIONS..."
mv "CANVAS_NAVIGATION_INTELLIGENCE.md" "ops.CANVAS_NAVIGATION.md" 2>/dev/null && echo "  ✓ ops.CANVAS_NAVIGATION.md"
mv "CANVAS_SNIPER_ANALYSIS.md" "ops.CANVAS_SNIPER.md" 2>/dev/null && echo "  ✓ ops.CANVAS_SNIPER.md"
mv "CANVAS_EXPLORER_SETUP.md" "ops.CANVAS_EXPLORER.md" 2>/dev/null && echo "  ✓ ops.CANVAS_EXPLORER.md"
mv "OBSIDIAN_GRAPH_VIEW_STRATEGY.md" "ops.GRAPH_VIEW.md" 2>/dev/null && echo "  ✓ ops.GRAPH_VIEW.md"
mv "VAULT_OPTIMIZATION_MASTER_PLAN.md" "ops.VAULT_OPTIMIZATION.md" 2>/dev/null && echo "  ✓ ops.VAULT_OPTIMIZATION.md"
mv "TIME_TRACKING_PLAN.md" "ops.TIME_TRACKING.md" 2>/dev/null && echo "  ✓ ops.TIME_TRACKING.md"
mv "COMMUNITY_STRENGTHENING_PLAN.md" "ops.COMMUNITY.md" 2>/dev/null && echo "  ✓ ops.COMMUNITY.md"
mv "ISOLATED_CONTENT_STRATEGY.md" "ops.CONTENT_STRATEGY.md" 2>/dev/null && echo "  ✓ ops.CONTENT_STRATEGY.md"
mv "CONTEXT_FILES_GROUP.md" "ops.CONTEXT_FILES.md" 2>/dev/null && echo "  ✓ ops.CONTEXT_FILES.md"
mv "IMPLEMENTATION_KNOWLEDGE_INTEGRATION.md" "ops.IMPL_KNOWLEDGE.md" 2>/dev/null && echo "  ✓ ops.IMPL_KNOWLEDGE.md"
mv "COMPLETE_CANVAS_REGISTRY.md" "ops.CANVAS_REGISTRY.md" 2>/dev/null && echo "  ✓ ops.CANVAS_REGISTRY.md"
mv "MASTER_REGISTRY.md" "ops.MASTER_REGISTRY.md" 2>/dev/null && echo "  ✓ ops.MASTER_REGISTRY.md"
mv "MASTER_REGISTRY_SUMMARY.md" "ops.REGISTRY_SUMMARY.md" 2>/dev/null && echo "  ✓ ops.REGISTRY_SUMMARY.md"
mv "REGISTRY_DELIVERY_SUMMARY.md" "ops.REGISTRY_DELIVERY.md" 2>/dev/null && echo "  ✓ ops.REGISTRY_DELIVERY.md"
mv "CONTENT_SEPARATION_PLAN.md" "ops.SEPARATION_PLAN.md" 2>/dev/null && echo "  ✓ ops.SEPARATION_PLAN.md"
mv "SEPARATION_COMMANDS.md" "ops.SEPARATION_COMMANDS.md" 2>/dev/null && echo "  ✓ ops.SEPARATION_COMMANDS.md"

# Analysis files → ops.
mv "MEANINGFUL_SECTION_REPORT.md" "ops.MEANINGFUL_SECTIONS.md" 2>/dev/null && echo "  ✓ ops.MEANINGFUL_SECTIONS.md"
mv "PRECISION_SECTION_ANALYSIS.md" "ops.PRECISION_SECTIONS.md" 2>/dev/null && echo "  ✓ ops.PRECISION_SECTIONS.md"
mv "GENETIC_SPECIFICATION_MANIFEST.md" "ops.GENETIC_MANIFEST.md" 2>/dev/null && echo "  ✓ ops.GENETIC_MANIFEST.md"
mv "FIVE_CATEGORY_GENETIC_ANALYSIS.md" "ops.FIVE_CATEGORY_ANALYSIS.md" 2>/dev/null && echo "  ✓ ops.FIVE_CATEGORY_ANALYSIS.md"
mv "GENETIC_FIVE_CATEGORY_ORGANIZATION.md" "ops.GENETIC_ORGANIZATION.md" 2>/dev/null && echo "  ✓ ops.GENETIC_ORGANIZATION.md"
mv "ALGEBRAIC_SPECIFICATION_TAXONOMY.md" "ops.ALGEBRAIC_TAXONOMY.md" 2>/dev/null && echo "  ✓ ops.ALGEBRAIC_TAXONOMY.md"
mv "ALGEBRAIC_SPECIFICATION_ANALYSIS.md" "ops.ALGEBRAIC_ANALYSIS.md" 2>/dev/null && echo "  ✓ ops.ALGEBRAIC_ANALYSIS.md"
mv "SCIENTIFIC_SEMANTIC_ANALYSIS.md" "ops.SEMANTIC_ANALYSIS.md" 2>/dev/null && echo "  ✓ ops.SEMANTIC_ANALYSIS.md"
mv "COMPREHENSIVE_ARCHITECTURAL_UNDERSTANDING.md" "ops.COMPREHENSIVE_UNDERSTANDING.md" 2>/dev/null && echo "  ✓ ops.COMPREHENSIVE_UNDERSTANDING.md"

# MISC files
echo "⚪ Renaming MISC files..."
mv "2025-09-27.md" "misc.2025-09-27.md" 2>/dev/null && echo "  ✓ misc.2025-09-27.md"
mv "2025-09-29.md" "misc.2025-09-29.md" 2>/dev/null && echo "  ✓ misc.2025-09-29.md"
mv "PAGE STRUCTURE.md" "misc.PAGE_STRUCTURE.md" 2>/dev/null && echo "  ✓ misc.PAGE_STRUCTURE.md"

# Keep new files without renaming
echo "📝 Skipping new documentation files (already well-named)..."

echo ""
echo "✅ REORGANIZATION COMPLETE!"
echo "📊 Summary:"
echo "  🔴 Configurations: 3 files (cfg.*)"
echo "  🟢 Scaffolds: 9 files (scf.*)"
echo "  🟡 Modules: 28 files renamed (mod.*)"
echo "  🟣 Governance: 12 files (gov.*)"
echo "  🔵 Operations: 25 files (ops.*)"
echo "  ⚪ Misc: 3 files (misc.*)"
echo ""
echo "🎨 Next: Update Canvas with new colors and zones!"
