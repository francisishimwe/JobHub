'use client'

import { useEffect } from 'react'

interface DynamicFaviconProps {
    companyLogo?: string
}

export function DynamicFavicon({ companyLogo }: DynamicFaviconProps) {
    useEffect(() => {
        const defaultFavicon = '/favicon-.png'
        const faviconUrl = companyLogo || defaultFavicon

        // Update favicon
        const updateFavicon = (url: string) => {
            // Remove existing favicons
            const existingIcons = document.querySelectorAll("link[rel*='icon']")
            existingIcons.forEach((icon) => icon.remove())

            // Add new favicon
            const link = document.createElement('link')
            link.rel = 'icon'
            link.href = url
            link.type = 'image/png'
            document.head.appendChild(link)

            // Add apple touch icon
            const appleLink = document.createElement('link')
            appleLink.rel = 'apple-touch-icon'
            appleLink.href = url
            document.head.appendChild(appleLink)
        }

        updateFavicon(faviconUrl)

        // Cleanup: restore default favicon when component unmounts
        return () => {
            updateFavicon(defaultFavicon)
        }
    }, [companyLogo])

    return null // This component doesn't render anything
}
