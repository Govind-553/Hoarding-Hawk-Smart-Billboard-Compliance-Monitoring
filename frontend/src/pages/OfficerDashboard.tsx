import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface Report {
  id: string;
  location: string;
  violation: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  status: string;
}

const OfficerDashboard = ({ onBack }: { onBack: () => void }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'inbox' | 'map' | 'analytics'>('inbox');
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      toast.error('You must be logged in to view the dashboard.');
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const fetchedReports = response.data.map((report: any) => ({
          id: report.id,
          location: report.gps_point ? `Lat: ${report.gps_point.coordinates[1]}, Lng: ${report.gps_point.coordinates[0]}` : 'N/A',
          violation: report.server_rules?.violations?.join(', ') || 'No server-side violations detected.',
          priority: 'high', // Logic to determine priority can be added here
          created_at: report.created_at,
          status: report.status,
        }));
        setReports(fetchedReports);
      } catch (error) {
        toast.error('Failed to fetch reports.');
        console.error('Error fetching reports:', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to fetch analytics.');
        console.error('Error fetching analytics:', error);
      }
    };

    fetchReports();
    fetchAnalytics();
  }, [token]);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    if (!token) {
        toast.error('You must be logged in to update a report.');
        return;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_API}/reports/${reportId}`, { status }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success(`Report ${reportId} status updated to ${status}.`);
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (error) {
      toast.error('Failed to update report status.');
      console.error('Error updating report status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-civic text-white p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/80 hover:text-white">← Back</button>
          <h1 className="text-xl font-semibold">Officer Dashboard</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {[{ id: 'inbox', label: 'Inbox', count: reports.filter(r => r.status === 'pending').length }, { id: 'map', label: 'Map View', count: null }, { id: 'analytics', label: 'Analytics', count: null }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Violation Reports</h2>
              <Button size="sm" variant="outline">Filter</Button>
            </div>
            {reports.length > 0 ? (
              reports.map((report) => (
                <Card key={report.id} className="shadow-civic">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{report.location}</h3>
                        <p className="text-sm text-muted-foreground">{report.violation}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${report.priority === 'high' ? 'bg-destructive/10 text-destructive' : report.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                            {report.priority} priority
                          </span>
                          <span className="text-xs text-muted-foreground">{report.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleUpdateStatus(report.id, 'notice_sent')}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(report.id, 'dismissed')}>Dismiss</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No reports found.</p>
            )}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{analytics.total_reports}</div><div className="text-sm text-muted-foreground">Total Reports</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-warning">{analytics.pending}</div><div className="text-sm text-muted-foreground">Pending Review</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-success">{analytics.notice_sent}</div><div className="text-sm text-muted-foreground">Notices Sent</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-destructive">{analytics.dismissed}</div><div className="text-sm text-muted-foreground">Dismissed</div></CardContent></Card>
            </div>
            {/* The rest of the analytics content would go here, e.g., charts from backend/services/analyticsService.js */}
          </div>
        )}
        
        {activeTab === 'map' && (
          <p className="text-center text-muted-foreground">Map view is not yet implemented.</p>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;