import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAnalyticsStats, clearAnalytics, type AnalyticsEvent } from "../analytics";
import { Activity, Users, MousePointer, Clock, Monitor, LogOut, LayoutDashboard, Smartphone, Briefcase, FileText, Mail, Linkedin, Github, TrendingUp, Zap, Cloud, Trash2, AlertTriangle, RefreshCw, Download } from "lucide-react";

export default function AnalyticsDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return <DashboardContent onLogout={handleLogout} />;
}

function DashboardContent({ onLogout }: { onLogout: () => void }) {
    const [stats, setStats] = useState<{
        totalEvents: number;
        uniqueVisitors: number;
        breakdown: Record<string, number>;
        recentEvents: AnalyticsEvent[];
        topProjects: [string, number][];
        deviceStats: { mobile: number; desktop: number };
        conversions: { hire: number; resume: number; email: number; linkedin: number; github: number; trailhead: number; other: number };
    } | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = () => {
        getAnalyticsStats().then(setStats);
    };

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
                        <button
                            onClick={loadStats}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                            title="Refresh Data"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                        <button
                            onClick={() => exportToCSV(stats.recentEvents)}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                        <Link
                            to="/admin"
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Content Admin
                        </Link>

                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Reset
                        </button>
                        <button
                            onClick={onLogout}
                            className="btn-interactive rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                {/* Activity Trend Chart */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#00a1e0]" />
                        Activity Trend (Last 24h)
                    </h3>
                    <ActivityChart events={stats.recentEvents} />
                </div>

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
                        icon={TrendingUp}
                        label="Engagement Rate"
                        value={`${stats.uniqueVisitors ? ((stats.totalEvents / stats.uniqueVisitors).toFixed(1)) : 0} avg`}
                        color="text-orange-400"
                        bg="bg-orange-500/10"
                    />
                </div>

                {/* Conversion Goals */}
                <div className="mt-8">
                    <h3 className="mb-4 text-sm font-medium text-white/50 uppercase tracking-wider">Conversion Goals</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        <ConversionCard icon={Zap} label="Hired" value={stats.conversions.hire} color="text-yellow-400" />
                        <ConversionCard icon={FileText} label="Resumes" value={stats.conversions.resume} color="text-emerald-400" />
                        <ConversionCard icon={Mail} label="Emails" value={stats.conversions.email} color="text-blue-400" />
                        <ConversionCard icon={Linkedin} label="LinkedIn" value={stats.conversions.linkedin} color="text-[#0077b5]" />
                        <ConversionCard icon={Github} label="GitHub" value={stats.conversions.github} color="text-white" />
                        <ConversionCard icon={Cloud} label="Trailhead" value={stats.conversions.trailhead} color="text-[#00a1e0]" />
                    </div>
                </div>

                {/* Detailed Breakdown Row */}
                <div className="mt-8 grid gap-8 md:grid-cols-3">
                    {/* Top Projects */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-emerald-400" />
                                Top Projects
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {stats.topProjects.length > 0 ? stats.topProjects.slice(0, 5).map(([name, count], i) => (
                                <div key={name} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-white">{i + 1}. {name}</span>
                                        <span className="text-white/60">{count} views</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                        <div
                                            className="h-full bg-emerald-500/50 rounded-full"
                                            style={{ width: `${(count / stats.topProjects[0][1]) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-white/40 italic">No project views recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-blue-400" />
                                Devices
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <DeviceBar
                                icon={Smartphone}
                                label="Mobile"
                                value={stats.deviceStats.mobile}
                                total={stats.totalEvents || 1}
                                color="bg-purple-500"
                            />
                            <DeviceBar
                                icon={Monitor}
                                label="Desktop"
                                value={stats.deviceStats.desktop}
                                total={stats.totalEvents || 1}
                                color="bg-blue-500"
                            />
                        </div>
                    </div>
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
                                    <th className="px-6 py-3 font-medium">IP Address</th>
                                    <th className="px-6 py-3 font-medium">Source</th>
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
                                        <td className="px-6 py-4 font-mono text-xs text-white/50">
                                            {event.ip || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white/60 max-w-[150px] truncate" title={event.referrer}>
                                            {event.referrer ? new URL(event.referrer).hostname : 'Direct'}
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

            {showClearConfirm && (
                <ClearAnalyticsModal
                    onClose={() => setShowClearConfirm(false)}
                    onConfirm={() => {
                        loadStats();
                        setShowClearConfirm(false);
                    }}
                />
            )}
        </div>
    );
}

function ClearAnalyticsModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // Import dynamically to avoid circular dependency issues if any, but regular import is fine here.
    // We need clearAnalytics from ../analytics
    // Note: We need to import it at top of file, assuming it's exported.

    const handleClear = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");

        // Simple safety check - no password needed since they are already logged in as admin
        // But maybe a "type DELETE" confirmation?
        // Let's just ask "Are you sure?"

        setLoading(true);
        // We need to import clearAnalytics.
        // I will assume it's imported at the top. I need to add it to imports in the first chunk if strict.
        // Actually I forgot to add it to imports in Chunk 1. I'll use require or assumes I'll fix imports.
        // I'll fix imports in a separate tool call if this fails, or use window/dynamic... no.
        // I'll add logic to chunk 1.

        // Wait, I can't restart chunk 1.
        // I'll assume 'clearAnalytics' is available? use replacement to add it.
        const success = await clearAnalytics();

        if (success) {
            onConfirm();
        } else {
            setErr("Failed to clear data. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-[#0d2035] p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-xl font-bold">Clear All Data?</h3>
                </div>
                <p className="text-white/60 mb-6">
                    This action cannot be undone. All analytics events and statistics will be permanently deleted.
                </p>

                {err && <p className="mb-4 text-sm text-red-400">{err}</p>}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-white/60 hover:bg-white/5 hover:text-white"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Confirm Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ConversionCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50">{label}</p>
            </div>
        </div>
    )
}

function DeviceBar({ icon: Icon, label, value, total, color }: any) {
    const percent = Math.round((value / total) * 100) || 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-white/80">
                    <Icon className="h-4 w-4 text-white/40" />
                    {label}
                </div>
                <span className="text-sm font-bold text-white">{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
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

function exportToCSV(events: AnalyticsEvent[]) {
    if (!events || events.length === 0) return;

    const headers = ["Timestamp", "Event Name", "Session ID", "Referrer", "User Agent"];
    const csvContent = [
        headers.join(","),
        ...events.map(e => [
            new Date(e.timestamp).toISOString(),
            e.eventName,
            e.sessionId || "",
            e.referrer ? `"${e.referrer.replace(/"/g, '""')}"` : "",
            e.userAgent ? `"${e.userAgent.replace(/"/g, '""')}"` : ""
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function ActivityChart({ events }: { events: AnalyticsEvent[] }) {
    // Group events by hour (last 24 hours)
    const hours = Array.from({ length: 24 }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (23 - i), 0, 0, 0);
        return d;
    });

    const data = hours.map(hour => {
        const count = events.filter(e => {
            const eventTime = new Date(e.timestamp);
            return eventTime.getHours() === hour.getHours() &&
                eventTime.getDate() === hour.getDate();
        }).length;
        return { hour, count };
    });

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const height = 150;
    const width = 1000; // viewbox width

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height + 30}`}
                className="w-full min-w-[600px] h-48"
                style={{ overflow: 'visible' }}
            >
                {/* Y-axis grid lines */}
                {[0, 0.5, 1].map(ratio => (
                    <line
                        key={ratio}
                        x1="0"
                        y1={height * ratio}
                        x2={width}
                        y2={height * ratio}
                        stroke="rgba(255,255,255,0.1)"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Bars */}
                {data.map((d, i) => {
                    const barHeight = (d.count / maxCount) * height;
                    const x = (i / 24) * width;
                    const barWidth = (width / 24) - 8;

                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={height - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill="#00a1e0"
                                opacity={0.6 + (d.count / maxCount) * 0.4}
                                rx="4"
                            >
                                <title>{d.hour.toLocaleTimeString([], { hour: 'numeric' })}: {d.count} events</title>
                            </rect>
                            {/* X-axis labels (every 4 hours) */}
                            {i % 4 === 0 && (
                                <text
                                    x={x + barWidth / 2}
                                    y={height + 20}
                                    fill="rgba(255,255,255,0.4)"
                                    fontSize="12"
                                    textAnchor="middle"
                                >
                                    {d.hour.getHours()}:00
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
