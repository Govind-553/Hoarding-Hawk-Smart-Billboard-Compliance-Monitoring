const supabase = require('../config/supabase');
const permitService = require('./permitService');
const geoUtils = require('../utils/geoUtils');

class MatchingService {
  async processReport(gpsPoint, clientRules) {
    const serverRules = {
      timestamp: new Date().toISOString(),
      violations: [],
      permit_match: null,
      geofence_violations: []
    };

    // 1. Check permit matching
    const nearbyPermits = await permitService.findNearbyPermits(
      gpsPoint.longitude, 
      gpsPoint.latitude, 
      50 // 50m radius
    );

    if (nearbyPermits.length > 0) {
      // Try to match with OCR license ID from client
      const ocrLicense = clientRules.ocr_result?.license_id;
      if (ocrLicense) {
        const matchedPermit = nearbyPermits.find(p => 
          this.fuzzyMatchLicense(p.license_id, ocrLicense)
        );
        if (matchedPermit) {
          serverRules.permit_match = matchedPermit;
          
          // Check if permit is expired
          if (new Date(matchedPermit.valid_to) < new Date()) {
            serverRules.violations.push('expired_permit');
          }
        }
      }
    } else {
      serverRules.violations.push('no_permit_found');
    }

    // 2. Check geofence violations
    const geofenceViolations = await this.checkGeofences(gpsPoint);
    serverRules.geofence_violations = geofenceViolations;
    
    if (geofenceViolations.length > 0) {
      serverRules.violations.push('geofence_violation');
    }

    // 3. Validate client-reported violations
    if (clientRules.structural_tilt) {
      serverRules.violations.push('structural_tilt');
    }
    
    if (clientRules.no_license_marker && !serverRules.permit_match) {
      serverRules.violations.push('no_license_marker');
    }

    return serverRules;
  }

  async checkGeofences(gpsPoint) {
    const { data } = await supabase.rpc('check_geofence_violations', {
      point_lng: gpsPoint.longitude,
      point_lat: gpsPoint.latitude
    });

    return data || [];
  }

  fuzzyMatchLicense(permitLicense, ocrLicense) {
    if (!permitLicense || !ocrLicense) return false;
    
    const clean1 = permitLicense.replace(/[^A-Z0-9]/g, '').toUpperCase();
    const clean2 = ocrLicense.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Simple fuzzy matching - can be improved with Levenshtein distance
    return clean1 === clean2 || 
           clean1.includes(clean2) || 
           clean2.includes(clean1);
  }
}

module.exports = new MatchingService();