import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react";

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
}

interface City {
  id: string;
  name: string;
  district: string;
}

const AdminSchools = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [schoolsResult, citiesResult] = await Promise.all([
      supabase.from("schools").select("*").order("name"),
      supabase.from("cities").select("*").order("name"),
    ]);

    if (schoolsResult.data) setSchools(schoolsResult.data);
    if (citiesResult.data) setCities(citiesResult.data);
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

    resetForm();
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

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL schools? This action cannot be undone.")) return;
    
    const { error } = await supabase
      .from("schools")
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete all schools",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "All schools deleted successfully",
    });
    fetchData();
  };

  const startEdit = (school: School) => {
    setEditingSchool(school);
    setFormData(school);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingSchool(null);
    resetFormData();
  };

  const resetForm = () => {
    setEditingSchool(null);
    setIsCreating(false);
    resetFormData();
  };

  const resetFormData = () => {
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
    });
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-1">
          <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-gray-900">
                {editingSchool ? "Edit School" : isCreating ? "Add New School" : "School Management"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {editingSchool || isCreating ? "Fill in the details below" : "Manage schools and their information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editingSchool && !isCreating ? (
                <Button onClick={startCreate} className="w-full bg-blue-600 hover:bg-blue-700">
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

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Thumbnail Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
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
                      placeholder="Enter detailed school description"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="established">Year Established</Label>
                    <Input
                      id="established"
                      type="number"
                      value={formData.established || ""}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="e.g., 1995"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principal">Principal Name</Label>
                    <Input
                      id="principal"
                      value={formData.principal}
                      onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                      placeholder="Enter principal's name"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Save className="mr-2 h-4 w-4" />
                      {editingSchool ? "Update School" : "Create School"}
                    </Button>
                    <Button onClick={resetForm} variant="outline" className="border-gray-300">
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
        <div className="xl:col-span-3">
          <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Schools Database ({filteredSchools.length})</CardTitle>
                  <CardDescription className="text-gray-600">Manage all schools in the system</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleDeleteAll}
                    variant="destructive"
                    size="sm"
                    disabled={schools.length === 0}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Schools
                  </Button>
                  <div className="w-80">
                    <Input
                      placeholder="Search schools by name, city, or district..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex space-x-4 flex-1">
                      {school.image_url && (
                        <img
                          src={school.image_url}
                          alt={school.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{school.name}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">📍 {school.city}, {school.district}</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">{school.type}</Badge>
                          <Badge variant="outline" className="border-gray-300">{school.board}</Badge>
                        </div>
                        {school.description && (
                          <p className="text-sm text-gray-700 mt-3 line-clamp-2 leading-relaxed">
                            {school.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => window.open(`/schools/${school.id}`, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => startEdit(school)}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(school.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredSchools.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    {searchTerm ? "No schools found matching your search." : "No schools found. Add your first school to get started."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSchools;