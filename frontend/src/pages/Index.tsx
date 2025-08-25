import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Shield, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import CitizenApp from './CitizenApp';
import OfficerDashboard from '../pages/OfficerDashboard';

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

export default Index;