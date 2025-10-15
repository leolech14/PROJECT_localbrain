import * as THREE from 'three';
import { RenderPassGraph } from './RenderPassGraph.js';
import { CesiumIntegration } from './CesiumIntegration.js';
import { LayerFactory } from '@uv/layers';
import type { UvRenderer, LayerDesc, LayerHandle, PickResult, CameraCommand, RenderStats } from '@uv/types';

/**
 * Universal Viewer Renderer Implementation
 * Based on Batch 1 RENDER_CORE_ADAPTER specification
 *
 * Invariants:
 * - Exactly one active Cesium viewer per window
 * - All visible objects mount via layer adapters
 * - Prepare work is async, commit() is atomic on main thread
 * - Main loop governed by Cesium render loop
 */
export class UniversalViewerRenderer implements UvRenderer {
  private renderPassGraph: RenderPassGraph;
  private cesiumIntegration: CesiumIntegration;
  private layers: Map<string, LayerHandle> = new Map();
  private container: HTMLElement | null = null;
  private stats: RenderStats;
  private isInitialized = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderPassGraph = new RenderPassGraph(canvas);
    this.cesiumIntegration = new CesiumIntegration(canvas);
    this.stats = this.renderPassGraph.getStats();
  }

  /**
   * Mount the renderer to a container
   */
  async mount(container: HTMLElement, opts: any = {}): Promise<void> {
    this.container = container;

    // Create canvas if not provided
    const canvas = this.renderPassGraph.getRenderer().domElement;
    container.appendChild(canvas);

    // Initialize Cesium viewer
    await this.initializeCesium(canvas, opts);

    // Start render loop
    this.startRenderLoop();

    this.isInitialized = true;

    // Emit uv.renderer.mounted event
    this.emitEvent('uv.renderer.mounted', { container: container.id });
  }

  /**
   * Unmount the renderer
   */
  async unmount(): Promise<void> {
    this.stopRenderLoop();

    if (this.container && this.renderPassGraph.getRenderer().domElement) {
      this.container.removeChild(this.renderPassGraph.getRenderer().domElement);
    }

    this.renderPassGraph.dispose();
    this.layers.clear();
    this.isInitialized = false;

    this.emitEvent('uv.renderer.unmounted', {});
  }

  /**
   * Add a layer to the scene
   */
  async addLayer(desc: LayerDesc): Promise<LayerHandle> {
    if (!this.isInitialized) {
      throw new Error('Renderer not initialized. Call mount() first.');
    }

    const handle = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.layers.set(handle, {
      desc,
      cesiumEntity: null, // Will be populated when we add Cesium layers
      threeObject: null   // Will be populated for Three.js layers
    });

    // Emit uv.layer.added event
    this.emitEvent('uv.layer.added', {
      id: desc.id,
      kind: desc.kind,
      handle
    });

    return handle;
  }

  /**
   * Update a layer
   */
  async updateLayer(id: string, patch: Partial<LayerDesc>): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) {
      throw new Error(`Layer with id ${id} not found`);
    }

    // Update layer description
    layer.desc = { ...layer.desc, ...patch };

    // Apply changes to the actual layer objects
    // This will be implemented when we add specific layer types

    // Emit uv.layer.updated event
    this.emitEvent('uv.layer.updated', {
      id,
      changes: Object.keys(patch)
    });
  }

  /**
   * Remove a layer
   */
  async removeLayer(id: string): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) {
      throw new Error(`Layer with id ${id} not found`);
    }

    // Clean up Cesium/Three.js objects
    if (layer.cesiumEntity && this.cesiumViewer) {
      this.cesiumViewer.entities.remove(layer.cesiumEntity);
    }
    if (layer.threeObject) {
      // Clean up Three.js object
      layer.threeObject.parent?.remove(layer.threeObject);
    }

    this.layers.delete(id);

    // Emit uv.layer.removed event
    this.emitEvent('uv.layer.removed', { id });
  }

  /**
   * Pick objects at screen coordinates
   */
  async pick(screen: { x: number; y: number }, opts: any = {}): Promise<PickResult | null> {
    if (!this.cesiumViewer) {
      return null;
    }

    // Convert screen coordinates to Cesium coordinates
    const cartesian = this.cesiumViewer.scene.pickPosition(
      new Cesium.Cartesian2(screen.x, screen.y)
    );

    if (!cartesian) {
      return null;
    }

    // Convert to geographic coordinates
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);

    return {
      layerId: 'unknown', // Will be determined by layer picking logic
      featureId: 'unknown',
      position: {
        x: cartographic.longitude,
        y: cartographic.latitude,
        z: cartographic.height
      },
      properties: {}
    };
  }

  /**
   * Set camera position/view
   */
  setCamera(cmd: CameraCommand): void {
    if (!this.cesiumViewer) {
      return;
    }

    // Apply camera command
    // This will be implemented when we add camera controls
  }

  /**
   * Get render statistics
   */
  getStats(): RenderStats {
    return this.renderPassGraph.getStats();
  }

  /**
   * Initialize Cesium viewer
   */
  private async initializeCesium(canvas: HTMLCanvasElement, opts: any): Promise<void> {
    // Initialize Cesium integration
    await this.cesiumIntegration.initialize(opts);

    // Connect Cesium with render pass graph
    this.renderPassGraph.setCesiumViewer(this.cesiumIntegration.getViewer());

    // Add default layers
    await this.addDefaultLayers();

    // Set up camera controls
    this.setupCameraControls();
  }

  /**
   * Start the render loop
   */
  private startRenderLoop(): void {
    const render = () => {
      if (!this.isInitialized) return;

      this.renderPassGraph.render();
      this.stats = this.renderPassGraph.getStats();

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  /**
   * Stop the render loop
   */
  private stopRenderLoop(): void {
    this.isInitialized = false;
  }

  /**
   * Emit observability events
   */
  private emitEvent(eventType: string, data: any): void {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent(eventType, { detail: data });
      window.dispatchEvent(event);
    }
  }

  /**
   * Add default layers
   */
  private async addDefaultLayers(): Promise<void> {
    const viewer = this.cesiumIntegration.getViewer();

    // Add default terrain and imagery
    const handle = LayerFactory.createLayer(viewer, {
      id: 'default-terrain',
      kind: 'terrain',
      name: 'World Terrain',
      visible: true,
      opacity: 1.0,
      data: {}
    });

    this.layers.set(handle, {
      desc: {
        id: 'default-terrain',
        kind: 'terrain',
        name: 'World Terrain',
        visible: true,
        opacity: 1.0,
        data: {}
      },
      cesiumEntity: null,
      threeObject: null
    });
  }

  /**
   * Set up camera controls
   */
  private setupCameraControls(): void {
    const viewer = this.cesiumIntegration.getViewer();

    // Enable camera controls
    viewer.scene.screenSpaceCameraController.enableInputs = true;
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableRotate = true;
    viewer.scene.screenSpaceCameraController.enableTranslate = true;

    // Set zoom limits
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 100000000;

    console.log('🎮 Camera controls enabled');
  }

  /**
   * Handle window resize
   */
  resize(width: number, height: number): void {
    this.renderPassGraph.resize(width, height);
    this.cesiumIntegration.resize(width, height);
  }

  /**
   * Get Cesium viewer instance
   */
  getCesiumViewer() {
    return this.cesiumIntegration.getViewer();
  }
}

// Internal layer interface
interface InternalLayer {
  desc: LayerDesc;
  cesiumEntity: any;
  threeObject: THREE.Object3D | null;
}

export default UniversalViewerRenderer;