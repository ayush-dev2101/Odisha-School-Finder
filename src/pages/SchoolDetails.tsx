import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Globe, Phone, Mail, Heart, ThumbsUp, User, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RatingStars from '@/components/RatingStars';
import LoginPopup from '@/components/LoginPopup';
import ImageGallery from '@/components/ImageGallery';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { School } from '@/types/school';
import { fetchSchoolWithImages } from '@/utils/schoolUtils';

const SchoolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [school, setSchool] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState({
    overall: 0,
    facility: 0,
    faculty: 0,
    activities: 0
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSchoolData(id);
    }
  }, [id]);

  const fetchSchoolData = async (schoolId: string) => {
    setLoading(true);
    try {
      // Fetch complete school data with images using enhanced utility
      const schoolData = await fetchSchoolWithImages(schoolId);

      if (!schoolData) {
        setSchool(null);
        return;
      }

      // Set default ratings if not present
      const schoolWithRatings = {
        ...schoolData,
        ratings: schoolData.ratings || {
          overall: 4.2,
          facility: 4.0,
          faculty: 4.5,
          activities: 3.8
        }
      };

      setSchool(schoolWithRatings);

      // Fetch comments/reviews (you might want to create a reviews table)
      // For now, we'll use mock data
      setComments([
        {
          id: 1,
          author: "Parent",
          rating: 4,
          comment: "Great school with excellent facilities.",
          date: new Date().toISOString(),
          helpful: 5
        }
      ]);

    } catch (error) {
      console.error('Error fetching school data:', error);
      toast({
        title: "Error",
        description: "Failed to load school details",
        variant: "destructive",
      });
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

  // Default school image
  const getSchoolImage = (school: any) => {
    return school?.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading school details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">School not found</h1>
          <p className="text-muted-foreground mt-2">The school you're looking for doesn't exist or has been removed.</p>
          <Link to="/schools">
            <Button className="mt-4">Back to Schools</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with School Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={getSchoolImage(school)}
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
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {school.city}, {school.district || 'Odisha'}
                  </div>
                  {school.established && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Est. {school.established}
                    </div>
                  )}
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
                  {school.established && (
                    <div className="bg-accent/30 rounded-lg p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">Established</div>
                      <div className="text-sm text-muted-foreground">{school.established}</div>
                    </div>
                  )}
                </div>

                {school.facilities && school.facilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {school.facilities.map((facility: string, index: number) => (
                        <Badge key={index} variant="secondary">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {school.admission_process && (
                  <div>
                    <h3 className="font-semibold mb-2">Admission Process</h3>
                    <p className="text-muted-foreground leading-relaxed">{school.admission_process}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Contact Details */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary" />
                  Contact Details
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Principal Information */}
                {(school.principal_name || school.principal_email || school.principal_phone) && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Principal Information
                    </h3>
                    <div className="space-y-2">
                      {school.principal_name && (
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{school.principal_name}</span>
                        </div>
                      )}
                      {school.principal_email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${school.principal_email}`} className="text-sm text-primary hover:underline">
                            {school.principal_email}
                          </a>
                        </div>
                      )}
                      {school.principal_phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${school.principal_phone}`} className="text-sm text-primary hover:underline">
                            {school.principal_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* School Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {school.contact_email && (
                    <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">School Email</div>
                        <a href={`mailto:${school.contact_email}`} className="text-sm text-primary hover:underline">
                          {school.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                  {school.contact_phone && (
                    <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">School Phone</div>
                        <a href={`tel:${school.contact_phone}`} className="text-sm text-primary hover:underline">
                          {school.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Alternate Contact */}
                {(school.alternate_contact_name || school.alternate_contact_phone) && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Alternate Contact
                    </h3>
                    <div className="space-y-2">
                      {school.alternate_contact_name && (
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{school.alternate_contact_name}</span>
                        </div>
                      )}
                      {school.alternate_contact_phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${school.alternate_contact_phone}`} className="text-sm text-primary hover:underline">
                            {school.alternate_contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Address Section */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-primary" />
                  Address & Location
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Structured Address */}
                {(school.street_address || school.pincode || school.landmark) && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <div className="space-y-2">
                      {school.street_address && (
                        <div className="text-sm">
                          <span className="font-medium">Street: </span>
                          <span className="text-muted-foreground">{school.street_address}</span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">City: </span>
                        <span className="text-muted-foreground">{school.city}, {school.district}</span>
                      </div>
                      {school.state && (
                        <div className="text-sm">
                          <span className="font-medium">State: </span>
                          <span className="text-muted-foreground">{school.state}</span>
                        </div>
                      )}
                      {school.pincode && (
                        <div className="text-sm">
                          <span className="font-medium">Pincode: </span>
                          <span className="text-muted-foreground">{school.pincode}</span>
                        </div>
                      )}
                      {school.landmark && (
                        <div className="text-sm">
                          <span className="font-medium">Landmark: </span>
                          <span className="text-muted-foreground">{school.landmark}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Legacy Address */}
                {school.address && (
                  <div>
                    <h4 className="font-semibold mb-2">Complete Address</h4>
                    <p className="text-muted-foreground text-sm">{school.address}</p>
                  </div>
                )}
                
                {/* Map Section (if coordinates available) */}
                {school.latitude && school.longitude && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <MapIcon className="h-4 w-4 mr-2" />
                      Location on Map
                    </h4>
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MapIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">Map view available</p>
                        <p className="text-xs">Lat: {school.latitude}, Lng: {school.longitude}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {school.images && school.images.length > 0 && (
              <Card className="edu-card">
                <CardHeader>
                  <h2 className="text-2xl font-bold">School Gallery</h2>
                  <p className="text-muted-foreground">View infrastructure, events, and more</p>
                </CardHeader>
                <CardContent>
                  <ImageGallery images={school.images} schoolName={school.name} />
                </CardContent>
              </Card>
            )}

            {/* Interactive Ratings */}
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold">Rate This School</h2>
                <p className="text-muted-foreground">Share your experience to help other families</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(school.ratings).map(([category, avgRating]) => (
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
                    {school.ratings.overall}
                  </div>
                  <RatingStars rating={school.ratings.overall} size="sm" />
                  <div className="text-sm text-muted-foreground mt-1">Overall Rating</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Facilities</span>
                    <span className="font-semibold">{school.ratings.facility}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Faculty</span>
                    <span className="font-semibold">{school.ratings.faculty}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activities</span>
                    <span className="font-semibold">{school.ratings.activities}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="edu-card">
              <CardHeader>
                <h3 className="text-xl font-bold">Quick Contact</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Display enhanced address or fallback to legacy */}
                  {(school.street_address || school.address) && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        {school.street_address ? (
                          <div>
                            <div>{school.street_address}</div>
                            <div className="text-muted-foreground">
                              {school.city}, {school.district}
                              {school.pincode && ` - ${school.pincode}`}
                            </div>
                          </div>
                        ) : (
                          <span>{school.address}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {school.contact_phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${school.contact_phone}`} className="text-sm text-primary hover:underline">
                        {school.contact_phone}
                      </a>
                    </div>
                  )}
                  
                  {school.contact_email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${school.contact_email}`} className="text-sm text-primary hover:underline">
                        {school.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {school.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={school.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {school.principal_name && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="text-xs text-muted-foreground">Principal</div>
                        <div className="font-medium">{school.principal_name}</div>
                      </div>
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