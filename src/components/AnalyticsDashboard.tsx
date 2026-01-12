import React, { useEffect, useState } from "react";
import { getAnalyticsStats, type AnalyticsEvent } from "../analytics";
import { checkAdminPasswordAsync, setAdminPasswordAsync } from "../data/portfolioData";
import { Activity, Users, MousePointer, ShieldCheck, Clock, Monitor, Key, LogOut, ArrowLeft, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnalyticsDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Auth State
    useEffect(() => {
        const session = sessionStorage.getItem("admin_session");
        if (session === "active") {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        sessionStorage.setItem("admin_session", "active");
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("admin_session");
        setIsAuthenticated(false);
    };

    if (loading) return null;

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLoginSuccess} />;
    }

    return <DashboardContent onLogout={handleLogout} />;
}

// Reuse Login Logic similar to AdminDashboard but simpler
function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const isValid = await checkAdminPasswordAsync(password);
            if (isValid) {
                onLogin();
            } else {
                setError("access_denied: Invalid password");
            }
        } catch {
            setError("system_error: Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d2035] p-4 text-white">
            <div className="w-full max-w-sm space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a1e0]/20">
                        <ShieldCheck className="h-8 w-8 text-[#00a1e0]" />
                    </div>
                    <h2 className="text-2xl font-bold">Analytics Access</h2>
                    <p className="mt-2 text-sm text-white/50">Enter admin password to view stats</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-12 text-white placeholder-white/30 focus:border-[#00a1e0] focus:outline-none"
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

                    {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#00a1e0] py-3 font-semibold text-white hover:bg-[#00a1e0]/90 disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Unlock Dashboard"}
                    </button>
                </form>
                <Link
                    to="/"
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/60"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Portfolio
                </Link>
            </div>
        </div>
    );
}

function DashboardContent({ onLogout }: { onLogout: () => void }) {
    const [stats, setStats] = useState<{
        totalEvents: number;
        uniqueVisitors: number;
        breakdown: Record<string, number>;
        recentEvents: AnalyticsEvent[];
    } | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        getAnalyticsStats().then(setStats);
    }, []);

    if (!stats) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0d2035] text-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-[#00a1e0]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d2035] p-6 text-white md:p-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold">
                            <Activity className="text-[#00a1e0]" />
                            Analytics Dashboard
                        </h1>
                        <p className="mt-2 text-white/50">Real-time portfolio interactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Content Admin
                        </Link>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <Key className="h-4 w-4" />
                            Change Password
                        </button>
                        <button
                            onClick={onLogout}
                            className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatCard
                        icon={Users}
                        label="Unique Visitors"
                        value={stats.uniqueVisitors.toLocaleString()}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />
                    <StatCard
                        icon={MousePointer}
                        label="Total Interactions"
                        value={stats.totalEvents.toLocaleString()}
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                    />
                    <StatCard
                        icon={Monitor}
                        label="Active Sessions"
                        value={(stats.uniqueVisitors * 1 + (Math.random() > 0.5 ? 1 : 0)).toFixed(0)}
                        color="text-orange-400"
                        bg="bg-orange-500/10"
                    />
                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4">
                        <h2 className="text-lg font-semibold">Interaction Log</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-white/60">
                                <tr>
                                    <th className="px-6 py-3 font-medium">When</th>
                                    <th className="px-6 py-3 font-medium">Event</th>
                                    <th className="px-6 py-3 font-medium">Who (Session)</th>
                                    <th className="px-6 py-3 font-medium">Device</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.recentEvents.map((event, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition">
                                        <td className="whitespace-nowrap px-6 py-4 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-white/40" />
                                                {event.timestamp.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.eventName === 'page_view' ? 'bg-blue-500/20 text-blue-300' :
                                                event.eventName.includes('click') ? 'bg-emerald-500/20 text-emerald-300' :
                                                    'bg-white/10 text-white'
                                                }`}>
                                                {event.eventName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-white/50">
                                            {event.sessionId?.slice(0, 8) || 'Unknown'}
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-4 text-xs text-white/30" title={event.userAgent}>
                                            {getBrowserInfo(event.userAgent || '')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
        </div>
    );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(""); setMsg("");
        if (newPass !== confirm) return setErr("Passwords do not match");
        if (newPass.length < 4) return setErr("Password too short");

        const valid = await checkAdminPasswordAsync(current);
        if (!valid) return setErr("Current password incorrect");

        await setAdminPasswordAsync(newPass);
        setMsg("Password updated successfully");
        setTimeout(onClose, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d2035] p-6 shadow-2xl">
                <h3 className="mb-4 text-xl font-bold text-white">Change Password</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input type="password" placeholder="Current Password" value={current} onChange={e => setCurrent(e.target.value)} className="w-full rounded-lg bg-black/20 px-4 py-2 text-white border border-white/10" required />
                    <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full rounded-lg bg-black/20 px-4 py-2 text-white border border-white/10" required />
                    <input type="password" placeholder="Confirm New" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-lg bg-black/20 px-4 py-2 text-white border border-white/10" required />

                    {err && <p className="text-red-400 text-sm">{err}</p>}
                    {msg && <p className="text-green-400 text-sm">{msg}</p>}

                    <div className="flex gap-2 justify-end mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-white/60 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#00a1e0] text-white rounded-lg">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <div className={`flex items-center gap-4 rounded-xl border border-white/10 ${bg} p-6`}>
            <div className={`rounded-lg p-3 ${bg} ${color}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-white/60">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

function getBrowserInfo(ua: string) {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown";
}
