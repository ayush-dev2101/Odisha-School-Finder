import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import RatingStars from './RatingStars';
import { Link } from 'react-router-dom';

interface School {
  id: number;
  name: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  ratings: {
    overall: number;
    facility: number;
    faculty: number;
    activities: number;
  };
}

interface MapComponentProps {
  schools: School[];
  selectedCity?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCt9dISEfT7zM4zAeE8a4_ZE6F5oAmRppI';

const Map: React.FC<{ schools: School[]; selectedCity?: string }> = ({ schools, selectedCity }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // Filter schools by city if selectedCity is provided and not 'all'
  const filteredSchools = selectedCity && selectedCity !== 'all'
    ? schools.filter(school => school.city.toLowerCase() === selectedCity.toLowerCase())
    : schools;

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar center
      zoom: selectedCity ? 12 : 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);

    // Create info window
    const infoWindow = new (window as any).google.maps.InfoWindow();

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Add markers for filtered schools
    filteredSchools.forEach((school) => {
      const marker = new (window as any).google.maps.Marker({
        position: school.coordinates,
        map: mapInstance,
        title: school.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="2"/>
              <path d="M16 8L19 14H13L16 8Z" fill="white"/>
              <circle cx="16" cy="20" r="2" fill="white"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        setSelectedSchool(school);
        infoWindow.setContent(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 600;">${school.name}</h3>
            <p style="margin: 4px 0; color: #64748b; font-size: 14px;">${school.address}</p>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 4px;">
              <span style="color: #f59e0b;">★</span>
              <span style="color: #1e293b; font-weight: 500;">${school.ratings.overall}</span>
              <span style="color: #64748b; font-size: 12px;">(Overall Rating)</span>
            </div>
          </div>
        `);
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Adjust map bounds to show all filtered schools
    if (filteredSchools.length > 0) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      filteredSchools.forEach(school => {
        bounds.extend(school.coordinates);
      });
      
      if (filteredSchools.length === 1) {
        mapInstance.setCenter(filteredSchools[0].coordinates);
        mapInstance.setZoom(14);
      } else {
        mapInstance.fitBounds(bounds);
      }
    }

  }, [filteredSchools, selectedCity]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* School Details Popup */}
      {selectedSchool && (
        <div className="absolute top-4 right-4 z-10 max-w-sm animate-slide-up">
          <Card className="edu-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{selectedSchool.name}</h3>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedSchool.city}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSchool(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2 mb-4">
              <RatingStars rating={selectedSchool.ratings.overall} size="sm" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground">Facility</div>
                  <div className="font-semibold">{selectedSchool.ratings.facility}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Faculty</div>
                  <div className="font-semibold">{selectedSchool.ratings.faculty}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Activities</div>
                  <div className="font-semibold">{selectedSchool.ratings.activities}</div>
                </div>
              </div>
            </div>
            
            <Link to={`/schools/${selectedSchool.id}`}>
              <Button className="edu-button-primary w-full text-sm">
                View Details
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ schools, selectedCity }) => {
  return (
    <Wrapper apiKey={GOOGLE_MAPS_API_KEY}>
      <Map schools={schools} selectedCity={selectedCity} />
    </Wrapper>
  );
};

export default MapComponent;