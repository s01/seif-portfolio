// Portfolio Data Store
// This file manages all portfolio data with Firestore persistence

import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  category: string;
  impact: string;
  description: string;
  bullets: string[];
  stack: string[];
  links: { label: string; href: string }[];
  featured: boolean;
  images?: string[]; // Multiple project images/screenshots
  colors: {
    glow: string;
    accent: string;
  };
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  color: string;
  image?: string; // Optional certification badge image
  order?: number; // For custom ordering
}

export interface SkillGroup {
  id: string;
  group: string;
  icon: string;
  color: string;
  items: string[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  details: string;
  icon: string;
  order?: number; // For custom ordering
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface PortfolioData {
  // Personal Info
  name: string;
  headline: string;
  tagline: string;
  subheadline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  trailblazerRank: string;
  
  // Arrays
  stats: Stat[];
  principles: string[];
  certifications: Certification[];
  skillGroups: SkillGroup[];
  projects: Project[];
  timeline: TimelineItem[];
  proTip: string;
}

// Default data - used as fallback if Firestore is empty
const DEFAULT_DATA: PortfolioData = {
  name: "Saif Mohsen",
  headline: "Salesforce Developer",
  tagline: "Admin • Apex • LWC",
  subheadline:
    "I ship maintainable Salesforce solutions: clean trigger architecture, bulk-safe Apex, and delightful automations with Flow + LWC.",
  location: "Cairo, Egypt",
  email: "hello@yourdomain.com",
  linkedin: "https://www.linkedin.com/in/your-handle",
  github: "https://github.com/your-handle",
  resumeUrl: "#",
  trailblazerRank: "Ranger",

  stats: [
    { id: "1", label: "Certifications", value: "2", icon: "Award" },
    { id: "2", label: "Trail Badges", value: "45+", icon: "Target" },
    { id: "3", label: "Focus Area", value: "Apex + Flow", icon: "Zap" },
    { id: "4", label: "Code Style", value: "Bulk-safe", icon: "Shield" },
  ],

  principles: [
    "One Trigger per Object",
    "No Logic in Triggers",
    "Handler + Service Pattern",
    "Flow-first (when it fits)",
  ],

  certifications: [
    { id: "1", title: "Salesforce Certified Administrator", issuer: "Salesforce", year: "2025", color: "#00a1e0" },
    { id: "2", title: "Salesforce Certified Agentforce Specialist", issuer: "Salesforce", year: "2025", color: "#8b5cf6" },
    { id: "3", title: "ITI — Salesforce Track Graduate", issuer: "Information Technology Institute", year: "2025", color: "#10b981" },
  ],

  skillGroups: [
    {
      id: "1",
      group: "Platform",
      icon: "Layers",
      color: "#00a1e0",
      items: ["Data Model", "Security (RLS/Perm Sets)", "Reports/Dashboards", "App Builder"],
    },
    {
      id: "2",
      group: "Automation",
      icon: "Workflow",
      color: "#ff6b35",
      items: ["Flow (Screen/Record-Triggered)", "Validation Rules", "Approvals", "Assignment Rules"],
    },
    {
      id: "3",
      group: "Development",
      icon: "Code2",
      color: "#8b5cf6",
      items: ["Apex", "Triggers", "Async Apex", "SOQL", "Unit Tests"],
    },
    {
      id: "4",
      group: "UI",
      icon: "Wrench",
      color: "#10b981",
      items: ["LWC", "Lightning Pages", "UX for Admins", "SLDS mindset"],
    },
  ],

  projects: [
    {
      id: "1",
      title: "Opportunity Stage Manager",
      category: "Flow + UX",
      impact: "Reduced stage-update mistakes and guided reps with step-by-step UI.",
      description:
        "A screen-flow experience that turns messy sales process rules into a simple guided path. Includes conditional screens, validations, and clean updates.",
      bullets: [
        "Mobile-first Flow screens with smart branching",
        "Validations + user-friendly error messaging",
        "Audit-friendly data updates",
      ],
      stack: ["Flow", "Validation Rules", "Reports"],
      links: [
        { label: "Demo", href: "#" },
        { label: "Case Study", href: "#" },
      ],
      featured: true,
      colors: {
        glow: "rgba(0, 161, 224, 0.4)",
        accent: "#00a1e0",
      },
    },
    {
      id: "2",
      title: "Product Stock Protection",
      category: "Apex Trigger",
      impact: "Blocked out-of-stock Opportunities with bulk-safe validation.",
      description:
        "A service-driven Apex validation that queries Product2 stock and blocks Opportunity saves using addError—no SOQL/DML in loops.",
      bullets: [
        "Before-insert validation with addError",
        "Single SOQL query + map-based lookup",
        "Test coverage with realistic data factory",
      ],
      stack: ["Apex", "SOQL", "Triggers", "Tests"],
      links: [{ label: "GitHub", href: "#" }],
      featured: false,
      colors: {
        glow: "rgba(139, 92, 246, 0.4)",
        accent: "#8b5cf6",
      },
    },
    {
      id: "3",
      title: "Case Escalation + Async Follow-Up",
      category: "Flow + Async",
      impact: "Escalated urgent cases and created follow-up tasks asynchronously.",
      description:
        "Queue-based routing, escalation automation, and async task creation to keep support tight and predictable under load.",
      bullets: [
        "Queue-based routing + escalation rules",
        "Async Apex for heavy work",
        "Defensive idempotency to avoid duplicates",
      ],
      stack: ["Flow", "Async Apex", "Queues"],
      links: [{ label: "Design Notes", href: "#" }],
      featured: false,
      colors: {
        glow: "rgba(16, 185, 129, 0.4)",
        accent: "#10b981",
      },
    },
    {
      id: "4",
      title: "Trigger Context Visual Guide",
      category: "Content + Teaching",
      impact: "Helped juniors stop confusing Trigger.new/old and map variants.",
      description:
        "A compact visual mental model: triggers route context; handlers own logic. Built for LinkedIn, mobile-first.",
      bullets: [
        "Clear context-variable routing",
        "Beginner-friendly mental model",
        "Clean architecture emphasis",
      ],
      stack: ["Apex", "Clean Code", "Bulkification"],
      links: [{ label: "Post", href: "#" }],
      featured: false,
      colors: {
        glow: "rgba(255, 107, 53, 0.4)",
        accent: "#ff6b35",
      },
    },
  ],

  timeline: [
    {
      id: "1",
      year: "2025",
      title: "ITI — Salesforce Track",
      subtitle: "Admin → Apex → LWC → Intro Integrations",
      details:
        "Built projects with platform fundamentals, automation decisions, and clean trigger patterns.",
      icon: "GraduationCap",
    },
    {
      id: "2",
      year: "2024",
      title: "Family Business (Ops + Tech)",
      subtitle: "Sales, consulting, inventory, systems",
      details:
        "Learned stakeholder communication, real-world processes, and practical problem solving.",
      icon: "Briefcase",
    },
  ],

  proTip:
    "Triggers are routers. Context variables are payload. If your trigger contains logic, it's already getting hard to maintain.",
};

const FIRESTORE_DOC = "portfolio";
const FIRESTORE_COLLECTION = "settings";
const ADMIN_PASSWORD_KEY = "admin_password";

// Get data from Firestore (async)
export async function getPortfolioDataAsync(): Promise<PortfolioData> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...DEFAULT_DATA, ...docSnap.data() } as PortfolioData;
    }
  } catch (e) {
    console.error("Error loading portfolio data from Firestore:", e);
  }
  return DEFAULT_DATA;
}

