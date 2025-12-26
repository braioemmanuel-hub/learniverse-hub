import { Link } from "react-router-dom";
import { BookOpen, Star, Users, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublishedCourses } from "@/hooks/useCourses";
import { useState } from "react";

const Courses = () => {
  const { data: courses, isLoading } = usePublishedCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(courses?.map((c) => c.category).filter(Boolean))];

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <Link to="/courses" className="text-sm font-medium text-primary transition-colors">
              Courses
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Header */}
      <section className="pt-28 pb-12 px-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore Our Courses</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover courses taught by industry experts to advance your career
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as string)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-card border border-border p-6 animate-pulse">
                  <div className="h-48 bg-secondary rounded-xl mb-4" />
                  <div className="h-4 bg-secondary rounded mb-2" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredCourses?.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses?.map((course) => (
                <div
                  key={course.id}
                  className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor_name}</p>
                    {course.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      {course.duration && (
                        <span className="text-sm text-muted-foreground">{course.duration}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">
                        ${Number(course.price).toFixed(2)}
                      </span>
                      <Link to={`/auth?redirect=/student&enroll=${course.id}`}>
                        <Button size="sm">Enroll Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <p className="text-sm text-muted-foreground">© 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
