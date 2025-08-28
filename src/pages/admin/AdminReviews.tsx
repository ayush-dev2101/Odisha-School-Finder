import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, User, Calendar, Search, Filter, Trash2, Edit, Eye } from "lucide-react";

interface SchoolRating {
  id: string;
  school_id: string;
  user_id: string | null;
  overall: number;
  facility: number;
  faculty: number;
  activities: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  school?: {
    name: string;
    city: string;
    district: string;
  };
  user?: {
    email: string;
    display_name: string;
  };
}

interface School {
  id: string;
  name: string;
  city: string;
  district: string;
}

const AdminReviews = () => {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<SchoolRating[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingRating, setEditingRating] = useState<SchoolRating | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [ratingsResult, schoolsResult] = await Promise.all([
        supabase
          .from("school_ratings")
          .select(`
            *,
            school:schools(name, city, district),
            user:profiles(email, display_name)
          `)
          .order("created_at", { ascending: false }),
        supabase.from("schools").select("id, name, city, district").order("name")
      ]);

      if (ratingsResult.data) {
        setRatings(ratingsResult.data as SchoolRating[]);
      }
      if (schoolsResult.data) {
        setSchools(schoolsResult.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from("school_ratings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRating = async (rating: SchoolRating) => {
    try {
      const { error } = await supabase
        .from("school_ratings")
        .update({
          overall: rating.overall,
          facility: rating.facility,
          faculty: rating.faculty,
          activities: rating.activities,
          comment: rating.comment,
          updated_at: new Date().toISOString()
        })
        .eq("id", rating.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review updated successfully",
      });
      setEditingRating(null);
      fetchData();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.school?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = !selectedSchool || rating.school_id === selectedSchool;
    const matchesRating = !selectedRating || rating.overall.toString() === selectedRating;
    
    return matchesSearch && matchesSchool && matchesRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{ratings.length}</div>
            <p className="text-sm text-blue-600 mt-1">User reviews</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {ratings.length > 0 
                ? (ratings.reduce((sum, r) => sum + r.overall, 0) / ratings.length).toFixed(1)
                : "0.0"
              }
            </div>
            <p className="text-sm text-green-600 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Active Reviewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Set(ratings.filter(r => r.user_id).map(r => r.user_id)).size}
            </div>
            <p className="text-sm text-purple-600 mt-1">Unique users</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {ratings.filter(r => {
                const createdDate = new Date(r.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createdDate > weekAgo;
              }).length}
            </div>
            <p className="text-sm text-orange-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Reviews Management ({filteredRatings.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage school reviews and ratings
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredRatings.map((rating) => (
              <div
                key={rating.id}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                {editingRating?.id === rating.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {rating.school?.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleUpdateRating(editingRating)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingRating(null)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Overall Rating</label>
                        <Select
                          value={editingRating.overall.toString()}
                          onValueChange={(value) => setEditingRating({
                            ...editingRating,
                            overall: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Star{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Facility Rating</label>
                        <Select
                          value={editingRating.facility.toString()}
                          onValueChange={(value) => setEditingRating({
                            ...editingRating,
                            facility: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Star{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Faculty Rating</label>
                        <Select
                          value={editingRating.faculty.toString()}
                          onValueChange={(value) => setEditingRating({
                            ...editingRating,
                            faculty: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Star{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Activities Rating</label>
                        <Select
                          value={editingRating.activities.toString()}
                          onValueChange={(value) => setEditingRating({
                            ...editingRating,
                            activities: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Star{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Comment</label>
                      <Textarea
                        value={editingRating.comment || ""}
                        onChange={(e) => setEditingRating({
                          ...editingRating,
                          comment: e.target.value
                        })}
                        placeholder="Review comment..."
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {rating.school?.name}
                          </h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {rating.school?.city}, {rating.school?.district}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(rating.overall)}
                            <span className={`ml-2 font-semibold ${getRatingColor(rating.overall)}`}>
                              {rating.overall}/5
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(rating.created_at)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-600">Facility:</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.facility)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Faculty:</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.faculty)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Activities:</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.activities)}
                            </div>
                          </div>
                        </div>
                        
                        {rating.comment && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-700 text-sm">{rating.comment}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {rating.user?.display_name || rating.user?.email || 'Anonymous'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingRating(rating)}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteRating(rating.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filteredRatings.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                {searchTerm || selectedSchool || selectedRating 
                  ? "No reviews found matching your filters." 
                  : "No reviews found. Reviews will appear here when users rate schools."
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviews;
