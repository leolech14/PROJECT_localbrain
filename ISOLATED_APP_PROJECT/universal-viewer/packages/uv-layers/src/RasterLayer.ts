import * as Cesium from 'cesium';
import type { LayerDesc, LayerHandle } from '@uv/types';

/**
 * Raster Layer - Handles custom raster overlays (heatmaps, analysis results)
 * Based on Batch 3 maps-globe-layers specifications
 */
export class RasterLayer {
  private cesiumViewer: Cesium.Viewer;
  private imageryLayer: Cesium.ImageryLayer | null = null;
  private handle: LayerHandle;

  constructor(viewer: Cesium.Viewer, handle: LayerHandle) {
    this.cesiumViewer = viewer;
    this.handle = handle;
  }

  /**
   * Add heatmap overlay
   */
  async addHeatmap(url: string, bounds: number[][]): Promise<void> {
    const imageryProvider = new Cesium.SingleTileImageryProvider({
      url: url,
      rectangle: Cesium.Rectangle.fromDegrees(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1])
    });

    this.addRasterLayer(imageryProvider, 'Heatmap');
  }

  /**
   * Add analysis results as raster
   */
  addAnalysisRaster(canvas: HTMLCanvasElement, bounds: number[][]): void {
    const imageryProvider = new Cesium.SingleTileImageryProvider({
      url: canvas.toDataURL(),
      rectangle: Cesium.Rectangle.fromDegrees(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1])
    });

    this.addRasterLayer(imageryProvider, 'Analysis Results');
  }

  /**
   * Add water depth visualization
   */
  addWaterDepthVisualization(): void {
    // Create a simple water depth gradient
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create depth gradient (blue to darker blue)
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, 'rgba(0, 119, 190, 0.8)');
      gradient.addColorStop(0.5, 'rgba(0, 89, 160, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 59, 130, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      // Add some depth contours
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 25);
        ctx.lineTo(256, i * 25);
        ctx.stroke();
      }

      // Use as overlay for specific area
      const bounds = [[-122.5, 37.7], [-122.3, 37.8]]; // San Francisco area
      this.addAnalysisRaster(canvas, bounds);
    }
  }

  /**
   * Add sediment thickness visualization
   */
  addSedimentThickness(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create sediment pattern (brown/tan colors)
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(194, 178, 128, 0.6)');
      gradient.addColorStop(0.5, 'rgba(160, 134, 96, 0.7)');
      gradient.addColorStop(1, 'rgba(128, 96, 64, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add noise pattern for texture
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 3;
        const opacity = Math.random() * 0.3;

        ctx.fillStyle = `rgba(101, 67, 33, ${opacity})`;
        ctx.fillRect(x, y, size, size);
      }

      const bounds = [[-122.6, 37.6], [-122.2, 37.9]]; // Larger area
      this.addAnalysisRaster(canvas, bounds);
    }
  }

  /**
   * Add raster layer to the viewer
   */
  private addRasterLayer(provider: Cesium.ImageryProvider, name: string): void {
    // Remove existing layer if any
    if (this.imageryLayer) {
      this.cesiumViewer.imageryLayers.remove(this.imageryLayer);
    }

    // Add new layer
    this.imageryLayer = this.cesiumViewer.imageryLayers.addImageryProvider(
      provider,
      {
        show: true,
        alpha: 0.7,
        brightness: 1.0,
        contrast: 1.2,
        saturation: 0.8,
        gamma: 0.9
      }
    );

    console.log(`📊 Added raster layer: ${name}`);
  }

  /**
   * Set layer opacity
   */
  setOpacity(opacity: number): void {
    if (this.imageryLayer) {
      this.imageryLayer.alpha = Math.max(0, Math.min(1, opacity));
    }
  }

  /**
   * Set layer contrast
   */
  setContrast(contrast: number): void {
    if (this.imageryLayer) {
      this.imageryLayer.contrast = Math.max(0, Math.min(3, contrast));
    }
  }

  /**
   * Toggle layer visibility
   */
  setVisible(visible: boolean): void {
    if (this.imageryLayer) {
      this.imageryLayer.show = visible;
    }
  }

  /**
   * Get layer information
   */
  getLayerInfo(): any {
    if (!this.imageryLayer) {
      return null;
    }

    return {
      name: 'Raster Layer',
      show: this.imageryLayer.show,
      alpha: this.imageryLayer.alpha,
      contrast: this.imageryLayer.contrast
    };
  }

  /**
   * Dispose of raster layer
   */
  dispose(): void {
    if (this.imageryLayer) {
      this.cesiumViewer.imageryLayers.remove(this.imageryLayer);
      this.imageryLayer = null;
    }
  }
}

export default RasterLayer;