
-- Create storage bucket for ROM files
INSERT INTO storage.buckets (id, name, public) VALUES ('rom-files', 'rom-files', false);

-- Authenticated users can view files
CREATE POLICY "Authenticated users can view rom files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'rom-files');

-- Admins can upload files
CREATE POLICY "Admins can upload rom files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rom-files' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update files
CREATE POLICY "Admins can update rom files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'rom-files' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete files
CREATE POLICY "Admins can delete rom files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'rom-files' AND public.has_role(auth.uid(), 'admin'));
