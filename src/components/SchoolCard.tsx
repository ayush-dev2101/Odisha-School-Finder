import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RatingStars from './RatingStars';
import davSchool from '@/assets/schools/dav-school.jpg';
import kiitSchool from '@/assets/schools/kiit-school.jpg';
import kendriyadSchool from '@/assets/schools/kendriya-vidyalaya.jpg';
import sainikSchool from '@/assets/schools/sainik-school.jpg';
import saiSchool from '@/assets/schools/sai-international.jpg';

interface School {
  id: string;
  name: string;
  city: string;
  address?: string;
  description?: string;
  image?: string;
  image_url?: string;
  ratings?: {
    overall: number;
    facility: number;
    faculty: number;
    activities: number;
  };
  established?: number;
  board: string;
  type: string;
}

interface SchoolCardProps {
  school: School;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  // Handle both local image paths and URLs
  const getSchoolImage = (school: School) => {
    // If it's a URL (from Supabase), use it directly
    if (school.image_url && school.image_url.startsWith('http')) {
      return school.image_url;
    }
    
    // If it's a local path (from JSON), map to imports
    const imagePath = school.image || school.image_url || '';
    if (imagePath.includes('dav-school')) return davSchool;
    if (imagePath.includes('kiit-school')) return kiitSchool;
    if (imagePath.includes('kendriya-vidyalaya')) return kendriyadSchool;
    if (imagePath.includes('sainik-school')) return sainikSchool;
    if (imagePath.includes('sai-international')) return saiSchool;
    return davSchool; // fallback
  };

  return (
    <Card className="edu-card group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={getSchoolImage(school)}
            alt={school.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-primary">
              {school.board}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-xl font-bold text-white mb-1">{school.name}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {school.city}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Overall Rating */}
          <div className="flex items-center justify-between">
            <RatingStars rating={school.ratings?.overall || 0} size="md" />
            {school.established && (
              <Badge variant="outline" className="text-xs">
                Est. {school.established}
              </Badge>
            )}
          </div>

          {/* Description */}
          {school.description && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {school.description}
            </p>
          )}

          {/* Quick Stats */}
          {school.ratings && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-accent/30 rounded-lg p-2">
                <div className="text-xs text-muted-foreground">Facility</div>
                <div className="font-semibold text-sm">{school.ratings.facility || 0}</div>
              </div>
              <div className="bg-accent/30 rounded-lg p-2">
                <div className="text-xs text-muted-foreground">Faculty</div>
                <div className="font-semibold text-sm">{school.ratings.faculty || 0}</div>
              </div>
              <div className="bg-accent/30 rounded-lg p-2">
                <div className="text-xs text-muted-foreground">Activities</div>
                <div className="font-semibold text-sm">{school.ratings.activities || 0}</div>
              </div>
            </div>
          )}

          {/* School Type */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {school.type}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link to={`/schools/${school.id}`} className="w-full">
          <Button className="edu-button-primary w-full group">
            View Details
            <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchoolCard;