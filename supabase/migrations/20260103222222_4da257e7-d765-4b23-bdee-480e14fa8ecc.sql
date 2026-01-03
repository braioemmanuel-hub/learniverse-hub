-- Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload payment slips
CREATE POLICY "Users can upload payment slips"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own payment slips
CREATE POLICY "Users can view own payment slips"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all payment slips
CREATE POLICY "Admins can view all payment slips"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-slips' AND has_role(auth.uid(), 'admin'));

-- Add payment_slip_url column to enrollments table
ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS payment_slip_url TEXT;