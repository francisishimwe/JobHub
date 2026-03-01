"use client"

import { useEffect, useState } from "react"

interface AnalyticsData {
    views: number
    visitors: number
    countries: { country?: string; count: number }[]
    devices: { device_type?: string; count: number }[]
    browsers: { browser?: string; count: number }[]
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
                // Fetch analytics via API
                const response = await fetch('/api/analytics/track')
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch analytics')
                }

                // Format countries
                const countries = (data.countries || [])
                    .map((item: any) => ({ name: item.country || 'Unknown', count: parseInt(item.count) }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)

                // Format devices
                const devices = (data.devices || [])
                    .map((item: any) => ({ name: item.device_type || 'Unknown', count: parseInt(item.count) }))
                    .sort((a, b) => b.count - a.count)

                // Format browsers
                const browsers = (data.browsers || [])
                    .map((item: any) => ({ name: item.browser || 'Unknown', count: parseInt(item.count) }))
                    .sort((a, b) => b.count - a.count)

                setAnalytics({
                    views: data.views || 0,
                    visitors: data.visitors || 0,
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
