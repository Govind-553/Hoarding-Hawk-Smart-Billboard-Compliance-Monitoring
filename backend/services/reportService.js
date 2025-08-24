const supabase = require('../config/supabase');
const matchingService = require('./matchingService');

class ReportService {
  async createReport(reportData) {
    const { user_id, gps_point, image, rules_triggered, local_hash } = reportData;
    
    // Upload image to Supabase Storage
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const { data: uploadData } = await supabase.storage
      .from('report-images')
      .upload(filename, image.buffer, { contentType: image.mimetype });

    // Run server-side matching
    const serverRules = await matchingService.processReport(gps_point, rules_triggered);

    // Insert report record
    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id,
        gps_point: `POINT(${gps_point.longitude} ${gps_point.latitude})`,
        image_url: uploadData?.path,
        rules_triggered,
        server_rules: serverRules,
        local_hash,
        status: 'pending',
        permit_match_id: serverRules.permit_match?.id || null
      })
      .select()
      .single();

    return data;
  }

  async getReports(filters) {
    let query = supabase
      .from('reports')
      .select(`
        *,
        users(name, role),
        permits(license_id, owner)
      `)
      .order('created_at', { ascending: false });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.from_date) query = query.gte('created_at', filters.from_date);
    if (filters.to_date) query = query.lte('created_at', filters.to_date);

    const { data } = await query;
    return data || [];
  }

  async updateReportStatus(reportId, status, notes) {
    const { data } = await supabase
      .from('reports')
      .update({ status, notes })
      .eq('id', reportId)
      .select()
      .single();

    return data;
  }

  async getReportById(id) {
    const { data } = await supabase
      .from('reports')
      .select(`
        *,
        users(name, email, role),
        permits(license_id, owner, valid_to)
      `)
      .eq('id', id)
      .single();

    return data;
  }
}

module.exports = new ReportService();