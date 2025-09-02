export interface SchoolImage {
  id: string;
  school_id: string;
  image_url: string;
  image_type: 'infrastructure' | 'events' | 'general';
  title?: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface ContactDetails {
  principal_name?: string;
  principal_email?: string;
  principal_phone?: string;
  contact_email?: string;
  contact_phone?: string;
  alternate_contact_name?: string;
  alternate_contact_phone?: string;
  website?: string;
}

export interface AddressDetails {
  street_address?: string;
  address?: string; // Keep for backward compatibility
  city: string;
  district: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface School {
  id: string;
  name: string;
  city: string;
  district: string;
  type: 'Government' | 'Private' | 'Aided' | 'International';
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB';
  established?: number;
  
  // Enhanced Contact Details
  principal_name?: string;
  principal_email?: string;
  principal_phone?: string;
  contact_email?: string;
  contact_phone?: string;
  alternate_contact_name?: string;
  alternate_contact_phone?: string;
  website?: string;
  
  // Enhanced Address Fields
  street_address?: string;
  address?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  
  description?: string;
  image_url?: string; // Keep for backward compatibility
  facilities?: string[];
  achievements?: string[];
  ratings?: {
    overall: number;
    facility: number;
    faculty: number;
    activities: number;
  };
  fee_structure?: any;
  admission_process?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related data
  images?: SchoolImage[];
}

export interface SchoolFormData extends Omit<School, 'id' | 'created_at' | 'updated_at' | 'images'> {
  images?: File[];
  existing_images?: SchoolImage[];
}
