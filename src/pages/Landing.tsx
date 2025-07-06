import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";

// Location Pin SVG with animated floating
const LocationPin = ({ className = "", size = 48, animate = false }) => (
  <svg
    className={className + (animate ? " animate-bounce-slow" : "")}
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={animate ? { filter: "drop-shadow(0 8px 24px #31C35855)" } : {}}
  >
    <ellipse cx="24" cy="41" rx="8" ry="3" fill="#31C358" fillOpacity="0.2" />
    <path
      d="M24 44c-7-8-14-16-14-24A14 14 0 1 1 38 20c0 8-7 16-14 24z"
      fill="#fff"
      stroke="#31C358"
      strokeWidth="3"
    />
    <circle cx="24" cy="20" r="6" fill="#31C358" />
  </svg>
);

// Features list for the webapp
const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#31C358]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Report Lost/Found",
    desc: "Easily report lost or found items with details and photos.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#31C358]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2 2 4-4" />
      </svg>
    ),
    title: "Smart Search",
    desc: "Search and filter items by location, date, or category.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#31C358]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
      </svg>
    ),
    title: "Community Support",
    desc: "Get help from the community and receive instant notifications.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#31C358]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M16 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="6" width="8" height="6" rx="2" />
      </svg>
    ),
    title: "Secure Messaging",
    desc: "Chat safely to arrange item returns.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#31C358]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Instant Notifications",
    desc: "Get notified when your item is matched or found.",
  },
];

