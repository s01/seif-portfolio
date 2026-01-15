import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Activity, Users, MousePointer, TrendingUp, LogOut, LayoutDashboard, Linkedin, RefreshCw, Download, Globe, ExternalLink, Box, Command, Clock } from "lucide-react";

interface AnalyticsSummary {
    totalVisits: number;
    uniqueVisitors: number;
    visitsBySource: Record<string, number>;
    topPages: Array<{ path: string; count: number }>;
    dailyVisits: Array<{ date: string; count: number }>;
    linkedInStats: {
        total: number;
        webview: number;
        withUTM: number;
    };
    projectClicks: Array<{ project: string; count: number }>;
    buttonClicks: Array<{ button: string; count: number }>;
    recentEvents: Array<any>;
}

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
    const [stats, setStats] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            // Check if we're in development mode
            const isDev = import.meta.env.DEV;

            if (isDev) {
                throw new Error(
                    '📍 Analytics API only works in production.'
                );
            }

            const response = await fetch('/api/analytics/summary?days=30');

            if (!response.ok) {
                throw new Error(`Failed to load analytics: ${response.statusText}`);
            }

            const data = await response.json();
            setStats(data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('[Analytics] Error loading stats:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0d2035] text-white">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#00a1e0] mx-auto mb-4"></div>
                    <p className="text-white/60">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0d2035] text-white p-6">
                <div className="max-w-2xl text-center">
                    <div className="mb-4 text-5xl">
                        {error.includes('📍') ? '📍' : '⚠️'}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                        {error.includes('📍') ? 'Development Mode' : 'Error Loading Analytics'}
                    </h2>
                    <div className="text-left bg-black/30 rounded-lg p-6 mb-6">
                        <pre className="text-white/80 whitespace-pre-wrap text-sm font-mono">
                            {error}
                        </pre>
                    </div>
                    {!error.includes('📍') && (
                        <button
                            onClick={() => loadStats(false)}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5 mx-auto"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    )}
                    {error.includes('📍') && (
                        <div className="text-white/60 text-sm">
                            <p className="mb-2">💡 <strong>Quick Start:</strong></p>
                            <code className="block bg-black/50 p-3 rounded text-left text-xs">
                                npm install -g vercel<br />
                                vercel login<br />
                                vercel --prod
                            </code>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const engagementRate = stats.uniqueVisitors > 0
        ? (stats.totalVisits / stats.uniqueVisitors).toFixed(1)
        : '0';

    return (
        <div className="min-h-screen bg-[#0d2035] p-6 text-white md:p-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold">
                            <Activity className="text-[#00a1e0]" />
                            Portfolio Analytics
                        </h1>
                        <div className="mt-2 flex items-center gap-3 text-sm text-white/50">
                            <span>Comprehensive tracking • Last 30 days</span>
                            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-xs font-mono">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => loadStats(false)}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => exportToCSV(stats!)}
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                        <Link
                            to="/admin"
                            className="btn-interactive flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin
                        </Link>
                        <button
                            onClick={onLogout}
                            className="btn-interactive rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
                    <StatCard
                        icon={Users}
                        label="Unique Visitors"
                        value={stats.uniqueVisitors.toLocaleString()}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />
                    <StatCard
                        icon={MousePointer}
                        label="Total Events"
                        value={stats.totalVisits.toLocaleString()}
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Engagement Rate"
                        value={`${engagementRate}x avg`}
                        color="text-orange-400"
                        bg="bg-orange-500/10"
                    />
                    <StatCard
                        icon={Linkedin}
                        label="LinkedIn Visits"
                        value={stats.linkedInStats.total.toLocaleString()}
                        color="text-[#0077b5]"
                        bg="bg-[#0077b5]/10"
                    />
                </div>

                {/* LinkedIn Insights */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                        LinkedIn Traffic Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InsightCard
                            label="Total LinkedIn Visits"
                            value={stats.linkedInStats.total}
                            description="All visits from LinkedIn"
                        />
                        <InsightCard
                            label="In-App Browser"
                            value={stats.linkedInStats.webview}
                            description="LinkedIn mobile app WebView"
                            highlight
                        />
                        <InsightCard
                            label="With UTM Tags"
                            value={stats.linkedInStats.withUTM}
                            description="Properly tagged campaigns"
                        />
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Project Interactions */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                            <Box className="h-5 w-5 text-emerald-400" />
                            Project Interest
                        </h3>
                        <div className="space-y-4">
                            {(stats.projectClicks || []).map((project, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-white">{project.project}</span>
                                        <span className="text-white/60">{project.count} clicks</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                        <div
                                            className="h-full bg-emerald-500/50 rounded-full"
                                            style={{ width: `${(project.count / (stats.projectClicks[0]?.count || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!stats.projectClicks || stats.projectClicks.length === 0) && (
                                <p className="text-sm text-white/40 italic">No project clicks yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Button Interactions */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                            <Command className="h-5 w-5 text-purple-400" />
                            Top Actions
                        </h3>
                        <div className="space-y-3">
                            {(stats.buttonClicks || []).map((btn, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-sm font-medium text-white capitalize">
                                        {btn.button.replace(/_/g, ' ')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                            {btn.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!stats.buttonClicks || stats.buttonClicks.length === 0) && (
                                <p className="text-sm text-white/40 italic">No button interactions yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Traffic & Pages */}
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                    {/* Traffic Sources */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-400" />
                            Traffic Sources
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(stats.visitsBySource)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 10)
                                .map(([source, count]) => {
                                    const total = stats.totalVisits || 1;
                                    const percentage = ((count / total) * 100).toFixed(1);
                                    return (
                                        <div key={source} className="relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-white capitalize">{source}</span>
                                                <span className="text-white/60">{count} ({percentage}%)</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                                <div
                                                    className={`h-full rounded-full ${source === 'linkedin' ? 'bg-[#0077b5]' :
                                                        source === 'direct' ? 'bg-purple-500/50' :
                                                            'bg-blue-500/50'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                            <ExternalLink className="h-5 w-5 text-orange-400" />
                            Top Pages
                        </h3>
                        <div className="space-y-4">
                            {stats.topPages.slice(0, 10).map((page, i) => {
                                const maxCount = stats.topPages[0]?.count || 1;
                                const percentage = ((page.count / maxCount) * 100).toFixed(0);
                                return (
                                    <div key={page.path} className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-white truncate max-w-[200px]">
                                                {i + 1}. {page.path}
                                            </span>
                                            <span className="text-white/60">{page.count} views</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                            <div
                                                className="h-full bg-orange-500/50 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 overflow-hidden">
                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-teal-400" />
                        Recent Live Activity (Last 100 Events)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white/70">
                            <thead className="bg-white/5 text-white">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Time</th>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Visitor IP</th>
                                    <th className="px-4 py-3">Source</th>
                                    <th className="px-4 py-3">Path</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(stats.recentEvents || []).map((event: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {event.createdAt ? new Date(event.createdAt).toLocaleTimeString() : new Date(event.receivedAt).toLocaleTimeString()}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white">
                                            {event.eventName || 'Page View'}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs opacity-70" title={event.ip || event.ipHash || 'N/A'}>
                                            {event.ip || (event.ipHash ? `${event.ipHash.substring(0, 8)}...` : 'unknown')}
                                        </td>
                                        <td className="px-4 py-3 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs ${event.source === 'linkedin' ? 'bg-[#0077b5]/20 text-[#0077b5]' : 'bg-white/10'}`}>
                                                {event.source || 'Direct'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono">{event.path}</td>
                                        <td className="px-4 py-3 text-xs opacity-60">
                                            {event.project ? `Project: ${event.project}` :
                                                event.label ? `Label: ${event.label}` :
                                                    event.linkedinWebview ? 'In-App Browser' : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.recentEvents || stats.recentEvents.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-white/30 italic">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Daily Visits Chart */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#00a1e0]" />
                        Daily Visits (Last 30 Days)
                    </h3>
                    <DailyVisitsChart data={stats.dailyVisits} />
                </div>

            </div>
        </div>
    );
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

function InsightCard({ label, value, description, highlight }: {
    label: string;
    value: number;
    description: string;
    highlight?: boolean;
}) {
    return (
        <div className={`rounded-xl border ${highlight ? 'border-[#0077b5]/30 bg-[#0077b5]/5' : 'border-white/10 bg-white/5'} p-4`}>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm font-medium text-white/80 mb-1">{label}</p>
            <p className="text-xs text-white/50">{description}</p>
        </div>
    );
}

function DailyVisitsChart({ data }: { data: Array<{ date: string; count: number }> }) {
    if (!data || data.length === 0) {
        return <p className="text-white/40 text-sm italic">No data available</p>;
    }

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const height = 200;
    const width = 1000;

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height + 40}`}
                className="w-full min-w-[600px] h-64"
                style={{ overflow: 'visible' }}
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
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
                    const x = (i / data.length) * width;
                    const barWidth = (width / data.length) - 4;

                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={height - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill="#00a1e0"
                                opacity={0.6 + (d.count / maxCount) * 0.4}
                                rx="2"
                            >
                                <title>{d.date}: {d.count} visits</title>
                            </rect>
                            {/* Show every 5th date label */}
                            {i % 5 === 0 && (
                                <text
                                    x={x + barWidth / 2}
                                    y={height + 20}
                                    fill="rgba(255,255,255,0.4)"
                                    fontSize="10"
                                    textAnchor="middle"
                                >
                                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function exportToCSV(stats: AnalyticsSummary) {
    const headers = ["Metric", "Value", "Details"];
    const rows = [
        ["Total Visits", stats.totalVisits.toString(), ""],
        ["Unique Visitors", stats.uniqueVisitors.toString(), ""],
        ["LinkedIn Total", stats.linkedInStats.total.toString(), ""],
        ["LinkedIn WebView", stats.linkedInStats.webview.toString(), ""],
        ["LinkedIn with UTM", stats.linkedInStats.withUTM.toString(), ""],
        ["", "", ""],
        ["Traffic Sources", "Count", ""],
        ...Object.entries(stats.visitsBySource).map(([source, count]) => [source, count.toString(), ""]),
        ["", "", ""],
        ["Top Pages", "Views", ""],
        ...stats.topPages.map(page => [page.path, page.count.toString(), ""]),
        ["", "", ""],
        ["Project Clicks", "Clicks", ""],
        ...(stats.projectClicks || []).map(p => [p.project, p.count.toString(), ""]),
        ["", "", ""],
        ["Recent Events", "Type", "Source"],
        ...(stats.recentEvents || []).map(e => [
            new Date(e.receivedAt || e.createdAt).toISOString(),
            e.eventName || 'page_view',
            e.source
        ])
    ];

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
