import * as Cesium from 'cesium';
import type { LayerDesc, LayerHandle } from '@uv/types';

/**
 * Terrain Layer - Handles elevation data and terrain rendering
 * Based on Batch 3 maps-globe-layers specifications
 */
export class TerrainLayer {
  private cesiumViewer: Cesium.Viewer;
  private terrainProvider: Cesium.TerrainProvider | null = null;
  private handle: LayerHandle;

  constructor(viewer: Cesium.Viewer, handle: LayerHandle) {
    this.cesiumViewer = viewer;
    this.handle = handle;
  }

  /**
   * Load terrain from specified provider
   */
  async loadTerrain(provider: Cesium.TerrainProvider): Promise<void> {
    this.terrainProvider = provider;
    this.cesiumViewer.terrainProvider = provider;

    // Wait for terrain to load
    await this.waitForTerrainLoad();
  }

  /**
   * Load world terrain with underwater support
   */
  async loadWorldTerrain(): Promise<void> {
    const terrainProvider = await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    });

    await this.loadTerrain(terrainProvider);
  }

  /**
   * Wait for terrain to be ready
   */
  private async waitForTerrainLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.cesiumViewer.terrainProvider?.ready) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 30000);
    });
  }

  /**
   * Get terrain height at specific coordinates
   */
  async getHeightAtCoordinates(longitude: number, latitude: number): Promise<number> {
    const cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude);
    const positions = [cartographic];

    try {
      const updatedPositions = await Cesium.sampleTerrainMostDetailed(
        this.terrainProvider || this.cesiumViewer.terrainProvider,
        positions
      );

      return updatedPositions[0]?.height || 0;
    } catch (error) {
      console.warn('Failed to sample terrain height:', error);
      return 0;
    }
  }

  /**
   * Check if point is underwater
   */
  async isUnderwater(longitude: number, latitude: number): Promise<boolean> {
    const height = await this.getHeightAtCoordinates(longitude, latitude);
    return height < 0;
  }

  /**
   * Dispose of terrain resources
   */
  dispose(): void {
    this.terrainProvider = null;
  }
}

export default TerrainLayer;