// Universal Viewer - Geographic Layers Package
// Exports all layer implementations for Cesium integration

export { default as TerrainLayer } from './TerrainLayer.js';
export { default as ImageryLayer } from './ImageryLayer.js';
export { default as VectorLayer } from './VectorLayer.js';
export { default as RasterLayer } from './RasterLayer.js';

// Layer factory for creating layers by type
import TerrainLayer from './TerrainLayer.js';
import ImageryLayer from './ImageryLayer.js';
import VectorLayer from './VectorLayer.js';
import RasterLayer from './RasterLayer.js';
import type { LayerDesc, LayerHandle } from '@uv/types';

export class LayerFactory {
  static createLayer(viewer: any, layerDesc: LayerDesc): LayerHandle {
    const handle = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (layerDesc.kind) {
      case 'terrain':
        const terrainLayer = new TerrainLayer(viewer, handle);
        // Initialize terrain asynchronously
        terrainLayer.loadWorldTerrain();
        return handle;

      case 'imagery':
        const imageryLayer = new ImageryLayer(viewer, handle);
        imageryLayer.addSatelliteImagery();
        return handle;

      case 'vector':
        const vectorLayer = new VectorLayer(viewer, handle);
        vectorLayer.addSampleBuildings();
        return handle;

      case 'raster':
        const rasterLayer = new RasterLayer(viewer, handle);
        rasterLayer.addWaterDepthVisualization();
        return handle;

      default:
        throw new Error(`Unsupported layer kind: ${layerDesc.kind}`);
    }
  }
}