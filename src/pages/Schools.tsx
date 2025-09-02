import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ITEMS_PER_PAGE = 6;

const Schools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch schools and cities from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schoolsResult, citiesResult] = await Promise.all([
        supabase.from('schools').select('*').order('name'),
        supabase.from('cities').select('name').order('name')
      ]);

      if (schoolsResult.error) {
        console.error('Error fetching schools:', schoolsResult.error);
      } else if (schoolsResult.data) {
        setSchools(schoolsResult.data);
      }
      
      if (citiesResult.error) {
        console.warn('Cities table error:', citiesResult.error);
        // Use default cities for Odisha
        setCities(['Bhubaneswar', 'Cuttack', 'Puri', 'Berhampur', 'Sambalpur', 'Rourkela']);
      } else if (citiesResult.data) {
        setCities(citiesResult.data.map(city => city.name));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default cities even on error
      setCities(['Bhubaneswar', 'Cuttack', 'Puri', 'Berhampur', 'Sambalpur', 'Rourkela']);
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

  // Filter and sort schools
  const filteredSchools = schools
    .filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           school.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = !selectedCity || selectedCity === 'all' || school.city === selectedCity;
      const matchesBoard = !selectedBoard || selectedBoard === 'all' || school.board === selectedBoard;
      
      return matchesSearch && matchesCity && matchesBoard;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          const aRating = a.ratings?.overall || 0;
          const bRating = b.ratings?.overall || 0;
          return bRating - aRating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        case 'established':
          return (b.established || 0) - (a.established || 0);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const boards = Array.from(new Set(schools.map(school => school.board).filter(Boolean)));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedBoard, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              All Schools in Odisha
            </h1>
            <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover {schools.length} quality schools across Odisha with detailed information and ratings
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search schools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Board Filter */}
              <div>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Boards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Boards</SelectItem>
                    {boards.map(board => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="established">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredSchools.length)} of {filteredSchools.length} schools
              </div>
              {(searchQuery || (selectedCity && selectedCity !== 'all') || (selectedBoard && selectedBoard !== 'all')) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('all');
                    setSelectedBoard('all');
                    setSortBy('rating');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading schools...</p>
            </div>
          ) : paginatedSchools.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedSchools.map((school, index) => (
                  <div
                    key={school.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <SchoolCard school={school} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "edu-button-primary" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="edu-card text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No schools found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('all');
                    setSelectedBoard('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
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

export default Schools;