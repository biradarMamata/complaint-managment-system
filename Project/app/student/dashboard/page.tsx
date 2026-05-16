"use client"

import type React from "react"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  PlusCircle,
  History,
  LogOut,
  School,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Code,
  Paperclip,
  Maximize2,
  Strikethrough,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function StudentDashboardContent() {
  const [activeTab, setActiveTab] = useState<"create" | "history">("create")
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [complaintText, setComplaintText] = useState("")
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "student") {
      router.push("/student/login")
      return
    }

    setUserEmail(email)
    fetchComplaints()
  }, [router])

  function fetchComplaints() {
    setIsLoading(true)
    const stored = localStorage.getItem("all_complaints")
    const all = stored ? JSON.parse(stored) : []
    const email = localStorage.getItem("userEmail")

    const studentComplaints = all.filter((c: any) => c.student_email === email)
    setComplaints(studentComplaints)
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!complaintText.trim() || !title.trim() || !category || !userEmail) return

    setIsSubmitting(true)

    const newComplaint = {
      id: Math.random().toString(36).substr(2, 9),
      student_name: userEmail.split("@")[0],
      student_email: userEmail,
      title: title,
      category: category,
      complaint_text: complaintText,
      status: "pending",
      created_at: new Date().toISOString(),
      admin_response: null,
    }

    const stored = localStorage.getItem("all_complaints")
    const all = stored ? JSON.parse(stored) : []
    all.unshift(newComplaint)
    localStorage.setItem("all_complaints", JSON.stringify(all))

    setTimeout(() => {
      setTitle("")
      setCategory("")
      setComplaintText("")
      setActiveTab("history")
      fetchComplaints()
      setIsSubmitting(false)
    }, 500)
  }

  function handleLogout() {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-10">
          <School className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">StudentPortal</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("create")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              activeTab === "create"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <PlusCircle className="w-5 h-5" />
            Create Ticket
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              activeTab === "history"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <History className="w-5 h-5" />
            History
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 max-w-5xl">
        {activeTab === "create" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("history")}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Create Support Ticket</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-lg text-slate-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Affairs</SelectItem>
                    <SelectItem value="facilities">Facilities & Maintenance</SelectItem>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="it">IT Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter Title"
                  className="h-12 bg-white border-slate-200 rounded-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  {/* Mock Rich Text Toolbar */}
                  <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Strikethrough className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-4 bg-slate-300 mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-4 bg-slate-300 mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <List className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-4 bg-slate-300 mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
                        <Terminal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-px border border-slate-300 rounded overflow-hidden">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none bg-slate-100">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Type message here"
                    className="min-h-[250px] border-0 focus-visible:ring-0 rounded-none bg-white p-4 text-slate-700"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                  />
                  <div className="bg-slate-50 border-t border-slate-100 p-1 flex justify-end">
                    <span className="text-[10px] text-slate-400 p-1">...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-slate-200 text-slate-500 bg-transparent"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-10 bg-slate-900 hover:bg-indigo-950 text-white font-bold rounded-xl transition-all"
                  disabled={isSubmitting || !complaintText.trim() || !title.trim() || !category}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Ticket"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">My Ticket History</h1>
              <p className="text-slate-500 mt-1">View and track your submitted complaints.</p>
            </header>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                </div>
              ) : complaints.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-200 bg-transparent text-center py-20 shadow-none">
                  <CardContent>
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No tickets found. Raise one now!</p>
                  </CardContent>
                </Card>
              ) : (
                complaints.map((t) => (
                  <Card key={t.id} className="hover:shadow-md transition-shadow duration-200 border-slate-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 items-start">
                          <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors duration-200">
                            <History className="w-6 h-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-slate-100 text-slate-600 hover:bg-slate-100 uppercase text-[10px]"
                              >
                                {t.category || "General"}
                              </Badge>
                              <p className="font-bold text-slate-900">{t.title || "Untitled Ticket"}</p>
                            </div>
                            <p className="text-slate-600 text-sm line-clamp-2">{t.complaint_text}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-3 py-1 font-semibold capitalize",
                            t.status === "resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : t.status === "in-progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-700 border-slate-200",
                          )}
                        >
                          {t.status}
                        </Badge>
                      </div>
                      {t.admin_response && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            Admin Response
                          </p>
                          <p className="text-sm text-indigo-900 leading-relaxed">{t.admin_response}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={null}>
      <StudentDashboardContent />
    </Suspense>
  )
}