// Synchronous version for backwards compatibility (returns default data)
export function getPortfolioData(): PortfolioData {
  return DEFAULT_DATA;
}

// Save data to Firestore (async)
export async function savePortfolioDataAsync(data: PortfolioData): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    await setDoc(docRef, data);
  } catch (e) {
    console.error("Error saving portfolio data to Firestore:", e);
    throw e;
  }
}

// Legacy sync version (no-op, kept for compatibility)
export function savePortfolioData(_data: PortfolioData): void {
  // This is now a no-op - use savePortfolioDataAsync instead
  console.warn("savePortfolioData is deprecated, use savePortfolioDataAsync");
}

// Reset to defaults (saves defaults to Firestore)
export async function resetPortfolioDataAsync(): Promise<PortfolioData> {
  await savePortfolioDataAsync(DEFAULT_DATA);
  return DEFAULT_DATA;
}

// Legacy sync version
export function resetPortfolioData(): PortfolioData {
  console.warn("resetPortfolioData is deprecated, use resetPortfolioDataAsync");
  return DEFAULT_DATA;
}

// Admin password management (still uses localStorage - password is per-device)
export function setAdminPassword(password: string): void {
  const hash = btoa(password);
  localStorage.setItem(ADMIN_PASSWORD_KEY, hash);
}

export function checkAdminPassword(password: string): boolean {
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!stored) {
    setAdminPassword(password);
    return true;
  }
  return btoa(password) === stored;
}

export function isPasswordSet(): boolean {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) !== null;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Color presets for easy selection
export const COLOR_PRESETS = [
  { name: "Salesforce Blue", value: "#00a1e0" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#ff6b35" },
  { name: "Red", value: "#ea4359" },
  { name: "Yellow", value: "#ffc107" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Pink", value: "#ec4899" },
];

// Icon options
export const ICON_OPTIONS = [
  "Award", "Target", "Zap", "Shield", "Layers", "Workflow", 
  "Code2", "Wrench", "GraduationCap", "Briefcase", "Rocket",
  "BookOpen", "Database", "Settings", "Star", "Heart"
];
