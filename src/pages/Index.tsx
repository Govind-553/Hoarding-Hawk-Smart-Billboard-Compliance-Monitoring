import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Shield, Map, Users, Eye, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'officer' | null>(null);

  if (selectedRole === 'citizen') {
    return <CitizenApp onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'officer') {
    return <OfficerDashboard onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Urban billboard monitoring"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hoarding Hawk
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Privacy-first billboard compliance monitoring using on-device AI and smart mapping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setSelectedRole('citizen')}
                className="min-w-48"
              >
                <Camera className="mr-2 h-5 w-5" />
                Report as Citizen
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setSelectedRole('officer')}
                className="min-w-48"
              >
                <Shield className="mr-2 h-5 w-5" />
                Officer Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Smart Compliance Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced on-device processing ensures privacy while maintaining effectiveness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-elevated hover:shadow-civic transition-shadow duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-civic rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle>On-Device AI</CardTitle>
                <CardDescription>
                  Privacy-first processing with TensorFlow.js and Tesseract OCR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Rectangle detection for billboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    License plate & QR code reading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No data leaves your device
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elevated hover:shadow-civic transition-shadow duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-civic rounded-lg flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Geospatial Analysis</CardTitle>
                <CardDescription>
                  Smart location-based rule enforcement with MapLibre & Turf.js
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    Distance to junctions & schools
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    Sensitive zone detection
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    GPS auto-tagging
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elevated hover:shadow-civic transition-shadow duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-civic rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Citizen Engagement</CardTitle>
                <CardDescription>
                  Offline-capable PWA for field reporting and community involvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Works offline with sync
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Instant violation feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Community leaderboards
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="bg-accent py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-accent-foreground">Privacy First</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Photos are analyzed locally on your device. Only essential metadata and compliance status are transmitted, never your actual images.
          </p>
        </div>
      </section>
    </div>
  );
};

// Citizen App Component
const CitizenApp = ({ onBack }: { onBack: () => void }) => {
  const [hasLocation, setHasLocation] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-civic text-white p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/80 hover:text-white">
            ← Back
          </button>
          <h1 className="text-xl font-semibold">Citizen Reporter</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Location Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className={`h-5 w-5 ${hasLocation ? 'text-success' : 'text-muted-foreground'}`} />
                <span className="font-medium">
                  {hasLocation ? 'Location detected' : 'Getting location...'}
                </span>
              </div>
              {!hasLocation && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setHasLocation(true)}
                >
                  Enable GPS
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capture Billboard
            </CardTitle>
            <CardDescription>
              Point camera at billboard for automatic analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!capturedImage ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">📸 Image captured</p>
                </div>
                
                {/* Instant Analysis Results */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Potential Violation: Within 50m of junction</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">License text detected</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                variant="civic" 
                className="flex-1"
                onClick={() => setCapturedImage('captured')}
                disabled={!hasLocation}
              >
                <Camera className="mr-2 h-4 w-4" />
                {capturedImage ? 'Retake' : 'Capture'}
              </Button>
              {capturedImage && (
                <Button variant="success" className="flex-1">
                  Submit Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offline Queue */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Offline reports pending</span>
              <span className="text-sm font-medium">0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Officer Dashboard Component
const OfficerDashboard = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'map' | 'analytics'>('inbox');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-civic text-white p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/80 hover:text-white">
            ← Back
          </button>
          <h1 className="text-xl font-semibold">Officer Dashboard</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {[
          { id: 'inbox', label: 'Inbox', count: 12 },
          { id: 'map', label: 'Map View', count: null },
          { id: 'analytics', label: 'Analytics', count: null }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 p-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
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
            
            {/* Sample Reports */}
            {[
              { id: 1, location: 'MG Road Junction', violation: 'Too close to junction', priority: 'high' },
              { id: 2, location: 'Brigade Road', violation: 'Missing license', priority: 'medium' },
              { id: 3, location: 'Commercial Street', violation: 'Size violation', priority: 'low' }
            ].map((report) => (
              <Card key={report.id} className="shadow-civic">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-medium">{report.location}</h3>
                      <p className="text-sm text-muted-foreground">{report.violation}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          report.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          report.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {report.priority} priority
                        </span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="success">Approve</Button>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Violation Heatmap</h2>
            <Card>
              <CardContent className="p-8">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive map will be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Reports', value: '1,234', change: '+12%' },
                { label: 'Violations Found', value: '456', change: '+8%' },
                { label: 'Active Citizens', value: '89', change: '+23%' },
                { label: 'Resolved Cases', value: '234', change: '+15%' }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-success mt-1">{stat.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Chart will be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;