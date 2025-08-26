import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, School, Star, TrendingUp, Activity } from "lucide-react";

interface DashboardStats {
  totalSchools: number;
  totalUsers: number;
  totalRatings: number;
  averageRating: number;
  recentActivities: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    totalUsers: 0,
    totalRatings: 0,
    averageRating: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [schoolsResult, profilesResult, ratingsResult] = await Promise.all([
        supabase.from("schools").select("*", { count: 'exact' }),
        supabase.from("profiles").select("*", { count: 'exact' }),
        supabase.from("school_ratings").select("overall")
      ]);

      const totalSchools = schoolsResult.count || 0;
      const totalUsers = profilesResult.count || 0;
      const totalRatings = ratingsResult.data?.length || 0;
      
      const averageRating = ratingsResult.data?.length 
        ? ratingsResult.data.reduce((sum, rating) => sum + rating.overall, 0) / ratingsResult.data.length
        : 0;

      setStats({
        totalSchools,
        totalUsers,
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        recentActivities: []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100 text-lg">Manage schools, users, and system settings from this central hub.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <School className="mr-2 h-4 w-4" />
              Total Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalSchools}</div>
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Total Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalRatings}</div>
            <p className="text-sm text-purple-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              User reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
            <p className="text-sm text-orange-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/admin/schools" 
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-center"
              >
                <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Manage Schools</div>
                <div className="text-sm text-gray-600">Add or edit schools</div>
              </a>
              <a 
                href="/admin/users" 
                className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-center"
              >
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-600">View user accounts</div>
              </a>
              <a 
                href="/admin/analytics" 
                className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-center"
              >
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-600">Platform insights</div>
              </a>
              <a 
                href="/admin/settings" 
                className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-center"
              >
                <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-600">System configuration</div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Total Active Listings</span>
                <span className="font-semibold text-gray-900">{stats.totalSchools}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">User Engagement</span>
                <span className="font-semibold text-gray-900">{stats.totalRatings} reviews</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Platform Rating</span>
                <span className="font-semibold text-gray-900">{stats.averageRating}/5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Total Registrations</span>
                <span className="font-semibold text-gray-900">{stats.totalUsers} users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;