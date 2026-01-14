import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin");
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/invalid-credential") {
                setError("You are not me! why are you trying to hack me?😒");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("Failed to login. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-500 ${theme === 'morning' ? 'bg-slate-50' : 'bg-gradient-to-br from-[#0d2035] to-[#032d60]'}`}>
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className={`rounded-full p-2 backdrop-blur-sm border transition-colors ${theme === 'morning'
                        ? 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white/80'
                        : 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20'
                        }`}
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
                                <Moon className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="h-5 w-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-md rounded-2xl border p-8 backdrop-blur-xl transition-colors duration-500 ${theme === 'morning'
                    ? 'bg-white border-slate-200 shadow-xl'
                    : 'bg-white/5 border-white/10'
                    }`}
            >
                <div className="mb-6 text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${theme === 'morning' ? 'bg-[#00a1e0]/10' : 'bg-[#00a1e0]/20'}`}>
                        <Lock className="h-8 w-8 text-[#00a1e0]" />
                    </div>
                    <h1 className={`text-2xl font-bold ${theme === 'morning' ? 'text-slate-900' : 'text-white'}`}>Admin Access</h1>
                    <p className={`mt-2 text-sm ${theme === 'morning' ? 'text-slate-500' : 'text-white/60'}`}>
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'morning' ? 'text-slate-700' : 'text-white/80'}`}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[#00a1e0]/50 ${theme === 'morning'
                                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                                : 'bg-white/5 border-white/10 text-white placeholder-white/40'
                                }`}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'morning' ? 'text-slate-700' : 'text-white/80'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none focus:border-[#00a1e0]/50 ${theme === 'morning'
                                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                                    : 'bg-white/5 border-white/10 text-white placeholder-white/40'
                                    }`}
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'morning' ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white/60'}`}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-[#00a1e0] py-3 font-semibold text-white transition hover:bg-[#00a1e0]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <Link
                    to="/"
                    className={`mt-6 flex items-center justify-center gap-2 text-sm hover:opacity-100 ${theme === 'morning' ? 'text-slate-500 hover:text-slate-900' : 'text-white/40 hover:text-white/60'}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Portfolio
                </Link>
            </motion.div>
        </div>
    );
}
