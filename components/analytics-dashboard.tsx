"use client"

import { useJobs } from "@/lib/job-context"
import { useExams } from "@/lib/exam-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, Users, Briefcase, GraduationCap, Eye, Globe, Monitor, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface AnalyticsData {
    views: number
    visitors: number
    countries: { name: string; count: number }[]
    devices: { name: string; count: number }[]
    browsers: { name: string; count: number }[]
}

export function AnalyticsDashboard() {
    const { jobs } = useJobs()
    const { exams } = useExams()
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        views: 0,
        visitors: 0,
        countries: [],
        devices: [],
        browsers: []
    })

    // Calculate metrics
    const totalJobs = jobs.length
    const totalExams = exams.length
    const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
    const totalExamParticipants = exams.reduce((sum, exam) => sum + exam.participants, 0)
    const avgApplicantsPerJob = totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0

    // Fetch analytics data (currently using mock data - see ANALYTICS_SETUP.md for real data integration)
    useEffect(() => {
        // TODO: Replace with real Supabase data fetch (see lib/use-analytics.ts)
        const mockAnalytics: AnalyticsData = {
            views: 3247,
            visitors: 1523,
            countries: [
                { name: "Rwanda", count: 685 },
                { name: "Kenya", count: 312 },
                { name: "Uganda", count: 198 },
                { name: "Tanzania", count: 156 },
                { name: "Burundi", count: 98 },
                { name: "Others", count: 74 }
            ],
            devices: [
                { name: "Mobile", count: 892 },
                { name: "Desktop", count: 531 },
                { name: "Tablet", count: 100 }
            ],
            browsers: [
                { name: "Chrome", count: 789 },
                { name: "Safari", count: 398 },
                { name: "Firefox", count: 201 },
                { name: "Edge", count: 89 },
                { name: "Others", count: 46 }
            ]
        }
        setAnalytics(mockAnalytics)
    }, [])

    const COLORS = ['#003566', '#76c893', '#ffd60a', '#f77f00', '#d62828', '#999']

    const stats = [
        {
            title: "Total Jobs",
            value: totalJobs,
            icon: Briefcase,
            description: "Active job postings",
            color: "text-blue-600"
        },
        {
            title: "Total Applicants",
            value: totalApplicants,
            icon: Users,
            description: `Avg ${avgApplicantsPerJob} per job`,
            color: "text-green-600"
        },
        {
            title: "Total Exams",
            value: totalExams,
            icon: GraduationCap,
            description: "Available exams",
            color: "text-purple-600"
        },
        {
            title: "Exam Participants",
            value: totalExamParticipants,
            icon: Users,
            description: "Total participants",
            color: "text-orange-600"
        }
    ]

    const webStats = [
        {
            title: "Total Views",
            value: analytics.views.toLocaleString(),
            icon: Eye,
            description: "Page views this month",
            color: "text-blue-600"
        },
        {
            title: "Unique Visitors",
            value: analytics.visitors.toLocaleString(),
            icon: Users,
            description: "Unique users this month",
            color: "text-green-600"
        },
        {
            title: "Top Country",
            value: analytics.countries[0]?.name || "N/A",
            icon: Globe,
            description: `${analytics.countries[0]?.count || 0} visitors`,
            color: "text-purple-600"
        },
        {
            title: "Top Device",
            value: analytics.devices[0]?.name || "N/A",
            icon: Monitor,
            description: `${analytics.devices[0]?.count || 0} users`,
            color: "text-orange-600"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Job/Exam Stats Grid */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Content Statistics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Web Analytics Stats Grid */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Web Analytics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {webStats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Tables and Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Visitors by Country - Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Visitors by Country
                        </CardTitle>
                        <CardDescription>Geographic distribution of visitors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Country</TableHead>
                                    <TableHead className="text-right">Visitors</TableHead>
                                    <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics.countries.map((country) => {
                                    const total = analytics.countries.reduce((sum, c) => sum + c.count, 0)
                                    const percentage = total > 0 ? ((country.count / total) * 100).toFixed(1) : '0'
                                    return (
                                        <TableRow key={country.name}>
                                            <TableCell className="font-medium">{country.name}</TableCell>
                                            <TableCell className="text-right">{country.count}</TableCell>
                                            <TableCell className="text-right">{percentage}%</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Device Distribution - Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Device Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by device type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={analytics.devices}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analytics.devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Browser Distribution - Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Browser Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by browser</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Browser</TableHead>
                                    <TableHead className="text-right">Users</TableHead>
                                    <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics.browsers.map((browser) => {
                                    const total = analytics.browsers.reduce((sum, b) => sum + b.count, 0)
                                    const percentage = total > 0 ? ((browser.count / total) * 100).toFixed(1) : '0'
                                    return (
                                        <TableRow key={browser.name}>
                                            <TableCell className="font-medium">{browser.name}</TableCell>
                                            <TableCell className="text-right">{browser.count}</TableCell>
                                            <TableCell className="text-right">{percentage}%</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Jobs - Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Recent Jobs
                        </CardTitle>
                        <CardDescription>Latest job postings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead className="text-right">Applicants</TableHead>
                                    <TableHead className="text-right">Posted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.slice(0, 5).map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell className="text-right">{job.applicants}</TableCell>
                                        <TableCell className="text-right">
                                            {new Date(job.postedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {jobs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No jobs posted yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Insights */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Engagement Rate</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {analytics.visitors > 0 ? ((analytics.visitors / analytics.views) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-xs text-muted-foreground">Unique visitors / Total views</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Total Engagement</p>
                            <p className="text-2xl font-bold text-green-600">
                                {totalApplicants + totalExamParticipants}
                            </p>
                            <p className="text-xs text-muted-foreground">Combined applicants & participants</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Mobile Usage</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {analytics.devices.length > 0
                                    ? ((analytics.devices.find(d => d.name === "Mobile")?.count || 0) /
                                        analytics.devices.reduce((sum, d) => sum + d.count, 0) * 100).toFixed(0)
                                    : 0}%
                            </p>
                            <p className="text-xs text-muted-foreground">Visitors using mobile devices</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
