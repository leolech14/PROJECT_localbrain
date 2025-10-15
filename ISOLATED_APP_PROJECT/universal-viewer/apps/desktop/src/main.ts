// Universal Viewer - Main Desktop Application
// Initialize the underwater intelligence desktop environment

import { UniversalViewerRenderer } from '@uv/render-core';
import type { LayerDesc } from '@uv/types';

class UniversalViewerApp {
  private renderer: UniversalViewerRenderer;
  private canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private isLoading = true;

  constructor() {
    this.canvas = document.getElementById('render-canvas') as HTMLCanvasElement;
    this.container = document.getElementById('canvas-container')!;

    this.renderer = new UniversalViewerRenderer(this.canvas);
  }

  async initialize(): Promise<void> {
    try {
      console.log('🌊 Initializing Universal Viewer...');

      // Mount the renderer
      await this.renderer.mount(this.container, {
        // Cesium options will go here
      });

      // Set up event listeners
      this.setupEventListeners();

      // Set up UI controls
      this.setupUIControls();

      // Start status monitoring
      this.startStatusMonitoring();

      // Hide loading screen
      this.hideLoading();

      // Add a demo layer
      await this.addDemoLayer();

      console.log('✅ Universal Viewer initialized successfully!');
      this.updateVoiceStatus('AI Control Plane ready - Say "What can you control?"');

    } catch (error) {
      console.error('❌ Failed to initialize Universal Viewer:', error);
      this.updateVoiceStatus('Initialization failed - Please refresh');
    }
  }

