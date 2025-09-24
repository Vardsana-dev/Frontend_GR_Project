"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components";

const data = [
    { month: "Jan", sales: 4000, marketing: 2400, development: 2000 },
    { month: "Feb", sales: 3000, marketing: 1398, development: 1800 },
    { month: "Mar", sales: 2000, marketing: 9800, development: 2200 },
    { month: "Apr", sales: 2780, marketing: 3908, development: 2500 },
    { month: "May", sales: 1890, marketing: 4800, development: 2100 },
    { month: "Jun", sales: 2390, marketing: 3800, development: 2300 },
    { month: "Jul", sales: 3490, marketing: 4300, development: 2400 },
    { month: "Aug", sales: 4200, marketing: 3200, development: 2600 },
    { month: "Sep", sales: 3800, marketing: 2800, development: 2200 },
    { month: "Oct", sales: 4300, marketing: 3500, development: 2800 },
    { month: "Nov", sales: 4100, marketing: 4200, development: 3000 },
    { month: "Dec", sales: 4500, marketing: 3800, development: 3200 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-800 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">
                            {entry.dataKey}: <span className="font-medium">{entry.value.toLocaleString()}</span>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function MonthlyPerformanceTrends() {
    return (
        <Card className="h-104">
            <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Revenue and spending analysis over time</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                            name="Sales"
                        />
                        <Line
                            type="monotone"
                            dataKey="marketing"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
                            name="Marketing"
                        />
                        <Line
                            type="monotone"
                            dataKey="development"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                            name="Development"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}