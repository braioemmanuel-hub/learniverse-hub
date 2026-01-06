-- Allow admins to update enrollment payment status
CREATE POLICY "Admins can update enrollments" 
ON public.enrollments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));