"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userEmail", email)
      router.push("/admin/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200 bg-white text-slate-900">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <ShieldAlert className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Admin Console</CardTitle>
          <CardDescription className="text-slate-500">Restricted access for authorized personnel only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-slate-200 text-slate-900 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Secret Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-white border-slate-200 text-slate-900 focus:ring-indigo-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-900/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Authorize Access"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <button onClick={() => router.push("/")} className="text-slate-500 hover:text-indigo-600 transition-colors">
              ← Exit to portal
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
