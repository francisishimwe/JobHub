'use client'

import { useEffect } from 'react'

interface DynamicFaviconProps {
    companyLogo: string
}

export function DynamicFavicon({ companyLogo }: DynamicFaviconProps) {
    useEffect(() => {
        if (!companyLogo) return

        // Update favicon
        const updateFavicon = () => {
            // Remove existing favicons
            const existingIcons = document.querySelectorAll("link[rel*='icon']")
            existingIcons.forEach((icon) => icon.remove())

            // Add new favicon with company logo
            const link = document.createElement('link')
            link.rel = 'icon'
            link.href = companyLogo
            link.type = 'image/png'
            document.head.appendChild(link)

            // Add apple touch icon
            const appleLink = document.createElement('link')
            appleLink.rel = 'apple-touch-icon'
            appleLink.href = companyLogo
            document.head.appendChild(appleLink)
        }

        updateFavicon()
    }, [companyLogo])

    return null // This component doesn't render anything
}
