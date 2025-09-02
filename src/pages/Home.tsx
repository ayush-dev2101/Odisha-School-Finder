import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import schoolsData from '@/data/schools.json';
import citiesData from '@/data/cities.json';

const Home = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-show login after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setShowLogin(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleSearch = () => {
    // Navigate to schools page with search parameters
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== 'all') {
      params.append('city', selectedCity);
    }
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    navigate(`/schools?${params.toString()}`);
  };

  const handleButtonClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      navigate('/schools');
    }
  };

  const filteredSchools = selectedCity && selectedCity !== 'all'
    ? schoolsData.filter(school => school.city.toLowerCase() === selectedCity.toLowerCase())
    : schoolsData;

  const stats = [
    { icon: Users, label: 'Schools Listed', value: '20+', color: 'text-primary' },
    { icon: MapPin, label: 'Cities Covered', value: '30+', color: 'text-success' },
    { icon: Star, label: 'Average Rating', value: '4.3', color: 'text-warning' },
    { icon: Award, label: 'Top Rated Schools', value: '8', color: 'text-destructive' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-glow/80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find the Perfect School in{' '}
              <span className="text-yellow-300">Odisha</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Helping families returning from abroad discover the best educational opportunities 
              with honest reviews and comprehensive ratings.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search schools by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-foreground border-0 text-lg h-12"
                  />
                </div>
                <div className="md:w-64">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-white text-foreground border-0 h-12">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {citiesData.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-yellow-500 hover:bg-yellow-400 text-primary font-semibold h-12 px-8"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Schools on Map
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive map showing all schools across Odisha. Click on markers to view school details and ratings.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <MapComponent schools={filteredSchools} selectedCity={selectedCity} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Odisha School Finder?
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive school information for informed decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="edu-card text-center group hover:scale-105">
              <CardContent className="p-8">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Smart Search</h3>
                <p className="text-muted-foreground">
                  Find schools by location, curriculum, ratings, and specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="edu-card text-center group hover:scale-105">
              <CardContent className="p-8">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Honest Reviews</h3>
                <p className="text-muted-foreground">
                  Real ratings from parents covering facilities, faculty, and activities.
                </p>
              </CardContent>
            </Card>

            <Card className="edu-card text-center group hover:scale-105">
              <CardContent className="p-8">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Location Based</h3>
                <p className="text-muted-foreground">
                  Interactive maps and location-based search for convenient school selection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect School?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Browse our comprehensive directory of top schools in Odisha
          </p>
          <Button 
            onClick={handleButtonClick}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg"
          >
            Browse All Schools
          </Button>
        </div>
      </section>

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

export default Home;