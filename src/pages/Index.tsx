import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight, 
  Play, 
  Star, 
  CheckCircle, 
  Sparkles,
  Target,
  TrendingUp,
  Globe,
  MessageSquare,
  Clock,
  Shield
} from "lucide-react";
import { usePublishedCourses } from "@/hooks/useCourses";
import { useLandingContent } from "@/hooks/useLandingContent";

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

const benefits = [
  {
    icon: Target,
    title: "Personalized Learning Paths",
    description: "AI-powered recommendations tailored to your goals and skill level",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description: "Flexible schedules that fit your busy lifestyle",
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description: "Get help whenever you need it from our expert team",
  },
  {
    icon: Shield,
    title: "Money-Back Guarantee",
    description: "30-day refund policy if you're not satisfied",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "LearnHub transformed my career. The courses are practical and the instructors are amazing.",
  },
  {
    name: "Michael Chen",
    role: "Product Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "I went from beginner to professional in just 6 months. Highly recommend!",
  },
  {
    name: "Emily Roberts",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote: "The community here is incredible. I've made connections that will last a lifetime.",
  },
];

const stats = [
  { value: "50K+", label: "Active Learners" },
  { value: "200+", label: "Expert Instructors" },
  { value: "500+", label: "Courses Available" },
  { value: "95%", label: "Success Rate" },
];

const Index = () => {
  const { data: courses, isLoading } = usePublishedCourses();
  const { data: content } = useLandingContent();
  const displayCourses = courses?.slice(0, 3) || [];

  // Default content fallbacks
  const heroContent = content?.hero || {
    title: "Unlock Your Potential with World-Class Learning",
    subtitle: "Master new skills with expert-led courses. From coding to design, find everything you need to advance your career.",
    badge: "Trusted by 50,000+ learners worldwide",
    cta_primary: "Start Learning Today",
    cta_secondary: "Browse Courses",
  };

  const statsContent = content?.stats || stats;
  const featuresContent = content?.features || { title: "Why Choose LearnHub?", subtitle: "We're committed to providing the best learning experience possible", items: features.map(f => ({ title: f.title, description: f.description })) };
  const testimonialsContent = content?.testimonials || { title: "What Our Students Say", subtitle: "Join thousands of satisfied learners who have transformed their careers", items: testimonials };
  const ctaContent = content?.cta || { title: "Ready to Transform Your Career?", subtitle: "Join thousands of learners who have already taken the first step. Start your learning journey today with unlimited access.", button_text: "Get Started Free" };

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
            <Link to="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>{heroContent.badge}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              {heroContent.title.includes("World-Class") ? (
                <>
                  {heroContent.title.split("World-Class")[0]}
                  <span className="text-primary">World-Class</span>
                  {heroContent.title.split("World-Class")[1]}
                </>
              ) : (
                heroContent.title
              )}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="hero" size="xl">
                  {heroContent.cta_primary}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="xl">
                  <Play className="w-5 h-5" />
                  {heroContent.cta_secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-card border-y border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsContent.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{featuresContent.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {featuresContent.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuresContent.items?.map((feature, index) => {
              const IconComponent = features[index]?.icon || BookOpen;
              return (
                <div 
                  key={feature.title}
                  className={`p-6 rounded-2xl bg-card shadow-soft border border-border/50 animate-fade-up animation-delay-${(index + 1) * 100}`}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Courses</h2>
              <p className="text-muted-foreground">Explore our most enrolled courses</p>
            </div>
            <Link to="/courses">
              <Button variant="outline">
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-card border border-border p-6 animate-pulse">
                  <div className="h-48 bg-secondary rounded-xl mb-4" />
                  <div className="h-4 bg-secondary rounded mb-2" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : displayCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Courses Coming Soon</h3>
              <p className="text-muted-foreground">We're working on adding amazing courses for you</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {displayCourses.map((course, index) => (
                <div 
                  key={course.id}
                  className={`group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up animation-delay-${(index + 1) * 100}`}
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
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor_name}</p>
                    {course.duration && (
                      <p className="text-sm text-muted-foreground mb-4">{course.duration}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">${Number(course.price).toFixed(2)}</span>
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

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Premium Experience
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground mb-8">
                We've designed our platform with your success in mind. From personalized learning 
                paths to 24/7 support, we've got you covered every step of the way.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                alt="Students learning"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-card shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">95%</p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{testimonialsContent.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {testimonialsContent.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsContent.items?.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className={`p-6 rounded-2xl bg-card border border-border shadow-soft animate-fade-up animation-delay-${(index + 1) * 100}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Community */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Global Reach
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join Our Global Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Learners from over 150 countries trust LearnHub for their professional development.
            Be part of a community that's shaping the future of education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Join Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More About Us
              </Button>
            </Link>
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
                <Link to="/auth">
                  <Button variant="accent" size="lg">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="glass" size="lg">
                    Browse Courses
                  </Button>
                </Link>
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
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">LearnHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with quality education and expert instruction.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">Courses</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
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
