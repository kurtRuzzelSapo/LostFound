-- Create storage buckets for the application

-- Create avatars bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create found-images bucket for found item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('found-images', 'found-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create lost-images bucket for lost item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lost-images', 'lost-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for found-images bucket
CREATE POLICY "Found images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'found-images');

CREATE POLICY "Users can upload found images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'found-images');

CREATE POLICY "Users can update their own found images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'found-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own found images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'found-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for lost-images bucket
CREATE POLICY "Lost images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'lost-images');

CREATE POLICY "Users can upload lost images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lost-images');

CREATE POLICY "Users can update their own lost images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'lost-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own lost images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'lost-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
); 