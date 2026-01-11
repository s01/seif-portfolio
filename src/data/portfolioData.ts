// Portfolio Data Store
// This file manages all portfolio data with Firestore persistence

// Lazy-load Firebase to avoid blocking main bundle
import type { Firestore } from "firebase/firestore";

let firebaseInitialized = false;
let db: Firestore | null = null;

async function initFirebase(): Promise<Firestore | null> {
  if (firebaseInitialized && db) return db;
  try {
    const { db: firebaseDb } = await import("../firebase");
    db = firebaseDb;
    firebaseInitialized = true;
    return db;
  } catch {
    // Firebase failed to load - not critical, static data works fine
    return null;
  }
}

export interface Project {
  id: string;
  title: string;
  category: string;
  icon?: string; // Icon for the project card
  impact: string;
  description: string;
  bullets: string[];
  stack: string[];
  links: { label: string; href: string; icon?: string }[];
  featured: boolean;
  images?: string[]; // Multiple project images/screenshots
  colors: {
    glow: string;
    accent: string;
  };
}

// Available icons for project links
export const LINK_ICON_OPTIONS = [
  "ExternalLink",
  "Github",
  "Globe",
  "Play",
  "FileText",
  "BookOpen",
  "Video",
  "Presentation",
  "Download",
  "Eye",
  "Code2",
  "Rocket",
  "Linkedin",
  "Twitter",
  "Youtube",
];

// Available icons for project cards
export const PROJECT_ICON_OPTIONS = [
  "Workflow",
  "Code2",
  "Zap",
  "Rocket",
  "Database",
  "Cloud",
  "Shield",
  "Layers",
  "Settings",
  "Terminal",
  "FileCode",
  "GitBranch",
  "Box",
  "Cpu",
  "Globe",
  "Users",
  "MessageSquare",
  "BarChart",
  "PieChart",
  "TrendingUp",
  "Lightbulb",
  "BookOpen",
  "Wrench",
  "Puzzle",
];

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
  trailhead: string;
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
  name: "Seif Mohsen",
  headline: "Salesforce Developer",
  tagline: "Admin • Apex • LWC",
  subheadline:
    "I ship maintainable Salesforce solutions: clean trigger architecture, bulk-safe Apex, and delightful automations with Flow + LWC.",
  location: "6th of October City, Giza, Egypt",
  email: "saifmohsen65@gmail.com",
  linkedin: "https://www.linkedin.com/in/saif-mohsen",
  github: "https://github.com/s01",
  trailhead: "https://www.salesforce.com/trailblazer/seifmohsen",
  resumeUrl: "",
  trailblazerRank: "Ranger",

  stats: [
    { id: "1", label: "Certifications", value: "2", icon: "Award" },
    { id: "2", label: "Trail Badges", value: "120+", icon: "Target" },
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
      year: "(July 2025 – Jan 2026)",
      title: "Trainee — ITI Salesforce Track",
      subtitle: "Admin → Apex → LWC → Intro Integrations",
      details:
        "Built projects with platform fundamentals, automation decisions, and clean trigger patterns.",
      icon: "GraduationCap",
    },
    {
      id: "2",
      year: "(October 2023 – May 2025)",
      title: "Operations Manager — October Pneumatic",
      subtitle: "Sales, consulting, inventory, systems",
      details:
        "Managed customer inquiries and matched product specifications to client needs. - Maintained inventory records and processed invoices using Excel, improved order documentation efficiency.",
      icon: "Briefcase",
    },
    {
      id: "mk7wg96wikhl6db41y9",
      year: "(September 2019 – July 2023)",
      title: "Student — Business Information Systems",
      subtitle: "Misr University For Science And Technology ",
      details:
        "GPA: 3.55 — Grade: Very Good with Honors",
      icon: "GraduationCap",
    },
  ],

  proTip:
    "Triggers are routers. Context variables are payload. If your trigger contains logic, it's already getting hard to maintain.",
};

const FIRESTORE_DOC = "portfolio";
const FIRESTORE_COLLECTION = "settings";
const PROJECTS_COLLECTION = "projects";
const CERTIFICATIONS_DOC = "certifications";
const SKILLS_DOC = "skills";
const TIMELINE_DOC = "timeline";

