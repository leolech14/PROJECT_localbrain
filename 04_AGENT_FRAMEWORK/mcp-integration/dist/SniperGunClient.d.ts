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
export declare class SniperGunClient {
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * 🔍 Auto-scan and index all HTML components in target script
     */
    scanComponents(scriptPath: string, targetDir?: string): Promise<SniperGunResponse>;
    /**
     * 🎯 Query components using semantic tags
     * Examples: "@html:form AND @component:modal", "@layer:overlay", "@method:_generate_*"
     */
    queryComponents(query: string, scanResults?: any): Promise<SniperGunResponse>;
    /**
     * ⚡ Apply surgical edits to specific line ranges
     */
    sniperEdit(targetFile: string, lineRanges: number[][], editOperation: 'replace' | 'insert' | 'delete', newContent?: string): Promise<SniperGunResponse>;
    /**
     * 📊 Analyze impact of proposed changes before applying
     */
    impactAnalysis(targetFile: string, proposedEdits: any[]): Promise<SniperGunResponse>;
    /**
     * 📦 Extract component to separate file with proper imports
     */
    extractComponent(componentId: string, targetFile: string, newFilePath: string): Promise<SniperGunResponse>;
    /**
     * 📋 Get complete task registry
     */
    getRegistry(includeCompleted?: boolean): Promise<SniperGunResponse>;
    /**
     * 🔍 Check server health
     */
    healthCheck(): Promise<SniperGunResponse>;
    /**
     * 📋 List available tools
     */
    listTools(): Promise<SniperGunResponse>;
    /**
     * Find all HTML forms
     */
    findForms(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find all modal components
     */
    findModals(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find all overlay layers
     */
    findOverlays(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find all HTML generation methods
     */
    findGenerationMethods(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find complex components (high complexity)
     */
    findComplexComponents(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find editable components
     */
    findEditableComponents(scanResults?: any): Promise<SniperGunResponse>;
    /**
     * Find active (non-deprecated) components
     */
    findActiveComponents(scanResults?: any): Promise<SniperGunResponse>;
}
export {};
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
//# sourceMappingURL=SniperGunClient.d.ts.map