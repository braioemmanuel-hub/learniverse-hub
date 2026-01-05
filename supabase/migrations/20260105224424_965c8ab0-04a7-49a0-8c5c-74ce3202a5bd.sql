-- Insert certificate settings into landing_page_content
INSERT INTO landing_page_content (section_key, content)
VALUES ('certificate_settings', '{
  "signature_name": "LearnHub Administration",
  "logo_url": null,
  "organization_name": "LearnHub"
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Create storage bucket for certificate assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-assets', 'certificate-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view certificate assets
CREATE POLICY "Anyone can view certificate assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-assets');

-- Allow admins to upload certificate assets
CREATE POLICY "Admins can upload certificate assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update certificate assets
CREATE POLICY "Admins can update certificate assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete certificate assets
CREATE POLICY "Admins can delete certificate assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-assets' AND has_role(auth.uid(), 'admin'::app_role));