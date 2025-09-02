import { supabase } from '@/integrations/supabase/client';
import { School, SchoolImage } from '@/types/school';

export interface ImageUploadData {
  file?: File;
  url?: string;
  title: string;
  description: string;
  image_type: 'infrastructure' | 'events' | 'general';
  preview?: string;
  isExisting?: boolean;
  id?: string;
}

/**
 * Upload an image file to Supabase storage
 */
export const uploadImageToStorage = async (file: File, schoolId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${schoolId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('school-images')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('school-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

/**
 * Save school images to database
 */
export const saveSchoolImages = async (schoolId: string, images: ImageUploadData[]): Promise<SchoolImage[]> => {
  const imageRecords: Omit<SchoolImage, 'id' | 'created_at'>[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    let imageUrl = image.url;
    
    // Upload file if it's a new file
    if (image.file) {
      imageUrl = await uploadImageToStorage(image.file, schoolId);
    }
    
    if (imageUrl) {
      imageRecords.push({
        school_id: schoolId,
        image_url: imageUrl,
        image_type: image.image_type,
        title: image.title || null,
        description: image.description || null,
        display_order: i
      });
    }
  }
  
  // Insert new images
  const { data, error } = await supabase
    .from('school_images')
    .insert(imageRecords)
    .select();
    
  if (error) {
    throw new Error(`Failed to save images: ${error.message}`);
  }
  
  return data || [];
};

/**
 * Update school images - handles both new uploads and existing image updates
 */
export const updateSchoolImages = async (schoolId: string, images: ImageUploadData[]): Promise<void> => {
  // First, delete all existing images for this school
  await supabase
    .from('school_images')
    .delete()
    .eq('school_id', schoolId);
  
  // Then save the new/updated images
  await saveSchoolImages(schoolId, images);
};

/**
 * Fetch school with images
 */
export const fetchSchoolWithImages = async (schoolId: string): Promise<School | null> => {
  const { data: schoolData, error: schoolError } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single();

  if (schoolError || !schoolData) {
    throw new Error(`Failed to fetch school: ${schoolError?.message}`);
  }

  const { data: imagesData, error: imagesError } = await supabase
    .from('school_images')
    .select('*')
    .eq('school_id', schoolId)
    .order('display_order');

  if (imagesError) {
    console.warn('Failed to fetch images:', imagesError);
  }

  return {
    ...schoolData,
    images: imagesData || []
  };
};

/**
 * Create or update school with images
 */
export const saveSchoolWithImages = async (
  schoolData: Omit<School, 'id' | 'created_at' | 'updated_at' | 'images'>,
  images: ImageUploadData[],
  schoolId?: string
): Promise<School> => {
  let school: School;
  
  if (schoolId) {
    // Update existing school
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', schoolId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to update school: ${error.message}`);
    }
    school = data;
  } else {
    // Create new school
    const { data, error } = await supabase
      .from('schools')
      .insert(schoolData)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to create school: ${error.message}`);
    }
    school = data;
  }
  
  // Handle images
  if (images.length > 0) {
    await updateSchoolImages(school.id, images);
  }
  
  // Fetch the complete school with images
  const completeSchool = await fetchSchoolWithImages(school.id);
  return completeSchool!;
};

/**
 * Delete school image
 */
export const deleteSchoolImage = async (imageId: string): Promise<void> => {
  const { error } = await supabase
    .from('school_images')
    .delete()
    .eq('id', imageId);
    
  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};
