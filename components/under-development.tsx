import { Construction } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface UnderDevelopmentProps {
  pageName: string
}

export function UnderDevelopment({ pageName }: UnderDevelopmentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-8">
        <Construction className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {pageName} - Under Development
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We're working hard to bring you this feature. Check back soon!
      </p>
      <Link href="/">
        <Button size="lg" style={{ backgroundColor: '#16A34A' }} className="text-white">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
