import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Play,
  Clock,
  CheckCircle,
  Zap,
  ShoppingCart,
  FileText,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useMyEnrollments, useEnrollInCourse } from "@/hooks/useEnrollments";
import { usePublishedCourses } from "@/hooks/useCourses";
import { CourseCertificate } from "@/components/CourseCertificate";
import { useCertificateSettings } from "@/hooks/useCertificateSettings";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: ShoppingCart, label: "Browse Courses", id: "browse" },
  { icon: Award, label: "Certificates", id: "certificates" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    courseTitle: string;
    completionDate: string;
  } | null>(null);

  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments();
  const { data: allCourses, isLoading: coursesLoading } = usePublishedCourses();
  const { data: certificateSettings } = useCertificateSettings();
  const enrollInCourse = useEnrollInCourse();

  // Handle enrollment from URL param
  useEffect(() => {
    const enrollCourseId = searchParams.get('enroll');
    if (enrollCourseId && allCourses) {
      const courseToEnroll = allCourses.find(c => c.id === enrollCourseId);
      if (courseToEnroll) {
        const isAlreadyEnrolled = enrollments?.some(e => e.course_id === enrollCourseId);
        if (!isAlreadyEnrolled) {
          setSelectedCourse(courseToEnroll);
          setEnrollDialogOpen(true);
        }
      }
    }
  }, [searchParams, allCourses, enrollments]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    try {
      await enrollInCourse.mutateAsync(selectedCourse.id);
      setEnrollDialogOpen(false);
      setSelectedCourse(null);
      toast.success("Successfully enrolled in " + selectedCourse.title);
      setActiveTab("courses");
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll");
    }
  };

  // Get courses not yet enrolled
  const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
  const availableCourses = allCourses?.filter(c => !enrolledCourseIds.includes(c.id)) || [];

  const stats = [
    { label: "Courses Enrolled", value: enrollments?.length || 0, icon: BookOpen, color: "primary" },
    { label: "In Progress", value: enrollments?.filter(e => e.status === 'active').length || 0, icon: Clock, color: "accent" },
    { label: "Completed", value: enrollments?.filter(e => e.status === 'completed').length || 0, icon: Award, color: "primary" },
    { label: "Current Streak", value: "12 days", icon: Zap, color: "accent" },
  ];

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {sidebarOpen && (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">LearnHub</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${!sidebarOpen && "justify-center"}`}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground capitalize">
              {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10 w-64 bg-secondary border-0"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <div className="p-6 rounded-2xl gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
                <div className="relative">
                  <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                    Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'}! 👋
                  </h2>
                  <p className="text-primary-foreground/80 mb-4">
                    {enrollments?.length ? `You have ${enrollments.length} course(s) in progress.` : 'Start your learning journey today!'}
                  </p>
                  <Button variant="accent" size="sm" onClick={() => setActiveTab("browse")}>
                    {enrollments?.length ? 'Continue Learning' : 'Browse Courses'}
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`p-5 rounded-2xl bg-card border border-border shadow-soft animate-fade-up animation-delay-${(index + 1) * 100}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${stat.color === "primary" ? "gradient-primary" : "gradient-accent"} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Continue Learning */}
              {enrollments && enrollments.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Continue Learning</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("courses")}>
                      View All
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.slice(0, 3).map((enrollment) => {
                      const isPending = enrollment.payment_status === 'pending';
                      const isRejected = enrollment.payment_status === 'rejected';
                      const isApproved = enrollment.payment_status === 'approved';

                      return (
                        <Link
                          key={enrollment.id}
                          to={`/course/${enrollment.course_id}`}
                          className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative">
                            <img
                              src={enrollment.course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                              alt={enrollment.course.title}
                              className="w-full h-36 object-cover"
                            />
                            {!isApproved && (
                              <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
                                <div className="text-center text-primary-foreground">
                                  <Lock className="w-6 h-6 mx-auto mb-1" />
                                  <p className="text-xs font-medium">
                                    {isPending ? "Payment Pending" : "Rejected"}
                                  </p>
                                </div>
                              </div>
                            )}
                            {isApproved && (
                              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="accent" size="sm">
                                  <Play className="w-4 h-4" />
                                  Continue
                                </Button>
                              </div>
                            )}
                            {isPending && (
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-medium">
                                  Pending
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{enrollment.course.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{enrollment.course.instructor_name}</p>
                            {isApproved && (
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium text-primary">{enrollment.progress}%</span>
                                </div>
                                <Progress value={enrollment.progress || 0} className="h-2" />
                              </div>
                            )}
                            {!isApproved && (
                              <p className="text-xs text-muted-foreground">
                                {isPending ? "Awaiting approval" : "Re-enroll required"}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 rounded-2xl bg-card border border-border">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Enroll in a course to start learning</p>
                  <Button onClick={() => setActiveTab("browse")}>Browse Courses</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Courses you're enrolled in</p>
              {enrollmentsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl bg-card border border-border p-6 animate-pulse">
                      <div className="h-40 bg-secondary rounded-xl mb-4" />
                      <div className="h-4 bg-secondary rounded mb-2" />
                      <div className="h-4 bg-secondary rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : enrollments?.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-card border border-border">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No enrolled courses</h3>
                  <p className="text-muted-foreground mb-4">Browse our catalog and enroll in a course</p>
                  <Button onClick={() => setActiveTab("browse")}>Browse Courses</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments?.map((enrollment) => {
                    const isPending = enrollment.payment_status === 'pending';
                    const isRejected = enrollment.payment_status === 'rejected';
                    const isApproved = enrollment.payment_status === 'approved';

                    return (
                      <Link
                        key={enrollment.id}
                        to={`/course/${enrollment.course_id}`}
                        className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={enrollment.course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                            alt={enrollment.course.title}
                            className="w-full h-40 object-cover"
                          />
                          {!isApproved && (
                            <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
                              <div className="text-center text-primary-foreground">
                                <Lock className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">
                                  {isPending ? "Payment Pending" : "Payment Rejected"}
                                </p>
                              </div>
                            </div>
                          )}
                          {isApproved && (
                            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="accent">
                                <Play className="w-4 h-4" />
                                Continue Learning
                              </Button>
                            </div>
                          )}
                          {enrollment.status === 'completed' && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            </div>
                          )}
                          {isPending && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            </div>
                          )}
                          {isRejected && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h4 className="font-semibold text-foreground mb-1">{enrollment.course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-4">{enrollment.course.instructor_name}</p>
                          {isApproved && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-primary">{enrollment.progress}%</span>
                              </div>
                              <Progress value={enrollment.progress || 0} className="h-2" />
                            </div>
                          )}
                          {!isApproved && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {isPending ? "Waiting for payment approval" : "Please re-enroll with valid payment"}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "browse" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Discover new courses to advance your skills</p>
              {coursesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl bg-card border border-border p-6 animate-pulse">
                      <div className="h-40 bg-secondary rounded-xl mb-4" />
                      <div className="h-4 bg-secondary rounded mb-2" />
                      <div className="h-4 bg-secondary rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : availableCourses.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-card border border-border">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">You're enrolled in all courses!</h3>
                  <p className="text-muted-foreground">Check back later for new courses</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                          alt={course.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {course.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
                              {course.category}
                            </span>
                          </div>
                        )}
                        {course.level && (
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                              {course.level}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor_name}</p>
                        {course.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-foreground">
                            ${Number(course.price).toFixed(2)}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setEnrollDialogOpen(true);
                            }}
                          >
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Your earned certificates</p>
              {enrollments?.filter(e => e.progress === 100).length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-card border border-border">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground">Complete a course to earn your first certificate</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments?.filter(e => e.progress === 100).map((enrollment) => (
                    <div key={enrollment.id} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                      <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground text-center mb-2">{enrollment.course.title}</h4>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Completed on {new Date(enrollment.completed_at || enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                      <Button
                        className="w-full gap-2"
                        onClick={() => {
                          setSelectedCertificate({
                            courseTitle: enrollment.course.title,
                            completionDate: enrollment.completed_at || enrollment.enrolled_at,
                          });
                          setCertificateDialogOpen(true);
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        Generate Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input value={user?.user_metadata?.full_name || ''} disabled />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enrollment Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              Confirm your enrollment in this course
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="py-4">
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedCourse.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                  alt={selectedCourse.title}
                  className="w-full h-40 object-cover"
                />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{selectedCourse.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{selectedCourse.instructor_name}</p>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                <span className="text-muted-foreground">Course Price</span>
                <span className="text-2xl font-bold text-foreground">${Number(selectedCourse.price).toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnroll} disabled={enrollInCourse.isPending}>
              {enrollInCourse.isPending ? "Enrolling..." : "Confirm Enrollment"}
            </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      {selectedCertificate && (
        <CourseCertificate
          open={certificateDialogOpen}
          onOpenChange={setCertificateDialogOpen}
          studentName={user?.user_metadata?.full_name || user?.email || "Student"}
          courseTitle={selectedCertificate.courseTitle}
          completionDate={selectedCertificate.completionDate}
          adminSignature={certificateSettings?.signature_name}
          logoUrl={certificateSettings?.logo_url}
          organizationName={certificateSettings?.organization_name}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
