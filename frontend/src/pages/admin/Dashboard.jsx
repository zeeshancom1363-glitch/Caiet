// ============================================
// FILE: Dashboard.jsx
// WHAT IT DOES: Admin dashboard with stats cards,
// recent activity, and recent applications.
// Used by: App.jsx route "/admin/dashboard"
// ============================================
import React, { useEffect, useState } from 'react';
import { getDashboardStats, getActivityLog, getRecentApplications } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, GraduationCap, ClipboardList, MessageSquare, Newspaper, FileText, Clock, Activity } from 'lucide-react';

export default function Dashboard() {
    const { admin } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [apps, setApps] = useState([]);

    useEffect(() => {
        getDashboardStats().then(r => setStats(r.data)).catch(() => { });
        getActivityLog().then(r => setActivities(r.data.slice(0, 10))).catch(() => { });
        getRecentApplications().then(r => setApps(r.data)).catch(() => { });
    }, []);

    const statCards = stats ? [
        { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'from-green-500 to-green-600' },
        { label: 'Pending Apps', value: stats.pendingApplications, icon: ClipboardList, color: 'from-amber-500 to-amber-600' },
        { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'from-red-500 to-red-600' },
        { label: 'Newsletter Subs', value: stats.newsletterSubs, icon: Newspaper, color: 'from-purple-500 to-purple-600' },
        { label: 'Published Blogs', value: stats.publishedBlogs, icon: FileText, color: 'from-teal-500 to-teal-600' },
    ] : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                    Welcome back, {admin?.name || 'Admin'} 👋
                </h1>
                <p className="text-sm text-gray-500">Here's what's happening at CAI&ET today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-600" />
                        <h2 className="font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-3 max-h-80 overflow-y-auto">
                        {activities.length === 0 ? (
                            <p className="text-sm text-gray-500 p-4 text-center">No activity yet</p>
                        ) : (
                            <div className="space-y-1">
                                {activities.map(log => (
                                    <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-sm">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.actionType === 'added' ? 'bg-green-500' :
                                                log.actionType === 'changed' ? 'bg-blue-500' : 'bg-red-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900">
                                                <span className="font-medium">{log.adminName}</span>
                                                {' '}{log.actionType}{' '}
                                                <span className="text-gray-500">{log.itemType}:</span>
                                                {' '}<span className="font-medium">{log.itemName}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-amber-600" />
                        <h2 className="font-bold text-gray-900">Recent Applications</h2>
                    </div>
                    <div className="p-3 max-h-80 overflow-y-auto">
                        {apps.length === 0 ? (
                            <p className="text-sm text-gray-500 p-4 text-center">No applications yet</p>
                        ) : (
                            <div className="space-y-1">
                                {apps.map(app => (
                                    <div key={app.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-900">{app.fullName}</p>
                                            <p className="text-xs text-gray-500">{app.course?.title || 'N/A'}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
