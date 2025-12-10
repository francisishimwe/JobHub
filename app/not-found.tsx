"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* 404 Number */}
                    <div className="space-y-4">
                        <h1 className="text-9xl font-bold text-primary">404</h1>
                        <div className="h-1 w-32 bg-[#76c893] mx-auto rounded-full"></div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            size="lg"
                            className="gap-2 min-w-[200px]"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Go Back
                        </Button>

                        <Link href="/">
                            <Button
                                size="lg"
                                className="gap-2 min-w-[200px] text-black"
                                style={{ backgroundColor: '#76c893' }}
                            >
                                <Home className="h-5 w-5" />
                                Return Home
                            </Button>
                        </Link>
                    </div>

                    {/* Additional Help Text */}
                    <div className="pt-8">
                        <p className="text-sm text-muted-foreground">
                            Looking for opportunities? Check out our{" "}
                            <Link href="/" className="text-[#76c893] hover:underline font-semibold">
                                latest jobs and scholarships
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
