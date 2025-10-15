// Universal Viewer - Core TypeScript Types
// Based on Batch 13 AI Control Plane specifications

export type LayerKind =
  | "MapRaster" | "Vector" | "Raster"
  | "Mesh" | "Tiles3D" | "PointCloud"
  | "Chart2D" | "Annotation" | "UI";

export type ControlKind =
  | "slider" | "toggle" | "select"
  | "color" | "text" | "button" | "gizmo";

export type EffectKind =
  | "data" | "style" | "transform"
  | "camera" | "export" | "settings";

// Control Capability Descriptor (CCD) - from UCC spec
export interface CCD {
  controlId: string;                 // "panel.style.raster.hillshade.intensity"
  widgetId: string;                  // "STYLE_PANEL"
  label: string;
  kind: ControlKind;
  paramsSchema: JSONSchema;          // Typed parameters
  affects: EffectKind[];             // What it changes
  destructive?: boolean;             // Delete/reset operations
  preconditions?: string[];          // Requirements before apply
  postconditions?: string[];         // Sanity checks after apply
  previewable: boolean;              // Supports dry-run
  version: string;
}

// Universal Control Contract (UCC) interface
export interface UCC {
  simulate(controlId: string, params: unknown): Promise<DiffSummary>;
  act(controlId: string, params: unknown): Promise<ApplyResult>;
  explain(controlId: string): Promise<string>;
  focus(controlId: string): void;
}

// Control Reflection Protocol (CRP) interface
export interface CRP {
  listControls(scope?: {widgetId?: string; panel?: string}): Promise<CCD[]>;
  getControl(controlId: string): Promise<CCD>;
  resolve(labelOrPath: string): Promise<string[]>; // disambiguation
  subscribeControls(handler: (ev: ControlChangeEvent) => void): Unsubscribe;
}

// Plan and Step types - from AI Control Plane
export type Plan = {
  id: string;                        // CID for verification
  steps: Step[];
  createdAt: number;
  role: Role;
  preview: DiffSummary[];
};

export type Step = OpStep | ControlStep;

export type OpStep = {
  kind: "op";
  id: string;
  params: any;
};

export type ControlStep = {
  kind: "control";
  controlId: string;
  action: "simulate" | "act";
  params: any;
};

// Core render types - from Render Core Adapter spec
export interface UvRenderer {
  mount(container: HTMLElement, opts: RendererOptions): Promise<void>;
  unmount(): Promise<void>;
  addLayer(desc: LayerDesc): Promise<LayerHandle>;
  updateLayer(id: string, patch: Partial<LayerDesc>): Promise<void>;
  removeLayer(id: string): Promise<void>;
  pick(screen: {x: number; y: number}, opts?: PickOpts): Promise<PickResult | null>;
  setCamera(cmd: CameraCommand): void;
  getStats(): RenderStats;
}

export interface LayerDesc {
  id: string;
  kind: LayerKind;
  name: string;
  visible: boolean;
  opacity: number;
  data: any; // Layer-specific data
  style?: any; // Layer-specific styling
}

export interface RenderStats {
  frame_time_ms: number;
  draw_calls: number;
  vram_mb: number;
  tiles_in_view: number;
  tiles_loading: number;
}

// Event and result types
export interface DiffSummary {
  controlId: string;
  changes: Record<string, unknown>;
  metrics?: Record<string, number>;
  humanReadable?: string;
}

export interface ApplyResult {
  applied: boolean;
  diff: DiffSummary;
  error?: string;
}

export interface ControlChangeEvent {
  added: CCD[];
  removed: string[];
}

export interface PickResult {
  layerId: string;
  featureId?: string;
  position: {x: number; y: number; z: number};
  properties: Record<string, unknown>;
}

// Utility types
export type Unsubscribe = () => void;
export type JSONSchema = any; // Simplified for now
export type RendererOptions = any;
export type LayerHandle = string;
export type PickOpts = any;
export type CameraCommand = any;

// Role and permission types - from AI Policy Limits
export type Role = "Analyst-Lite" | "Analyst-Core" | "Editor" | "Admin";

export interface SessionLimits {
  per_session: {
    max_preview_per_min: number;
    max_commit_per_min: number;
    max_plan_steps: number;
    idle_timeout_min: number;
  };
  dangerous_ops: {
    require_reason: boolean;
    confirm_twice: boolean;
  };
}

// Observability event types
export interface UvEvent {
  namespace: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface RenderFrameEvent extends UvEvent {
  namespace: "uv.render.frame";
  data: {
    frame_time_ms: number;
    draw_calls: number;
    vram_mb: number;
    tiles_in_view: number;
    tiles_loading: number;
  };
}

export interface AiControlEvent extends UvEvent {
  namespace: "uv.ai.control";
  event: "reflect" | "simulate" | "act" | "explain" | "focus";
  data: {
    controlId: string;
    params?: unknown;
    result?: unknown;
    duration_ms?: number;
  };
}