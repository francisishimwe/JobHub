"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Helper to detect device type
function getDeviceType(): string {
    if (typeof window === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile'
    }
    return 'Desktop'
}

// Helper to detect browser
function getBrowser(): string {
    if (typeof window === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
    return 'Others'
}

// Helper to get or create visitor ID
function getVisitorId(): string {
    if (typeof window === 'undefined') return ''
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('visitor_id', visitorId)
    }
    return visitorId
}

// Helper to get country (using a free IP geolocation API)
async function getCountry(): Promise<string> {
    try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        return data.country_name || 'Unknown'
    } catch {
        return 'Unknown'
    }
}

export function AnalyticsTracker() {
    const pathname = usePathname()

    useEffect(() => {
        async function trackPageView() {
            try {
                const visitorId = getVisitorId()
                const deviceType = getDeviceType()
                const browser = getBrowser()
                const country = await getCountry()

                // Track page view via API
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page_url: pathname,
                        visitor_id: visitorId,
                        referrer: document.referrer || null,
                        user_agent: navigator.userAgent,
                        country,
                        device_type: deviceType,
                        browser
                    })
                })
            } catch (error) {
                console.error('Analytics tracking error:', error)
            }
        }

        trackPageView()
    }, [pathname])

    return null // This component doesn't render anything
}
