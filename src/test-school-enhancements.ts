// Test script for enhanced school functionality
// This file can be used to test the new features in development

import { School, SchoolImage } from './types/school';
import { ImageUploadData } from './utils/schoolUtils';

// Mock data for testing
export const mockEnhancedSchool: School = {
  id: 'test-school-123',
  name: 'Test Enhanced School',
  city: 'Bhubaneswar',
  district: 'Khordha',
  type: 'Private',
  board: 'CBSE',
  established: 2010,
  
  // Enhanced Contact Details
  principal_name: 'Dr. Jane Smith',
  principal_email: 'principal@testschool.edu',
  principal_phone: '+91 98765 43210',
  contact_email: 'info@testschool.edu',
  contact_phone: '+91 98765 43211',
  alternate_contact_name: 'Mr. John Doe',
  alternate_contact_phone: '+91 98765 43212',
  website: 'https://www.testschool.edu',
  
  // Enhanced Address Fields
  street_address: '123 Education Street, Sector 15',
  state: 'Odisha',
  pincode: '751015',
  landmark: 'Near Central Mall',
  latitude: 20.2961,
  longitude: 85.8245,
  address: '123 Education Street, Sector 15, Bhubaneswar, Khordha, Odisha - 751015',
  
  description: 'A premier educational institution providing quality education with modern facilities and experienced faculty.',
  image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
  facilities: ['Library', 'Computer Lab', 'Science Lab', 'Sports Ground', 'Auditorium'],
  achievements: ['Best Academic Performance 2023', 'Excellence in Sports'],
  ratings: {
    overall: 4.5,
    facility: 4.2,
    faculty: 4.7,
    activities: 4.3
  },
  admission_process: 'Online application followed by entrance test and interview.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  
  images: [
    {
      id: 'img-1',
      school_id: 'test-school-123',
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      image_type: 'infrastructure',
      title: 'Main Building',
      description: 'The main academic building with modern classrooms',
      display_order: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'img-2',
      school_id: 'test-school-123',
      image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      image_type: 'infrastructure',
      title: 'Library',
      description: 'Well-equipped library with extensive collection',
      display_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'img-3',
      school_id: 'test-school-123',
      image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
      image_type: 'events',
      title: 'Annual Sports Day',
      description: 'Students participating in annual sports day events',
      display_order: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'img-4',
      school_id: 'test-school-123',
      image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      image_type: 'infrastructure',
      title: 'Science Laboratory',
      description: 'Modern science lab with latest equipment',
      display_order: 3,
      created_at: new Date().toISOString()
    }
  ]
};

export const mockImageUploadData: ImageUploadData[] = [
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    title: 'Main Building',
    description: 'The main academic building',
    image_type: 'infrastructure',
    preview: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
    title: 'Sports Event',
    description: 'Annual sports day celebration',
    image_type: 'events',
    preview: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80'
  }
];

// Test functions to validate functionality
export const testSchoolCreation = () => {
  console.log('Testing school creation with enhanced fields...');
  console.log('Mock school data:', mockEnhancedSchool);
  return mockEnhancedSchool;
};

export const testImageUpload = () => {
  console.log('Testing image upload functionality...');
  console.log('Mock image data:', mockImageUploadData);
  return mockImageUploadData;
};

// Validation functions
export const validateSchoolData = (school: Partial<School>): string[] => {
  const errors: string[] = [];
  
  if (!school.name) errors.push('School name is required');
  if (!school.city) errors.push('City is required');
  if (!school.district) errors.push('District is required');
  if (!school.type) errors.push('School type is required');
  if (!school.board) errors.push('Board is required');
  
  // Validate email formats
  if (school.principal_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(school.principal_email)) {
    errors.push('Principal email format is invalid');
  }
  if (school.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(school.contact_email)) {
    errors.push('Contact email format is invalid');
  }
  
  // Validate phone formats (basic validation)
  if (school.principal_phone && !/^[\+]?[\d\s\-\(\)]{10,15}$/.test(school.principal_phone)) {
    errors.push('Principal phone format is invalid');
  }
  if (school.contact_phone && !/^[\+]?[\d\s\-\(\)]{10,15}$/.test(school.contact_phone)) {
    errors.push('Contact phone format is invalid');
  }
  
  // Validate coordinates
  if (school.latitude && (school.latitude < -90 || school.latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  if (school.longitude && (school.longitude < -180 || school.longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  return errors;
};

export const validateImageData = (images: ImageUploadData[]): string[] => {
  const errors: string[] = [];
  
  if (images.length > 20) {
    errors.push('Maximum 20 images allowed');
  }
  
  images.forEach((image, index) => {
    if (!image.image_type) {
      errors.push(`Image ${index + 1}: Category is required`);
    }
    if (!image.url && !image.file) {
      errors.push(`Image ${index + 1}: Either URL or file is required`);
    }
  });
  
  return errors;
};

console.log('Enhanced School Test Module Loaded');
console.log('Available test functions: testSchoolCreation(), testImageUpload(), validateSchoolData(), validateImageData()');
