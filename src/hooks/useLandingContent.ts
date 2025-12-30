import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HeroContent {
  title: string;
  subtitle: string;
  badge: string;
  cta_primary: string;
  cta_secondary: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

interface FeaturesContent {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

interface TestimonialItem {
  name: string;
  role: string;
  image: string;
  quote: string;
}

interface TestimonialsContent {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

interface CTAContent {
  title: string;
  subtitle: string;
  button_text: string;
}

export interface LandingPageContent {
  hero: HeroContent;
  stats: StatItem[];
  features: FeaturesContent;
  testimonials: TestimonialsContent;
  cta: CTAContent;
}

export function useLandingContent() {
  return useQuery({
    queryKey: ['landing-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('section_key, content');

      if (error) throw error;

      const content: Partial<LandingPageContent> = {};
      data.forEach((item: { section_key: string; content: unknown }) => {
        if (item.section_key === 'hero') {
          content.hero = item.content as HeroContent;
        } else if (item.section_key === 'stats') {
          content.stats = item.content as StatItem[];
        } else if (item.section_key === 'features') {
          content.features = item.content as FeaturesContent;
        } else if (item.section_key === 'testimonials') {
          content.testimonials = item.content as TestimonialsContent;
        } else if (item.section_key === 'cta') {
          content.cta = item.content as CTAContent;
        }
      });

      return content as LandingPageContent;
    },
  });
}

export function useUpdateLandingContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sectionKey, content }: { sectionKey: string; content: Record<string, unknown> | unknown[] }) => {
      const { error } = await supabase
        .from('landing_page_content')
        .update({ content: content as any })
        .eq('section_key', sectionKey);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-content'] });
    },
  });
}
