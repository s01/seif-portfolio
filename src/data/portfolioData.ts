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
  "name": "Seif Mohsen",
  "headline": "Salesforce Developer",
  "tagline": "Admin • Apex • LWC",
  "subheadline": "I’m a Junior Salesforce Developer who focuses on building maintainable solutions through clean trigger architecture, bulk-safe Apex, and thoughtful automation with Flow and LWC.",
  "location": "6th of October City, Giza, Egypt",
  "email": "saifmohsen65@gmail.com",
  "linkedin": "https://www.linkedin.com/in/saif-mohsen",
  "github": "https://github.com/s01",
  "trailhead": "https://www.salesforce.com/trailblazer/saifmohsen",
  "resumeUrl": "https://drive.google.com/drive/folders/1CmJo2pFLvsyfimgO2912EwyBO63WlGIn",
  "trailblazerRank": "Ranger",
  "stats": [
    {
      "label": "Certifications",
      "value": "2",
      "id": "1",
      "icon": "Award"
    },
    {
      "id": "2",
      "icon": "Target",
      "label": "Trailhead Badges",
      "value": "120+"
    },
    {
      "id": "3",
      "icon": "Zap",
      "value": "Apex + Flow",
      "label": "Focus Area"
    },
    {
      "value": "Bulk-safe",
      "label": "Code Style",
      "icon": "Shield",
      "id": "4"
    }
  ],
  "principles": [
    "One Trigger per Object",
    "Flow-first (when it fits)",
    "Bulkified by Design",
    "Governor Limits Aware",
    "Meaningful Unit Tests",
    "Fail Fast with addError()",
    "Readable > Clever Code"
  ],
  "certifications": [
    {
      "color": "#10b981",
      "title": "ITI — Salesforce Track Graduate",
      "year": "January 2026",
      "issuer": "Information Technology Institute",
      "id": "3",
      "image": "/cert-iti---salesforce-track-graduate-3.png"
    },
    {
      "color": "#00a1e0",
      "image": "/cert-salesforce-certified-administrator-1.png",
      "id": "1",
      "issuer": "Salesforce",
      "year": "December 2025",
      "title": "Salesforce Certified Administrator"
    },
    {
      "issuer": "Salesforce",
      "color": "#8b5cf6",
      "title": "Salesforce Certified Agentforce Specialist",
      "year": "December 2025",
      "image": "/cert-salesforce-certified-agentforce-specialist-2.png",
      "id": "2"
    }
  ],
  "skillGroups": [
    {
      "items": [
        "Data Modeling (Custom & Standard Objects)",
        "Relationships (Lookup / Master-Detail)",
        "Schema Builder",
        "Page Layouts & Record Types",
        "User Management"
      ],
      "icon": "Layers",
      "group": "Salesforce Core Platform",
      "color": "#00a1e0",
      "id": "1"
    },
    {
      "icon": "Shield",
      "id": "2",
      "items": [
        "Profiles & Permission Sets",
        "Role Hierarchy & RLS",
        "Sharing Rules",
        "Field-Level Security",
        "Secure Org Configuration"
      ],
      "color": "#ff6b35",
      "group": "Security & Access Control"
    },
    {
      "id": "3",
      "icon": "Workflow",
      "group": "Business Automation",
      "color": "#8b5cf6",
      "items": [
        "Flow Builder",
        "Validation Rules",
        "Approval Processes",
        "Assignment Rules",
        "Declarative vs Programmatic Automation"
      ]
    },
    {
      "color": "#10b981",
      "id": "4",
      "icon": "Code2",
      "group": "Apex & Backend Development",
      "items": [
        "Apex Classes & Triggers",
        "Trigger Context & Best Practices",
        "Async Apex (Future, Queueable, Batch)",
        "SOQL & SOSL",
        "Testing & Governor Limits"
      ]
    },
    {
      "id": "mk93jdsc4rgcmai4mcb",
      "group": "UI & Frontend",
      "icon": "Wrench",
      "color": "#ea4359",
      "items": [
        "Lightning Web Components (LWC)",
        "Lightning App Builder",
        "Lightning Pages",
        "SLDS Mindset",
        "UX for Admins & End Users"
      ]
    },
    {
      "id": "mk93k5vsgzv5rjjdn9h",
      "group": "Integration & Data",
      "icon": "Zap",
      "color": "#ffc107",
      "items": [
        "REST APIs (Basics)",
        "Data Loader & Import Wizard",
        "Postman (API Testing)",
        "Data Management & Migration"
      ]
    },
    {
      "id": "mk93l3dkbdguje7e8cv",
      "group": "Data & Analytics",
      "icon": "Database",
      "color": "#14b8a6",
      "items": [
        "Reports & Dashboards",
        "Excel",
        "Data Cleaning & Validation",
        "Power BI (Foundational)"
      ]
    },
    {
      "id": "mk93lpblms9fiamos4a",
      "group": "Dev & Collaboration Tools",
      "icon": "Settings",
      "color": "#ec4899",
      "items": [
        "Git & GitHub",
        "Salesforce CLI (SFDX)",
        "VS Code",
        "Jira"
      ]
    }
  ],
  "projects": [
    {
      "links": [
        {
          "href": "https://www.linkedin.com/posts/saif-mohsen_salesforce-salesforceflow-automation-activity-7383036480799105024-GAfB",
          "icon": "Linkedin",
          "label": "Video Demo"
        },
        {
          "href": "https://drive.google.com/file/d/1cEaqj0x2cZk5h2aLwCYFGJsGDspaWzd_/view?usp=sharing",
          "icon": "FileText",
          "label": "Documentation"
        },
        {
          "href": "mailto:saifmohsen65@gmail.com",
          "icon": "ExternalLink",
          "label": "Want More Info"
        }
      ],
      "featured": true,
      "impact": "Reduced stage-update mistakes and guided reps with step-by-step UI.",
      "title": "Opportunity Stage Manager",
      "colors": {
        "glow": "rgba(0, 161, 224, 0.4)",
        "accent": "#00a1e0"
      },
      "stack": [
        "Screen Flows",
        "Validation Rules",
        "Custom Fields",
        "Quick Actions",
        "Lightning Tabs & Page Configuration",
        "Profiles & Permission Sets"
      ],
      "id": "1",
      "icon": "Workflow",
      "bullets": [
        "Guided Screen Flow to control Opportunity stage progression",
        "Strict stage governance using validation rules to prevent manual UI changes",
        "Dynamic stage-specific screens with required fields per stage",
        "Clear, user-friendly error handling (same-stage checks & validation messaging)",
        "Audit-friendly updates with all changes routed through a single controlled flow",
        "Admin-safe override mechanism for automation and system processes"
      ],
      "description": "A screen-flow experience that turns messy sales process rules into a simple guided path. Includes conditional screens, validations, and clean updates.",
      "images": [
        "/project-opportunity-stage-manager-1-0.png"
      ],
      "category": "Flow + Admin"
    },
    {
      "colors": {
        "glow": "rgba(139, 92, 246, 0.4)",
        "accent": "#8b5cf6"
      },
      "category": "Development + Admin",
      "links": [
        {
          "icon": "BookOpen",
          "href": "https://drive.google.com/file/d/1OMLz1VDSOiyfRue3DF2xVK3HBBigHEHF/view?usp=sharing",
          "label": "Documentation"
        },
        {
          "label": "Want More Info",
          "href": "mailto:saifmohsen65@gmail.com",
          "icon": "ExternalLink"
        }
      ],
      "title": "Gaming Tournament Project ",
      "bullets": [
        "Before-save record-triggered Flow to enforce tournament capacity and prevent race conditions",
        "Bulkified trigger handler following one-trigger-per-object best practice",
        "Invocable Apex method for complex team roster validation (3–5 players)",
        "Map-based processing & SOQL for-loops for governor-safe bulk operations",
        "98% test coverage using realistic bulk data scenarios"
      ],
      "stack": [
        "Flows",
        "Apex Triggers",
        "Invocable Apex Methods",
        "SOQL",
        "Validation Rules",
        "Roll-Up Summary Fields",
        "Apex Test Classes"
      ],
      "id": "2",
      "description": "A hybrid declarative + Apex-driven Salesforce solution for managing esports tournaments.\nThe system enforces registration rules, tournament capacity, team roster limits, and prize distribution using before-save Flows for transactional safety and Apex service classes for complex, bulk-heavy logic, all built with scalability and testability in mind.",
      "featured": true,
      "icon": "Code2",
      "impact": "*Prevented tournament overbooking with transaction-safe capacity enforcement   *Ensured fair competition through controlled registrations, roster validation, and automated prize distribution    --- *Maintained data integrity at scale under bulk operations (200+ records)",
      "images": [
        "/project-gaming-tournament-project--2-0.png",
        "/project-gaming-tournament-project--2-1.png"
      ]
    },
    {
      "links": [
        {
          "href": "mailto:saifmohsen65@gmail.com",
          "icon": "ExternalLink",
          "label": "Want More Info"
        }
      ],
      "id": "3",
      "colors": {
        "glow": "rgba(16, 185, 129, 0.4)",
        "accent": "#10b981"
      },
      "bullets": [
        "Opportunity inventory protection using Apex validation with addError()",
        "Case priority assignment driven by keyword analysis (Broken / Missing)",
        "Async follow-up task creation using Queueable Apex",
        "Flow-based escalation for high-priority cases (no Apex in Flow)",
        "Order lifecycle inventory management (update / delete / undelete)",
        "Task-based audit logging for all order actions",
        "Visualforce management console unifying Products, Orders, and Cases",
        "Bulk-safe design across all triggers (no SOQL/DML in loops)"
      ],
      "featured": false,
      "images": [
        "/project-retail-automation-suite---inventory--orders---case-management-3-0.png",
        "/project-retail-automation-suite---inventory--orders---case-management-3-1.png",
        "/project-retail-automation-suite---inventory--orders---case-management-3-2.png"
      ],
      "impact": "Prevented invalid sales, automated case escalation and follow-ups, and maintained accurate product inventory across the full retail order lifecycle - all at scale and under bulk load.",
      "stack": [
        "Apex Triggers",
        "Async Apex",
        "Record-Triggered Flows",
        "Visualforce Pages",
        "SOQL",
        "Apex Test Classes"
      ],
      "description": "An end-to-end Salesforce retail automation suite that enforces product availability at opportunity creation, prioritizes and escalates customer support cases, and keeps inventory accurate as orders are updated, deleted, or restored.\nThe system combines bulk-safe Apex, Queueable async processing, record-triggered Flows, and a Visualforce management console to deliver a controlled, auditable, and scalable retail workflow.",
      "icon": "Layers",
      "title": "Retail Automation Suite – Inventory, Orders & Case Management",
      "category": "Apex + Flow + Async + Visualforce"
    },
    {
      "description": "A multi-component Lightning Web Components project designed to showcase component lifecycle hooks, parent–child communication, and reactive state handling using Salesforce-recommended patterns.\n\nThe project includes a product catalog with searchable results, clickable product cards, a detailed view component, and a dedicated lifecycle timer to visualize component initialization and re-rendering behavior.",
      "featured": false,
      "stack": [
        "LWC",
        "JavaScript",
        "@api Decorator",
        "@track Decorator",
        "Custom DOM Events",
        "Conditional Rendering",
        "Salesforce Lightning Design System (SLDS)"
      ],
      "links": [
        {
          "href": "mailto:saifmohsen65@gmail.com",
          "label": "Want More Info"
        }
      ],
      "bullets": [
        "Lifecycle visualization using a dedicated timer component to demonstrate LWC lifecycle hooks",
        "Parent → child communication via @api public properties",
        "Child → parent communication using custom events",
        "Reactive state management using @track for UI-driven updates",
        "Search-driven data flow from child input → parent state → child rendering",
        "Composable component architecture with clear separation of concerns"
      ],
      "impact": "Demonstrated real-world Lightning Web Component communication patterns and lifecycle behavior through a modular product catalog system with parent–child coordination and reactive UI updates.",
      "id": "4",
      "category": "LWC",
      "colors": {
        "accent": "#ff6b35",
        "glow": "rgba(255, 107, 53, 0.4)"
      },
      "title": "LWC Component Communication & Lifecycle Playground",
      "icon": "Puzzle",
      "images": [
        "/project-lwc-component-communication---lifecycle-playground-4-0.png",
        "/project-lwc-component-communication---lifecycle-playground-4-1.png",
        "/project-lwc-component-communication---lifecycle-playground-4-2.png"
      ]
    },
    {
      "id": "mk92luc36uykhb7cdpl",
      "title": "Student Grade Manager",
      "category": "LWC",
      "impact": "Delivered a dynamic, client-side grade management system that visualizes student performance, highlights top achievers, and provides instant class insights without server-side dependency.",
      "description": "A Lightning Web Component built to manage and visualize student grades using reactive state management and computed properties.\nThe component allows users to add students with scores, automatically calculates grades and pass/fail status, and presents real-time class statistics using conditional rendering and template looping.\n\nDesigned to demonstrate core LWC fundamentals with clean, predictable UI behavior.",
      "bullets": [
        "Reactive state management using @track for student data",
        "Computed getters for:  Average score - Pass / Fail status  - Letter grade calculation",
        "Template looping (for:each) to render dynamic student lists",
        "Conditional rendering for empty, filtered, and highlighted states",
        "Client-side filtering (All / Passing / Failing)",
        "Top performer highlighting based on highest score",
        "Visual grade indicators for quick performance recognition"
      ],
      "stack": [
        "LWC",
        "JavaScript",
        "CSS",
        "@track Reactive Properties",
        "Conditional Rendering",
        "Salesforce Lightning Design System (SLDS)"
      ],
      "links": [
        {
          "label": "Want More Info",
          "href": "mailto:saifmohsen65@gmail.com",
          "icon": "ExternalLink"
        }
      ],
      "featured": false,
      "colors": {
        "accent": "#ff6b35",
        "glow": "rgba(ff6b35, 255, 107, 53, 0.4)"
      },
      "icon": "BarChart",
      "images": [
        "/project-student-grade-manager-mk92luc36uykhb7cdpl-0.png"
      ]
    }
  ],
  "timeline": [
    {
      "id": "1",
      "icon": "GraduationCap",
      "details": "Built projects with platform fundamentals, automation decisions, and clean trigger patterns.",
      "title": "Trainee — ITI Salesforce Track",
      "year": "(July 2025 – Jan 2026)",
      "subtitle": "Admin → Apex → LWC → Intro Integrations"
    },
    {
      "year": "(October 2023 – May 2025)",
      "icon": "Briefcase",
      "details": "Managed customer inquiries and matched product specifications to client needs. - Maintained inventory records and processed invoices using Excel, improved order documentation efficiency.",
      "subtitle": "Sales, consulting, inventory, systems",
      "id": "2",
      "title": "Operations Manager — October Pneumatic"
    },
    {
      "subtitle": "Misr University For Science And Technology ",
      "id": "mk7wg96wikhl6db41y9",
      "title": "Student — Business Information Systems",
      "year": "(September 2019 – July 2023)",
      "icon": "GraduationCap",
      "details": "GPA: 3.55 — Grade: Very Good with Honors"
    }
  ],
  "proTip": "I design Salesforce so the next developer doesn’t hate me. 😅"
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
    // Lazy-load Firebase and Firestore Lite (90% smaller)
    const firebaseDb = await initFirebase();
    if (!firebaseDb) return DEFAULT_DATA;

    const { doc, getDoc, collection, getDocs } = await import("firebase/firestore/lite");

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
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
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

    const { doc, setDoc, writeBatch } = await import("firebase/firestore/lite");

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
