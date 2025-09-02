import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, User, Phone } from "lucide-react";
import { School } from "@/types/school";
import SchoolForm from "@/components/SchoolForm";
import { saveSchoolWithImages, fetchSchoolWithImages, ImageUploadData } from "@/utils/schoolUtils";


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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolsResult, citiesResult] = await Promise.all([
        supabase.from("schools").select("*").order("name"),
        supabase.from("cities").select("*").order("name"),
      ]);

      if (schoolsResult.error) {
        console.error('Error fetching schools:', schoolsResult.error);
        toast({
          title: "Error",
          description: "Failed to fetch schools. Please check your database connection.",
          variant: "destructive",
        });
      } else if (schoolsResult.data) {
        setSchools(schoolsResult.data);
      }

      if (citiesResult.error) {
        console.warn('Cities table not found:', citiesResult.error);
        // Create default cities for Odisha
        setCities([
          { id: '1', name: 'Bhubaneswar', district: 'Khordha' },
          { id: '2', name: 'Cuttack', district: 'Cuttack' },
          { id: '3', name: 'Puri', district: 'Puri' },
          { id: '4', name: 'Berhampur', district: 'Ganjam' },
          { id: '5', name: 'Sambalpur', district: 'Sambalpur' },
          { id: '6', name: 'Rourkela', district: 'Sundargarh' },
        ]);
      } else if (citiesResult.data) {
        setCities(citiesResult.data);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from database.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSchool = async (
    schoolData: Omit<School, 'id' | 'created_at' | 'updated_at' | 'images'>,
    images: ImageUploadData[]
  ) => {
    setLoading(true);
    try {
      await saveSchoolWithImages(schoolData, images, editingSchool?.id);
      
      toast({
        title: "Success",
        description: editingSchool ? "School updated successfully" : "School created successfully",
      });
      
      setIsFormOpen(false);
      setEditingSchool(null);
      await fetchData();
    } catch (error) {
      console.error('Error saving school:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save school",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const startEdit = async (school: School) => {
    setLoading(true);
    try {
      // Fetch complete school data with images
      const completeSchool = await fetchSchoolWithImages(school.id);
      setEditingSchool(completeSchool);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error fetching school details:', error);
      toast({
        title: "Error",
        description: "Failed to load school details for editing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditingSchool(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSchool(null);
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Schools</h1>
            <p className="text-gray-600">Add, edit, and manage school information</p>
          </div>
          <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add New School
          </Button>
        </div>

        {/* Schools List */}
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
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
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
                      {/* Enhanced contact preview */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {school.principal_name && (
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {school.principal_name}
                          </span>
                        )}
                        {school.contact_phone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {school.contact_phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => {
                        const url = `/schools/${school.id}`;
                        window.open(url, '_blank');
                      }}
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
                      disabled={loading}
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

      {/* Enhanced School Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? 'Edit School Details' : 'Add New School'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <SchoolForm
              school={editingSchool}
              cities={cities}
              onSave={handleSaveSchool}
              onCancel={handleFormClose}
              loading={loading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSchools;