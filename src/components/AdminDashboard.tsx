import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  X,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Award,
  Layers,
  FolderKanban,
  Clock,
  Lightbulb,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getPortfolioData,
  getPortfolioDataAsync,
  savePortfolioDataAsync,
  resetPortfolioDataAsync,
  checkAdminPassword,
  isPasswordSet,
  setAdminPassword,
  generateId,
  COLOR_PRESETS,
  ICON_OPTIONS,
  type PortfolioData,
  type Project,
  type Certification,
  type SkillGroup,
  type TimelineItem,
  type Stat,
} from "../data/portfolioData";


// Login Screen
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isFirstTime = !isPasswordSet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isFirstTime) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      setAdminPassword(password);
      onLogin();
    } else {
      if (checkAdminPassword(password)) {
        onLogin();
      } else {
        setError("Incorrect password");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0d2035] to-[#032d60] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a1e0]/20">
            <Lock className="h-8 w-8 text-[#00a1e0]" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isFirstTime ? "Set Up Admin Access" : "Admin Login"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {isFirstTime
              ? "Create a password to protect your dashboard"
              : "Enter your password to access the dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/40 outline-none focus:border-[#00a1e0]/50"
                placeholder="Enter password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isFirstTime && (
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-[#00a1e0]/50"
                placeholder="Confirm password"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#00a1e0] py-3 font-semibold text-white transition hover:bg-[#00a1e0]/90"
          >
            {isFirstTime ? "Create Password" : "Login"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
      </motion.div>
    </div>
  );
}

// Collapsible Section
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00a1e0]/20">
            <Icon className="h-5 w-5 text-[#00a1e0]" />
          </div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-white/40" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/40" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Input Field
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00a1e0]/50"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00a1e0]/50"
        />
      )}
    </div>
  );
}

// Color Picker
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`h-8 w-8 rounded-lg border-2 transition ${
              value === color.value ? "border-white scale-110" : "border-transparent"
            }`}
            style={{ background: color.value }}
            title={color.name}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
          title="Custom color"
        />
      </div>
    </div>
  );
}

// Icon Selector
function IconSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#00a1e0]/50"
      >
        {ICON_OPTIONS.map((icon) => (
          <option key={icon} value={icon} className="bg-[#0d2035]">
            {icon}
          </option>
        ))}
      </select>
    </div>
  );
}

