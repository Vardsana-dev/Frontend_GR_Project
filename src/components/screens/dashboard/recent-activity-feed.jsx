"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components";

const activities = [
    {
        id: 1,
        type: "user",
        action: "New user registered",
        user: "John Doe",
        time: "2 minutes ago",
        avatar: "👤",
        color: "bg-blue-500"
    },
    {
        id: 2,
        type: "order",
        action: "Order completed",
        user: "Sarah Wilson",
        time: "5 minutes ago",
        avatar: "🛒",
        color: "bg-green-500"
    },
    {
        id: 3,
        type: "payment",
        action: "Payment received",
        user: "Mike Johnson",
        time: "12 minutes ago",
        avatar: "💳",
        color: "bg-emerald-500"
    },
    {
        id: 4,
        type: "support",
        action: "Support ticket created",
        user: "Emily Davis",
        time: "18 minutes ago",
        avatar: "��",
        color: "bg-orange-500"
    },
    {
        id: 5,
        type: "product",
        action: "New product added",
        user: "Admin",
        time: "25 minutes ago",
        avatar: "��",
        color: "bg-purple-500"
    },
    {
        id: 6,
        type: "review",
        action: "New review posted",
        user: "Alex Brown",
        time: "32 minutes ago",
        avatar: "⭐",
        color: "bg-yellow-500"
    },
    {
        id: 7,
        type: "update",
        action: "System update completed",
        user: "System",
        time: "1 hour ago",
        avatar: "⚙️",
        color: "bg-gray-500"
    },
];

const ActivityItem = ({ activity, isLast }) => (
    <div className="relative flex items-start gap-3 pb-4">
        {/* Timeline line */}
        {!isLast && (
            <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
        )}

        {/* Avatar */}
        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${activity.color} text-white text-sm font-medium shadow-sm`}>
            {activity.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                </p>
                <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {activity.time}
                </p>
            </div>
            <p className="text-sm text-gray-600 mt-1">
                by <span className="font-medium">{activity.user}</span>
            </p>
        </div>
    </div>
);

export function RecentActivityFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Latest system activities and user actions</p>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-1">
                    {activities.map((activity, index) => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                            isLast={index === activities.length - 1}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full text-center py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        View All Activities
                    </button>
                </div>

                {/* Activity Summary */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">
                            {activities.filter(a => a.type === 'user' || a.type === 'order').length}
                        </p>
                        <p className="text-xs text-blue-500">Today</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                            {activities.length}
                        </p>
                        <p className="text-xs text-green-500">This Hour</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
