import React, { useEffect, useMemo, useState, memo, useCallback } from "react";
import { LazyMotion, domAnimation, m as motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  BarChart,
  BookOpen,
  Box,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Filter,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  PieChart,
  Play,
  Presentation,
  Puzzle,
  Rocket,
  Search,
  Sparkles,
  Star,
  Terminal,
  TerminalSquare,
  Twitter,
  Users,
  Video,
  Workflow,
  Wrench,
  X,
  Youtube,
  Zap,
  Shield,
  Database,
  Settings,
  Heart,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Maximize2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Moon,
  Sun,
  Clock,
  PartyPopper,
} from "lucide-react";
import { getPortfolioData, getPortfolioDataAsync, type PortfolioData, type Project } from "../data/portfolioData";

/**
 * ⚡ Salesforce Trailblazer Portfolio
 * Authentic Salesforce theme with characters, colors, and energy
 */

// Icon mapping for dynamic data
const STAT_ICONS: Record<string, React.ElementType> = {
  Award,
  Target,
  Zap,
  Shield,
  Rocket,
  Star,
  Heart,
  CheckCircle,
};

// Icon mapping for project links
const LINK_ICONS: Record<string, React.ElementType> = {
  ExternalLink,
  Github,
  Globe,
  Play,
  FileText,
  BookOpen,
  Video,
  Presentation,
  Download,
  Eye,
  Code2,
  Rocket,
  Linkedin,
  Twitter,
  Youtube,
};

// Icon mapping for project cards
const PROJECT_ICONS: Record<string, React.ElementType> = {
  Workflow,
  Code2,
  Zap,
  Rocket,
  Database,
  Cloud,
  Shield,
  Layers,
  Settings,
  Terminal,
  FileCode,
  GitBranch,
  Box,
  Cpu,
  Globe,
  Users,
  MessageSquare,
  BarChart,
  PieChart,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Wrench,
  Puzzle,
};

// Official Salesforce Colors
const SF = {
  blue: "#00a1e0",
  blueAccessible: "#0082b8", // Darker blue for WCAG AA contrast with white text
  darkBlue: "#032d60",
  navy: "#0d2035",
  cloud: "#1b96ff",
  purple: "#8b5cf6",
  orange: "#ff6b35",
  green: "#10b981",
  yellow: "#ffc107",
  red: "#ea4359",
  white: "#ffffff",
  lightGray: "#f3f3f3",
};

function cx(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const ICONS: Record<string, typeof Sparkles> = {
  Sparkles,
  Workflow,
  Layers,
  Code2,
  GraduationCap,
  Briefcase,
  Wrench,
  TerminalSquare,
  Rocket,
  BookOpen,
  Database,
  Settings,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// Official Salesforce Logo - Exact replica
function SalesforceCloudLogo({ className = "", animate = true, size = "md" }: { className?: string; animate?: boolean; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
  };

  return (
    <motion.svg
      viewBox="0 0 460 320"
      className={cx(sizes[size], "w-auto", className)}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      {/* Official Salesforce Cloud Shape */}
      <path
        d="M191.2 64.5c15.1-15.7 36.2-25.5 59.6-25.5 32.4 0 60.5 18.8 73.9 46.1 10.4-4.5 21.8-7 33.9-7 47.1 0 85.3 38.2 85.3 85.3s-38.2 85.3-85.3 85.3c-6.3 0-12.4-0.7-18.3-2-12.8 21.2-36.1 35.4-62.8 35.4-17.3 0-33.2-6-45.8-16-14.3 19.5-37.3 32.2-63.3 32.2-33.5 0-62-21.2-72.9-50.9-4.7 0.8-9.5 1.2-14.4 1.2-47.1 0-85.3-38.2-85.3-85.3 0-40.1 27.7-73.8 65-83 5.6-38.4 38.6-67.9 78.5-67.9 24.4 0 46.3 11 60.9 28.3z"
        fill="#00A1E0"
      />

      {/* "salesforce" text */}
      <text
        x="230"
        y="185"
        textAnchor="middle"
        fill="white"
        fontSize="58"
        fontWeight="400"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-1"
      >
        sales<tspan fontStyle="italic">f</tspan>orce
      </text>
    </motion.svg>
  );
}

// Astro Character - Salesforce's friendly mascot
function AstroCharacter({ className = "", waving = false }: { className?: string; waving?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 250"
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Astro's body - blue spacesuit */}
      <ellipse cx="100" cy="180" rx="55" ry="50" fill="#00a1e0" />

      {/* Astro's head */}
      <circle cx="100" cy="90" r="55" fill="#00a1e0" />

      {/* Helmet visor */}
      <ellipse cx="100" cy="85" rx="42" ry="38" fill="#032d60" />
      <ellipse cx="100" cy="82" rx="36" ry="32" fill="#1a1a2e" />

      {/* Face */}
      <circle cx="100" cy="85" r="28" fill="#ffd4a3" />

      {/* Eyes */}
      <ellipse cx="88" cy="80" rx="8" ry="10" fill="white" />
      <ellipse cx="112" cy="80" rx="8" ry="10" fill="white" />
      <circle cx="90" cy="82" r="4" fill="#032d60" />
      <circle cx="114" cy="82" r="4" fill="#032d60" />
      <circle cx="91" cy="81" r="1.5" fill="white" />
      <circle cx="115" cy="81" r="1.5" fill="white" />

      {/* Smile */}
      <path
        d="M88 95 Q100 108 112 95"
        stroke="#032d60"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cheeks */}
      <circle cx="78" cy="90" r="5" fill="#ffb6c1" opacity="0.6" />
      <circle cx="122" cy="90" r="5" fill="#ffb6c1" opacity="0.6" />

      {/* Antenna */}
      <line x1="100" y1="35" x2="100" y2="20" stroke="#00a1e0" strokeWidth="4" />
      <motion.circle
        cx="100"
        cy="15"
        r="8"
        fill="#ff6b35"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Arms */}
      <motion.g
        animate={waving ? { rotate: [0, -20, 0] } : undefined}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ transformOrigin: "45px 160px" }}
      >
        <ellipse cx="35" cy="170" rx="18" ry="25" fill="#00a1e0" />
        <circle cx="30" cy="195" r="12" fill="#ffd4a3" />
      </motion.g>
      <ellipse cx="165" cy="170" rx="18" ry="25" fill="#00a1e0" />
      <circle cx="170" cy="195" r="12" fill="#ffd4a3" />

      {/* Boots */}
      <ellipse cx="75" cy="225" rx="20" ry="12" fill="#ff6b35" />
      <ellipse cx="125" cy="225" rx="20" ry="12" fill="#ff6b35" />

      {/* Chest badge */}
      <circle cx="100" cy="165" r="15" fill="white" />
      <path
        d="M92 165 L100 158 L108 165 L100 172 Z"
        fill="#00a1e0"
      />
    </motion.svg>
  );
}

