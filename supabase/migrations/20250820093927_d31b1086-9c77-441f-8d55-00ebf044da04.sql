-- Add all major cities and districts of Odisha
INSERT INTO public.cities (name, district, state) VALUES 
-- Angul District
('Angul', 'Angul', 'Odisha'),
('Talcher', 'Angul', 'Odisha'),

-- Balangir District  
('Balangir', 'Balangir', 'Odisha'),
('Titlagarh', 'Balangir', 'Odisha'),

-- Bargarh District
('Bargarh', 'Bargarh', 'Odisha'),
('Padampur', 'Bargarh', 'Odisha'),

-- Bhadrak District
('Bhadrak', 'Bhadrak', 'Odisha'),
('Chandbali', 'Bhadrak', 'Odisha'),

-- Boudh District
('Boudh', 'Boudh', 'Odisha'),
('Kantamal', 'Boudh', 'Odisha'),

-- Deogarh District
('Deogarh', 'Deogarh', 'Odisha'),

-- Dhenkanal District
('Dhenkanal', 'Dhenkanal', 'Odisha'),
('Kamakhyanagar', 'Dhenkanal', 'Odisha'),

-- Gajapati District
('Paralakhemundi', 'Gajapati', 'Odisha'),
('Kashinagar', 'Gajapati', 'Odisha'),

-- Ganjam District
('Berhampur', 'Ganjam', 'Odisha'),
('Chhatrapur', 'Ganjam', 'Odisha'),
('Gopalpur', 'Ganjam', 'Odisha'),

-- Jagatsinghpur District
('Jagatsinghpur', 'Jagatsinghpur', 'Odisha'),
('Paradip', 'Jagatsinghpur', 'Odisha'),

-- Jajpur District
('Jajpur', 'Jajpur', 'Odisha'),
('Vyasanagar', 'Jajpur', 'Odisha'),

-- Jharsuguda District
('Jharsuguda', 'Jharsuguda', 'Odisha'),
('Brajrajnagar', 'Jharsuguda', 'Odisha'),

-- Kalahandi District
('Bhawanipatna', 'Kalahandi', 'Odisha'),
('Kesinga', 'Kalahandi', 'Odisha'),

-- Kandhamal District
('Phulbani', 'Kandhamal', 'Odisha'),
('Balliguda', 'Kandhamal', 'Odisha'),

-- Kendrapara District
('Kendrapara', 'Kendrapara', 'Odisha'),
('Pattamundai', 'Kendrapara', 'Odisha'),

-- Kendujhar District
('Kendujhar', 'Kendujhar', 'Odisha'),
('Barbil', 'Kendujhar', 'Odisha'),

-- Koraput District
('Koraput', 'Koraput', 'Odisha'),
('Jeypore', 'Koraput', 'Odisha'),

-- Malkangiri District
('Malkangiri', 'Malkangiri', 'Odisha'),
('Motu', 'Malkangiri', 'Odisha'),

-- Mayurbhanj District
('Baripada', 'Mayurbhanj', 'Odisha'),
('Rairangpur', 'Mayurbhanj', 'Odisha'),

-- Nabarangpur District
('Nabarangpur', 'Nabarangpur', 'Odisha'),
('Umerkote', 'Nabarangpur', 'Odisha'),

-- Nayagarh District
('Nayagarh', 'Nayagarh', 'Odisha'),
('Odagaon', 'Nayagarh', 'Odisha'),

-- Nuapada District
('Nuapada', 'Nuapada', 'Odisha'),
('Khariar', 'Nuapada', 'Odisha'),

-- Rayagada District
('Rayagada', 'Rayagada', 'Odisha'),
('Gunupur', 'Rayagada', 'Odisha'),

-- Subarnapur District
('Subarnapur', 'Subarnapur', 'Odisha'),
('Sonepur', 'Subarnapur', 'Odisha'),

-- Additional major cities for existing districts
('Konark', 'Puri', 'Odisha'),
('Pipili', 'Puri', 'Odisha'),
('Jatni', 'Khordha', 'Odisha'),
('Khordha', 'Khordha', 'Odisha'),
('Choudwar', 'Cuttack', 'Odisha'),
('Banki', 'Cuttack', 'Odisha'),
('Birmitrapur', 'Sundargarh', 'Odisha'),
('Rajgangpur', 'Sundargarh', 'Odisha'),
('Brajarajnagar', 'Jharsuguda', 'Odisha'),
('Hirakud', 'Sambalpur', 'Odisha'),
('Burla', 'Sambalpur', 'Odisha'),
('Remuna', 'Balasore', 'Odisha'),
('Nilgiri', 'Balasore', 'Odisha'),
('Soro', 'Balasore', 'Odisha')

ON CONFLICT (name, district) DO NOTHING;