// Image Uploader - converts image to base64 for localStorage storage
function ImageUploader({
  label,
  value,
  onChange,
  placeholder = "Upload image or paste URL",
}: {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB for localStorage)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange(base64);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Error reading file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error uploading image");
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      
      {/* Preview */}
      {value && (
        <div className="mb-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-20 w-20 rounded-lg object-cover border border-white/10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23333' width='80' height='80'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          <button
            onClick={() => onChange(undefined)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-2">
        {/* File Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-3 text-sm text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0] disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[#00a1e0]" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Image (max 2MB)
            </>
          )}
        </button>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00a1e0]/50"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="rounded-lg bg-[#00a1e0]/20 px-4 py-2 text-[#00a1e0] hover:bg-[#00a1e0]/30 disabled:opacity-50"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Multi-Image Uploader for projects with multiple screenshots
function MultiImageUploader({
  label,
  images,
  onChange,
}: {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange([...images, base64]);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Error reading file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error uploading image");
      setIsUploading(false);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt={`Image ${i + 1}`}
                className="h-24 w-24 rounded-lg object-cover border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect fill='%23333' width='96' height='96'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='10'%3EError%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Image number badge */}
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                {i + 1}
              </span>
              {/* Controls overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button
                    onClick={() => moveImage(i, "up")}
                    className="rounded p-1 text-white hover:bg-white/20"
                    title="Move left"
                  >
                    <ArrowUp className="h-4 w-4 -rotate-90" />
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    onClick={() => moveImage(i, "down")}
                    className="rounded p-1 text-white hover:bg-white/20"
                    title="Move right"
                  >
                    <ArrowDown className="h-4 w-4 -rotate-90" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(i)}
                  className="rounded p-1 text-red-400 hover:bg-red-400/20"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-3 text-sm text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0] disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[#00a1e0]" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Add Image (max 2MB each)
            </>
          )}
        </button>

        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste image URL..."
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00a1e0]/50"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="rounded-lg bg-[#00a1e0]/20 px-4 py-2 text-[#00a1e0] hover:bg-[#00a1e0]/30 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {images.length > 0 && (
        <p className="mt-2 text-xs text-white/40">
          First image is used as the card thumbnail. Hover to reorder or remove.
        </p>
      )}
    </div>
  );
}

// List Editor for simple string arrays
function ListEditor({
  label,
  items,
  onChange,
  placeholder = "Add item...",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i] = e.target.value;
                onChange(newItems);
              }}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#00a1e0]/50"
            />
            <button
              onClick={() => removeItem(i)}
              className="rounded-lg p-2 text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00a1e0]/50"
          />
          <button
            onClick={addItem}
            className="rounded-lg bg-[#00a1e0]/20 px-4 py-2 text-[#00a1e0] hover:bg-[#00a1e0]/30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Project Editor Modal
function ProjectEditor({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Project>(
    project || {
      id: generateId(),
      title: "",
      category: "",
      impact: "",
      description: "",
      bullets: [],
      stack: [],
      links: [],
      featured: false,
      colors: { glow: "rgba(0, 161, 224, 0.4)", accent: "#00a1e0" },
    }
  );

  const updateField = <K extends keyof Project>(key: K, value: Project[K]) => {
    setData({ ...data, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/10 bg-[#0d2035] p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {project ? "Edit Project" : "Add Project"}
          </h2>
          <button onClick={onCancel} className="text-white/40 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={data.title}
              onChange={(v) => updateField("title", v)}
              placeholder="Project name"
            />
            <Field
              label="Category"
              value={data.category}
              onChange={(v) => updateField("category", v)}
              placeholder="e.g., Flow + UX"
            />
          </div>

          <Field
            label="Impact"
            value={data.impact}
            onChange={(v) => updateField("impact", v)}
            placeholder="Brief impact statement"
          />

          <Field
            label="Description"
            value={data.description}
            onChange={(v) => updateField("description", v)}
            placeholder="Detailed description"
            multiline
          />

          <ListEditor
            label="Key Highlights"
            items={data.bullets}
            onChange={(v) => updateField("bullets", v)}
            placeholder="Add highlight..."
          />

          <ListEditor
            label="Tech Stack"
            items={data.stack}
            onChange={(v) => updateField("stack", v)}
            placeholder="Add technology..."
          />

          <ColorPicker
            label="Accent Color"
            value={data.colors.accent}
            onChange={(v) =>
              updateField("colors", {
                accent: v,
                glow: v.replace(")", ", 0.4)").replace("rgb", "rgba").replace("#", "rgba(") + 
                  (v.startsWith("#") ? `, ${parseInt(v.slice(1, 3), 16)}, ${parseInt(v.slice(3, 5), 16)}, ${parseInt(v.slice(5, 7), 16)}, 0.4)`.replace("rgba(", "") : ""),
              })
            }
          />

          <MultiImageUploader
            label="Project Screenshots / Images"
            images={data.images || []}
            onChange={(v) => updateField("images", v)}
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-5 w-5 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm text-white/70">Featured Project</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-6 py-2 text-white/70 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            className="rounded-xl bg-[#00a1e0] px-6 py-2 font-semibold text-white hover:bg-[#00a1e0]/90"
          >
            Save Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Main Dashboard
export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<PortfolioData>(getPortfolioData());
  const [hasChanges, setHasChanges] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null | "new">(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check if already logged in (session) and load data from Firestore
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session === "active") {
      setIsLoggedIn(true);
    }
    
    // Load data from Firestore
    getPortfolioDataAsync().then((firestoreData) => {
      setData(firestoreData);
      setIsLoading(false);
    }).catch((err) => {
      console.error("Failed to load data:", err);
      setIsLoading(false);
    });
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("admin_session", "active");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    setIsLoggedIn(false);
  };

  const updateData = (updates: Partial<PortfolioData>) => {
    setData({ ...data, ...updates });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePortfolioDataAsync(data);
      setHasChanges(false);
      setSaveMessage("Changes saved to cloud!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
      setSaveMessage("Failed to save. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all data to defaults? This cannot be undone.")) {
      setIsSaving(true);
      try {
        const defaultData = await resetPortfolioDataAsync();
        setData(defaultData);
        setHasChanges(false);
        setSaveMessage("Data reset to defaults");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch (err) {
        console.error("Failed to reset:", err);
        setSaveMessage("Failed to reset. Please try again.");
        setTimeout(() => setSaveMessage(""), 3000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Project CRUD
  const saveProject = (project: Project) => {
    const projects = [...data.projects];
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    updateData({ projects });
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    if (confirm("Delete this project?")) {
      updateData({ projects: data.projects.filter((p) => p.id !== id) });
    }
  };

  // Certification CRUD
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      title: "New Certification",
      issuer: "Issuer",
      year: new Date().getFullYear().toString(),
      color: "#00a1e0",
    };
    updateData({ certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    updateData({
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const deleteCertification = (id: string) => {
    if (confirm("Delete this certification?")) {
      updateData({ certifications: data.certifications.filter((c) => c.id !== id) });
    }
  };

  // Move certification up or down
  const moveCertification = (id: string, direction: "up" | "down") => {
    const certifications = [...data.certifications];
    const index = certifications.findIndex((c) => c.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= certifications.length) return;

    [certifications[index], certifications[newIndex]] = [certifications[newIndex], certifications[index]];
    updateData({ certifications });
  };

  // Skill Group CRUD
  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: generateId(),
      group: "New Skill Group",
      icon: "Layers",
      color: "#00a1e0",
      items: [],
    };
    updateData({ skillGroups: [...data.skillGroups, newGroup] });
  };

  const updateSkillGroup = (id: string, updates: Partial<SkillGroup>) => {
    updateData({
      skillGroups: data.skillGroups.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    });
  };

  const deleteSkillGroup = (id: string) => {
    if (confirm("Delete this skill group?")) {
      updateData({ skillGroups: data.skillGroups.filter((g) => g.id !== id) });
    }
  };

  // Timeline CRUD
  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: generateId(),
      year: new Date().getFullYear().toString(),
      title: "New Experience",
      subtitle: "Role / Description",
      details: "Details about this experience...",
      icon: "Briefcase",
    };
    updateData({ timeline: [...data.timeline, newItem] });
  };

  const updateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    updateData({
      timeline: data.timeline.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  };

  const deleteTimelineItem = (id: string) => {
    if (confirm("Delete this timeline item?")) {
      updateData({ timeline: data.timeline.filter((t) => t.id !== id) });
    }
  };

  // Move timeline item up or down
  const moveTimelineItem = (id: string, direction: "up" | "down") => {
    const timeline = [...data.timeline];
    const index = timeline.findIndex((t) => t.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= timeline.length) return;

    // Swap items
    [timeline[index], timeline[newIndex]] = [timeline[newIndex], timeline[index]];
    updateData({ timeline });
  };

  // Stat CRUD
  const updateStat = (id: string, updates: Partial<Stat>) => {
    updateData({
      stats: data.stats.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0d2035] to-[#032d60]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#00a1e0]"></div>
          <p className="text-white/60">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2035] to-[#032d60]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d2035]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-green-400"
              >
                {saveMessage}
              </motion.span>
            )}
            
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Link>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                hasChanges && !isSaving
                  ? "bg-[#00a1e0] text-white hover:bg-[#00a1e0]/90"
                  : "bg-white/10 text-white/40"
              }`}
            >
              <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        {/* Personal Info */}
        <Section title="Personal Information" icon={User} defaultOpen>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              value={data.name}
              onChange={(v) => updateData({ name: v })}
            />
            <Field
              label="Headline"
              value={data.headline}
              onChange={(v) => updateData({ headline: v })}
            />
            <Field
              label="Tagline"
              value={data.tagline}
              onChange={(v) => updateData({ tagline: v })}
            />
            <Field
              label="Location"
              value={data.location}
              onChange={(v) => updateData({ location: v })}
            />
            <Field
              label="Email"
              value={data.email}
              onChange={(v) => updateData({ email: v })}
              type="email"
            />
            <Field
              label="Trailblazer Rank"
              value={data.trailblazerRank}
              onChange={(v) => updateData({ trailblazerRank: v })}
            />
            <Field
              label="LinkedIn URL"
              value={data.linkedin}
              onChange={(v) => updateData({ linkedin: v })}
              type="url"
            />
            <Field
              label="GitHub URL"
              value={data.github}
              onChange={(v) => updateData({ github: v })}
              type="url"
            />
            <Field
              label="Resume URL"
              value={data.resumeUrl}
              onChange={(v) => updateData({ resumeUrl: v })}
              type="url"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Subheadline / Bio"
              value={data.subheadline}
              onChange={(v) => updateData({ subheadline: v })}
              multiline
            />
          </div>
        </Section>

        {/* Stats */}
        <Section title="Stats" icon={Settings}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.stats.map((stat) => (
              <div key={stat.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="grid gap-3">
                  <Field
                    label="Label"
                    value={stat.label}
                    onChange={(v) => updateStat(stat.id, { label: v })}
                  />
                  <Field
                    label="Value"
                    value={stat.value}
                    onChange={(v) => updateStat(stat.id, { value: v })}
                  />
                  <IconSelector
                    label="Icon"
                    value={stat.icon}
                    onChange={(v) => updateStat(stat.id, { icon: v })}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Principles */}
        <Section title="Principles / Badges" icon={Award}>
          <ListEditor
            label="Your coding principles"
            items={data.principles}
            onChange={(v) => updateData({ principles: v })}
            placeholder="Add principle..."
          />
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={FolderKanban}>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded bg-[#ff6b35] px-2 py-0.5 text-xs text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setEditingProject("new")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-4 text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0]"
            >
              <Plus className="h-5 w-5" />
              Add Project
            </button>
          </div>
        </Section>

        {/* Certifications */}
        <Section title="Certifications" icon={Award}>
          <p className="mb-4 text-sm text-white/50">
            Use the arrow buttons to reorder certifications. Items at the top appear first.
          </p>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                {/* Order Controls */}
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-white/30" />
                    <span className="text-sm font-medium text-white/50">
                      Position: {index + 1} of {data.certifications.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveCertification(cert.id, "up")}
                      disabled={index === 0}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveCertification(cert.id, "down")}
                      disabled={index === data.certifications.length - 1}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Title"
                    value={cert.title}
                    onChange={(v) => updateCertification(cert.id, { title: v })}
                  />
                  <Field
                    label="Issuer"
                    value={cert.issuer}
                    onChange={(v) => updateCertification(cert.id, { issuer: v })}
                  />
                  <Field
                    label="Year"
                    value={cert.year}
                    onChange={(v) => updateCertification(cert.id, { year: v })}
                  />
                  <ColorPicker
                    label="Color"
                    value={cert.color}
                    onChange={(v) => updateCertification(cert.id, { color: v })}
                  />
                </div>
                <div className="mt-3">
                  <ImageUploader
                    label="Certificate Badge / Image"
                    value={cert.image}
                    onChange={(v) => updateCertification(cert.id, { image: v })}
                    placeholder="URL or upload certificate badge"
                  />
                </div>
                <button
                  onClick={() => deleteCertification(cert.id)}
                  className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={addCertification}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-4 text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0]"
            >
              <Plus className="h-5 w-5" />
              Add Certification
            </button>
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={Layers}>
          <div className="space-y-4">
            {data.skillGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Group Name"
                    value={group.group}
                    onChange={(v) => updateSkillGroup(group.id, { group: v })}
                  />
                  <IconSelector
                    label="Icon"
                    value={group.icon}
                    onChange={(v) => updateSkillGroup(group.id, { icon: v })}
                  />
                  <ColorPicker
                    label="Color"
                    value={group.color}
                    onChange={(v) => updateSkillGroup(group.id, { color: v })}
                  />
                </div>
                <div className="mt-3">
                  <ListEditor
                    label="Skills"
                    items={group.items}
                    onChange={(v) => updateSkillGroup(group.id, { items: v })}
                    placeholder="Add skill..."
                  />
                </div>
                <button
                  onClick={() => deleteSkillGroup(group.id)}
                  className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Group
                </button>
              </div>
            ))}
            <button
              onClick={addSkillGroup}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-4 text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0]"
            >
              <Plus className="h-5 w-5" />
              Add Skill Group
            </button>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="Journey / Timeline" icon={Clock}>
          <p className="mb-4 text-sm text-white/50">
            Use the arrow buttons to reorder timeline items. Items at the top appear first.
          </p>
          <div className="space-y-4">
            {data.timeline.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                {/* Order Controls */}
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-white/30" />
                    <span className="text-sm font-medium text-white/50">
                      Position: {index + 1} of {data.timeline.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveTimelineItem(item.id, "up")}
                      disabled={index === 0}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveTimelineItem(item.id, "down")}
                      disabled={index === data.timeline.length - 1}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Year"
                    value={item.year}
                    onChange={(v) => updateTimelineItem(item.id, { year: v })}
                  />
                  <Field
                    label="Title"
                    value={item.title}
                    onChange={(v) => updateTimelineItem(item.id, { title: v })}
                  />
                  <Field
                    label="Subtitle"
                    value={item.subtitle}
                    onChange={(v) => updateTimelineItem(item.id, { subtitle: v })}
                  />
                  <IconSelector
                    label="Icon"
                    value={item.icon}
                    onChange={(v) => updateTimelineItem(item.id, { icon: v })}
                  />
                </div>
                <div className="mt-3">
                  <Field
                    label="Details"
                    value={item.details}
                    onChange={(v) => updateTimelineItem(item.id, { details: v })}
                    multiline
                  />
                </div>
                <button
                  onClick={() => deleteTimelineItem(item.id)}
                  className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={addTimelineItem}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-4 text-white/50 hover:border-[#00a1e0] hover:text-[#00a1e0]"
            >
              <Plus className="h-5 w-5" />
              Add Timeline Item
            </button>
          </div>
        </Section>

        {/* Pro Tip */}
        <Section title="Pro Tip" icon={Lightbulb}>
          <Field
            label="Your pro tip / advice"
            value={data.proTip}
            onChange={(v) => updateData({ proTip: v })}
            multiline
            rows={4}
          />
        </Section>
      </main>

      {/* Project Editor Modal */}
      {editingProject && (
        <ProjectEditor
          project={editingProject === "new" ? null : editingProject}
          onSave={saveProject}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}
