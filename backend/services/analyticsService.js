const supabase = require('../config/supabase');

class AnalyticsService {
  async getDashboardStats() {
    // Get total reports by status
    const { data: statusCounts } = await supabase
      .from('reports')
      .select('status')
      .not('status', 'is', null);

    const stats = statusCounts.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    // Get violation types count
    const { data: reports } = await supabase
      .from('reports')
      .select('server_rules');

    const violationCounts = {};
    reports.forEach(report => {
      if (report.server_rules?.violations) {
        report.server_rules.violations.forEach(violation => {
          violationCounts[violation] = (violationCounts[violation] || 0) + 1;
        });
      }
    });

    return {
      total_reports: statusCounts.length,
      pending: stats.pending || 0,
      notice_sent: stats.notice_sent || 0,
      dismissed: stats.dismissed || 0,
      violations_by_type: violationCounts,
      top_citizens: await this.getTopCitizens(5)
    };
  }

  async getHeatmapData(bounds) {
    let query = supabase
      .from('reports')
      .select('gps_point, server_rules');

    if (bounds) {
      // Add spatial filtering if bounds provided
      const boundsArray = bounds.split(',').map(Number);
      query = query.rpc('reports_in_bounds', {
        min_lng: boundsArray[0],
        min_lat: boundsArray[1], 
        max_lng: boundsArray[2],
        max_lat: boundsArray[3]
      });
    }

    const { data } = await query;
    
    return data?.map(report => ({
      lat: report.gps_point?.coordinates[1],
      lng: report.gps_point?.coordinates[0],
      intensity: report.server_rules?.violations?.length || 1
    })) || [];
  }

  async getTopCitizens(limit = 10) {
    const { data } = await supabase
      .from('reports')
      .select('user_id, users(name)')
      .not('user_id', 'is', null);

    const userCounts = data.reduce((acc, report) => {
      const userId = report.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          name: report.users?.name || 'Anonymous',
          reports: 0
        };
      }
      acc[userId].reports++;
      return acc;
    }, {});

    return Object.values(userCounts)
      .sort((a, b) => b.reports - a.reports)
      .slice(0, limit);
  }

  async getViolationTrends(period = '7d') {
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('reports')
      .select('created_at, server_rules')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    // Group by date
    const trends = {};
    data?.forEach(report => {
      const date = report.created_at.split('T')[0];
      if (!trends[date]) trends[date] = 0;
      trends[date]++;
    });

    return Object.entries(trends).map(([date, count]) => ({
      date,
      count
    }));
  }
}

module.exports = new AnalyticsService();