// Get data from Firestore (async) - now split across multiple documents
export async function getPortfolioDataAsync(): Promise<PortfolioData> {
  try {
    // Lazy-load Firebase and Firestore
    const firebaseDb = await initFirebase();
    if (!firebaseDb) return DEFAULT_DATA;
    
    const { doc, getDoc, collection, getDocs } = await import("firebase/firestore");
    
    // Load main portfolio data
    const mainRef = doc(firebaseDb, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    const mainSnap = await getDoc(mainRef);
    
    let portfolioData: PortfolioData = { ...DEFAULT_DATA };
    
    if (mainSnap.exists()) {
      portfolioData = { ...portfolioData, ...mainSnap.data() } as PortfolioData;
    }
    
    // Load projects from separate collection
    try {
      const projectsCol = collection(firebaseDb, PROJECTS_COLLECTION);
      const projectsSnap = await getDocs(projectsCol);
      if (!projectsSnap.empty) {
        portfolioData.projects = projectsSnap.docs.map(doc => doc.data() as Project);
      }
    } catch (e) {
      console.log("Projects not found, using defaults");
    }
    
    // Load certifications
    try {
      const certsRef = doc(firebaseDb, FIRESTORE_COLLECTION, CERTIFICATIONS_DOC);
      const certsSnap = await getDoc(certsRef);
      if (certsSnap.exists()) {
        portfolioData.certifications = certsSnap.data().items as Certification[];
      }
    } catch (e) {
      console.log("Certifications not found, using defaults");
    }
    
    // Load skills
    try {
      const skillsRef = doc(firebaseDb, FIRESTORE_COLLECTION, SKILLS_DOC);
      const skillsSnap = await getDoc(skillsRef);
      if (skillsSnap.exists()) {
        portfolioData.skillGroups = skillsSnap.data().items as SkillGroup[];
      }
    } catch (e) {
      console.log("Skills not found, using defaults");
    }
    
    // Load timeline
    try {
      const timelineRef = doc(firebaseDb, FIRESTORE_COLLECTION, TIMELINE_DOC);
      const timelineSnap = await getDoc(timelineRef);
      if (timelineSnap.exists()) {
        portfolioData.timeline = timelineSnap.data().items as TimelineItem[];
      }
    } catch (e) {
      console.log("Timeline not found, using defaults");
    }
    
    return portfolioData;
  } catch {
    // Silently fail for network errors - static data works fine
    // No need to spam console with Firebase connection errors
  }
  return DEFAULT_DATA;
}

// Synchronous version for backwards compatibility (returns default data)
export function getPortfolioData(): PortfolioData {
  return DEFAULT_DATA;
}

// Save data to Firestore (async) - now split across multiple documents to bypass 1MB limit
export async function savePortfolioDataAsync(data: PortfolioData): Promise<void> {
  try {
    const firebaseDb = await initFirebase();
    if (!firebaseDb) throw new Error("Firebase not initialized");
    
    const { doc, setDoc, writeBatch } = await import("firebase/firestore");
    
    // Extract large arrays from main data
    const { projects, certifications, skillGroups, timeline, ...mainData } = data;
    
    // Save main portfolio data (without large arrays)
    const mainRef = doc(firebaseDb, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    await setDoc(mainRef, mainData);
    
    // Use batch writes for better performance
    const batch = writeBatch(firebaseDb);
    
    // Save each project as a separate document
    projects.forEach((project) => {
      const projectRef = doc(firebaseDb, PROJECTS_COLLECTION, project.id);
      batch.set(projectRef, project);
    });
    
    // Save certifications in one document
    const certsRef = doc(firebaseDb, FIRESTORE_COLLECTION, CERTIFICATIONS_DOC);
    batch.set(certsRef, { items: certifications });
    
    // Save skills in one document
    const skillsRef = doc(firebaseDb, FIRESTORE_COLLECTION, SKILLS_DOC);
    batch.set(skillsRef, { items: skillGroups });
    
    // Save timeline in one document
    const timelineRef = doc(firebaseDb, FIRESTORE_COLLECTION, TIMELINE_DOC);
    batch.set(timelineRef, { items: timeline });
    
    // Commit all writes
    await batch.commit();
    
    console.log("✅ Portfolio data saved successfully across multiple documents");
  } catch (e) {
    console.error("Error saving portfolio data to Firestore:", e);
    throw e;
  }
}

// Legacy sync version (no-op, kept for compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Admin password management - stored in Firestore for security
const ADMIN_DOC = "admin";

// Hash password using a simple but more secure method
function hashPassword(password: string): string {
  // Use a simple hash - in production, you'd want bcrypt on a server
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return btoa(password + hash.toString());
}

export async function setAdminPasswordAsync(password: string): Promise<void> {
  try {
    const firebaseDb = await initFirebase();
    if (!firebaseDb) throw new Error("Firebase not initialized");
    
    const { doc, setDoc } = await import("firebase/firestore");
    const docRef = doc(firebaseDb, FIRESTORE_COLLECTION, ADMIN_DOC);
    await setDoc(docRef, { passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
  } catch (e) {
    console.error("Error setting admin password:", e);
    throw e;
  }
}

export async function checkAdminPasswordAsync(password: string): Promise<boolean> {
  try {
    const firebaseDb = await initFirebase();
    if (!firebaseDb) return false;
    
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(firebaseDb, FIRESTORE_COLLECTION, ADMIN_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // First time - set the password
      await setAdminPasswordAsync(password);
      return true;
    }
    
    const stored = docSnap.data()?.passwordHash;
    return hashPassword(password) === stored;
  } catch (e) {
    console.error("Error checking admin password:", e);
    return false;
  }
}

export async function isPasswordSetAsync(): Promise<boolean> {
  try {
    const firebaseDb = await initFirebase();
    if (!firebaseDb) return false;
    
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(firebaseDb, FIRESTORE_COLLECTION, ADMIN_DOC);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && !!docSnap.data()?.passwordHash;
  } catch (e) {
    console.error("Error checking if password is set:", e);
    return false;
  }
}

// Legacy sync versions - kept for compatibility but will use cached values
let cachedPasswordSet: boolean | null = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setAdminPassword(_password: string): void {
  console.warn("setAdminPassword is deprecated, use setAdminPasswordAsync");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function checkAdminPassword(_password: string): boolean {
  console.warn("checkAdminPassword is deprecated, use checkAdminPasswordAsync");
  // This is a fallback - the async version should be used
  return false;
}

export function isPasswordSet(): boolean {
  // Return cached value if available, otherwise assume not set
  // The async version should be called first to populate this
  return cachedPasswordSet ?? false;
}

// Call this on app init to cache the password status
export async function initPasswordStatus(): Promise<boolean> {
  cachedPasswordSet = await isPasswordSetAsync();
  return cachedPasswordSet;
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
