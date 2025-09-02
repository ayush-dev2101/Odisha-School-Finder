import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Mail, Calendar, Search, RefreshCw } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_login_at?: string;
  display_name?: string;
  phone?: string;
  role: 'admin' | 'moderator' | 'user'; // Make role required and properly typed
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Try to fetch all users from auth.users using admin API
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.warn('Admin API not available, falling back to profiles table:', authError);
        
        // Fallback: Get users from profiles table and combine with user_roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast({
            title: "Error",
            description: "Failed to fetch users. Please check your permissions.",
            variant: "destructive",
          });
          return;
        }

        // Fetch user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        
        if (rolesError) {
          console.warn('Error fetching user roles:', rolesError);
        }

        // Create role map
        const roleMap = new Map();
        userRoles?.forEach(roleRecord => {
          roleMap.set(roleRecord.user_id, roleRecord.role);
        });

        // Format users from profiles
        const formattedUsers = profiles?.map(profile => ({
          id: profile.user_id,
          email: profile.email || '',
          created_at: profile.created_at,
          last_login_at: profile.last_login_at,
          display_name: profile.display_name,
          phone: profile.phone,
          role: roleMap.get(profile.user_id) || 'user'
        })) || [];

        console.log(`Fetched ${formattedUsers.length} users from profiles table`);
        setUsers(formattedUsers);
        return;
      }

      // Fetch user roles from user_roles table
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        console.warn('Error fetching user roles:', rolesError);
      }

      // Create a map of user_id to role for quick lookup
      const roleMap = new Map();
      userRoles?.forEach(roleRecord => {
        roleMap.set(roleRecord.user_id, roleRecord.role);
      });

      // Fetch additional profile information if available
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, phone, last_login_at');
      
      if (profilesError) {
        console.warn('Error fetching profiles:', profilesError);
      }

      // Create a map of user_id to profile for quick lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Combine auth users with roles and profiles
      const formattedUsers = authUsers?.map(user => {
        const userRole = roleMap.get(user.id) || 'user'; // Default to 'user' role
        const userProfile = profileMap.get(user.id);
        
        return {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          last_login_at: user.last_sign_in_at || userProfile?.last_login_at,
          display_name: userProfile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0],
          phone: userProfile?.phone || user.phone,
          role: userRole
        };
      }) || [];

      console.log(`Fetched ${formattedUsers.length} users from auth.users`);
      setUsers(formattedUsers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please check your connection and admin permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
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
              <Users className="mr-2 h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
            <p className="text-sm text-blue-600 mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Admin Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-sm text-green-600 mt-1">Admin accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {users.filter(u => {
                const createdDate = new Date(u.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createdDate > weekAgo;
              }).length}
            </div>
            <p className="text-sm text-purple-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.last_login_at).length}
            </div>
            <p className="text-sm text-orange-600 mt-1">Users with logins</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Users Management ({filteredUsers.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={fetchUsers} 
                variant="outline" 
                size="sm" 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <div className="w-80 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {user.display_name || user.email}
                      </h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span>{user.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Joined: {formatDate(user.created_at)}</span>
                      {user.last_login_at && (
                        <span>Last login: {formatDate(user.last_login_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                    Edit Role
                  </Button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                {searchTerm ? "No users found matching your search." : "No users found."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;