import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  Lock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  Award,
  BarChart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLessons, Lesson } from "@/hooks/useLessons";
import { useMyEnrollments, useUpdateProgress } from "@/hooks/useEnrollments";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PaymentEnrollmentDialog } from "@/components/PaymentEnrollmentDialog";
import { useQueryClient } from "@tanstack/react-query";

type Course = Tables<'courses'>;

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [lessonsExpanded, setLessonsExpanded] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: lessons, isLoading: lessonsLoading } = useLessons(courseId || '');
  const { data: enrollments, refetch: refetchEnrollments } = useMyEnrollments();
  const updateProgress = useUpdateProgress();

  const currentEnrollment = enrollments?.find(e => e.course_id === courseId);
  const isEnrolled = !!currentEnrollment;
  const isPendingPayment = currentEnrollment?.payment_status === 'pending';
  const isPaymentApproved = currentEnrollment?.payment_status === 'approved';
  const isPaymentRejected = currentEnrollment?.payment_status === 'rejected';

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      }
      setCourse(data);
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  // Set first lesson as active when lessons load
  useEffect(() => {
    if (lessons && lessons.length > 0 && !activeLesson) {
      setActiveLesson(lessons[0]);
    }
  }, [lessons, activeLesson]);

  // Simulate completed lessons from progress
  useEffect(() => {
    if (currentEnrollment && lessons) {
      const progress = currentEnrollment.progress || 0;
      const completedCount = Math.floor((progress / 100) * lessons.length);
      const completed = new Set(lessons.slice(0, completedCount).map(l => l.id));
      setCompletedLessons(completed);
    }
  }, [currentEnrollment, lessons]);

  const handleEnroll = () => {
    if (!user) {
      navigate(`/auth?redirect=/course/${courseId}`);
      return;
    }
    setPaymentDialogOpen(true);
  };

  const handleEnrollmentSuccess = () => {
    refetchEnrollments();
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!currentEnrollment || !lessons) return;
    
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);

    // Calculate new progress
    const newProgress = Math.round((newCompleted.size / lessons.length) * 100);
    
    try {
      await updateProgress.mutateAsync({
        enrollmentId: currentEnrollment.id,
        progress: newProgress,
      });
      
      if (newProgress >= 100) {
        toast.success("Congratulations! You've completed the course!");
      } else {
        toast.success("Lesson completed!");
      }

      // Move to next lesson
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      if (currentIndex < lessons.length - 1) {
        setActiveLesson(lessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const canAccessLesson = (lesson: Lesson) => {
    // User can access if lesson is free, or if enrolled with approved payment
    return lesson.is_free || (isEnrolled && isPaymentApproved);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Course not found</h2>
        <Link to="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  const progress = currentEnrollment?.progress || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isEnrolled && isPaymentApproved && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Progress</span>
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm font-medium text-primary">{progress}%</span>
              </div>
            )}
            {user ? (
              <Link to="/student">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Payment Status Banner */}
      {isPendingPayment && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3">
          <div className="container mx-auto flex items-center gap-3 text-amber-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">Payment pending approval.</span> An admin will verify your payment slip and grant access soon.
            </p>
          </div>
        </div>
      )}
      {isPaymentRejected && (
        <div className="bg-destructive/10 border-b border-destructive/30 px-6 py-3">
          <div className="container mx-auto flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">Payment was rejected.</span> Please contact support or try enrolling again with a valid payment slip.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Video Player Section */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="aspect-video bg-foreground/95 relative">
            {activeLesson ? (
              canAccessLesson(activeLesson) ? (
                activeLesson.video_url ? (
                  <iframe
                    src={activeLesson.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                    <Play className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">{activeLesson.title}</p>
                    <p className="text-sm opacity-70">No video available for this lesson</p>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground bg-foreground/90">
                  <Lock className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">This lesson is locked</p>
                  <p className="text-sm opacity-70 mb-4">Enroll to access all lessons</p>
                  <Button onClick={handleEnroll}>
                    Enroll Now - ${Number(course.price).toFixed(2)}
                  </Button>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
                <p>Select a lesson to start</p>
              </div>
            )}
          </div>

          {/* Lesson Info & Actions */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {activeLesson?.title || course.title}
                </h1>
                {activeLesson?.description && (
                  <p className="text-muted-foreground mb-4">{activeLesson.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {course.instructor_name}
                  </span>
                  {activeLesson?.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activeLesson.duration}
                    </span>
                  )}
                  {course.level && (
                    <Badge variant="secondary">{course.level}</Badge>
                  )}
                </div>
              </div>
              {isEnrolled && isPaymentApproved && activeLesson && !completedLessons.has(activeLesson.id) && (
                <Button 
                  onClick={() => handleLessonComplete(activeLesson.id)}
                  className="flex-shrink-0"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {isEnrolled && activeLesson && completedLessons.has(activeLesson.id) && (
                <Badge variant="default" className="flex items-center gap-1 px-3 py-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Lesson Content */}
          {activeLesson?.content && canAccessLesson(activeLesson) && (
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-foreground">
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          )}

          {/* Course Overview (when no lesson selected or for non-enrolled users) */}
          {!isEnrolled && (
            <div className="p-6 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Course</h2>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-secondary">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{lessons?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{course.duration || "Self-paced"}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary">
                    <BarChart className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{course.level || "All Levels"}</p>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary">
                    <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-semibold text-foreground">Yes</p>
                    <p className="text-xs text-muted-foreground">Certificate</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div>
                    <p className="text-3xl font-bold text-foreground">${Number(course.price).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">One-time payment, lifetime access</p>
                  </div>
                  <Button size="lg" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lessons Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card">
          <div 
            className="p-4 border-b border-border flex items-center justify-between cursor-pointer lg:cursor-default"
            onClick={() => setLessonsExpanded(!lessonsExpanded)}
          >
            <div>
              <h3 className="font-semibold text-foreground">Course Content</h3>
              <p className="text-sm text-muted-foreground">
                {lessons?.length || 0} lessons • {completedLessons.size} completed
              </p>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden">
              {lessonsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>

          <div className={`${lessonsExpanded ? 'block' : 'hidden lg:block'} max-h-[60vh] lg:max-h-[calc(100vh-8rem)] overflow-y-auto`}>
            {lessonsLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
                ))}
              </div>
            ) : lessons?.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No lessons available yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {lessons?.map((lesson, index) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  const canAccess = canAccessLesson(lesson);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full p-4 text-left transition-colors hover:bg-secondary/50 ${
                        isActive ? 'bg-primary/10 border-l-4 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted 
                            ? 'bg-primary text-primary-foreground' 
                            : canAccess 
                              ? 'bg-secondary text-foreground'
                              : 'bg-secondary text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : canAccess ? (
                            index + 1
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium line-clamp-1 ${
                            canAccess ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                            )}
                            {lesson.is_free && !isEnrolled && (
                              <Badge variant="outline" className="text-xs">Free</Badge>
                            )}
                          </div>
                        </div>
                        {isActive && (
                          <Play className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Enrollment Dialog */}
      {course && (
        <PaymentEnrollmentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          course={course}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
