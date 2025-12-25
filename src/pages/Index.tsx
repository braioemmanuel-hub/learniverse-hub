import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, ArrowRight, Play, Star, CheckCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    rating: 4.9,
    students: 12453,
    price: 89.99,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    category: "Development",
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    instructor: "Michael Chen",
    rating: 4.8,
    students: 8234,
    price: 79.99,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    category: "Design",
  },
  {
    id: 3,
    title: "Data Science with Python",
    instructor: "Emily Roberts",
    rating: 4.9,
    students: 15678,
    price: 99.99,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    category: "Data Science",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with thousands of learners worldwide",
  },
  {
    icon: Award,
    title: "Certified Credentials",
    description: "Earn recognized certificates upon completion",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 50,000+ learners worldwide</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Unlock Your Potential with{" "}
              <span className="text-primary">World-Class</span> Learning
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master new skills with expert-led courses. From coding to design, 
              find everything you need to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                Start Learning Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`p-6 rounded-2xl bg-card shadow-soft border border-border/50 animate-fade-up animation-delay-${(index + 1) * 100}`}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Courses</h2>
              <p className="text-muted-foreground">Explore our most enrolled courses</p>
            </div>
            <Button variant="outline">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div 
                key={course.id}
                className={`group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up animation-delay-${(index + 1) * 100}`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">${course.price}</span>
                    <Button size="sm">Enroll Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-3xl gradient-hero p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of learners who have already taken the first step. 
                Start your learning journey today with unlimited access.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" size="lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="glass" size="lg">
                  Browse Courses
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">LearnHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
