const csv = require('csv-parser');
const { Readable } = require('stream');

class CSVParser {
  async parsePermitCSV(buffer) {
    return new Promise((resolve, reject) => {
      const permits = [];
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      stream
        .pipe(csv())
        .on('data', (row) => {
          // Clean and validate each row
          const permit = {
            license_id: this.cleanString(row.license_id || row.License_ID || row.id),
            owner: this.cleanString(row.owner || row.Owner || row.permit_holder),
            geo_point: this.createGeoPoint(
              parseFloat(row.longitude || row.lng || row.lon),
              parseFloat(row.latitude || row.lat)
            ),
            width_m: parseFloat(row.width_m || row.width) || null,
            height_m: parseFloat(row.height_m || row.height) || null,
            valid_from: this.parseDate(row.valid_from || row.start_date),
            valid_to: this.parseDate(row.valid_to || row.end_date || row.expiry),
            notes: this.cleanString(row.notes || row.remarks || '')
          };

          // Only add if required fields are present
          if (permit.license_id && permit.owner && permit.geo_point) {
            permits.push(permit);
          }
        })
        .on('end', () => resolve(permits))
        .on('error', reject);
    });
  }

  cleanString(str) {
    return str ? str.toString().trim() : null;
  }

  createGeoPoint(longitude, latitude) {
    if (isNaN(longitude) || isNaN(latitude)) return null;
    return `POINT(${longitude} ${latitude})`;
  }

  parseDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }
}

module.exports = new CSVParser();