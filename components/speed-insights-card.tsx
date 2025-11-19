"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, TrendingUp, Activity } from "lucide-react"
import { useEffect, useState } from "react"

interface PerformanceMetrics {
    fcp: number | null
    lcp: number | null
    fid: number | null
    cls: number | null
    ttfb: number | null
}

export function SpeedInsightsCard() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
    })

    useEffect(() => {
        if (typeof window !== 'undefined' && 'performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

            if (perfData) {
                const ttfb = perfData.responseStart - perfData.requestStart
                setMetrics(prev => ({ ...prev, ttfb: Math.round(ttfb) }))

                const paintEntries = performance.getEntriesByType('paint')
                paintEntries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }))
                    }
                })
            }

            if ('PerformanceObserver' in window) {
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries()
                        const lastEntry = entries[entries.length - 1] as any
                        setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.renderTime || lastEntry.loadTime) }))
                    })
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

                    let clsValue = 0
                    const clsObserver = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries() as any[]) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value
                                setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }))
                            }
                        }
                    })
                    clsObserver.observe({ entryTypes: ['layout-shift'] })

                    const fidObserver = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries() as any[]) {
                            setMetrics(prev => ({ ...prev, fid: Math.round(entry.processingStart - entry.startTime) }))
                        }
                    })
                    fidObserver.observe({ entryTypes: ['first-input'] })

                    setTimeout(() => {
                        setMetrics(prev => ({
                            fcp: prev.fcp !== null ? prev.fcp : 0,
                            lcp: prev.lcp !== null ? prev.lcp : 0,
                            fid: prev.fid !== null ? prev.fid : 0,
                            cls: prev.cls !== null ? prev.cls : 0,
                            ttfb: prev.ttfb !== null ? prev.ttfb : 0,
                        }))
                    }, 3000)
                } catch (e) {
                    setMetrics({ fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0 })
                }
            }
        }
    }, [])

    const getScoreColor = (metric: string, value: number | null) => {
        if (value === null) return "secondary"

        switch (metric) {
            case 'first-contentful-paint':
                return value < 1800 ? "default" : value < 3000 ? "secondary" : "destructive"
            case 'largest-contentful-paint':
                return value < 2500 ? "default" : value < 4000 ? "secondary" : "destructive"
            case 'first-input-delay':
                return value < 100 ? "default" : value < 300 ? "secondary" : "destructive"
            case 'cumulative-layout-shift':
                return value < 0.1 ? "default" : value < 0.25 ? "secondary" : "destructive"
            case 'time-to-first-byte':
                return value < 800 ? "default" : value < 1800 ? "secondary" : "destructive"
            default:
                return "secondary"
        }
    }

    const performanceData = [
        {
            name: "First Contentful Paint",
            value: metrics.fcp,
            unit: "ms",
            icon: Zap,
            description: "Time until first content appears",
            good: "< 1.8s",
        },
        {
            name: "Largest Contentful Paint",
            value: metrics.lcp,
            unit: "ms",
            icon: Activity,
            description: "Time until main content loads",
            good: "< 2.5s",
        },
        {
            name: "First Input Delay",
            value: metrics.fid,
            unit: "ms",
            icon: Clock,
            description: "Time until page is interactive",
            good: "< 100ms",
        },
        {
            name: "Cumulative Layout Shift",
            value: metrics.cls,
            unit: "",
            icon: TrendingUp,
            description: "Visual stability score",
            good: "< 0.1",
        },
        {
            name: "Time to First Byte",
            value: metrics.ttfb,
            unit: "ms",
            icon: Zap,
            description: "Server response time",
            good: "< 800ms",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Speed Insights
                </CardTitle>
                <CardDescription>
                    Real-time performance metrics for your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {performanceData.map((metric) => {
                        const Icon = metric.icon
                        const scoreVariant = getScoreColor(
                            metric.name.toLowerCase().replace(/\s+/g, '-'),
                            metric.value
                        )

                        return (
                            <div key={metric.name} className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-start justify-between">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant={scoreVariant as any}>
                                        {metric.value !== null ? `${metric.value}${metric.unit}` : "0ms"}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{metric.name}</p>
                                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                                    <p className="text-xs text-green-600 mt-1">Good: {metric.good}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> These metrics are measured in real-time from your browser.
                        For comprehensive analytics across all users, check your Vercel dashboard.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
