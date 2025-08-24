const supabase = require('../config/supabase');
const csvParser = require('../utils/csvParser');

class PermitService {
  async uploadPermits(csvBuffer) {
    const permits = await csvParser.parsePermitCSV(csvBuffer);
    
    const { data, error } = await supabase
      .from('permits')
      .upsert(permits, { onConflict: 'license_id' });

    return {
      success: !error,
      inserted: permits.length,
      message: error ? error.message : 'Permits uploaded successfully'
    };
  }

  async getPermits(filters) {
    let query = supabase
      .from('permits')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.license_id) {
      query = query.ilike('license_id', `%${filters.license_id}%`);
    }
    
    if (filters.status === 'expired') {
      query = query.lt('valid_to', new Date().toISOString());
    } else if (filters.status === 'active') {
      query = query.gte('valid_to', new Date().toISOString());
    }

    const { data } = await query;
    return data || [];
  }

  async createPermit(permitData) {
    const { data } = await supabase
      .from('permits')
      .insert({
        license_id: permitData.license_id,
        owner: permitData.owner,
        geo_point: `POINT(${permitData.longitude} ${permitData.latitude})`,
        width_m: permitData.width_m,
        height_m: permitData.height_m,
        valid_from: permitData.valid_from,
        valid_to: permitData.valid_to,
        notes: permitData.notes
      })
      .select()
      .single();

    return data;
  }

  async updatePermit(id, updates) {
    const { data } = await supabase
      .from('permits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return data;
  }

  async findNearbyPermits(longitude, latitude, radiusMeters = 100) {
    const { data } = await supabase.rpc('find_nearby_permits', {
      point_lng: longitude,
      point_lat: latitude,
      radius_m: radiusMeters
    });

    return data || [];
  }
}

module.exports = new PermitService();