  private setupEventListeners(): void {
    // Handle window resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.resize?.(width, height);
    });

    // Listen for render events
    window.addEventListener('uv.render.frame', (event: any) => {
      this.updateStats(event.detail);
    });

    // Listen for AI control events (placeholder for future AI integration)
    window.addEventListener('uv.ai.control.act', (event: any) => {
      console.log('🤖 AI Control Action:', event.detail);
      this.updateVoiceStatus(`AI adjusted ${event.detail.controlId}`);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.toggleFullscreen();
      }
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        this.toggleDebugMode();
      }
    });
  }

  private setupUIControls(): void {
    // Water intensity slider
    const waterIntensity = document.getElementById('water-intensity') as HTMLInputElement;
    waterIntensity.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      console.log('💧 Water intensity:', value);
      // This will control the AquaSpace shader uniform
    });

    // Caustics strength slider
    const causticsStrength = document.getElementById('caustics-strength') as HTMLInputElement;
    causticsStrength.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      console.log('✨ Caustics strength:', value);
      // This will control caustics effect intensity
    });

    // Fog density slider
    const fogDensity = document.getElementById('fog-density') as HTMLInputElement;
    fogDensity.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      console.log('🌫️ Fog density:', value);
      // This will control underwater fog
    });

    // Current speed slider
    const currentSpeed = document.getElementById('current-speed') as HTMLInputElement;
    currentSpeed.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      console.log('🌊 Current speed:', value);
      // This will control water animation speed
    });

    // Cesium terrain visibility slider
    const terrainVisibility = document.getElementById('terrain-visibility') as HTMLInputElement;
    terrainVisibility.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value) / 100;
      console.log('🏔️ Terrain visibility:', value);
      // This will control terrain visibility
      this.updateTerrainVisibility(value);
    });

    // Cesium imagery brightness slider
    const imageryBrightness = document.getElementById('imagery-brightness') as HTMLInputElement;
    imageryBrightness.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value) / 100;
      console.log('🛰️ Imagery brightness:', value);
      // This will control imagery brightness
      this.updateImageryBrightness(value);
    });

    // Buildings height slider
    const buildingsHeight = document.getElementById('buildings-height') as HTMLInputElement;
    buildingsHeight.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      console.log('🏢 Buildings height:', value);
      // This will control building heights
      this.updateBuildingHeights(value);
    });

    // Add buildings button
    const addBuildingsBtn = document.getElementById('add-buildings') as HTMLButtonElement;
    addBuildingsBtn.addEventListener('click', () => {
      console.log('🏢 Adding sample buildings...');
      this.addSampleBuildings();
      this.updateVoiceStatus('Added sample buildings to the scene');
    });
  }

  private startStatusMonitoring(): void {
    setInterval(() => {
      const stats = this.renderer.getStats();
      this.updateStats(stats);
    }, 1000); // Update every second
  }

  private updateStats(stats: any): void {
    document.getElementById('frame-time')!.textContent = `${Math.round(stats.frame_time_ms)}ms`;
    document.getElementById('draw-calls')!.textContent = stats.draw_calls.toString();
    document.getElementById('vram')!.textContent = `${Math.round(stats.vram_mb)}MB`;

    const fps = Math.round(1000 / stats.frame_time_ms);
    document.getElementById('fps')!.textContent = `${Math.min(fps, 60)}`;
  }

  private hideLoading(): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }
    this.isLoading = false;
  }

  private updateVoiceStatus(text: string): void {
    const voiceStatus = document.getElementById('voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = text;
    }
  }

  private async addDemoLayer(): Promise<void> {
    try {
      // Add a demo layer (this will be expanded when we add proper layer types)
      const demoLayer: LayerDesc = {
        id: 'demo-underwater-scene',
        kind: 'MapRaster',
        name: 'Underwater Environment',
        visible: true,
        opacity: 1.0,
        data: {
          type: 'aquaspace',
          animated: true
        }
      };

      const handle = await this.renderer.addLayer(demoLayer);
      console.log('🎨 Demo layer added:', handle);

    } catch (error) {
      console.error('Failed to add demo layer:', error);
    }
  }

  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.updateVoiceStatus('Entered fullscreen mode');
    } else {
      document.exitFullscreen();
      this.updateVoiceStatus('Exited fullscreen mode');
    }
  }

  private toggleDebugMode(): void {
    // Toggle debug information display
    this.updateVoiceStatus('Debug mode toggled');
  }

  // Cesium control methods
  private updateTerrainVisibility(value: number): void {
    try {
      const cesiumViewer = this.renderer.getCesiumViewer();
      if (cesiumViewer && cesiumViewer.scene.globe) {
        cesiumViewer.scene.globe.show = value > 0;
        console.log('🏔️ Terrain visibility updated');
      }
    } catch (error) {
      console.warn('Failed to update terrain visibility:', error);
    }
  }

  private updateImageryBrightness(value: number): void {
    try {
      const cesiumViewer = this.renderer.getCesiumViewer();
      if (cesiumViewer && cesiumViewer.imageryLayers) {
        const baseLayer = cesiumViewer.imageryLayers.get(0);
        if (baseLayer) {
          baseLayer.brightness = value;
          console.log('🛰️ Imagery brightness updated');
        }
      }
    } catch (error) {
      console.warn('Failed to update imagery brightness:', error);
    }
  }

  private updateBuildingHeights(value: number): void {
    try {
      const cesiumViewer = this.renderer.getCesiumViewer();
      if (cesiumViewer && cesiumViewer.dataSources) {
        const vectorDataSource = cesiumViewer.dataSources.getByName('Sample Buildings');
        if (vectorDataSource) {
          const entities = vectorDataSource.entities.values;
          for (const entity of entities) {
            if (entity.polygon) {
              entity.polygon.extrudedHeight = value;
            }
          }
          console.log('🏢 Building heights updated');
        }
      }
    } catch (error) {
      console.warn('Failed to update building heights:', error);
    }
  }

  private addSampleBuildings(): void {
    try {
      const cesiumViewer = this.renderer.getCesiumViewer();
      if (cesiumViewer) {
        // Add vector layer with sample buildings
        cesiumViewer.dataSources.add(
          Cesium.GeoJsonDataSource.load({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-122.4194, 37.7749],
                    [-122.4184, 37.7749],
                    [-122.4184, 37.7759],
                    [-122.4194, 37.7759],
                    [-122.4194, 37.7749]
                  ]]
                },
                properties: {
                  name: 'Underwater Building 1',
                  height: 50,
                  type: 'research'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-122.4170, 37.7740],
                    [-122.4160, 37.7740],
                    [-122.4160, 37.7750],
                    [-122.4170, 37.7750],
                    [-122.4170, 37.7740]
                  ]]
                },
                properties: {
                  name: 'Underwater Research Lab',
                  height: 75,
                  type: 'laboratory'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-122.4150, 37.7755],
                    [-122.4140, 37.7755],
                    [-122.4140, 37.7765],
                    [-122.4150, 37.7765],
                    [-122.4150, 37.7755]
                  ]]
                },
                properties: {
                  name: 'AI Control Center',
                  height: 100,
                  type: 'facility'
                }
              }
            ]
          }, {
            stroke: Cesium.Color.CYAN,
            fill: Cesium.Color.CYAN.withAlpha(0.6),
            strokeWidth: 2,
            clampToGround: true
          })
        ).then((dataSource) => {
          dataSource.name = 'Sample Buildings';
          // Style entities
          const entities = dataSource.entities.values;
          for (const entity of entities) {
            if (entity.polygon) {
              entity.polygon.height = 0;
              entity.polygon.extrudedHeight = entity.properties?.height || 50;
              entity.polygon.material = Cesium.Color.fromCssColorString('#00ffff').withAlpha(0.7);
              entity.polygon.outline = true;
              entity.polygon.outlineColor = Cesium.Color.CYAN;
            }
          }
          console.log('🏢 Sample buildings added successfully');
        });
      }
    } catch (error) {
      console.error('Failed to add sample buildings:', error);
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new UniversalViewerApp();
  await app.initialize();
});

// Export for module usage
export default UniversalViewerApp;