// Codey Character - The bear coder
function CodeyCharacter({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 220"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Body */}
      <ellipse cx="100" cy="160" rx="50" ry="45" fill="#1b96ff" />

      {/* Head */}
      <circle cx="100" cy="80" r="50" fill="#1b96ff" />

      {/* Ears */}
      <circle cx="55" cy="45" r="18" fill="#1b96ff" />
      <circle cx="55" cy="45" r="10" fill="#032d60" />
      <circle cx="145" cy="45" r="18" fill="#1b96ff" />
      <circle cx="145" cy="45" r="10" fill="#032d60" />

      {/* Face/muzzle */}
      <ellipse cx="100" cy="95" rx="28" ry="22" fill="#e8f4fc" />

      {/* Eyes */}
      <ellipse cx="78" cy="70" rx="12" ry="14" fill="white" />
      <ellipse cx="122" cy="70" rx="12" ry="14" fill="white" />
      <circle cx="80" cy="72" r="6" fill="#032d60" />
      <circle cx="124" cy="72" r="6" fill="#032d60" />
      <circle cx="82" cy="70" r="2" fill="white" />
      <circle cx="126" cy="70" r="2" fill="white" />

      {/* Nose */}
      <ellipse cx="100" cy="90" rx="8" ry="6" fill="#032d60" />
      <ellipse cx="98" cy="88" rx="2" ry="1.5" fill="white" opacity="0.5" />

      {/* Mouth */}
      <path
        d="M90 100 Q100 110 110 100"
        stroke="#032d60"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Arms */}
      <ellipse cx="45" cy="155" rx="15" ry="25" fill="#1b96ff" />
      <ellipse cx="155" cy="155" rx="15" ry="25" fill="#1b96ff" />

      {/* Paws */}
      <circle cx="40" cy="180" r="12" fill="#e8f4fc" />
      <circle cx="160" cy="180" r="12" fill="#e8f4fc" />

      {/* Feet */}
      <ellipse cx="75" cy="200" rx="18" ry="12" fill="#e8f4fc" />
      <ellipse cx="125" cy="200" rx="18" ry="12" fill="#e8f4fc" />

      {/* Hoodie strings */}
      <line x1="85" y1="130" x2="85" y2="150" stroke="#032d60" strokeWidth="2" />
      <line x1="115" y1="130" x2="115" y2="150" stroke="#032d60" strokeWidth="2" />
      <circle cx="85" cy="152" r="4" fill="#032d60" />
      <circle cx="115" cy="152" r="4" fill="#032d60" />
    </motion.svg>
  );
}

// Einstein Character - The wise scientist
function EinsteinCharacter({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 220"
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Body - Lab coat */}
      <ellipse cx="100" cy="170" rx="45" ry="40" fill="white" />
      <ellipse cx="100" cy="175" rx="40" ry="35" fill="#f0f0f0" />

      {/* Head */}
      <circle cx="100" cy="75" r="45" fill="#8b5cf6" />

      {/* Wild hair */}
      <ellipse cx="60" cy="50" rx="20" ry="25" fill="white" />
      <ellipse cx="140" cy="50" rx="20" ry="25" fill="white" />
      <ellipse cx="75" cy="35" rx="15" ry="20" fill="white" />
      <ellipse cx="125" cy="35" rx="15" ry="20" fill="white" />
      <ellipse cx="100" cy="30" rx="18" ry="15" fill="white" />

      {/* Face */}
      <circle cx="100" cy="80" r="32" fill="#ffd4a3" />

      {/* Glasses */}
      <circle cx="82" cy="75" r="14" fill="none" stroke="#032d60" strokeWidth="3" />
      <circle cx="118" cy="75" r="14" fill="none" stroke="#032d60" strokeWidth="3" />
      <line x1="96" y1="75" x2="104" y2="75" stroke="#032d60" strokeWidth="3" />
      <line x1="68" y1="72" x2="55" y2="68" stroke="#032d60" strokeWidth="3" />
      <line x1="132" y1="72" x2="145" y2="68" stroke="#032d60" strokeWidth="3" />

      {/* Eyes behind glasses */}
      <circle cx="82" cy="75" r="5" fill="#032d60" />
      <circle cx="118" cy="75" r="5" fill="#032d60" />
      <circle cx="84" cy="73" r="1.5" fill="white" />
      <circle cx="120" cy="73" r="1.5" fill="white" />

      {/* Mustache */}
      <path
        d="M80 95 Q90 88 100 95 Q110 88 120 95"
        fill="white"
      />

      {/* Smile */}
      <path
        d="M85 100 Q100 112 115 100"
        stroke="#032d60"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Arms */}
      <ellipse cx="50" cy="165" rx="12" ry="22" fill="white" />
      <ellipse cx="150" cy="165" rx="12" ry="22" fill="white" />

      {/* Hands */}
      <circle cx="45" cy="185" r="10" fill="#ffd4a3" />
      <circle cx="155" cy="185" r="10" fill="#ffd4a3" />

      {/* Lightbulb (idea!) */}
      <motion.g
        animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ellipse cx="155" cy="50" rx="12" ry="15" fill="#ffc107" />
        <rect x="150" y="62" width="10" height="8" fill="#666" rx="2" />
        <line x1="155" y1="35" x2="155" y2="28" stroke="#ffc107" strokeWidth="2" />
        <line x1="145" y1="40" x2="138" y2="35" stroke="#ffc107" strokeWidth="2" />
        <line x1="165" y1="40" x2="172" y2="35" stroke="#ffc107" strokeWidth="2" />
      </motion.g>
    </motion.svg>
  );
}


