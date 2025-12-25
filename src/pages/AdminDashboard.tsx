import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
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
import { toast } from "sonner";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BookOpen, label: "Courses", path: "/admin/courses" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const stats = [
  { label: "Total Users", value: "12,453", change: "+12%", icon: Users, color: "primary" },
  { label: "Active Courses", value: "156", change: "+8%", icon: BookOpen, color: "accent" },
  { label: "Revenue", value: "$84,230", change: "+23%", icon: DollarSign, color: "primary" },
  { label: "Enrollments", value: "3,847", change: "+15%", icon: GraduationCap, color: "accent" },
];

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active", avatar: "JD", courses: 5 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Instructor", status: "Active", avatar: "JS", courses: 12 },
  { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "Student", status: "Inactive", avatar: "MW", courses: 3 },
  { id: 4, name: "Sarah Connor", email: "sarah@example.com", role: "Student", status: "Active", avatar: "SC", courses: 8 },
];

const courses = [
  { id: 1, title: "Web Development Bootcamp", instructor: "Jane Smith", students: 2345, price: 89.99, status: "Published" },
  { id: 2, title: "UI/UX Fundamentals", instructor: "Mike Chen", students: 1234, price: 69.99, status: "Published" },
  { id: 3, title: "Python for Data Science", instructor: "Emily Roberts", students: 3456, price: 99.99, status: "Draft" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const location = useLocation();

  const handleEditUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    toast.success("User deleted successfully");
  };

  const handleSaveUser = () => {
    setEditUserOpen(false);
    toast.success("User updated successfully");
  };

  const handleAddCourse = () => {
    setAddCourseOpen(false);
    toast.success("Course created successfully");
  };

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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.label.toLowerCase();
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label.toLowerCase())}
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
                {stats.map((stat, index) => (
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
                    {users.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Top Courses</h3>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${course.price}</p>
                          <p className="text-sm text-muted-foreground">{course.students} students</p>
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
                <p className="text-muted-foreground">Manage all user accounts</p>
                <Button>
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>

              <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Courses</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.role}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.courses}</td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage all courses</p>
                <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4" />
                      Upload Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Upload New Course</DialogTitle>
                      <DialogDescription>
                        Add a new course to the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" placeholder="Enter course title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input id="instructor" placeholder="Instructor name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" placeholder="99.99" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Course description..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddCourseOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCourse}>Create Course</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === "Published" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-accent/10 text-accent-foreground"
                      }`}>
                        {course.status}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">${course.price}</span>
                      <span className="text-sm text-muted-foreground">{course.students} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input id="adminName" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input id="adminEmail" type="email" defaultValue="admin@learnhub.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <Button onClick={() => toast.success("Settings saved!")}>Save Changes</Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Platform Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="LearnHub" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" type="email" defaultValue="support@learnhub.com" />
                  </div>
                  <Button onClick={() => toast.success("Platform settings saved!")}>Update Platform</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input id="userName" defaultValue={selectedUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input id="userEmail" type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Input id="userRole" defaultValue={selectedUser.role} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
