import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, User, MapPin, Phone, Mail, Building, Camera } from 'lucide-react';
import { School } from '@/types/school';
import MultiImageUpload from '@/components/MultiImageUpload';
import { ImageUploadData } from '@/utils/schoolUtils';

interface City {
  id: string;
  name: string;
  district: string;
}

interface SchoolFormProps {
  school?: School | null;
  cities: City[];
  onSave: (schoolData: Omit<School, 'id' | 'created_at' | 'updated_at' | 'images'>, images: ImageUploadData[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  cities,
  onSave,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    city: '',
    district: '',
    type: '',
    board: '',
    established: undefined,
    
    // Contact Details
    principal_name: '',
    principal_email: '',
    principal_phone: '',
    contact_email: '',
    contact_phone: '',
    alternate_contact_name: '',
    alternate_contact_phone: '',
    website: '',
    
    // Address Details
    street_address: '',
    address: '',
    state: 'Odisha',
    pincode: '',
    landmark: '',
    latitude: undefined,
    longitude: undefined,
    
    description: '',
    image_url: '',
    facilities: [],
    achievements: [],
    admission_process: '',
  });

  const [images, setImages] = useState<ImageUploadData[]>([]);

  useEffect(() => {
    if (school) {
      setFormData(school);
      setImages(school.images?.map(img => ({
        url: img.image_url,
        title: img.title || '',
        description: img.description || '',
        image_type: img.image_type,
        preview: img.image_url,
        isExisting: true,
        id: img.id
      })) || []);
    }
  }, [school]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.city || !formData.district || !formData.type || !formData.board) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await onSave(formData as Omit<School, 'id' | 'created_at' | 'updated_at' | 'images'>, images);
    } catch (error) {
      console.error('Error saving school:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center text-2xl text-gray-900">
            <Building className="mr-3 h-6 w-6 text-blue-600" />
            {school ? 'Edit School Details' : 'Add New School'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="established">Year Established</Label>
                  <Input
                    id="established"
                    type="number"
                    value={formData.established || ''}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="e.g., 1995"
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="type">School Type *</Label>
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
                <Label htmlFor="description">School Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed school description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admission_process">Admission Process</Label>
                <Textarea
                  id="admission_process"
                  value={formData.admission_process}
                  onChange={(e) => setFormData({ ...formData, admission_process: e.target.value })}
                  placeholder="Describe the admission process"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <User className="h-5 w-5" />
                  Principal Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="principal_name">Principal Name</Label>
                    <Input
                      id="principal_name"
                      value={formData.principal_name}
                      onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                      placeholder="Enter principal's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principal_email">Principal Email</Label>
                    <Input
                      id="principal_email"
                      type="email"
                      value={formData.principal_email}
                      onChange={(e) => setFormData({ ...formData, principal_email: e.target.value })}
                      placeholder="principal@school.edu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principal_phone">Principal Phone</Label>
                    <Input
                      id="principal_phone"
                      value={formData.principal_phone}
                      onChange={(e) => setFormData({ ...formData, principal_phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Phone className="h-5 w-5" />
                  School Contact Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">School Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="info@school.edu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">School Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternate_contact_name">Alternate Contact Name</Label>
                    <Input
                      id="alternate_contact_name"
                      value={formData.alternate_contact_name}
                      onChange={(e) => setFormData({ ...formData, alternate_contact_name: e.target.value })}
                      placeholder="Alternate contact person"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternate_contact_phone">Alternate Contact Phone</Label>
                    <Input
                      id="alternate_contact_phone"
                      value={formData.alternate_contact_phone}
                      onChange={(e) => setFormData({ ...formData, alternate_contact_phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.school.edu"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Address Information Tab */}
            <TabsContent value="address" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPin className="h-5 w-5" />
                  Address Details
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                      id="street_address"
                      value={formData.street_address}
                      onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                      placeholder="Enter complete street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="XXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Odisha"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Near famous landmark"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude (Optional)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude || ''}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="20.2961"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude (Optional)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude || ''}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="85.8245"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Complete Address (Legacy)</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Complete address (for backward compatibility)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Camera className="h-5 w-5" />
                  School Images Gallery
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Main Thumbnail Image URL (Legacy)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Thumbnail Preview"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <MultiImageUpload
                  existingImages={school?.images || []}
                  onImagesChange={setImages}
                  maxImages={20}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t mt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (school ? 'Update School' : 'Create School')}
            </Button>
            <Button 
              onClick={onCancel} 
              variant="outline" 
              disabled={loading}
              className="border-gray-300"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolForm;
