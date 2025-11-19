"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AnalyticsData {
    views: number
    visitors: number
    countries: { name: string; count: number }[]
    devices: { name: string; count: number }[]
    browsers: { name: string; count: number }[]
}

export function useAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        views: 0,
        visitors: 0,
        countries: [],
        devices: [],
        browsers: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const supabase = createClient()

                // Get total page views for current month
                const startOfMonth = new Date()
                startOfMonth.setDate(1)
                startOfMonth.setHours(0, 0, 0, 0)

                const { count: viewsCount } = await supabase
                    .from('page_views')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', startOfMonth.toISOString())

                // Get unique visitors count
                const { count: visitorsCount } = await supabase
                    .from('visitors')
                    .select('*', { count: 'exact', head: true })
                    .gte('first_visit', startOfMonth.toISOString())

                // Get countries distribution
                const { data: countriesData } = await supabase
                    .from('page_views')
                    .select('country')
                    .gte('created_at', startOfMonth.toISOString())
                    .not('country', 'is', null)

                // Get devices distribution
                const { data: devicesData } = await supabase
                    .from('page_views')
                    .select('device_type')
                    .gte('created_at', startOfMonth.toISOString())
                    .not('device_type', 'is', null)

                // Get browsers distribution
                const { data: browsersData } = await supabase
                    .from('page_views')
                    .select('browser')
                    .gte('created_at', startOfMonth.toISOString())
                    .not('browser', 'is', null)

                // Process countries
                const countryCounts = (countriesData || []).reduce((acc: Record<string, number>, item) => {
                    const country = item.country || 'Unknown'
                    acc[country] = (acc[country] || 0) + 1
                    return acc
                }, {})

                const countries = Object.entries(countryCounts)
                    .map(([name, count]) => ({ name, count: count as number }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)

                // Process devices
                const deviceCounts = (devicesData || []).reduce((acc: Record<string, number>, item) => {
                    const device = item.device_type || 'Unknown'
                    acc[device] = (acc[device] || 0) + 1
                    return acc
                }, {})

                const devices = Object.entries(deviceCounts)
                    .map(([name, count]) => ({ name, count: count as number }))
                    .sort((a, b) => b.count - a.count)

                // Process browsers
                const browserCounts = (browsersData || []).reduce((acc: Record<string, number>, item) => {
                    const browser = item.browser || 'Unknown'
                    acc[browser] = (acc[browser] || 0) + 1
                    return acc
                }, {})

                const browsers = Object.entries(browserCounts)
                    .map(([name, count]) => ({ name, count: count as number }))
                    .sort((a, b) => b.count - a.count)

                setAnalytics({
                    views: viewsCount || 0,
                    visitors: visitorsCount || 0,
                    countries: countries.length > 0 ? countries : [{ name: 'No data', count: 0 }],
                    devices: devices.length > 0 ? devices : [{ name: 'No data', count: 0 }],
                    browsers: browsers.length > 0 ? browsers : [{ name: 'No data', count: 0 }]
                })
            } catch (error) {
                console.error('Error fetching analytics:', error)
                // Fallback to mock data if there's an error
                setAnalytics({
                    views: 0,
                    visitors: 0,
                    countries: [{ name: 'No data', count: 0 }],
                    devices: [{ name: 'No data', count: 0 }],
                    browsers: [{ name: 'No data', count: 0 }]
                })
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    return { analytics, loading }
}
