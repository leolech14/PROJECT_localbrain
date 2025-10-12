/**
 * 🎯 Sniper Gun Client (For Agents)
 * ================================
 *
 * HTTP client for the Multi-Indexer Sniper Tagger Query Gun MCP Server.
 *
 * Features:
 * - Auto-connect to cloud-hosted Sniper Gun server
 * - Semantic HTML component queries (@html:form, @component:modal)
 * - Surgical code editing with precise line ranges
 * - Impact analysis before changes
 * - Component extraction to separate files
 */

interface SniperGunResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ComponentInfo {
  id: string;
  method_name: string;
  line_start: number;
  line_end: number;
  html_content: string;
  tags: string[];
  dependencies: string[];
  complexity_score: number;
}

interface QueryResult {
  matches: ComponentInfo[];
  query_time_ms: number;
  total_components_scanned: number;
}

interface ImpactResult {
  affected_components: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_breaking_changes: number;
  recommended_tests: string[];
}

const SNIPER_GUN_URL = "https://sniper-gun-mcp-635198490463.us-central1.run.app";

export class SniperGunClient {
  private baseUrl: string;

  constructor(baseUrl: string = SNIPER_GUN_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 🔍 Auto-scan and index all HTML components in target script
   */
  async scanComponents(scriptPath: string, targetDir: string = '.'): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/scan_components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            script_path: scriptPath,
            target_dir: targetDir
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to scan components: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 🎯 Query components using semantic tags
   * Examples: "@html:form AND @component:modal", "@layer:overlay", "@method:_generate_*"
   */
  async queryComponents(query: string, scanResults?: any): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/query_components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            query: query,
            scan_results: scanResults
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to query components: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * ⚡ Apply surgical edits to specific line ranges
   */
  async sniperEdit(
    targetFile: string,
    lineRanges: number[][],
    editOperation: 'replace' | 'insert' | 'delete',
    newContent?: string
  ): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/sniper_edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            target_file: targetFile,
            line_ranges: lineRanges,
            edit_operation: editOperation,
            new_content: newContent
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to apply sniper edit: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 📊 Analyze impact of proposed changes before applying
   */
  async impactAnalysis(targetFile: string, proposedEdits: any[]): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/impact_analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            target_file: targetFile,
            proposed_edits: proposedEdits
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to analyze impact: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 📦 Extract component to separate file with proper imports
   */
  async extractComponent(
    componentId: string,
    targetFile: string,
    newFilePath: string
  ): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/extract_component`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            component_id: componentId,
            target_file: targetFile,
            new_file_path: newFilePath
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to extract component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 📋 Get complete task registry
   */
  async getRegistry(includeCompleted: boolean = false): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/get_registry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: {
            include_completed: includeCompleted
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get registry: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 🔍 Check server health
   */
  async healthCheck(): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 📋 List available tools
   */
  async listTools(): Promise<SniperGunResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`);
      const result = await response.json();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to list tools: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // 🎯 Common Query Patterns for Agents

  /**
   * Find all HTML forms
   */
  async findForms(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@html:form", scanResults);
  }

  /**
   * Find all modal components
   */
  async findModals(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@component:modal", scanResults);
  }

  /**
   * Find all overlay layers
   */
  async findOverlays(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@layer:overlay", scanResults);
  }

  /**
   * Find all HTML generation methods
   */
  async findGenerationMethods(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@method:_generate_*", scanResults);
  }

  /**
   * Find complex components (high complexity)
   */
  async findComplexComponents(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@complexity:high", scanResults);
  }

  /**
   * Find editable components
   */
  async findEditableComponents(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@editable:true", scanResults);
  }

  /**
   * Find active (non-deprecated) components
   */
  async findActiveComponents(scanResults?: any): Promise<SniperGunResponse> {
    return this.queryComponents("@method:_generate_* NOT @deprecated:true", scanResults);
  }
}

/**
 * 🎯 Usage Examples for Agents:
 *
 * // Initialize client
 * const sniperGun = new SniperGunClient();
 *
 * // Check health
 * const health = await sniperGun.healthCheck();
 * if (!health.success) {
 *   console.error("Sniper Gun server is down:", health.error);
 *   return;
 * }
 *
 * // Scan components
 * const scanResults = await sniperGun.scanComponents("mr-fix-my-project-please.py");
 *
 * // Find forms
 * const forms = await sniperGun.findForms(scanResults.data);
 *
 * // Analyze impact before changes
 * const impact = await sniperGun.impactAnalysis("target.py", [
 *   { type: "style_update", target: "form_component_1" }
 * ]);
 *
 * // Apply surgical edit
 * if (impact.data.risk_level !== 'HIGH') {
 *   await sniperGun.sniperEdit("target.py", [[100, 150]], "replace", newContent);
 * }
 */