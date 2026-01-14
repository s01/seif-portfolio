import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Activity, Users, MousePointer, TrendingUp, LogOut, LayoutDashboard, Linkedin, RefreshCw, Download, Globe, ExternalLink } from "lucide-react";

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

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        try {
            // Check if we're in development mode (API routes don't work with npm run dev)
            const isDev = import.meta.env.DEV;

            if (isDev) {
                // In development, show a helpful message
                throw new Error(
                    '📍 Analytics API only works in production.\n\n' +
                    'To test locally, use: vercel dev\n' +
                    'Or deploy to Vercel: vercel --prod\n\n' +
                    'The API routes are Vercel serverless functions that don\'t run with "npm run dev".'
                );
            }

            // Call the new API endpoint
            const response = await fetch('/api/analytics/summary?days=30');

            if (!response.ok) {
                throw new Error(`Failed to load analytics: ${response.statusText}`);
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('[Analytics] Error loading stats:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        } finally {
            setLoading(false);
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
                            onClick={loadStats}
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
                            LinkedIn Analytics
                        </h1>
                        <p className="mt-2 text-white/50">First-party tracking • Last 30 days</p>
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
                            onClick={() => exportToCSV(stats)}
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
                        label="Total Visits"
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

                {/* Traffic Sources & Top Pages */}
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                    {/* Traffic Sources */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-emerald-400" />
                                Traffic Sources
                            </h3>
                        </div>
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
                                                            'bg-emerald-500/50'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            {Object.keys(stats.visitsBySource).length === 0 && (
                                <p className="text-sm text-white/40 italic">No traffic data yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ExternalLink className="h-5 w-5 text-blue-400" />
                                Top Pages
                            </h3>
                        </div>
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
                                                className="h-full bg-blue-500/50 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.topPages.length === 0 && (
                                <p className="text-sm text-white/40 italic">No page views yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daily Visits Chart */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#00a1e0]" />
                        Daily Visits (Last 30 Days)
                    </h3>
                    <DailyVisitsChart data={stats.dailyVisits} />
                </div>

                {/* How to Add UTM Parameters */}
                <div className="mt-8 rounded-2xl border border-[#00a1e0]/20 bg-[#00a1e0]/5 p-6">
                    <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                        💡 Pro Tip: Track LinkedIn Posts
                    </h3>
                    <p className="text-white/70 mb-3">
                        Add UTM parameters to your LinkedIn post links to track campaign performance:
                    </p>
                    <code className="block bg-black/30 p-3 rounded-lg text-sm text-[#00a1e0] overflow-x-auto">
                        https://yoursite.com/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio_launch
                    </code>
                    <p className="text-white/50 text-sm mt-3">
                        Even without UTM tags, this system detects LinkedIn traffic via referrer and user agent analysis.
                    </p>
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
    const headers = ["Metric", "Value"];
    const rows = [
        ["Total Visits", stats.totalVisits.toString()],
        ["Unique Visitors", stats.uniqueVisitors.toString()],
        ["LinkedIn Total", stats.linkedInStats.total.toString()],
        ["LinkedIn WebView", stats.linkedInStats.webview.toString()],
        ["LinkedIn with UTM", stats.linkedInStats.withUTM.toString()],
        [""],
        ["Traffic Sources", "Count"],
        ...Object.entries(stats.visitsBySource).map(([source, count]) => [source, count.toString()]),
        [""],
        ["Top Pages", "Views"],
        ...stats.topPages.map(page => [page.path, page.count.toString()]),
    ];

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `linkedin_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
