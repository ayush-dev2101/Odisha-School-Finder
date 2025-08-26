import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, School, Star, Eye } from "lucide-react";

interface AnalyticsData {
  totalSchools: number;
  totalUsers: number;
  totalRatings: number;
  averageRating: number;
  schoolsByType: { type: string; count: number }[];
  schoolsByBoard: { board: string; count: number }[];
  recentActivity: any[];
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSchools: 0,
    totalUsers: 0,
    totalRatings: 0,
    averageRating: 0,
    schoolsByType: [],
    schoolsByBoard: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch basic counts
      const [schoolsResult, profilesResult, ratingsResult] = await Promise.all([
        supabase.from("schools").select("type, board", { count: 'exact' }),
        supabase.from("profiles").select("*", { count: 'exact' }),
        supabase.from("school_ratings").select("overall")
      ]);

      // Calculate analytics
      const totalSchools = schoolsResult.count || 0;
      const totalUsers = profilesResult.count || 0;
      const totalRatings = ratingsResult.data?.length || 0;
      
      const averageRating = ratingsResult.data?.length 
        ? ratingsResult.data.reduce((sum, rating) => sum + rating.overall, 0) / ratingsResult.data.length
        : 0;

      // Group schools by type
      const schoolsByType = schoolsResult.data?.reduce((acc, school) => {
        const existing = acc.find(item => item.type === school.type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: school.type, count: 1 });
        }
        return acc;
      }, [] as { type: string; count: number }[]) || [];

      // Group schools by board
      const schoolsByBoard = schoolsResult.data?.reduce((acc, school) => {
        const existing = acc.find(item => item.board === school.board);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ board: school.board, count: 1 });
        }
        return acc;
      }, [] as { board: string; count: number }[]) || [];

      setAnalytics({
        totalSchools,
        totalUsers,
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        schoolsByType,
        schoolsByBoard,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Monitor platform performance and user engagement</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <School className="mr-2 h-4 w-4" />
              Total Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalSchools}</div>
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Total Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalRatings}</div>
            <p className="text-sm text-purple-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              User reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.averageRating}</div>
            <p className="text-sm text-orange-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Type */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900">Schools by Type</CardTitle>
            <CardDescription className="text-gray-600">Distribution of school types</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analytics.schoolsByType.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(item.count / analytics.totalSchools) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schools by Board */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900">Schools by Board</CardTitle>
            <CardDescription className="text-gray-600">Distribution of education boards</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analytics.schoolsByBoard.map((item, index) => (
                <div key={item.board} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-yellow-500' : 
                      index === 2 ? 'bg-indigo-500' : 'bg-pink-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.board}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-red-500' : 
                          index === 1 ? 'bg-yellow-500' : 
                          index === 2 ? 'bg-indigo-500' : 'bg-pink-500'
                        }`}
                        style={{ width: `${(item.count / analytics.totalSchools) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-gray-900 flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Quick Insights
          </CardTitle>
          <CardDescription className="text-gray-600">
            Key performance indicators and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((analytics.totalRatings / analytics.totalSchools) * 10) / 10}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average reviews per school</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.schoolsByType.find(t => t.type === 'Private')?.count || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Private schools</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.schoolsByBoard.find(b => b.board === 'CBSE')?.count || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">CBSE schools</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;