import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Globe, Phone, Mail, Heart, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RatingStars from '@/components/RatingStars';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import davSchool from '@/assets/schools/dav-school.jpg';
import kiitSchool from '@/assets/schools/kiit-school.jpg';
import kendriyadSchool from '@/assets/schools/kendriya-vidyalaya.jpg';
import sainikSchool from '@/assets/schools/sainik-school.jpg';
import saiSchool from '@/assets/schools/sai-international.jpg';

interface School {
  id: string;
  name: string;
  city: string;
  district: string;
  type: string;
  board: string;
  established?: number;
  principal?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  description?: string;
  image_url?: string;
  facilities?: string[];
  achievements?: string[];
  ratings?: {
    overall: number;
    facility: number;
    faculty: number;
    activities: number;
  };
}

const SchoolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState({
    overall: 0,
    facility: 0,
    faculty: 0,
    activities: 0
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSchoolData();
    }
  }, [id]);

  const fetchSchoolData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('School not found');
        setSchool(null);
      } else {
        // Cast the data to the School interface and ensure ratings is properly typed
        const schoolData: School = {
          ...data,
          ratings: data.ratings as { overall: number; facility: number; faculty: number; activities: number } || {
            overall: 0,
            facility: 0,
            faculty: 0,
            activities: 0
          }
        };
        setSchool(schoolData);
        // For now, we'll use empty comments array since we don't have a comments table yet
        setComments([]);
      }
    } catch (err) {
      setError('Failed to load school data');
      setSchool(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-show login after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setShowLogin(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleButtonClick = () => {
    if (!user) {
      setShowLogin(true);
    }
  };

  const handleRatingChange = (category: string, rating: number) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setUserRatings(prev => ({ ...prev, [category]: rating }));
  };

  // Map image paths to actual imports
  const getSchoolImage = (imagePath?: string) => {
    if (!imagePath) return davSchool; // fallback
    
    if (imagePath.includes('dav-school')) return davSchool;
    if (imagePath.includes('kiit-school')) return kiitSchool;
    if (imagePath.includes('kendriya-vidyalaya')) return kendriyadSchool;
    if (imagePath.includes('sainik-school')) return sainikSchool;
    if (imagePath.includes('sai-international')) return saiSchool;
    return davSchool; // fallback
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3" />
            <h1 className="text-2xl font-bold text-muted-foreground">Loading school details...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">School not found</h1>
          <p className="text-muted-foreground mt-2 mb-4">
            {error || "The school you're looking for doesn't exist."}
          </p>
          <Link to="/schools">
            <Button className="mt-4">Back to Schools</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with School Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={getSchoolImage(school.image_url)}
          alt={school.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <Link to="/schools">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Schools
                </Button>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                {school.name}
              </h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {school.city}, Odisha
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Est. {school.established}
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {school.board}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Information */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold">About {school.name}</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {school.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-accent/30 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">School Type</div>
                    <div className="text-sm text-muted-foreground">{school.type}</div>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">Board</div>
                    <div className="text-sm text-muted-foreground">{school.board}</div>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">Established</div>
                    <div className="text-sm text-muted-foreground">{school.established}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">{school.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Ratings */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold">Rate This School</h2>
                <p className="text-muted-foreground">Share your experience to help other families</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {school.ratings && Object.entries(school.ratings).map(([category, avgRating]) => (
                    <div key={category} className="bg-accent/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 capitalize">{category}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Average</span>
                          <span className="font-medium">{Number(avgRating)}/5</span>
                        </div>
                        <RatingStars rating={Number(avgRating)} size="sm" />
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Your Rating</span>
                          <span className="font-medium">
                            {userRatings[category as keyof typeof userRatings] || 'Not rated'}
                          </span>
                        </div>
                        <RatingStars
                          rating={userRatings[category as keyof typeof userRatings]}
                          interactive
                          onRatingChange={(rating) => handleRatingChange(category, rating)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {!user && (
                  <div className="bg-muted/50 border border-dashed border-border rounded-lg p-4 text-center">
                    <p className="text-muted-foreground mb-3">Please login to submit your ratings</p>
                    <Button onClick={handleButtonClick} className="edu-button-primary">
                      Login to Rate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold">Parent Reviews</h2>
                <p className="text-muted-foreground">{comments.length} reviews from the community</p>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{comment.author}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <RatingStars rating={comment.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{comment.comment}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary">
                            <ThumbsUp className="h-3 w-3" />
                            <span>Helpful ({comment.helpful})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="edu-card">
              <CardHeader>
                <h3 className="text-xl font-bold">Quick Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {school.ratings?.overall || 0}
                  </div>
                  <RatingStars rating={school.ratings?.overall || 0} size="sm" />
                  <div className="text-sm text-muted-foreground mt-1">Overall Rating</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Facilities</span>
                    <span className="font-semibold">{school.ratings?.facility || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Faculty</span>
                    <span className="font-semibold">{school.ratings?.faculty || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activities</span>
                    <span className="font-semibold">{school.ratings?.activities || 0}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="edu-card">
              <CardHeader>
                <h3 className="text-xl font-bold">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {school.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{school.address}</span>
                    </div>
                  )}
                  {school.contact_phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{school.contact_phone}</span>
                    </div>
                  )}
                  {school.contact_email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{school.contact_email}</span>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                
                <Button className="edu-button-primary w-full" onClick={handleButtonClick}>
                  Contact School
                </Button>
              </CardContent>
            </Card>

            {/* Save School */}
            <Card className="edu-card">
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleButtonClick}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Favorites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
      />

      {/* Content Overlay for Non-logged Users */}
      {!user && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 pointer-events-none"
          style={{ display: showLogin ? 'block' : 'none' }}
        />
      )}

      <Footer />
    </div>
  );
};

export default SchoolDetails;