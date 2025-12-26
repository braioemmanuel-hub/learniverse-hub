import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Get total courses
      const { count: courseCount, error: courseError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      if (courseError) throw courseError;

      // Get published courses
      const { count: publishedCount, error: publishedError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (publishedError) throw publishedError;

      // Get total enrollments
      const { count: enrollmentCount, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      if (enrollmentError) throw enrollmentError;

      // Get total revenue (sum of course prices * enrollments)
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, price');

      if (coursesError) throw coursesError;

      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id');

      if (enrollError) throw enrollError;

      let totalRevenue = 0;
      enrollments?.forEach((enrollment) => {
        const course = courses?.find((c) => c.id === enrollment.course_id);
        if (course) {
          totalRevenue += Number(course.price);
        }
      });

      return {
        totalUsers: userCount || 0,
        totalCourses: courseCount || 0,
        publishedCourses: publishedCount || 0,
        totalEnrollments: enrollmentCount || 0,
        totalRevenue,
      };
    },
  });
}
