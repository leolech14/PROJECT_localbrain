import * as THREE from 'three';
import type { UvRenderer, RenderStats, LayerDesc, LayerHandle, RendererOptions } from '@uv/types';

/**
 * Render Pass Graph - orchestrates the rendering pipeline
 * Based on Batch 1 RENDER_CORE_ADAPTER specification
 *
 * Pipeline: background(AquaSpace) → baseScene(Cesium) → overlays(HUD) → post
 */
export class RenderPassGraph {
  private passes: RenderPass[] = [];
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private stats: RenderStats = {
    frame_time_ms: 0,
    draw_calls: 0,
    vram_mb: 0,
    tiles_in_view: 0,
    tiles_loading: 0
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setClearColor(0x000000, 0); // Transparent background

    this.initializePasses();
  }

  private initializePasses(): void {
    // Pass 1: AquaSpace (underwater background)
    this.passes.push(new AquaSpacePass());

    // Pass 2: Cesium (3D globe/maps)
    this.passes.push(new CesiumPass(this.canvas));

    // Pass 3: HUD/UI overlay
    this.passes.push(new HUDPass());

    // Pass 4: Post-processing
    this.passes.push(new PostProcessPass());
  }

  /**
   * Set Cesium viewer for integration
   */
  setCesiumViewer(viewer: any): void {
    const cesiumPass = this.passes.find(pass => pass instanceof CesiumPass);
    if (cesiumPass) {
      cesiumPass.setCesiumViewer(viewer);
    }
  }

  /**
   * Execute the render pass graph
   * Performance target: <16.67ms per frame (60 FPS)
   */
  render(): void {
    const startTime = performance.now();

    this.renderer.clear();

    for (const pass of this.passes) {
      pass.render(this.renderer);
    }

    // Update performance stats
    this.stats.frame_time_ms = performance.now() - startTime;
    this.stats.draw_calls = this.renderer.info.render.calls;

    // Emit uv.render.frame event
    this.emitRenderEvent();
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.canvas.width = width;
    this.canvas.height = height;

    for (const pass of this.passes) {
      pass.resize?.(width, height);
    }
  }

  getStats(): RenderStats {
    return { ...this.stats };
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  dispose(): void {
    for (const pass of this.passes) {
      pass.dispose?.();
    }
    this.renderer.dispose();
  }

  private emitRenderEvent(): void {
    // Emit observability event: uv.render.frame
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent('uv.render.frame', {
        detail: this.stats
      });
      window.dispatchEvent(event);
    }
  }
}

/**
 * Base class for all render passes
 */
abstract class RenderPass {
  abstract render(renderer: THREE.WebGLRenderer): void;
  resize?(width: number, height: number): void;
  dispose?(): void;
}

/**
 * AquaSpace Pass - underwater background effects
 * Performance target: ≤1.5ms
 * Features: parallax noise, soft caustics, subtle fog
 */
class AquaSpacePass extends RenderPass {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;

  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.setupShaders();
    this.createGeometry();
  }

  private setupShaders(): void {
    // AquaSpace shader for underwater effects
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;

      // Noise function for water effect
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;

        // Parallax effect
        vec2 parallax = vec2(sin(time * 0.1), cos(time * 0.15)) * 0.1;

        // Caustics effect
        float caustics = noise(uv * 10.0 + time * 0.05) * 0.1;
        caustics += noise(uv * 20.0 + time * 0.08) * 0.05;

        // Underwater color gradient
        vec3 deepWater = vec3(0.0, 0.2, 0.4);
        vec3 shallowWater = vec3(0.0, 0.5, 0.7);

        vec3 color = mix(deepWater, shallowWater, uv.y + parallax.y);
        color += caustics;

        // Subtle fog
        float fog = smoothstep(0.0, 1.0, uv.y);
        color = mix(color, vec3(0.0, 0.1, 0.2), fog * 0.3);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() }
      }
    });
  }

  private createGeometry(): void {
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.quad);
  }

  render(renderer: THREE.WebGLRenderer): void {
    // Update time uniform for animation
    this.material.uniforms.time.value = performance.now() * 0.001;
    this.material.uniforms.resolution.value.set(
      renderer.domElement.width,
      renderer.domElement.height
    );

    renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}

/**
 * Cesium Pass - 3D globe and maps rendering
 * Integrated with CesiumJS for geographic visualization
 */
class CesiumPass extends RenderPass {
  private cesiumViewer: any = null; // Will be Cesium.Viewer when integrated

  constructor() {
    super();
  }

  setCesiumViewer(viewer: any): void {
    this.cesiumViewer = viewer;
  }

  render(renderer: THREE.WebGLRenderer): void {
    // Cesium handles its own rendering
    // This pass ensures Cesium renders in the correct pipeline position
    if (this.cesiumViewer) {
      // Cesium renders automatically through its own render loop
      // We just ensure it's called at the right time
    }
  }

  resize(width: number, height: number): void {
    // Resize Cesium viewer
    if (this.cesiumViewer) {
      this.cesiumViewer.scene.canvas.width = width;
      this.cesiumViewer.scene.canvas.height = height;
      this.cesiumViewer.resize();
    }
  }
}

/**
 * HUD Pass - UI overlay rendering
 */
class HUDPass extends RenderPass {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  render(renderer: THREE.WebGLRenderer): void {
    // Render UI elements here
    // Currently passes - UI will be rendered separately
  }
}

/**
 * Post-Process Pass - final effects
 */
class PostProcessPass extends RenderPass {
  render(renderer: THREE.WebGLRenderer): void {
    // Apply post-processing effects
    // Currently passes - effects will be added here
  }
}

export { AquaSpacePass, CesiumPass, HUDPass, PostProcessPass };