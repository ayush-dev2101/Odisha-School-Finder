import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SchoolImage } from '@/types/school';

interface ImageUploadData {
  file?: File;
  url?: string;
  title: string;
  description: string;
  image_type: 'infrastructure' | 'events' | 'general';
  preview?: string;
  isExisting?: boolean;
  id?: string;
}

interface MultiImageUploadProps {
  existingImages?: SchoolImage[];
  onImagesChange: (images: ImageUploadData[]) => void;
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  existingImages = [],
  onImagesChange,
  maxImages = 20
}) => {
  const [images, setImages] = useState<ImageUploadData[]>(() => 
    existingImages.map(img => ({
      url: img.image_url,
      title: img.title || '',
      description: img.description || '',
      image_type: img.image_type,
      preview: img.image_url,
      isExisting: true,
      id: img.id
    }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: ImageUploadData[] = files.map(file => ({
      file,
      title: '',
      description: '',
      image_type: 'general',
      preview: URL.createObjectURL(file)
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = (url: string) => {
    if (!url.trim() || images.length >= maxImages) return;

    const newImage: ImageUploadData = {
      url: url.trim(),
      title: '',
      description: '',
      image_type: 'general',
      preview: url.trim()
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const updateImage = (index: number, updates: Partial<ImageUploadData>) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, ...updates } : img
    );
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview && !imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'infrastructure': return 'Infrastructure';
      case 'events': return 'Events';
      case 'general': return 'General';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Controls */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= maxImages}
              className="w-full border-dashed border-2 h-32 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary"
            >
              <Upload className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Upload Images</span>
              <span className="text-xs">Click to select files</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images • Supports JPG, PNG, WebP formats
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Image Gallery ({images.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Image Preview */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={image.preview}
                        alt={image.title || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {image.isExisting && (
                        <Badge className="absolute bottom-1 left-1 text-xs bg-green-600">
                          Saved
                        </Badge>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 p-3 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Title</Label>
                        <Input
                          placeholder="Image title"
                          value={image.title}
                          onChange={(e) => updateImage(index, { title: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={image.image_type}
                          onValueChange={(value: 'infrastructure' | 'events' | 'general') => 
                            updateImage(index, { image_type: value })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                          placeholder="Optional description"
                          value={image.description}
                          onChange={(e) => updateImage(index, { description: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
