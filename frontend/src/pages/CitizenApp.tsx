import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

type Location = {
  longitude: number;
  latitude: number;
};

// Mock AI and OCR results for demonstration
const mockOnDeviceAnalysis = () => {
  return {
    structural_tilt: Math.random() > 0.8,
    no_license_marker: Math.random() > 0.5,
    ocr_result: { license_id: 'MH01AB1234' },
    geofence_violation: Math.random() > 0.3,
  };
};

const CitizenApp = ({ onBack }: { onBack: () => void }) => {
  const { token } = useAuth();
  const [hasLocation, setHasLocation] = useState<Location | null>(null);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCapture = () => {
    // In a real app, this would use the device camera. We'll simulate it for now.
    const mockImage = new File(['mock image data'], 'billboard.jpg', { type: 'image/jpeg' });
    setCapturedImage(mockImage);

    // Simulate on-device AI/OCR analysis
    const result = mockOnDeviceAnalysis();
    setAnalysisResult(result);
    toast.success('On-device analysis complete!', { description: 'Review potential violations below.' });
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        toast.success('GPS location captured.');
      },
      (error) => {
        toast.error('Could not get location.', { description: error.message });
      }
    );
  };

  const handleSubmit = async () => {
    if (!capturedImage || !hasLocation) {
      toast.error('Image and location are required.');
      return;
    }

    if (!token) {
        toast.error('You must be logged in to submit a report.');
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', capturedImage);
    formData.append('gps_point', JSON.stringify(hasLocation));
    formData.append('rules_triggered', JSON.stringify(analysisResult));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/reports`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toast.success('Report submitted successfully!', { description: 'Awaiting officer review.' });
        setCapturedImage(null);
        setAnalysisResult(null);
        setHasLocation(null);
      }
    } catch (error) {
      toast.error('Report submission failed.');
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <header className="bg-gradient-civic text-white p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/80 hover:text-white">← Back</button>
          <h1 className="text-xl font-semibold">Citizen Reporter</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Location Status Card */}
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
              <Button size="sm" variant="outline" onClick={handleGetLocation}>
                Enable GPS
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Camera Interface Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Capture Billboard</CardTitle>
          <CardDescription>Point camera at billboard for automatic analysis</CardDescription>
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
            <>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">📸 Image captured</p>
              </div>
              {analysisResult && (
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${analysisResult.geofence_violation ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'}`}>
                    {analysisResult.geofence_violation ? <AlertTriangle className="h-4 w-4 text-warning" /> : <CheckCircle className="h-4 w-4 text-success" />}
                    <span className="text-sm font-medium">
                      {analysisResult.geofence_violation ? 'Potential Violation: Within 50m of junction' : 'No geofence violations detected.'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${analysisResult.no_license_marker ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'}`}>
                    {analysisResult.no_license_marker ? <AlertTriangle className="h-4 w-4 text-warning" /> : <CheckCircle className="h-4 w-4 text-success" />}
                    <span className="text-sm">
                      {analysisResult.no_license_marker ? 'Potential Violation: Missing license marker' : 'License text detected.'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3">
            <Button variant="civic" className="flex-1" onClick={handleCapture} disabled={!hasLocation}>
              <Camera className="mr-2 h-4 w-4" />
              {capturedImage ? 'Retake' : 'Capture'}
            </Button>
            {capturedImage && (
              <Button variant="success" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
  );
};

export default CitizenApp;