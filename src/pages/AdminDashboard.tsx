import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Shield,
  ShieldCheck,
  FileText,
  CreditCard,
  Layout,
  Award,
  Upload,
  Trash2 as TrashIcon,
} from "lucide-react";
import LessonManager from "@/components/admin/LessonManager";
import EnrollmentManager from "@/components/admin/EnrollmentManager";
import LandingPageEditor from "@/components/admin/LandingPageEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAllCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/useCourses";
import { useAllUsers, useUpdateUserRole, useUpdateProfile, useDeleteUser } from "@/hooks/useUsers";
import { useAdminStats } from "@/hooks/useStats";
import { 
  useCertificateSettings, 
  useUpdateCertificateSettings, 
  uploadCertificateLogo,
  deleteCertificateLogo,
  type CertificateSettings 
} from "@/hooks/useCertificateSettings";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Users", id: "users" },
  { icon: BookOpen, label: "Courses", id: "courses" },
  { icon: CreditCard, label: "Enrollments", id: "enrollments" },
  { icon: Layout, label: "Landing Page", id: "landing" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [managingLessonsCourse, setManagingLessonsCourse] = useState<{ id: string; title: string } | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor_name: "",
    description: "",
    price: 0,
    category: "",
    level: "Beginner",
    duration: "",
    is_published: false,
  });
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [certSettings, setCertSettings] = useState<CertificateSettings>({
    signature_name: "Heros Academy Administration",
    logo_url: null,
    organization_name: "Heros Academy",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useAllCourses();
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: certificateSettings, isLoading: certSettingsLoading } = useCertificateSettings();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const updateUserRole = useUpdateUserRole();
  const updateProfile = useUpdateProfile();
  const deleteUser = useDeleteUser();
  const updateCertSettings = useUpdateCertificateSettings();
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync certificate settings from database
  useEffect(() => {
    if (certificateSettings) {
      setCertSettings(certificateSettings);
    }
  }, [certificateSettings]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleAddCourse = async () => {
    try {
      await createCourse.mutateAsync({
        ...newCourse,
        created_by: user?.id,
      });
      setAddCourseOpen(false);
      setNewCourse({
        title: "",
        instructor_name: "",
        description: "",
        price: 0,
        category: "",
        level: "Beginner",
        duration: "",
        is_published: false,
      });
      toast.success("Course created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create course");
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    try {
      await updateCourse.mutateAsync({
        id: selectedCourse.id,
        updates: {
          title: selectedCourse.title,
          instructor_name: selectedCourse.instructor_name,
          description: selectedCourse.description,
          price: selectedCourse.price,
          category: selectedCourse.category,
          level: selectedCourse.level,
          duration: selectedCourse.duration,
          is_published: selectedCourse.is_published,
        },
      });
      setEditCourseOpen(false);
      setSelectedCourse(null);
      toast.success("Course updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update course");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id);
      toast.success("Course deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'admin' | 'student') => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await updateProfile.mutateAsync({
        id: selectedUser.id,
        updates: {
          full_name: selectedUser.full_name,
          email: selectedUser.email,
        },
      });
      setEditUserOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser.mutateAsync(userId);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const statsDisplay = [
    { 
      label: "Total Users", 
      value: stats?.totalUsers?.toString() || "0", 
      change: "+12%", 
      icon: Users, 
      color: "primary" 
    },
    { 
      label: "Active Courses", 
      value: stats?.publishedCourses?.toString() || "0", 
      change: "+8%", 
      icon: BookOpen, 
      color: "accent" 
    },
    { 
      label: "Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`, 
      change: "+23%", 
      icon: DollarSign, 
      color: "primary" 
    },
    { 
      label: "Enrollments", 
      value: stats?.totalEnrollments?.toString() || "0", 
      change: "+15%", 
      icon: GraduationCap, 
      color: "accent" 
    },
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
                <span className="font-bold text-foreground">Heros Academy</span>
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.label}
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
            <h1 className="text-xl font-semibold text-foreground capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-secondary border-0"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsDisplay.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`p-6 rounded-2xl bg-card border border-border shadow-soft animate-fade-up animation-delay-${(index + 1) * 100}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color === "primary" ? "gradient-primary" : "gradient-accent"} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Users</h3>
                  <div className="space-y-4">
                    {usersLoading ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : users?.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                              {user.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-accent/10 text-accent-foreground" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Top Courses</h3>
                  <div className="space-y-4">
                    {coursesLoading ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : courses?.slice(0, 4).map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.instructor_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${Number(course.price).toFixed(2)}</p>
                          <span className={`text-xs ${course.is_published ? 'text-primary' : 'text-muted-foreground'}`}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage all user accounts and roles</p>
              </div>

              <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Enrollments</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Joined</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          Loading users...
                        </td>
                      </tr>
                    ) : users?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    ) : users?.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                                {user.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                            user.role === "admin" 
                              ? "bg-accent/10 text-accent-foreground" 
                              : "bg-primary/10 text-primary"
                          }`}>
                            {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : null}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.enrollmentCount}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser({ ...user });
                                setEditUserOpen(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)}>
                                <Shield className="w-4 h-4 mr-2" />
                                {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit User Dialog */}
              <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Update user information
                    </DialogDescription>
                  </DialogHeader>
                  {selectedUser && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-name">Full Name</Label>
                        <Input
                          id="user-name"
                          placeholder="Enter full name"
                          value={selectedUser.full_name || ''}
                          onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          placeholder="Enter email"
                          value={selectedUser.email || ''}
                          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateUser}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "courses" && !managingLessonsCourse && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage all courses</p>
                <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4" />
                      Create Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Course</DialogTitle>
                      <DialogDescription>
                        Add a new course to the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input 
                          id="title" 
                          placeholder="Enter course title"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor Name</Label>
                        <Input 
                          id="instructor" 
                          placeholder="Instructor name"
                          value={newCourse.instructor_name}
                          onChange={(e) => setNewCourse({ ...newCourse, instructor_name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            placeholder="99.99"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input 
                            id="duration" 
                            placeholder="e.g., 10 hours"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input 
                            id="category" 
                            placeholder="e.g., Development"
                            value={newCourse.category}
                            onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <Select 
                            value={newCourse.level}
                            onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Course description..."
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="published">Publish immediately</Label>
                        <Switch
                          id="published"
                          checked={newCourse.is_published}
                          onCheckedChange={(checked) => setNewCourse({ ...newCourse, is_published: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddCourseOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCourse} disabled={createCourse.isPending}>
                        {createCourse.isPending ? "Creating..." : "Create Course"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {coursesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card border border-border animate-pulse">
                      <div className="h-4 bg-secondary rounded mb-4" />
                      <div className="h-4 bg-secondary rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : courses?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first course to get started</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses?.map((course) => (
                    <div key={course.id} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.is_published
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {course.is_published ? "Published" : "Draft"}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setManagingLessonsCourse({ id: course.id, title: course.title });
                            }}>
                              <FileText className="w-4 h-4 mr-2" />
                              Manage Lessons
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedCourse({ ...course });
                              setEditCourseOpen(true);
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{course.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{course.instructor_name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          ${Number(course.price).toFixed(2)}
                        </span>
                        {course.category && (
                          <span className="text-xs text-muted-foreground">{course.category}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Course Dialog */}
              <Dialog open={editCourseOpen} onOpenChange={setEditCourseOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                    <DialogDescription>
                      Update course details
                    </DialogDescription>
                  </DialogHeader>
                  {selectedCourse && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Course Title</Label>
                        <Input 
                          id="edit-title" 
                          value={selectedCourse.title}
                          onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-instructor">Instructor Name</Label>
                        <Input 
                          id="edit-instructor" 
                          value={selectedCourse.instructor_name}
                          onChange={(e) => setSelectedCourse({ ...selectedCourse, instructor_name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-price">Price ($)</Label>
                          <Input 
                            id="edit-price" 
                            type="number"
                            value={selectedCourse.price}
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, price: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-duration">Duration</Label>
                          <Input 
                            id="edit-duration" 
                            value={selectedCourse.duration || ''}
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, duration: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Input 
                            id="edit-category" 
                            value={selectedCourse.category || ''}
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, category: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-level">Level</Label>
                          <Select 
                            value={selectedCourse.level || 'Beginner'}
                            onValueChange={(value) => setSelectedCourse({ ...selectedCourse, level: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea 
                          id="edit-description" 
                          value={selectedCourse.description || ''}
                          onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edit-published">Published</Label>
                        <Switch
                          id="edit-published"
                          checked={selectedCourse.is_published}
                          onCheckedChange={(checked) => setSelectedCourse({ ...selectedCourse, is_published: checked })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateCourse} disabled={updateCourse.isPending}>
                      {updateCourse.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "courses" && managingLessonsCourse && (
            <LessonManager
              course={managingLessonsCourse}
              onBack={() => setManagingLessonsCourse(null)}
            />
          )}

          {activeTab === "enrollments" && <EnrollmentManager />}

          {activeTab === "landing" && <LandingPageEditor />}

          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" value={user?.email || ''} disabled />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Certificate Settings</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signature-name">Signature Name</Label>
                    <Input
                      id="signature-name"
                      placeholder="e.g., John Doe, CEO"
                      value={certSettings.signature_name}
                      onChange={(e) => setCertSettings({ ...certSettings, signature_name: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">This name will appear as the authorized signature on certificates</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization-name">Organization Name</Label>
                    <Input
                      id="organization-name"
                      placeholder="e.g., Heros Academy"
                      value={certSettings.organization_name}
                      onChange={(e) => setCertSettings({ ...certSettings, organization_name: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">This name will appear in the certificate footer</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Certificate Logo</Label>
                    <div className="flex items-start gap-4">
                      {certSettings.logo_url ? (
                        <div className="relative">
                          <img
                            src={certSettings.logo_url}
                            alt="Certificate logo"
                            className="w-20 h-20 object-contain border border-border rounded-lg bg-white p-2"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6"
                            onClick={async () => {
                              try {
                                if (certSettings.logo_url) {
                                  await deleteCertificateLogo(certSettings.logo_url);
                                }
                                setCertSettings({ ...certSettings, logo_url: null });
                                toast.success("Logo removed");
                              } catch (error: any) {
                                toast.error(error.message || "Failed to remove logo");
                              }
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-secondary/30">
                          <Award className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingLogo(true);
                            try {
                              const url = await uploadCertificateLogo(file);
                              setCertSettings({ ...certSettings, logo_url: url });
                              toast.success("Logo uploaded");
                            } catch (error: any) {
                              toast.error(error.message || "Failed to upload logo");
                            } finally {
                              setUploadingLogo(false);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingLogo ? "Uploading..." : "Upload Logo"}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Recommended: Square image, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={async () => {
                      try {
                        await updateCertSettings.mutateAsync(certSettings);
                        toast.success("Certificate settings saved");
                      } catch (error: any) {
                        toast.error(error.message || "Failed to save settings");
                      }
                    }}
                    disabled={updateCertSettings.isPending}
                  >
                    {updateCertSettings.isPending ? "Saving..." : "Save Certificate Settings"}
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Platform Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Allow new registrations</p>
                      <p className="text-sm text-muted-foreground">Enable or disable new user sign-ups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts for new enrollments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
