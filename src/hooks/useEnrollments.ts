import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export type Enrollment = Tables<'enrollments'>;
export type EnrollmentInsert = TablesInsert<'enrollments'>;

export interface EnrollmentWithCourse extends Enrollment {
  course: Tables<'courses'>;
}

export function useMyEnrollments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', 'my', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data as EnrollmentWithCourse[];
    },
    enabled: !!user,
  });
}

export interface EnrollmentWithDetails extends Enrollment {
  course: Tables<'courses'>;
  profile?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export function useAllEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately due to RLS
      const userIds = [...new Set(data.map((e: Enrollment) => e.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map((enrollment: EnrollmentWithCourse) => ({
        ...enrollment,
        profile: profileMap.get(enrollment.user_id),
      })) as EnrollmentWithDetails[];
    },
  });
}

export function useUpdateEnrollmentPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      enrollmentId, 
      paymentStatus 
    }: { 
      enrollmentId: string; 
      paymentStatus: 'pending' | 'approved' | 'rejected';
    }) => {
      const { error } = await supabase
        .from('enrollments')
        .update({ payment_status: paymentStatus })
        .eq('id', enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useIsEnrolled(courseId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollment', 'check', user?.id, courseId],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!courseId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) => {
      const updates: any = { progress };
      if (progress >= 100) {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}