// Section animation hook
function useScrollAnimation(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

type SectionProps = { children: React.ReactNode; className?: string };
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "" }, ref) => {
    const localRef = useRef<HTMLElement | null>(null);
    const sectionRef = (ref as React.RefObject<HTMLElement | null>) || localRef;
    const visible = useScrollAnimation(sectionRef);
    return (
      <section
        ref={sectionRef}
        className={`transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } ${className}`}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

const LandingPage = () => {
  // Section refs for scrolling
  const heroRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const whyChooseRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Close mobile menu on link click
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#31C358" }}
    >
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#31C358]/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <LocationPin className="w-8 h-8" size={32} />
            <span
              className="font-bold"
              onClick={() => scrollToSection(heroRef)}
              style={{ color: "#31C358", cursor: "pointer" }}
            >
              FindIt
            </span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="font-medium hover:underline transition"
              style={{ color: "#31C358" }}
            >
              What's Included
            </button>
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="font-medium hover:underline transition"
              style={{ color: "#31C358" }}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection(whyChooseRef)}
              className="font-medium hover:underline transition"
              style={{ color: "#31C358" }}
            >
              Why Choose
            </button>
            <Link
              to="/auth/login"
              className="font-medium hover:underline"
              style={{ color: "#31C358" }}
            >
              Login
            </Link>
            <Button
              className="rounded-full px-6 py-2 text-sm text-white border-2 border-[#31C358]"
              style={{ background: "#31C358" }}
              asChild
            >
              <Link to="/auth/signup">Sign Up</Link>
            </Button>
          </div>
          {/* Mobile nav toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-2xl p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#31C358]"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span>{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        {/* Mobile nav menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 shadow-lg border-t border-[#31C358]/20 px-4 py-4 flex flex-col gap-4 animate-in fade-in duration-500">
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="font-medium hover:underline transition text-left"
              style={{ color: "#31C358" }}
            >
              What's Included
            </button>
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="font-medium hover:underline transition text-left"
              style={{ color: "#31C358" }}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection(whyChooseRef)}
              className="font-medium hover:underline transition text-left"
              style={{ color: "#31C358" }}
            >
              Why Choose
            </button>
            <Link
              to="/auth/login"
              className="font-medium hover:underline text-left"
              style={{ color: "#31C358" }}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Button
              className="rounded-full px-6 py-2 text-sm text-white border-2 border-[#31C358] w-full"
              style={{ background: "#31C358" }}
              asChild
            >
              <Link to="/auth/signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section with animated logo and illustration */}
      <Section
        ref={heroRef}
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-36 relative overflow-hidden bg-gradient-to-br from-[#31C358] via-[#31C358] to-[#43e97b]"
      >
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative gradient shapes */}
          <div className="absolute -top-32 -left-32 w-72 h-72 md:w-96 md:h-96 bg-[#fff]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 md:w-[32rem] md:h-[32rem] bg-[#fff]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 md:gap-8 order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-2 md:mb-4 text-white drop-shadow-lg">
              FindIt: Lost & Found, Reimagined
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90">
              Instantly report, search, and recover lost items with a vibrant,
              helpful community.
              <br />
              Experience the modern way to turn lost into found!
            </p>
            <Button
              className="rounded-full px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-bold shadow-lg text-white border-2 border-white w-full sm:w-auto"
              style={{ background: "#31C358" }}
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          {/* Illustration or image */}
          <div className="flex-1 flex items-center justify-center relative order-1 md:order-2 mb-8 md:mb-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Map_pin_icon_green.svg/752px-Map_pin_icon_green.svg.png"
              alt="FindIt Illustration"
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl rounded-3xl border-4 border-white/30 bg-white/10"
              loading="lazy"
            />
            {/* Optionally, add more floating shapes for depth */}
            <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-[#31C358]/30 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/30 rounded-full blur-xl" />
          </div>
        </div>
      </Section>

      {/* Features List Section (interactive) */}
      <Section
        ref={featuresRef}
        className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
          What's Included
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 bg-white/90 rounded-xl p-6 shadow-md hover:scale-105 hover:shadow-xl transition-transform cursor-pointer group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#31C35822] group-hover:bg-[#31C35833] transition-colors">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-xl font-bold mb-1 text-[#31C358] group-hover:underline">
                  {feature.title}
                </h3>
                <p className="text-[#31C358] text-base">{feature.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* How It Works Section */}
      <Section
        ref={howItWorksRef}
        className="w-full max-w-5xl mx-auto px-4 py-16 md:py-24"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 mb-2">
              <LocationPin className="w-10 h-10" size={40} />
            </span>
            <h4 className="text-xl font-bold text-white">Report</h4>
            <p className="text-white/90 text-base text-center max-w-xs">
              Post a lost or found item in seconds.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 mb-2">
              <svg
                className="w-10 h-10 text-[#31C358]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
            </span>
            <h4 className="text-xl font-bold text-white">Search</h4>
            <p className="text-white/90 text-base text-center max-w-xs">
              Browse and filter all reported items.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 mb-2">
              <svg
                className="w-10 h-10 text-[#31C358]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M16 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="6" width="8" height="6" rx="2" />
              </svg>
            </span>
            <h4 className="text-xl font-bold text-white">Connect</h4>
            <p className="text-white/90 text-base text-center max-w-xs">
              Chat and arrange to return items safely.
            </p>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section
        ref={whyChooseRef}
        className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
          Why Choose FindIt?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/90 rounded-xl p-6 shadow-md flex flex-col gap-2">
            <span className="text-[#31C358] font-bold text-lg">
              Fast & Easy
            </span>
            <span className="text-[#31C358]">
              No more paperwork or waiting. Report and search instantly.
            </span>
          </div>
          <div className="bg-white/90 rounded-xl p-6 shadow-md flex flex-col gap-2">
            <span className="text-[#31C358] font-bold text-lg">
              Safe & Secure
            </span>
            <span className="text-[#31C358]">
              Your data and chats are protected and private.
            </span>
          </div>
          <div className="bg-white/90 rounded-xl p-6 shadow-md flex flex-col gap-2">
            <span className="text-[#31C358] font-bold text-lg">
              Community Driven
            </span>
            <span className="text-[#31C358]">
              Help others and get help from a vibrant community.
            </span>
          </div>
          <div className="bg-white/90 rounded-xl p-6 shadow-md flex flex-col gap-2">
            <span className="text-[#31C358] font-bold text-lg">
              Mobile Friendly
            </span>
            <span className="text-[#31C358]">
              Use FindIt on any device, anywhere, anytime.
            </span>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-white bg-[#31C358]">
        &copy; {new Date().getFullYear()} FindIt. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
