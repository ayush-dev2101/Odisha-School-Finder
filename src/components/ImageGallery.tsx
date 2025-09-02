import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SchoolImage } from '@/types/school';

interface ImageGalleryProps {
  images: SchoolImage[];
  schoolName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, schoolName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.image_type === selectedCategory);

  // Get unique categories
  const categories = Array.from(new Set(images.map(img => img.image_type)));

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'infrastructure': return 'Infrastructure';
      case 'events': return 'Events';
      case 'general': return 'General';
      default: return type;
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
          <ZoomIn className="h-6 w-6" />
        </div>
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({images.length})
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryLabel(category)} ({images.filter(img => img.image_type === category).length})
            </Button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-muted"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.image_url}
              alt={image.title || `${schoolName} - ${getCategoryLabel(image.image_type)}`}
              className="w-full h-32 md:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-white/90 text-xs">
                {getCategoryLabel(image.image_type)}
              </Badge>
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {filteredImages[selectedImageIndex]?.title || 
               `${schoolName} - ${getCategoryLabel(filteredImages[selectedImageIndex]?.image_type || 'general')}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <img
              src={filteredImages[selectedImageIndex]?.image_url}
              alt={filteredImages[selectedImageIndex]?.title || schoolName}
              className="w-full max-h-[70vh] object-contain"
            />
            
            {/* Navigation buttons */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {filteredImages.length}
            </div>
          </div>
          
          {/* Image description */}
          {filteredImages[selectedImageIndex]?.description && (
            <div className="p-6 pt-0">
              <p className="text-muted-foreground">
                {filteredImages[selectedImageIndex].description}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
