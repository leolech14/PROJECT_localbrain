import * as Cesium from 'cesium';
import type { LayerDesc, LayerHandle } from '@uv/types';

/**
 * Vector Layer - Handles GeoJSON vector data (buildings, roads, points)
 * Based on Batch 3 maps-globe-layers specifications
 */
export class VectorLayer {
  private cesiumViewer: Cesium.Viewer;
  private dataSource: Cesium.GeoJsonDataSource | null = null;
  private handle: LayerHandle;

  constructor(viewer: Cesium.Viewer, handle: LayerHandle) {
    this.cesiumViewer = viewer;
    this.handle = handle;
  }

  /**
   * Load GeoJSON data from URL
   */
  async loadGeoJSON(url: string, name: string): Promise<void> {
    try {
      const dataSource = await Cesium.GeoJsonDataSource.load(url, {
        stroke: Cesium.Color.YELLOW,
        fill: Cesium.Color.YELLOW.withAlpha(0.5),
        strokeWidth: 2,
        clampToGround: true
      });

      this.addDataSource(dataSource, name);
    } catch (error) {
      console.error(`Failed to load GeoJSON from ${url}:`, error);
    }
  }

  /**
   * Load GeoJSON data from object
   */
  loadGeoJSONFromObject(geoJson: any, name: string): void {
    try {
      const dataSource = Cesium.GeoJsonDataSource.load(geoJson, {
        stroke: Cesium.Color.CYAN,
        fill: Cesium.Color.CYAN.withAlpha(0.3),
        strokeWidth: 1,
        clampToGround: true
      });

      this.addDataSource(dataSource, name);
    } catch (error) {
      console.error(`Failed to load GeoJSON object:`, error);
    }
  }

  /**
   * Add sample building data
   */
  addSampleBuildings(): void {
    const sampleBuildings = {
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
            name: 'Building 1',
            height: 50,
            type: 'office'
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
            name: 'Building 2',
            height: 75,
            type: 'residential'
          }
        }
      ]
    };

    this.loadGeoJSONFromObject(sampleBuildings, 'Sample Buildings');
  }

  /**
   * Add data source to viewer
   */
  private addDataSource(dataSource: Cesium.GeoJsonDataSource, name: string): void {
    // Remove existing data source if any
    if (this.dataSource) {
      this.cesiumViewer.dataSources.remove(this.dataSource);
    }

    // Add new data source
    this.dataSource = dataSource;
    this.cesiumViewer.dataSources.add(dataSource);

    // Style entities
    this.styleEntities();

    console.log(`🏢 Added vector layer: ${name}`);
  }

  /**
   * Style vector entities
   */
  private styleEntities(): void {
    if (!this.dataSource) return;

    const entities = this.dataSource.entities.values;
    for (const entity of entities) {
      if (entity.polygon) {
        // Style polygons
        entity.polygon.height = 0;
        entity.polygon.extrudedHeight = entity.properties?.height || 10;
        entity.polygon.material = Cesium.Color.fromCssColorString('#00ffff').withAlpha(0.8);
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.CYAN;
      }

      if (entity.polyline) {
        // Style lines
        entity.polyline.clampToGround = true;
        entity.polyline.material = Cesium.Color.CYAN;
        entity.polyline.width = 2;
      }

      if (entity.point) {
        // Style points
        entity.point.pixelSize = 10;
        entity.point.color = Cesium.Color.YELLOW;
        entity.point.outlineColor = Cesium.Color.BLACK;
        entity.point.outlineWidth = 2;
      }
    }
  }

  /**
   * Set entity color
   */
  setEntityColor(color: string): void {
    if (!this.dataSource) return;

    const cesiumColor = Cesium.Color.fromCssColorString(color);
    const entities = this.dataSource.entities.values;

    for (const entity of entities) {
      if (entity.polygon) {
        entity.polygon.material = cesiumColor.withAlpha(0.8);
      }
      if (entity.polyline) {
        entity.polyline.material = cesiumColor;
      }
      if (entity.point) {
        entity.point.color = cesiumColor;
      }
    }
  }

  /**
   * Toggle layer visibility
   */
  setVisible(visible: boolean): void {
    if (this.dataSource) {
      this.dataSource.show = visible;
    }
  }

  /**
   * Get layer information
   */
  getLayerInfo(): any {
    if (!this.dataSource) {
      return null;
    }

    return {
      name: this.dataSource.name,
      show: this.dataSource.show,
      entityCount: this.dataSource.entities.values.length
    };
  }

  /**
   * Dispose of vector layer
   */
  dispose(): void {
    if (this.dataSource) {
      this.cesiumViewer.dataSources.remove(this.dataSource);
      this.dataSource = null;
    }
  }
}

export default VectorLayer;