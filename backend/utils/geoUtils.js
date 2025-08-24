const geolib = require('geolib');

class GeoUtils {
  // Calculate distance between two GPS points in meters
  calculateDistance(point1, point2) {
    return geolib.getDistance(point1, point2);
  }

  // Check if point is within radius of target
  isWithinRadius(point, target, radiusMeters) {
    const distance = this.calculateDistance(point, target);
    return distance <= radiusMeters;
  }

  // Convert GPS coordinates to PostGIS POINT format
  toPostGISPoint(longitude, latitude) {
    return `POINT(${longitude} ${latitude})`;
  }

  // Parse PostGIS POINT to coordinates object
  parsePostGISPoint(pointString) {
    const coords = pointString.match(/POINT\(([^)]+)\)/);
    if (coords) {
      const [lng, lat] = coords[1].split(' ').map(Number);
      return { longitude: lng, latitude: lat };
    }
    return null;
  }

  // Create bounding box around point
  createBoundingBox(center, radiusKm) {
    const bounds = geolib.getBoundsOfDistance(center, radiusKm * 1000);
    return {
      southwest: bounds[0],
      northeast: bounds[1]
    };
  }

  // Validate GPS coordinates
  isValidCoordinate(longitude, latitude) {
    return longitude >= -180 && longitude <= 180 && 
           latitude >= -90 && latitude <= 90;
  }
}

module.exports = new GeoUtils();