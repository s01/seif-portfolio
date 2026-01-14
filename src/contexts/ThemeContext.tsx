
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "night" | "morning";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as Theme | null;
            if (savedTheme) {
                return savedTheme;
            }
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            return prefersDark ? "night" : "morning";
        }
        return "night";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        // Optional: Add a class to the body or document element if using Tailwind's 'darkMode: class' strategy
        // But since we are using explicit conditional classes, this might not be strictly necessary unless we switch strategies.
        // For now, we'll keep the logic explicitly in components as requested.
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "morning" ? "night" : "morning"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
