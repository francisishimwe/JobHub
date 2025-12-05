"use client"

import { useJobs } from "@/lib/job-context"
import { useExams } from "@/lib/exam-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { TrendingUp, Users, Briefcase, GraduationCap, Eye, MousePointerClick } from "lucide-react"
import { useEffect, useState } from "react"

export function AnalyticsDashboard() {
    const { jobs } = useJobs()
    const { exams } = useExams()
    const [totalViews, setTotalViews] = useState(0)

    // Calculate metrics
    const totalJobs = jobs.length
    const totalExams = exams.length
    const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
    const totalExamParticipants = exams.reduce((sum, exam) => sum + exam.participants, 0)
    const avgApplicantsPerJob = totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0

    // Get job stats by type
    const jobsByType = jobs.reduce((acc, job) => {
        const type = job.opportunityType
        if (!acc[type]) {
            acc[type] = { type, count: 0, applicants: 0 }
        }
        acc[type].count++
        acc[type].applicants += job.applicants
        return acc
    }, {} as Record<string, { type: string; count: number; applicants: number }>)

    const jobTypeData = Object.values(jobsByType)

    // Get top performing jobs
    const topJobs = [...jobs]
        .sort((a, b) => b.applicants - a.applicants)
        .slice(0, 10)

    // Fetch total views from database
    useEffect(() => {
        const fetchTotalViews = async () => {
            try {
                const response = await fetch('/api/analytics/total-views')
                if (response.ok) {
                    const data = await response.json()
                    setTotalViews(data.totalViews || 0)
                }
            } catch (error) {
                console.error('Error fetching total views:', error)
            }
        }
        fetchTotalViews()
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
            title: "Total Interactions",
            value: totalApplicants,
            icon: MousePointerClick,
            description: `Avg ${avgApplicantsPerJob} per job`,
            color: "text-green-600"
        },
        {
            title: "Total Views",
            value: totalViews,
            icon: Eye,
            description: "Page views tracked",
            color: "text-purple-600"
        },
        {
            title: "Exam Participants",
            value: totalExamParticipants,
            icon: Users,
            description: `${totalExams} total exams`,
            color: "text-orange-600"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Overview</h2>
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

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Jobs by Type - Bar Chart */}
                {jobTypeData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Jobs by Type
                            </CardTitle>
                            <CardDescription>Distribution of opportunity types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={jobTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#76c893" name="Jobs" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Interactions by Type - Pie Chart */}
                {jobTypeData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MousePointerClick className="h-4 w-4" />
                                Interactions by Type
                            </CardTitle>
                            <CardDescription>User engagement by opportunity type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={jobTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="applicants"
                                    >
                                        {jobTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Top Performing Jobs - Table */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Top Performing Jobs
                        </CardTitle>
                        <CardDescription>Jobs with most user interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Interactions</TableHead>
                                    <TableHead className="text-right">Posted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topJobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium max-w-[300px] truncate">{job.title}</TableCell>
                                        <TableCell>{job.opportunityType}</TableCell>
                                        <TableCell className="text-right font-semibold">{job.applicants}</TableCell>
                                        <TableCell className="text-right">
                                            {new Date(job.postedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {topJobs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                                {totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-xs text-muted-foreground">Interactions per view</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Total Engagement</p>
                            <p className="text-2xl font-bold text-green-600">
                                {totalApplicants + totalExamParticipants}
                            </p>
                            <p className="text-xs text-muted-foreground">Combined interactions & participants</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Most Popular Type</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {jobTypeData.length > 0
                                    ? jobTypeData.sort((a, b) => b.applicants - a.applicants)[0].type
                                    : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">By user interactions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
