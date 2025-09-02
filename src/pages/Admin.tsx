import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Eye, Users, UserPlus, Crown, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  fee_structure?: any;
  admission_process?: string;
  reviews?: any[];
  testimonials?: any[];
}

interface City {
  id: string;
  name: string;
  district: string;
}

interface UserWithRole {
  id: string;
  email?: string;
  display_name?: string;
  created_at: string;
  roles: ('admin' | 'user' | 'moderator')[];
}

interface AddRoleForm {
  email: string;
  role: 'admin' | 'user';
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [addRoleForm, setAddRoleForm] = useState<AddRoleForm>({
    email: '',
    role: 'user'
  });

  const [formData, setFormData] = useState<Partial<School>>({
    name: "",
    city: "",
    district: "",
    type: "",
    board: "",
    established: undefined,
    principal: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    address: "",
    description: "",
    image_url: "",
    facilities: [],
    achievements: [],
    admission_process: "",
    reviews: [],
    testimonials: [],
  });

  useEffect(() => {
    checkAdminRole();
    fetchData();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (data && !error) {
      setIsAdmin(true);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    const [schoolsResult, citiesResult, usersResult] = await Promise.all([
      supabase.from("schools").select("*").order("name"),
      supabase.from("cities").select("*").order("name"),
      fetchUsers()
    ]);

    if (schoolsResult.data) {
      const transformedSchools = schoolsResult.data.map(school => ({
        ...school,
        reviews: Array.isArray(school.reviews) ? school.reviews : [],
        testimonials: Array.isArray(school.testimonials) ? school.testimonials : [],
      }));
      setSchools(transformedSchools);
    }
    if (citiesResult.data) setCities(citiesResult.data);
  };

  const fetchUsers = async () => {
    try {
      // Get all profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, display_name, created_at');

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const roles = (userRoles || [])
          .filter(ur => ur.user_id === profile.user_id)
          .map(ur => ur.role);

        return {
          id: profile.user_id,
          email: profile.email || '',
          display_name: profile.display_name || '',
          created_at: profile.created_at,
          roles
        };
      });

      setUsers(usersWithRoles);
      return usersWithRoles;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.city || !formData.district || !formData.type || !formData.board) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const schoolData = {
      name: formData.name!,
      city: formData.city!,
      district: formData.district!,
      type: formData.type!,
      board: formData.board!,
      established: formData.established,
      principal: formData.principal,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      website: formData.website,
      address: formData.address,
      description: formData.description,
      image_url: formData.image_url,
      facilities: formData.facilities || [],
      achievements: formData.achievements || [],
      admission_process: formData.admission_process,
    };

    if (editingSchool) {
      const { error } = await supabase
        .from("schools")
        .update(schoolData)
        .eq("id", editingSchool.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update school",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "School updated successfully",
      });
    } else {
      const { error } = await supabase
        .from("schools")
        .insert(schoolData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create school",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "School created successfully",
      });
    }

    setEditingSchool(null);
    setIsCreating(false);
    setFormData({
      name: "",
      city: "",
      district: "",
      type: "",
      board: "",
      established: undefined,
      principal: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      address: "",
      description: "",
      image_url: "",
      facilities: [],
      achievements: [],
      admission_process: "",
      reviews: [],
      testimonials: [],
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return;

    const { error } = await supabase
      .from("schools")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "School deleted successfully",
    });
    fetchData();
  };

  const handleAddRole = async () => {
    if (!addRoleForm.email || !addRoleForm.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if user exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', addRoleForm.email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "Error",
          description: "User not found. The user must sign up first.",
          variant: "destructive",
        });
        return;
      }

      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('role', addRoleForm.role)
        .maybeSingle();

      if (existingRole) {
        toast({
          title: "Info",
          description: "User already has this role",
          variant: "default",
        });
        return;
      }

      // Add the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profile.user_id,
          role: addRoleForm.role
        });

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: `${addRoleForm.role} role added successfully`,
      });

      setAddRoleForm({ email: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: 'admin' | 'user' | 'moderator') => {
    if (!confirm(`Are you sure you want to remove the ${role} role?`)) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role removed successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const startEdit = (school: School) => {
    setEditingSchool(school);
    setFormData(school);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingSchool(null);
    setFormData({
      name: "",
      city: "",
      district: "",
      type: "",
      board: "",
      established: undefined,
      principal: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      address: "",
      description: "",
      image_url: "",
      facilities: [],
      achievements: [],
      admission_process: "",
      reviews: [],
      testimonials: [],
    });
  };

  const cancelEdit = () => {
    setEditingSchool(null);
    setIsCreating(false);
    setFormData({
      name: "",
      city: "",
      district: "",
      type: "",
      board: "",
      established: undefined,
      principal: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      address: "",
      description: "",
      image_url: "",
      facilities: [],
      achievements: [],
      admission_process: "",
      reviews: [],
      testimonials: [],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertDescription>
              {!user ? "Please log in to access the admin panel." : "You don't have admin privileges."}
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            size="lg" 
            className="mb-6 bg-background border-2 hover:bg-muted shadow-md"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Previous Page
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage schools and educational data</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Tabs defaultValue="schools" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schools" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Manage Schools</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schools" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingSchool ? "Edit School" : isCreating ? "Add New School" : "School Management"}
                </CardTitle>
                <CardDescription>
                  {editingSchool || isCreating ? "Fill in the details below" : "Select an action"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editingSchool && !isCreating ? (
                  <Button onClick={startCreate} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New School
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">School Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter school name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => setFormData({ ...formData, city: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District *</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) => setFormData({ ...formData, district: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(cities.map(city => city.district))).map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Government">Government</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="Aided">Aided</SelectItem>
                            <SelectItem value="International">International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="board">Board *</Label>
                        <Select
                          value={formData.board}
                          onValueChange={(value) => setFormData({ ...formData, board: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select board" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE">ICSE</SelectItem>
                            <SelectItem value="State Board">State Board</SelectItem>
                            <SelectItem value="IB">IB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter school description"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingSchool ? "Update" : "Create"}
                      </Button>
                      <Button onClick={cancelEdit} variant="outline">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Schools List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schools ({schools.length})</CardTitle>
                <CardDescription>Manage all schools in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{school.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>{school.city}, {school.district}</span>
                          <Badge variant="secondary">{school.type}</Badge>
                          <Badge variant="outline">{school.board}</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2 relative z-10">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('View button clicked for school:', school.id);
                            navigate(`/schools/${school.id}`);
                          }}
                          variant="outline"
                          size="sm"
                          className="relative z-20 pointer-events-auto"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startEdit(school);
                          }}
                          variant="outline"
                          size="sm"
                          className="relative z-20 pointer-events-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(school.id);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive relative z-20 pointer-events-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {schools.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No schools found. Add your first school to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add User Role Form */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add User Role</CardTitle>
                      <CardDescription>
                        Grant admin or user roles to existing users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">User Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          placeholder="user@example.com"
                          value={addRoleForm.email}
                          onChange={(e) => setAddRoleForm({ ...addRoleForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Role</Label>
                        <Select
                          value={addRoleForm.role}
                          onValueChange={(value: 'admin' | 'user') => 
                            setAddRoleForm({ ...addRoleForm, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>User</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center space-x-2">
                                <Crown className="h-4 w-4" />
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddRole} className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Role
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Users ({users.length})</CardTitle>
                      <CardDescription>Manage user roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                {user.display_name || 'No Name'}
                              </h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                {user.roles.length > 0 ? (
                                  user.roles.map((role) => (
                                    <Badge 
                                      key={role} 
                                      variant={role === 'admin' ? 'default' : 'secondary'}
                                      className="flex items-center space-x-1"
                                    >
                                      {role === 'admin' ? (
                                        <Crown className="h-3 w-3" />
                                      ) : (
                                        <User className="h-3 w-3" />
                                      )}
                                      <span>{role}</span>
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="outline">No roles</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {user.roles.map((role) => (
                                <Button
                                  key={role}
                                  onClick={() => handleRemoveRole(user.id, role)}
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                        {users.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No users found.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;