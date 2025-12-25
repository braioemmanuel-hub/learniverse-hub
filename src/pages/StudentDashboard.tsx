import { useState } from "react";
import { Link } from "react-router-dom";
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
  Star,
  Calendar,
  FileText,
  HelpCircle,
  MessageSquare,
  CreditCard,
  User,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Award, label: "Certificates", id: "certificates" },
  { icon: Calendar, label: "Schedule", id: "schedule" },
  { icon: FileText, label: "Notes", id: "notes" },
  { icon: MessageSquare, label: "Discussions", id: "discussions" },
  { icon: CreditCard, label: "Payments", id: "payments" },
  { icon: HelpCircle, label: "Help & Support", id: "support" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const enrolledCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    progress: 65,
    totalLessons: 48,
    completedLessons: 31,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    nextLesson: "Building REST APIs",
    duration: "2h 30m left",
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    instructor: "Michael Chen",
    progress: 30,
    totalLessons: 36,
    completedLessons: 11,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    nextLesson: "Color Theory Basics",
    duration: "8h remaining",
  },
  {
    id: 3,
    title: "Data Science with Python",
    instructor: "Emily Roberts",
    progress: 85,
    totalLessons: 52,
    completedLessons: 44,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    nextLesson: "Machine Learning Intro",
    duration: "1h 15m left",
  },
];

const recentActivity = [
  { type: "completed", course: "Web Development", lesson: "JavaScript Fundamentals", time: "2 hours ago" },
  { type: "started", course: "UI/UX Design", lesson: "User Research Methods", time: "5 hours ago" },
  { type: "certificate", course: "Python Basics", time: "1 day ago" },
  { type: "enrolled", course: "Machine Learning 101", time: "2 days ago" },
];

const upcomingSchedule = [
  { title: "Live Session: Q&A with Sarah", course: "Web Development", time: "Today, 3:00 PM", type: "live" },
  { title: "Assignment Due: Project 3", course: "Data Science", time: "Tomorrow, 11:59 PM", type: "assignment" },
  { title: "Group Discussion", course: "UI/UX Design", time: "Wed, 2:00 PM", type: "discussion" },
];

const certificates = [
  { id: 1, title: "Python Basics", date: "Dec 15, 2024", grade: "A" },
  { id: 2, title: "HTML & CSS Fundamentals", date: "Nov 20, 2024", grade: "A+" },
];

const payments = [
  { id: 1, course: "Web Development Bootcamp", amount: 89.99, date: "Dec 1, 2024", status: "Completed" },
  { id: 2, course: "UI/UX Design Masterclass", amount: 79.99, date: "Nov 15, 2024", status: "Completed" },
  { id: 3, course: "Data Science with Python", amount: 99.99, date: "Oct 20, 2024", status: "Completed" },
];

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    { label: "Courses Enrolled", value: "6", icon: BookOpen, color: "primary" },
    { label: "Hours Learned", value: "124", icon: Clock, color: "accent" },
    { label: "Certificates", value: "2", icon: Award, color: "primary" },
    { label: "Current Streak", value: "12 days", icon: Zap, color: "accent" },
  ];

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
                  <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">John Student</p>
                  <p className="text-xs text-muted-foreground">Pro Member</p>
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
            <Link to="/">
              <Button variant="ghost" className={`w-full justify-start gap-3 ${!sidebarOpen && "justify-center"}`}>
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Logout</span>}
              </Button>
            </Link>
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
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">JS</AvatarFallback>
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
                    Welcome back, John! 👋
                  </h2>
                  <p className="text-primary-foreground/80 mb-4">
                    You're on a 12-day learning streak! Keep it up.
                  </p>
                  <Button variant="accent" size="sm">
                    Continue Learning
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
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Continue Learning</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("courses")}>
                    View All
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="accent" size="sm">
                            <Play className="w-4 h-4" />
                            Continue
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{course.completedLessons}/{course.totalLessons} lessons</span>
                            <span className="font-medium text-primary">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">Next: {course.nextLesson}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity & Schedule */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "completed" ? "bg-primary/10" :
                          activity.type === "certificate" ? "bg-accent/10" :
                          "bg-secondary"
                        }`}>
                          {activity.type === "completed" && <CheckCircle className="w-4 h-4 text-primary" />}
                          {activity.type === "started" && <Play className="w-4 h-4 text-muted-foreground" />}
                          {activity.type === "certificate" && <Award className="w-4 h-4 text-accent" />}
                          {activity.type === "enrolled" && <BookOpen className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            {activity.type === "completed" && `Completed "${activity.lesson}"`}
                            {activity.type === "started" && `Started "${activity.lesson}"`}
                            {activity.type === "certificate" && `Earned certificate for ${activity.course}`}
                            {activity.type === "enrolled" && `Enrolled in ${activity.course}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Schedule</h3>
                  <div className="space-y-4">
                    {upcomingSchedule.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          event.type === "live" ? "gradient-accent" :
                          event.type === "assignment" ? "gradient-primary" :
                          "bg-secondary"
                        }`}>
                          {event.type === "live" && <Play className="w-5 h-5 text-primary-foreground" />}
                          {event.type === "assignment" && <FileText className="w-5 h-5 text-primary-foreground" />}
                          {event.type === "discussion" && <MessageSquare className="w-5 h-5 text-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.course}</p>
                          <p className="text-xs text-primary mt-1">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Courses you're enrolled in</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="accent">
                          <Play className="w-4 h-4" />
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold text-foreground mb-1">{course.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{course.completedLessons} of {course.totalLessons} lessons</span>
                          <span className="font-semibold text-primary">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="text-muted-foreground">Next: {course.nextLesson}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Your earned certificates</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center mb-4">
                      <Award className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{cert.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{cert.date}</span>
                      <span className="font-medium text-primary">Grade: {cert.grade}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Download Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Your upcoming events and deadlines</p>
              <div className="space-y-4">
                {upcomingSchedule.map((event, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-card border border-border shadow-soft flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      event.type === "live" ? "gradient-accent" :
                      event.type === "assignment" ? "gradient-primary" :
                      "bg-secondary"
                    }`}>
                      {event.type === "live" && <Play className="w-6 h-6 text-primary-foreground" />}
                      {event.type === "assignment" && <FileText className="w-6 h-6 text-primary-foreground" />}
                      {event.type === "discussion" && <MessageSquare className="w-6 h-6 text-foreground" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{event.time}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        {event.type === "live" ? "Join" : "View Details"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Your payment history</p>
              <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Course</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Amount</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{payment.course}</td>
                        <td className="px-6 py-4 text-foreground">${payment.amount}</td>
                        <td className="px-6 py-4 text-muted-foreground">{payment.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Your course notes</p>
              <div className="p-12 rounded-2xl bg-card border border-border shadow-soft text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-4">Start taking notes while watching courses</p>
                <Button>Create Your First Note</Button>
              </div>
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Course discussions and community</p>
              <div className="p-12 rounded-2xl bg-card border border-border shadow-soft text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Join the conversation</h3>
                <p className="text-muted-foreground mb-4">Connect with fellow learners in course discussions</p>
                <Button>Browse Discussions</Button>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted-foreground">Get help and support</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <HelpCircle className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">FAQs</h3>
                  <p className="text-muted-foreground mb-4">Find answers to commonly asked questions</p>
                  <Button variant="outline">View FAQs</Button>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <MessageSquare className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                  <p className="text-muted-foreground mb-4">Reach out to our support team</p>
                  <Button variant="outline">Send Message</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h3>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">JS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                      <Input defaultValue="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                      <Input defaultValue="Student" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input type="email" defaultValue="john@example.com" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
