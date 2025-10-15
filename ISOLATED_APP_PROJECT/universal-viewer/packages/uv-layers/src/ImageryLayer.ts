import * as Cesium from 'cesium';
import type { LayerDesc, LayerHandle } from '@uv/types';

/**
 * Imagery Layer - Handles satellite imagery and raster overlays
 * Based on Batch 3 maps-globe-layers specifications
 */
export class ImageryLayer {
  private cesiumViewer: Cesium.Viewer;
  private imageryLayer: Cesium.ImageryLayer | null = null;
  private handle: LayerHandle;

  constructor(viewer: Cesium.Viewer, handle: LayerHandle) {
    this.cesiumViewer = viewer;
    this.handle = handle;
  }

  /**
   * Add satellite imagery layer
   */
  async addSatelliteImagery(): Promise<void> {
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(2);
    this.addImageryLayer(imageryProvider, 'Satellite Imagery');
  }

  /**
   * Add custom imagery from URL
   */
  addCustomImagery(url: string, name: string): void {
    const imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: url,
      maximumLevel: 18
    });

    this.addImageryLayer(imageryProvider, name);
  }

  /**
   * Add underwater imagery layer (seabed, bathymetry)
   */
  async addUnderwaterImagery(): Promise<void> {
    // Blue marble bathymetry
    const imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maximumLevel: 19
    });

    this.addImageryLayer(imageryProvider, 'Underwater Imagery');
  }

  /**
   * Add imagery layer to the viewer
   */
  private addImageryLayer(provider: Cesium.ImageryProvider, name: string): void {
    // Remove existing layer if any
    if (this.imageryLayer) {
      this.cesiumViewer.imageryLayers.remove(this.imageryLayer);
    }

    // Add new layer
    this.imageryLayer = this.cesiumViewer.imageryLayers.addImageryProvider(
      provider,
      {
        show: true,
        alpha: 1.0,
        brightness: 1.0,
        contrast: 1.0,
        hue: 0.0,
        saturation: 1.0,
        gamma: 1.0
      }
    );

    console.log(`🗺️ Added imagery layer: ${name}`);
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
   * Set layer brightness
   */
  setBrightness(brightness: number): void {
    if (this.imageryLayer) {
      this.imageryLayer.brightness = Math.max(0, Math.min(3, brightness));
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
      name: this.imageryLayer.name,
      show: this.imageryLayer.show,
      alpha: this.imageryLayer.alpha,
      brightness: this.imageryLayer.brightness,
      contrast: this.imageryLayer.contrast
    };
  }

  /**
   * Dispose of imagery layer
   */
  dispose(): void {
    if (this.imageryLayer) {
      this.cesiumViewer.imageryLayers.remove(this.imageryLayer);
      this.imageryLayer = null;
    }
  }
}

export default ImageryLayer;