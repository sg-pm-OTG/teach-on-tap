-- Create storage bucket for session recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-recordings', 'session-recordings', false);

-- Allow authenticated users to upload their own recordings
CREATE POLICY "Users can upload their own recordings"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'session-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own recordings
CREATE POLICY "Users can read their own recordings"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'session-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own recordings
CREATE POLICY "Users can delete their own recordings"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'session-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);