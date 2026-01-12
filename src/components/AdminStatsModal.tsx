import React, { useEffect, useState } from 'react';
import { getAnalyticsStats } from '../analytics';
import { X, BarChart3, Users, MousePointer, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminStatsModal({ onClose }: { onClose: () => void }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalyticsStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
            <div className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Activity className="h-6 w-6 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">Portfolio Analytics</h2>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">Live</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-full overflow-y-auto p-6 pb-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center text-white/60">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400"></div>
                        </div>
                    ) : stats ? (
                        <div className="space-y-8">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <StatCard
                                    icon={Users}
                                    label="Unique Visitors"
                                    value={stats.uniqueVisitors}
                                    color="text-blue-400"
                                    bg="bg-blue-500/10"
                                />
                                <StatCard
                                    icon={MousePointer}
                                    label="Total Interactions"
                                    value={stats.totalEvents}
                                    color="text-purple-400"
                                    bg="bg-purple-500/10"
                                />
                                <StatCard
                                    icon={BarChart3}
                                    label="Events Tracked"
                                    value={Object.keys(stats.breakdown).length}
                                    color="text-orange-400"
                                    bg="bg-orange-500/10"
                                />
                            </div>

                            {/* Event Breakdown */}
                            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-white">Interaction Breakdown</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.breakdown)
                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                        .map(([name, count]) => (
                                            <div key={name} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                    <span className="font-mono text-sm text-white/80">{name}</span>
                                                </div>
                                                <span className="font-bold text-white">{count as number}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Recent Activity Log */}
                            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
                                <div className="space-y-2">
                                    {stats.recentEvents.map((event: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                                            <span className="text-sm text-white/60">{event.eventName}</span>
                                            <span className="text-xs text-white/40">
                                                {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center text-red-400">Failed to load stats. Check console.</div>
                    )}
                </div>
            </div>
        </motion.div>
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
