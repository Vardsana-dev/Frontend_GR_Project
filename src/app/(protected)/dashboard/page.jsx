'use client'

import { ChartAreaGradient } from "../../../components/screens/dashboard/chart-area-gradient"
import { MonthlyPerformanceTrends } from "../../../components/screens/dashboard/monthly-performance-trends"
import { RecentActivityFeed } from "../../../components/screens/dashboard/recent-activity-feed"

const DashboardPage = () => {
    return (
        <>
            <div className="grid grid-cols-1 gap6 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <ChartAreaGradient/>
                    <MonthlyPerformanceTrends/>
                </div>
                <RecentActivityFeed/>
            </div>
        </>
    )
}

export default DashboardPage