"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Phone, ArrowLeft } from "lucide-react"

export default function PendingApprovalPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <User className="h-8 w-8 text-orange-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa guhamagara cg kwandikira Admin kuri (+250 783 074 056) kugirango aguhe uburenganzira. Murakoze!
          </h1>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Phone className="h-5 w-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">(+250 783 074 056)</span>
            </div>
            <p className="text-orange-700 text-sm">
              Hamagara iyi nomero cg wandikira kuriyi nomero kugirango uburenganzira
            </p>
          </div>
          
          <p className="text-slate-600 mb-6">
            Nyuma yo kwemererwa, uzagaragara kuri iyi paji kugirango ukore isuzumabumenyi.
          </p>
          
          <Button 
            onClick={() => router.push("/road-rules")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Subira kuri Iga Amategeko
          </Button>
        </div>
      </Card>
    </div>
  )
}
