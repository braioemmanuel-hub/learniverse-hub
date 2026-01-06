import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedHeroBannerProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

const AnimatedHeroBanner = ({
  badge = "Trusted by 50,000+ learners worldwide",
  title = "Unlock Your Potential with World-Class Learning",
  subtitle = "Master new skills with expert-led courses. From coding to design, find everything you need to advance your career.",
  ctaPrimary = "Start Learning Today",
  ctaSecondary = "Browse Courses",
}: AnimatedHeroBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Parse title to highlight "World-Class"
  const renderTitle = () => {
    if (title.includes("World-Class")) {
      const parts = title.split("World-Class");
      return (
        <>
          {parts[0]}
          <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent animate-gradient">
            World-Class
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full animate-spin-slow" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm text-primary text-sm font-medium mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Star className="w-4 h-4 fill-current animate-pulse" />
            <span>{badge}</span>
            <Sparkles className="w-4 h-4 animate-pulse animation-delay-300" />
          </div>

          {/* Title */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-8 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {subtitle}
          </p>

          {/* CTA buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link to="/auth" className="group">
              <Button variant="hero" size="xl" className="relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  {ctaPrimary}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/courses" className="group">
              <Button variant="outline" size="xl" className="backdrop-blur-sm">
                <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                {ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            className={`mt-16 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AnimatedHeroBanner;
