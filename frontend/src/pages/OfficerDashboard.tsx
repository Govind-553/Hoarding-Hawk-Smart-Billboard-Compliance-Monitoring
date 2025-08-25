import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Map, Users, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Feature, Geometry } from 'geojson';

interface Report {
  id: string;
  location: string;
  violation: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  status: 'pending' | 'notice_sent' | 'dismissed';
}

interface Analytics {
  total_reports: number;
  pending: number;
  notice_sent: number;
  dismissed: number;
  trends: { date: string; count: number }[];
}

// --- Static Data for an Interactive Look ---
const STATIC_REPORTS: Report[] = [
  { id: 'static-1', location: 'City Park Blvd', violation: 'Illegal placement near a school', priority: 'high', created_at: '2 hours ago', status: 'pending' },
  { id: 'static-2', location: 'Downtown Square', violation: 'No license marker detected', priority: 'medium', created_at: '3 hours ago', status: 'pending' },
  { id: 'static-3', location: 'Tech Hub Center', violation: 'Expired permit (2024-01-15)', priority: 'high', created_at: '5 hours ago', status: 'pending' },
  { id: 'static-4', location: 'Industrial Zone A', violation: 'No geofence violations detected', priority: 'low', created_at: '1 day ago', status: 'notice_sent' },
];

const STATIC_ANALYTICS = {
  total_reports: 1234,
  pending: 12,
  notice_sent: 456,
  dismissed: 234,
  trends: [
    { date: 'Aug 19', count: 50 },
    { date: 'Aug 20', count: 65 },
    { date: 'Aug 21', count: 45 },
    { date: 'Aug 22', count: 70 },
    { date: 'Aug 23', count: 55 },
    { date: 'Aug 24', count: 80 },
    { date: 'Aug 25', count: 62 },
  ],
};

const STATIC_HEATMAP_DATA = [
  { lat: 19.0760, lng: 72.8777, intensity: 5 },
  { lat: 19.0800, lng: 72.8800, intensity: 3 },
  { lat: 19.0700, lng: 72.8750, intensity: 8 },
  { lat: 19.0650, lng: 72.8850, intensity: 6 },
  { lat: 28.7041, lng: 77.1025, intensity: 9 },
  { lat: 28.7100, lng: 77.1100, intensity: 7 },
  { lat: 12.9716, lng: 77.5946, intensity: 4 },
  { lat: 13.0000, lng: 77.6000, intensity: 5 },
];
// ------------------------------------------

const OfficerDashboard = ({ onBack }: { onBack: () => void }) => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [activeTab, setActiveTab] = useState<'inbox' | 'map' | 'analytics'>('inbox');
  const [reports, setReports] = useState<Report[]>(STATIC_REPORTS);
  const [analytics, setAnalytics] = useState<Analytics>(STATIC_ANALYTICS);

  useEffect(() => {
    const fetchLiveReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/reports`);
        const liveReports = response.data.map((report: any) => ({
          id: report.id,
          location: report.gps_point ? `Lat: ${report.gps_point.coordinates[1]}, Lng: ${report.gps_point.coordinates[0]}` : 'N/A',
          violation: report.server_rules?.violations?.join(', ') || 'No server-side violations detected.',
          priority: 'high',
          created_at: report.created_at,
          status: report.status,
        }));
        // Combine static reports with live reports
        setReports([...liveReports, ...STATIC_REPORTS]);
      } catch (error) {
        toast.error('Failed to fetch live reports. Displaying static data.');
      }
    };

    const fetchLiveAnalytics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/analytics`);
        const liveAnalytics = response.data;
        setAnalytics(liveAnalytics);
      } catch (error) {
        toast.error('Failed to fetch live analytics. Displaying static data.');
      }
    };

    fetchLiveReports();
    fetchLiveAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'map' && mapContainer.current) {
      if (map.current) return;
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
        center: [72.8777, 19.0760],
        zoom: 10,
      });

      map.current.on('load', async () => {
        try {
          // Attempt to fetch live heatmap data
          const { data: liveHeatmapData } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/analytics/heatmap`);
          const combinedHeatmapData = [...liveHeatmapData, ...STATIC_HEATMAP_DATA];

          const features = combinedHeatmapData.map((d: any) => ({
            type: 'Feature',
            properties: { intensity: d.intensity },
            geometry: {
              type: 'Point',
              coordinates: [d.lng, d.lat]
            }
          })) as Feature<Geometry, { [name: string]: any; }>[];

          map.current?.addSource('reports', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features
            }
          });

          map.current?.addLayer({
            id: 'heatmap',
            type: 'heatmap',
            source: 'reports',
            maxzoom: 15,
            paint: {
              'heatmap-weight': ['get', 'intensity'],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                15, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                15, 20
              ],
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                15, 0
              ]
            }
          });
        } catch (error) {
          console.error('Failed to load live heatmap data. Using static data:', error);
          const features = STATIC_HEATMAP_DATA.map((d) => ({
            type: 'Feature',
            properties: { intensity: d.intensity },
            geometry: {
              type: 'Point',
              coordinates: [d.lng, d.lat]
            }
          })) as Feature<Geometry, { [name: string]: any; }>[];

          map.current?.addSource('reports', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features
            }
          });
        }
      });
    }
  }, [activeTab]);

  const handleUpdateStatus = async (reportId: string, status: 'pending' | 'notice_sent' | 'dismissed') => {
    try {
      // Simulate API call for static data, but update live data if ID is not static
      if (!reportId.startsWith('static-')) {
          await axios.patch(`${import.meta.env.VITE_BACKEND_API}/reports/${reportId}`, { status });
      }
      toast.success(`Report ${reportId} status updated to ${status}.`);
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (error) {
      toast.error('Failed to update report status.');
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
              reports.filter(r => r.status === 'pending').map((report) => (
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
                          <span className="text-xs text-muted-foreground">{report.created_at}</span>
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
              <p className="text-center text-muted-foreground">No pending reports found.</p>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Violation Heatmap</h2>
            <Card>
              <CardContent className="p-0">
                <div ref={mapContainer} className="aspect-video bg-muted rounded-lg" style={{ minHeight: '500px' }} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{analytics.total_reports}</div><div className="text-sm text-muted-foreground">Total Reports</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-warning">{analytics.pending}</div><div className="text-sm text-muted-foreground">Pending Review</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-success">{analytics.notice_sent}</div><div className="text-sm text-muted-foreground">Notices Sent</div></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-destructive">{analytics.dismissed}</div><div className="text-sm text-muted-foreground">Dismissed</div></CardContent></Card>
            </div>

            {/* Violation Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Trends (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Reports" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;