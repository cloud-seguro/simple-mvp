-- Allow authenticated users to upload avatars and blog images
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);

-- Allow public access to view all files in the avatars bucket
CREATE POLICY "Allow public viewing of files" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'avatars');

-- Allow owner to update their files
CREATE POLICY "Allow owner to update files" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);

-- Allow owner to delete their files
CREATE POLICY "Allow owner to delete files" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);