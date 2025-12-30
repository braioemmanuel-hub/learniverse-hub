-- Create landing page content table
CREATE TABLE public.landing_page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_page_content ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all content
CREATE POLICY "Admins can manage landing page content"
ON public.landing_page_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow anyone to read landing page content
CREATE POLICY "Anyone can view landing page content"
ON public.landing_page_content
FOR SELECT
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_landing_page_content_updated_at
BEFORE UPDATE ON public.landing_page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default landing page content
INSERT INTO public.landing_page_content (section_key, content) VALUES
('hero', '{"title": "Unlock Your Potential with World-Class Learning", "subtitle": "Master new skills with expert-led courses. From coding to design, find everything you need to advance your career.", "badge": "Trusted by 50,000+ learners worldwide", "cta_primary": "Start Learning Today", "cta_secondary": "Browse Courses"}'),
('stats', '[{"value": "50K+", "label": "Active Learners"}, {"value": "200+", "label": "Expert Instructors"}, {"value": "500+", "label": "Courses Available"}, {"value": "95%", "label": "Success Rate"}]'),
('features', '{"title": "Why Choose LearnHub?", "subtitle": "We''re committed to providing the best learning experience possible", "items": [{"title": "Expert-Led Courses", "description": "Learn from industry professionals with real-world experience"}, {"title": "Community Learning", "description": "Connect with thousands of learners worldwide"}, {"title": "Certified Credentials", "description": "Earn recognized certificates upon completion"}]}'),
('testimonials', '{"title": "What Our Students Say", "subtitle": "Join thousands of satisfied learners who have transformed their careers", "items": [{"name": "Sarah Johnson", "role": "Software Developer", "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", "quote": "LearnHub transformed my career. The courses are practical and the instructors are amazing."}, {"name": "Michael Chen", "role": "Product Designer", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", "quote": "I went from beginner to professional in just 6 months. Highly recommend!"}, {"name": "Emily Roberts", "role": "Data Scientist", "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", "quote": "The community here is incredible. I''ve made connections that will last a lifetime."}]}'),
('cta', '{"title": "Ready to Transform Your Career?", "subtitle": "Join thousands of learners who have already taken the first step. Start your learning journey today with unlimited access.", "button_text": "Get Started Free"}');

-- Add payment status to enrollments
ALTER TABLE public.enrollments 
ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected'));

-- Add payment reference
ALTER TABLE public.enrollments 
ADD COLUMN payment_reference text;