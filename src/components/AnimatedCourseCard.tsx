import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";
import { useState, useRef, MouseEvent } from "react";

interface Course {
  id: string;
  title: string;
  instructor_name: string;
  price: number;
  thumbnail_url: string | null;
  category: string | null;
  duration: string | null;
  level?: string | null;
}

interface AnimatedCourseCardProps {
  course: Course;
  index?: number;
}

const AnimatedCourseCard = ({ course, index = 0 }: AnimatedCourseCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (limited to ±15 degrees)
    const rotateXValue = (mouseY / (rect.height / 2)) * -10;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group perspective-1000"
      style={{
        perspective: "1000px",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="relative rounded-2xl bg-card border border-border overflow-hidden shadow-soft transition-all duration-300 ease-out transform-gpu"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shine effect overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 3}% ${50 + rotateX * 3}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Glow effect */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 blur-xl transition-opacity duration-500 ${
            isHovered ? "opacity-30" : ""
          }`}
        />

        {/* Image container */}
        <div className="relative overflow-hidden">
          <img
            src={
              course.thumbnail_url ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"
            }
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-700 ease-out"
            style={{
              transform: `scale(${isHovered ? 1.1 : 1}) translateZ(20px)`,
            }}
          />
          
          {/* Category badge */}
          {course.category && (
            <div
              className="absolute top-3 left-3 transition-transform duration-300"
              style={{
                transform: `translateZ(40px) translate(${rotateY * 0.5}px, ${rotateX * 0.5}px)`,
              }}
            >
              <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm border-0 shadow-lg">
                {course.category}
              </Badge>
            </div>
          )}

          {/* Level badge */}
          {course.level && (
            <div
              className="absolute top-3 right-3 transition-transform duration-300"
              style={{
                transform: `translateZ(40px) translate(${rotateY * 0.5}px, ${rotateX * 0.5}px)`,
              }}
            >
              <Badge variant="outline" className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                {course.level}
              </Badge>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div
          className="relative p-5 bg-card"
          style={{
            transform: "translateZ(30px)",
          }}
        >
          {/* Rating stars (decorative) */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= 4 ? "text-accent fill-accent" : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
          </div>

          {/* Title */}
          <h3
            className="font-semibold text-foreground mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-primary"
            style={{
              transform: `translateZ(10px)`,
            }}
          >
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-muted-foreground mb-3">{course.instructor_name}</p>

          {/* Meta info */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{Math.floor(Math.random() * 500 + 100)} students</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">
                ${Number(course.price).toFixed(2)}
              </span>
              {Number(course.price) > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(Number(course.price) * 1.3).toFixed(2)}
                </span>
              )}
            </div>
            <Link to={`/auth?redirect=/student&enroll=${course.id}`}>
              <Button
                size="sm"
                className="relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Enroll</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transition-transform duration-500 origin-left ${
            isHovered ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default AnimatedCourseCard;
