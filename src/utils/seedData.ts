import { supabase } from '@/integrations/supabase/client';

export const seedSampleData = async () => {
  try {
    // Sample cities data
    const cities = [
      { name: 'Bhubaneswar', district: 'Khordha' },
      { name: 'Cuttack', district: 'Cuttack' },
      { name: 'Puri', district: 'Puri' },
      { name: 'Berhampur', district: 'Ganjam' },
      { name: 'Sambalpur', district: 'Sambalpur' },
      { name: 'Rourkela', district: 'Sundargarh' },
    ];

    // Sample schools data
    const schools = [
      {
        name: 'DAV Public School',
        city: 'Bhubaneswar',
        district: 'Khordha',
        type: 'Private',
        board: 'CBSE',
        established: 1995,
        principal: 'Dr. Rajesh Kumar',
        contact_email: 'info@davbhubaneswar.edu.in',
        contact_phone: '+91 674 2301234',
        website: 'https://davbhubaneswar.edu.in',
        address: 'Unit-VIII, Bhubaneswar - 751003, Odisha',
        description: 'DAV Public School is a premier educational institution committed to providing quality education with a focus on academic excellence and character building.',
        image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
        facilities: ['Library', 'Computer Lab', 'Science Lab', 'Sports Ground', 'Auditorium'],
        achievements: ['CBSE Board Toppers', 'State Level Sports Champions'],
        ratings: {
          overall: 4.5,
          facility: 4.3,
          faculty: 4.7,
          activities: 4.2
        }
      },
      {
        name: 'Kendriya Vidyalaya',
        city: 'Cuttack',
        district: 'Cuttack',
        type: 'Government',
        board: 'CBSE',
        established: 1985,
        principal: 'Mrs. Sunita Patel',
        contact_email: 'kvcuttack@gov.in',
        contact_phone: '+91 671 2234567',
        address: 'Cantonment Road, Cuttack - 753001, Odisha',
        description: 'Kendriya Vidyalaya provides quality education following CBSE curriculum with emphasis on holistic development.',
        image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
        facilities: ['Library', 'Science Lab', 'Computer Lab', 'Playground'],
        ratings: {
          overall: 4.2,
          facility: 4.0,
          faculty: 4.4,
          activities: 4.0
        }
      },
      {
        name: 'Sai International School',
        city: 'Bhubaneswar',
        district: 'Khordha',
        type: 'Private',
        board: 'CBSE',
        established: 2008,
        principal: 'Dr. Bijayalaxmi Nanda',
        contact_email: 'admission@saiinternational.edu.in',
        contact_phone: '+91 674 6649999',
        website: 'https://saiinternational.edu.in',
        address: 'At/PO: Sijua, Dist: Khordha, Bhubaneswar - 752101, Odisha',
        description: 'Sai International School is a world-class educational institution with state-of-the-art facilities and innovative teaching methodologies.',
        image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
        facilities: ['Smart Classrooms', 'Swimming Pool', 'Hostel', 'Transport', 'Medical Facility'],
        achievements: ['International School Award', 'Best Infrastructure Award'],
        ratings: {
          overall: 4.8,
          facility: 4.9,
          faculty: 4.7,
          activities: 4.8
        }
      }
    ];

    // Insert cities
    const { error: citiesError } = await supabase
      .from('cities')
      .upsert(cities, { onConflict: 'name' });

    if (citiesError) {
      console.error('Error inserting cities:', citiesError);
    }

    // Insert schools
    const { error: schoolsError } = await supabase
      .from('schools')
      .upsert(schools, { onConflict: 'name' });

    if (schoolsError) {
      console.error('Error inserting schools:', schoolsError);
    }

    console.log('Sample data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
};