// Animated Salesforce Background
function SalesforceBackground({ reduced, theme = 'night' }: { reduced: boolean; theme?: 'night' | 'morning' }) {
  const isNight = theme === 'night';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000">
      {/* Sky gradient */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isNight
            ? `linear-gradient(180deg, ${SF.darkBlue} 0%, ${SF.navy} 30%, #0a1628 60%, #050d18 100%)`
            : `linear-gradient(180deg, #0ea5e9 0%, #38bdf8 30%, #a5f3fc 70%, #f0f9ff 100%)`, // Bright morning sky
        }}
      />

      {/* Animated Salesforce clouds */}
      {[
        { left: -10, top: 5, size: 180, duration: 80, delay: 0, opacity: isNight ? 0.08 : 0.4 },
        { left: 15, top: 15, size: 120, duration: 70, delay: 10, opacity: isNight ? 0.06 : 0.3 },
        { left: 40, top: 8, size: 150, duration: 90, delay: 5, opacity: isNight ? 0.07 : 0.35 },
        { left: 65, top: 18, size: 100, duration: 75, delay: 15, opacity: isNight ? 0.05 : 0.25 },
        { left: 85, top: 10, size: 140, duration: 85, delay: 8, opacity: isNight ? 0.06 : 0.3 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
          }}
          animate={reduced ? undefined : {
            x: ["0%", "120%"],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: "linear",
            delay: cloud.delay,
          }}
        >
          {/* Official Salesforce Cloud Shape */}
          <svg
            width={cloud.size}
            height={cloud.size * 0.7}
            viewBox="0 0 460 320"
            style={{ opacity: cloud.opacity, transition: 'opacity 1s' }}
          >
            <path
              d="M191.2 64.5c15.1-15.7 36.2-25.5 59.6-25.5 32.4 0 60.5 18.8 73.9 46.1 10.4-4.5 21.8-7 33.9-7 47.1 0 85.3 38.2 85.3 85.3s-38.2 85.3-85.3 85.3c-6.3 0-12.4-0.7-18.3-2-12.8 21.2-36.1 35.4-62.8 35.4-17.3 0-33.2-6-45.8-16-14.3 19.5-37.3 32.2-63.3 32.2-33.5 0-62-21.2-72.9-50.9-4.7 0.8-9.5 1.2-14.4 1.2-47.1 0-85.3-38.2-85.3-85.3 0-40.1 27.7-73.8 65-83 5.6-38.4 38.6-67.9 78.5-67.9 24.4 0 46.3 11 60.9 28.3z"
              fill={isNight ? "#00A1E0" : "#ffffff"}
            />
          </svg>
        </motion.div>
      ))}

      {/* Glowing orbs - Warm sun in morning mode */}
      <motion.div
        className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: isNight
            ? `radial-gradient(circle, ${SF.blue} 0%, transparent 70%)`
            : `radial-gradient(circle, #fcd34d 0%, transparent 70%)`, // Yellow/Sun
        }}
        animate={reduced ? undefined : {
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -right-32 top-1/2 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          background: isNight
            ? `radial-gradient(circle, ${SF.purple} 0%, transparent 70%)`
            : `radial-gradient(circle, #fb7185 0%, transparent 70%)`, // Pink/Warm
        }}
        animate={reduced ? undefined : {
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(${isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Stars - Only in night mode */}
      {isNight && [
        { left: 10, top: 15, opacity: 0.3, duration: 4, delay: 0 },
        { left: 25, top: 45, opacity: 0.4, duration: 5, delay: 1 },
        { left: 40, top: 20, opacity: 0.25, duration: 6, delay: 0.5 },
        { left: 55, top: 70, opacity: 0.35, duration: 4.5, delay: 2 },
        { left: 70, top: 35, opacity: 0.3, duration: 5.5, delay: 1.5 },
        { left: 85, top: 60, opacity: 0.4, duration: 4, delay: 0.8 },
        { left: 15, top: 80, opacity: 0.25, duration: 6, delay: 2.5 },
        { left: 45, top: 55, opacity: 0.35, duration: 5, delay: 1.2 },
        { left: 75, top: 25, opacity: 0.3, duration: 4.5, delay: 0.3 },
        { left: 90, top: 85, opacity: 0.4, duration: 5.5, delay: 1.8 },
      ].map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
          }}
          animate={reduced ? undefined : {
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Salesforce-style card
function SFCard({
  children,
  className = "",
  glow = false,
  glowColor = SF.blue,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
}) {
  return (
    <motion.div
      className={cx(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "transition-all duration-300 hover:border-white/20 hover:bg-white/10",
        className
      )}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {glow && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl opacity-30"
          style={{ background: glowColor }}
        />
      )}
      {children}
    </motion.div>
  );
}

// Section header with Trailhead style
function SectionHeader({
  kicker,
  title,
  subtitle,
  icon: Icon = Sparkles,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  icon?: typeof Sparkles;
}) {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
      >
        <Icon className="h-4 w-4" style={{ color: SF.blue }} />
        <span className="text-sm font-semibold text-white/90">{kicker}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-3xl font-bold text-white md:text-4xl"
      >
        {title}
      </motion.h2>

      <motion.div
        className="mt-3 h-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${SF.blue}, ${SF.purple}, ${SF.orange}, transparent)` }}
        initial={{ width: 0 }}
        whileInView={{ width: "150px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-2xl text-base text-white/60"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// Navbar
function Navbar({ active, onJump, email, github, linkedin, trailhead, theme, toggleTheme }: { active: string; onJump: (id: string) => void; email: string; github: string; linkedin: string; trailhead: string; theme: 'night' | 'morning'; toggleTheme: () => void }) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items = [
    { id: "work", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Layers },
    { id: "cred", label: "Credentials", icon: Award },
    { id: "journey", label: "Journey", icon: Rocket },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    // Close menu first
    setMobileMenuOpen(false);
    // Then scroll after menu animation completes
    setTimeout(() => {
      onJump(id);
    }, 350); // Wait for menu close animation to complete
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-50 px-4 py-4"
    >
      <div className="mx-auto max-w-6xl">
        {/* Main navbar bar */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl md:px-6">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("top")}
            className="flex items-center gap-3"
          >
            <img
              src="/SeifMohsenLogo-optimized.png"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
              width="40"
              height="40"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hidden text-sm font-semibold text-white sm:block">Seif Mohsen</span>
          </button>

          {/* Desktop nav items */}
          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onJump(item.id)}
                className={cx(
                  "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  active === item.id ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {item.label}
                {active === item.id && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg"
                    style={{ background: `${SF.blue}30` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side - Hamburger (mobile) + Hire Me */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu button - mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={mobileMenuOpen ? "open" : "closed"}
                className="flex flex-col gap-1.5"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  className="block h-0.5 w-5 bg-current"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="block h-0.5 w-5 bg-current"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  className="block h-0.5 w-5 bg-current"
                />
              </motion.div>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* Hire Me button */}
            <a
              href={`mailto:${email}`}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:scale-105 md:px-5"
              style={{ background: SF.blueAccessible, color: 'white' }}
            >
              Hire Me
            </a>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl md:hidden"
            >
              <div className="p-4">
                {/* Nav items */}
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={cx(
                          "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                          active === item.id
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5" style={{ color: active === item.id ? SF.blue : undefined }} />
                        {item.label}
                        {active === item.id && (
                          <span className="ml-auto h-2 w-2 rounded-full" style={{ background: SF.blue }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-white/10" />

                {/* Social links */}
                <div className="flex items-center justify-center gap-4">
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    title="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    title="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>

                {/* Trailblazer badge - clickable link to Trailhead profile */}
                <a
                  href={trailhead}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-[#00a1e0]/20 to-[#1b96ff]/20 px-4 py-2.5 text-sm font-medium text-white transition hover:from-[#00a1e0]/30 hover:to-[#1b96ff]/30"
                >
                  <Cloud className="h-4 w-4" style={{ color: SF.blue }} />
                  <span>View Trailhead Profile</span>
                  <ExternalLink className="h-3.5 w-3.5 text-white/50" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Active section hook
function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);
  const sectionKey = useMemo(() => sectionIds.join(","), [sectionIds]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { threshold: [0.15, 0.3] }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sectionKey, sectionIds]);

  return active;
}

// Back to Top Button
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="btn-interactive z-50 rounded-full p-4 text-white shadow-lg"
          style={{
            position: 'fixed',
            background: SF.blue,
            bottom: '2rem',
            right: '2rem',
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Dark/Light Mode Toggle
function ThemeToggle({ theme, toggleTheme }: { theme: 'night' | 'morning'; toggleTheme: () => void }) {
  return (
    <motion.button
      onClick={toggleTheme}
      className="btn-interactive rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'morning' ? (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-blue-300" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-amber-400 fill-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans text-white">
      <SalesforceBackground reduced={false} />
      <div className="mx-auto max-w-6xl px-4 py-24">
        {/* Navbar skeleton */}
        <div className="mb-16 h-16 w-full animate-pulse rounded-2xl bg-white/10" />

        {/* Hero skeleton */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/10" />
            <div className="h-16 w-full animate-pulse rounded-lg bg-white/10" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/10" />
            <div className="h-24 w-full animate-pulse rounded-lg bg-white/10" />
          </div>
          <div className="h-96 w-full animate-pulse rounded-3xl bg-white/10" />
        </div>

        {/* Stats skeleton */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Keyboard Shortcuts Handler
function useKeyboardShortcuts(drawer: Project | null, setDrawer: (p: Project | null) => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC to close drawer
      if (e.key === "Escape" && drawer) {
        setDrawer(null);
      }

      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // ? or / to show keyboard shortcuts
      if ((e.key === "?" || (e.key === "/" && e.shiftKey)) && !drawer) {
        e.preventDefault();
        const helpMessage = `⌨️ Keyboard Shortcuts:

ESC - Close drawer
Ctrl/Cmd + K - Focus search  
Ctrl + ↑ - Back to top
? or / - Show this help

🎮 Easter Egg: Try the Konami Code!
↑ ↑ ↓ ↓ ← → ← → B A`;

        alert(helpMessage);
      }

      // Arrow up to scroll to top
      if (e.key === "ArrowUp" && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [drawer, setDrawer]);
}

// Easter Egg - Konami Code
function useKonamiCode(onSuccess: () => void) {
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          onSuccess();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onSuccess]);
}

// Easter Egg Animation
function EasterEggAnimation({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm force-white-text"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <PartyPopper className="mx-auto h-32 w-32 text-yellow-400" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-4xl font-bold text-white"
        >
          🎉 You found the Easter Egg! 🎉
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xl text-white/80"
        >
          Thank you for playing with me! 🎮
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xl text-white/80"
        >
          with all love , Seif ❤️
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 text-sm text-white/60"
        >
          Click anywhere to close
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Last Updated Timestamp
function LastUpdated() {
  const lastUpdate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <Clock className="h-3 w-3" />
      <span>Last updated: {lastUpdate}</span>
    </div>
  );
}

// Project drawer
// Full screen image lightbox with navigation
function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const hasMultiple = images.length > 1;
  const src = images[currentIndex];
  const alt = `Image ${currentIndex + 1} of ${images.length}`;

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultiple && onNext) {
      onNext();
    }
    if (isRightSwipe && hasMultiple && onPrev) {
      onPrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext?.();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrev?.();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 force-white-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 md:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-6 md:top-6"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Instructions */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/60">
        {hasMultiple ? "Use arrows or swipe to navigate • " : ""}Click anywhere to close
      </p>
    </motion.div>
  );
}

function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Reset image index when project changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [project?.id]);

  const images = project?.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultipleImages) {
      nextImage();
    }
    if (isRightSwipe && hasMultipleImages) {
      prevImage();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] force-white-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10"
            style={{ background: `linear-gradient(180deg, ${SF.darkBlue}, ${SF.navy})` }}
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 520 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="flex h-full flex-col">
              {/* Close button at top */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur-sm hover:bg-black/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Project Image Gallery - Large & Clickable */}
              {hasImages && (
                <div
                  className="relative h-64 w-full shrink-0 cursor-pointer overflow-hidden group"
                  onClick={() => setShowFullImage(true)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#032d60] via-transparent to-black/20" />

                  {/* Navigation arrows for multiple images - always visible on mobile */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                        <span className="text-xs text-white">
                          {currentImageIndex + 1} / {images.length}
                        </span>
                      </div>

                      {/* Dot indicators */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(i);
                            }}
                            className={cx(
                              "h-2 w-2 rounded-full transition-all",
                              i === currentImageIndex
                                ? "bg-white w-4"
                                : "bg-white/40 hover:bg-white/60"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Click to view full hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100 pointer-events-none">
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                      <Maximize2 className="h-5 w-5 text-white" />
                      <span className="text-sm font-medium text-white">Click to view full</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fixed header with title only */}
              <div className="shrink-0 border-b border-white/10 p-6">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: `${project.colors.accent}30`, color: project.colors.accent }}
                >
                  {(() => {
                    const ProjectIcon = PROJECT_ICONS[project.icon || "Workflow"] || Workflow;
                    return <ProjectIcon className="h-3.5 w-3.5" />;
                  })()}
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white">{project.title}</h3>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-auto p-6">
                {/* Impact statement - now scrollable */}
                <p className="mb-4 text-sm font-medium leading-relaxed text-white/80 italic">{project.impact}</p>

                <p className="text-sm leading-relaxed text-white/70">{project.description}</p>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">Tech Stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">Key Highlights</p>
                  <ul className="mt-3 space-y-3">
                    {project.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: project.colors.accent }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 p-6">
                <div className="flex flex-wrap gap-3">
                  {project.links?.map((l) => {
                    const LinkIcon = LINK_ICONS[l.icon || "ExternalLink"] || ExternalLink;
                    return (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                        style={{ background: project.colors.accent }}
                      >
                        {l.label}
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full image lightbox */}
          <AnimatePresence>
            {showFullImage && hasImages && (
              <ImageLightbox
                images={images}
                currentIndex={currentImageIndex}
                onClose={() => setShowFullImage(false)}
                onNext={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Project card - Memoized to prevent unnecessary re-renders
const ProjectCard = memo(function ProjectCard({ p, onOpen, index }: { p: Project; onOpen: (project: Project) => void; index: number }) {
  const [cardImageIndex, setCardImageIndex] = useState(0);
  const hasMultipleImages = p.images && p.images.length > 1;

  const nextCardImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (p.images && p.images.length > 0) {
      setCardImageIndex((prev) => (prev + 1) % p.images!.length);
    }
  };

  const prevCardImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (p.images && p.images.length > 0) {
      setCardImageIndex((prev) => (prev - 1 + p.images!.length) % p.images!.length);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <button
        onClick={() => onOpen(p)}
        className={cx(
          "group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
          "transition-all duration-300 hover:border-white/20 hover:bg-white/10 w-full text-left",
          p.featured ? "md:col-span-2" : ""
        )}
        type="button"
        aria-label={`View details for ${p.title} project`}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: p.colors.glow }}
        />

        {/* Project Image - carousel with arrows */}
        {p.images && p.images.length > 0 && (
          <div className="relative h-40 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={cardImageIndex}
                src={p.images[cardImageIndex]}
                alt={`${p.title} - Image ${cardImageIndex + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Image navigation arrows - visible on hover */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevCardImage}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 pointer-events-auto"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextCardImage}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 pointer-events-auto"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image counter and dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  {p.images.map((_, i) => (
                    <div
                      key={i}
                      className={cx(
                        "h-1.5 w-1.5 rounded-full transition-all",
                        i === cardImageIndex ? "bg-white w-3" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Image count badge */}
            {hasMultipleImages && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm pointer-events-none">
                <ImageIcon className="h-3 w-3" />
                {cardImageIndex + 1}/{p.images.length}
              </div>
            )}
          </div>
        )}

        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: `${p.colors.accent}20`, color: p.colors.accent }}
                >
                  {p.category}
                </span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ background: SF.orange }}
                  >
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-white/60">{p.impact}</p>
            </div>

            {(!p.images || p.images.length === 0) && (
              <div
                className="grid h-12 w-12 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${p.colors.accent}20` }}
              >
                {(() => {
                  const ProjectIcon = PROJECT_ICONS[p.icon || "Workflow"] || Workflow;
                  return <ProjectIcon className="h-5 w-5" style={{ color: p.colors.accent }} />;
                })()}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <div
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all group-hover:scale-[1.02]"
            style={{ background: p.colors.accent }}
          >
            View Details
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </button>
    </motion.div>
  );
});

// Main component
export default function Portfolio() {
  const [theme, setTheme] = useState<'night' | 'morning'>('night');
  const reduced = usePrefersReducedMotion();
  const sectionIds = ["work", "skills", "cred", "journey", "contact"];
  const active = useActiveSection(sectionIds);

  // Loading state to prevent flash of default content
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [DATA, setDATA] = useState<PortfolioData>(getPortfolioData());

  // Fetch data from Firestore immediately (with timeout fallback)
  useEffect(() => {
    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise<PortfolioData>((resolve) => {
      setTimeout(() => resolve(getPortfolioData()), 3000); // 3s timeout
    });

    Promise.race([getPortfolioDataAsync(), timeoutPromise])
      .then((data) => {
        setDATA(data);
        setIsDataLoading(false);
      })
      .catch(() => {
        // Silently fail - use default data
        setDATA(getPortfolioData());
        setIsDataLoading(false);
      });
  }, []);

  // Refresh data when window regains focus (in case admin made changes)
  useEffect(() => {
    const handleFocus = () => {
      getPortfolioDataAsync().then(setDATA).catch(() => {
        // Silently fail - don't spam console with Firebase errors
      });
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const [drawer, setDrawer] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [certImageLightbox, setCertImageLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Defer animations until after first paint to reduce render delay
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Enable animations after first paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        setAnimationsEnabled(true);
      }, 0);
    });
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts(drawer, setDrawer);

  // Easter egg - Konami Code
  useKonamiCode(() => {
    setShowEasterEgg(true);
  });

  const categories = useMemo(() => {
    const c = new Set(["All"]);
    DATA.projects.forEach((p) => c.add(p.category));
    return Array.from(c);
  }, [DATA.projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.projects.filter((p) => {
      const matchesCat = category === "All" || p.category === category;
      const hay = `${p.title} ${p.description} ${p.stack.join(" ")} ${p.impact}`.toLowerCase();
      const matchesQ = !q || hay.includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, category, DATA.projects]);

  // Memoize callbacks to prevent re-renders
  const jumpTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleOpenProject = useCallback((project: Project) => {
    setDrawer(project);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawer(null);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setCertImageLightbox(null);
  }, []);

  // Show loading skeleton while data is being fetched
  if (isDataLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div id="top" className={cx("min-h-screen overflow-x-hidden font-sans text-white transition-colors duration-500", theme === 'morning' ? 'morning' : '')}>
        <SalesforceBackground reduced={reduced} theme={theme} />
        <Navbar active={active} onJump={jumpTo} email={DATA.email} github={DATA.github} linkedin={DATA.linkedin} trailhead={DATA.trailhead} theme={theme} toggleTheme={() => setTheme(t => t === 'night' ? 'morning' : 'night')} />

        <main>
          {/* HERO */}
          <header className="relative min-h-screen overflow-x-hidden pt-24">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                {/* Left - Content */}
                <div className="relative z-10">
                  {/* Trailblazer badge */}
                  <motion.div
                    initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-4 py-2"
                  >
                    <Cloud className="h-5 w-5" style={{ color: SF.blue }} />
                    <span className="text-sm font-semibold">Trailblazer • Open to Work</span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  </motion.div>

                  <motion.h1
                    initial={animationsEnabled ? { opacity: 0, y: 30 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={animationsEnabled ? { delay: 0.1 } : { duration: 0 }}
                    className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
                  >
                    {DATA.name}
                  </motion.h1>

                  <motion.p
                    initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={animationsEnabled ? { delay: 0.2 } : { duration: 0 }}
                    className="mt-3 text-2xl font-semibold md:text-3xl"
                    style={{ color: theme === 'night' ? SF.blue : SF.darkBlue }}
                  >
                    {DATA.headline}
                  </motion.p>

                  <motion.p
                    initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={animationsEnabled ? { delay: 0.3 } : { duration: 0 }}
                    className="mt-2 text-xl text-white/70"
                  >
                    {DATA.tagline}
                  </motion.p>

                  <motion.p
                    initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={animationsEnabled ? { delay: 0.4 } : { duration: 0 }}
                    className="mt-6 max-w-lg text-base leading-relaxed text-white/60"
                  >
                    {DATA.subheadline}
                  </motion.p>

                  {/* Location & Email */}
                  <motion.div
                    initial={animationsEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={animationsEnabled ? { delay: 0.5 } : { duration: 0 }}
                    className="mt-6 flex flex-wrap gap-3"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm">
                      <MapPin className="h-4 w-4" style={{ color: SF.blue }} />
                      {DATA.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm">
                      <Mail className="h-4 w-4" style={{ color: SF.blue }} />
                      {DATA.email}
                    </span>
                  </motion.div>

                  {/* CTAs */}
                  <motion.div
                    initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={animationsEnabled ? { delay: 0.6 } : { duration: 0 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <a
                      href={`mailto:${DATA.email}`}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition hover:scale-105 hover:shadow-lg"
                      style={{ background: SF.blueAccessible, boxShadow: `0 8px 30px ${SF.blueAccessible}40`, color: 'white' }}
                    >
                      <Mail className="h-4 w-4" />
                      Let's Connect
                    </a>
                    <a
                      href={DATA.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                    <a
                      href={DATA.trailhead}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      <Cloud className="h-4 w-4" style={{ color: SF.blue }} />
                      Trailhead
                    </a>
                    <a
                      href={DATA.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </motion.div>
                </div>

                {/* Right - Photo + Characters */}
                <div className="relative">
                  {/* Your photo */}
                  <div className="relative mx-auto w-fit">
                    {/* Glow behind photo - simplified gradient for performance */}
                    <div
                      className="absolute inset-0 -z-10 opacity-30"
                      style={{
                        background: `radial-gradient(circle, ${SF.blue}, transparent 60%)`,
                        transform: 'scale(1.5)',
                        willChange: 'transform'
                      }}
                    />

                    {/* Photo frame with Salesforce cloud shape */}
                    <div className="relative overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl"
                      style={{ boxShadow: `0 20px 60px ${SF.blue}30` }}
                    >
                      {/* Your Salesforce photo - full size, no cropping */}
                      <picture>
                        <source srcSet="/saif-salesforce.webp" type="image/webp" />
                        <img
                          src="/saif-salesforce-optimized.jpg"
                          alt="Saif Mohsen at Salesforce"
                          className="h-auto w-80 max-w-none"
                          width="800"
                          height="800"
                          fetchPriority="high"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Name badge on photo */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="rounded-xl border border-white/20 bg-black/80 px-4 py-2">
                          <p className="text-sm font-semibold" style={{ color: 'white' }}>{DATA.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Salesforce Developer</p>
                        </div>
                      </div>
                    </div>

                    {/* Astro character - positioned inside on mobile, outside on desktop */}
                    <motion.div
                      className="absolute -top-6 left-0 md:-left-16 md:-top-8"
                      animate={reduced || !animationsEnabled ? undefined : { y: [0, -10, 0] }}
                      transition={animationsEnabled ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                    >
                      <AstroCharacter className="h-24 w-24 md:h-32 md:w-32" waving />
                    </motion.div>

                    {/* Codey character - positioned inside on mobile, outside on desktop */}
                    <motion.div
                      className="absolute -bottom-3 right-0 md:-bottom-4 md:-right-12"
                      animate={reduced || !animationsEnabled ? undefined : { y: [0, -8, 0] }}
                      transition={animationsEnabled ? { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } : { duration: 0 }}
                    >
                      <CodeyCharacter className="h-20 w-20 md:h-28 md:w-28" />
                    </motion.div>

                    {/* Trailhead Ranger badge - positioned inside on mobile, outside on desktop */}
                    <motion.div
                      className="absolute right-0 top-2 md:-right-8 md:top-0"
                      animate={reduced || !animationsEnabled ? undefined : { rotate: [0, 5, 0] }}
                      transition={animationsEnabled ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                    >
                      <img
                        src="/ranger.png"
                        alt="Trailhead Ranger Badge"
                        className="h-20 w-auto md:h-24 drop-shadow-lg"
                        width="177"
                        height="142"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                {DATA.stats.map((stat) => {
                  const Icon = STAT_ICONS[stat.icon] || Award;
                  return (
                    <SFCard key={stat.label} className="p-5" glow glowColor={SF.blue}>
                      <div className="flex items-center gap-4">
                        <div
                          className="grid h-12 w-12 place-items-center rounded-xl"
                          style={{ background: `${SF.blue}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: SF.blue }} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-sm text-white/60">{stat.label}</p>
                        </div>
                      </div>
                    </SFCard>
                  );
                })}
              </motion.div>

              {/* Principles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                {DATA.principles.map((p, i) => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm"
                  >
                    <CheckCircle className="h-4 w-4" style={{ color: SF.green }} />
                    {p}
                  </motion.span>
                ))}
              </motion.div>
            </div>

          </header>

          {/* WORK SECTION */}
          <section id="work" className="relative py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 3000px' }}>
            <div className="mx-auto max-w-6xl px-4">
              <SectionHeader
                kicker="Featured Projects"
                title="What I've Built"
                subtitle="From Flow automations to bulk-safe Apex triggers — real solutions for real problems."
                icon={Rocket}
              />

              {/* Filters */}
              <div className="mb-8 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-white/30"
                  />
                </div>
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-10 text-sm text-white outline-none backdrop-blur-sm transition focus:border-white/30 md:w-48"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} style={{ background: SF.navy }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((p, i) => (
                  <ProjectCard key={p.title} p={p} onOpen={handleOpenProject} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section id="skills" className="relative py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 2000px' }}>
            <div className="mx-auto max-w-6xl px-4">
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <SectionHeader
                    kicker="Technical Skills"
                    title="My Salesforce Toolkit"
                    subtitle="A solid foundation across the entire platform."
                    icon={Layers}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    {DATA.skillGroups.map((group, i) => {
                      const Icon = ICONS[group.icon] || Sparkles;
                      return (
                        <motion.div
                          key={group.group}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <SFCard className="h-full p-5" glow glowColor={group.color}>
                            <div className="flex items-center gap-3">
                              <div
                                className="grid h-10 w-10 place-items-center rounded-xl"
                                style={{ background: `${group.color}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color: group.color }} />
                              </div>
                              <h3 className="font-bold text-white">{group.group}</h3>
                            </div>
                            <ul className="mt-4 space-y-2">
                              {group.items.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: group.color }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </SFCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Einstein character + Pro tip */}
                <div className="flex flex-col items-center justify-center">
                  <EinsteinCharacter className="h-64 w-64" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 w-full"
                  >
                    <SFCard className="p-6" glow glowColor={SF.purple}>
                      <div className="flex items-start gap-4">
                        <div
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                          style={{ background: `${SF.purple}20` }}
                        >
                          <Zap className="h-5 w-5" style={{ color: SF.purple }} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">💡 My Salesforce Rule</p>
                          <p className="mt-2 text-sm text-white/70">{DATA.proTip}</p>
                        </div>
                      </div>
                    </SFCard>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* CREDENTIALS SECTION */}
          <section id="cred" className="relative py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1500px' }}>
            <div className="mx-auto max-w-6xl px-4">
              <SectionHeader
                kicker="Credentials"
                title="Certifications & Training"
                subtitle="Verified expertise from Salesforce and intensive training programs."
                icon={Award}
              />

              <div className="grid gap-6 md:grid-cols-3">
                {DATA.certifications.map((cert, i) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <SFCard className="overflow-hidden" glow glowColor={cert.color}>
                      {/* Certificate Image - Large & Clickable */}
                      {cert.image ? (
                        <div
                          className="relative h-48 w-full cursor-pointer overflow-hidden group"
                          onClick={() => setCertImageLightbox({ src: cert.image!, alt: cert.title })}
                        >
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {/* Click to view hint */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                              <Maximize2 className="h-4 w-4 text-white" />
                              <span className="text-sm font-medium text-white">View Certificate</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="grid h-32 w-full place-items-center"
                          style={{ background: `linear-gradient(135deg, ${cert.color}40, ${cert.color}20)` }}
                        >
                          <BadgeCheck className="h-16 w-16" style={{ color: cert.color }} />
                        </div>
                      )}

                      {/* Certificate Info */}
                      <div className="p-5">
                        <h4 className="font-bold text-white">{cert.title}</h4>
                        <p className="mt-1 text-sm text-white/60">{cert.issuer}</p>
                        <p className="mt-2 text-xs font-semibold" style={{ color: cert.color }}>{cert.year}</p>
                      </div>
                    </SFCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* JOURNEY SECTION */}
          <section id="journey" className="relative py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 2500px' }}>
            <div className="mx-auto max-w-6xl px-4">
              <SectionHeader
                kicker="My Journey"
                title="The Trail So Far"
                subtitle="Every Trailblazer has a story. Here's mine."
                icon={TrendingUp}
              />

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent md:left-1/2 md:block" />

                <div className="space-y-12">
                  {DATA.timeline.map((item, i) => {
                    const Icon = ICONS[item.icon] || Sparkles;
                    const isLeft = i % 2 === 0;

                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className={cx(
                          "relative flex flex-col gap-4 md:flex-row md:items-center",
                          isLeft ? "" : "md:flex-row-reverse"
                        )}
                      >
                        {/* Year badge - desktop */}
                        <div className={cx("hidden w-1/2 md:flex", isLeft ? "justify-end pr-8" : "justify-start pl-8")}>
                          <span
                            className="rounded-full px-4 py-2 text-sm font-bold text-white"
                            style={{ background: SF.blue }}
                          >
                            {item.year}
                          </span>
                        </div>

                        {/* Center dot */}
                        <div
                          className="absolute left-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 md:left-1/2 md:block"
                          style={{ borderColor: SF.blue, background: SF.navy }}
                        />

                        {/* Content */}
                        <div className="w-full md:w-1/2">
                          <SFCard className="p-6" glow glowColor={SF.blue}>
                            {/* Year badge - mobile */}
                            <span
                              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white md:hidden"
                              style={{ background: SF.blue }}
                            >
                              {item.year}
                            </span>

                            <div className="flex items-start gap-4">
                              <div
                                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                                style={{ background: `${SF.blue}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color: SF.blue }} />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                <p className="mt-1 text-sm font-medium" style={{ color: SF.blue }}>{item.subtitle}</p>
                                <p className="mt-2 text-sm text-white/60">{item.details}</p>
                              </div>
                            </div>
                          </SFCard>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="relative py-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1000px' }}>
            <div className="mx-auto max-w-4xl px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Characters */}
                <div className="mb-8 flex items-center justify-center gap-4">
                  <AstroCharacter className="h-20 w-20" />
                  <SalesforceCloudLogo size="md" />
                  <CodeyCharacter className="h-20 w-20" />
                </div>

                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
                >
                  <Heart className="h-4 w-4" style={{ color: SF.red }} />
                  Let's Build Together
                </span>

                <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                  Ready to Start My
                  <span className="block" style={{ color: SF.blue }}> Salesforce Journey</span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
                  I'm actively looking for opportunities where I can contribute, learn, and grow as a Salesforce developer. Let's connect!
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`mailto:${DATA.email}`}
                    className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition hover:scale-105"
                    style={{ background: SF.blue, boxShadow: `0 8px 30px ${SF.blue}40` }}
                  >
                    <Mail className="h-5 w-5" />
                    Send Me an Email
                  </a>
                  <a
                    href={DATA.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Ask For Resume
                  </a>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6">
                  {[
                    { icon: Mail, href: `mailto:${DATA.email}`, key: "mail", label: "Email" },
                    { icon: Linkedin, href: DATA.linkedin, key: "linkedin", label: "LinkedIn" },
                    { icon: Cloud, href: DATA.trailhead, key: "trailhead", label: "Trailhead", color: SF.blue },
                    { icon: Github, href: DATA.github, key: "github", label: "GitHub" },
                  ].map(({ icon: Icon, href, key, label, color }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col items-center gap-2"
                      title={label}
                    >
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/60 transition group-hover:bg-white/10 group-hover:text-white">
                        <Icon className="h-6 w-6" style={color ? { color } : undefined} />
                      </div>
                      <span className="text-xs text-white/40 group-hover:text-white/60">{label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-8">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-3">
                  <SalesforceCloudLogo size="sm" animate={false} />
                  <span className="font-semibold text-white/80">{DATA.name}</span>
                </div>
                <p className="text-sm text-white/40">
                  Built with Love • by Seif Mohsen ❤️
                </p>
                <LastUpdated />
              </div>
            </div>
          </footer>
        </main>

        <ProjectDrawer project={drawer} onClose={handleCloseDrawer} />

        {/* Certificate Image Lightbox */}
        <AnimatePresence>
          {certImageLightbox && (
            <ImageLightbox
              images={[certImageLightbox.src]}
              currentIndex={0}
              onClose={handleCloseLightbox}
            />
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <BackToTopButton />

        {/* Easter Egg Animation */}
        <AnimatePresence>
          {showEasterEgg && (
            <EasterEggAnimation onClose={() => setShowEasterEgg(false)} />
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
