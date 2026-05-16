"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

function AdminDashboardContent() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [response, setResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role !== "admin") {
      router.push("/admin/login")
      return
    }
    fetchComplaints()
  }, [router])

  useEffect(() => {
    let result = complaints
    if (filterStatus !== "all") {
      result = result.filter((c) => c.status === filterStatus)
    }
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.complaint_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.student_email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredComplaints(result)
  }, [complaints, searchTerm, filterStatus])

  function fetchComplaints() {
    setIsLoading(true)
    const stored = localStorage.getItem("all_complaints")
    const all = stored ? JSON.parse(stored) : []
    setComplaints(all)
    setIsLoading(false)
  }

  function handleUpdateStatus(id: string, status: string, adminResponse?: string) {
    setIsResponding(true)

    const stored = localStorage.getItem("all_complaints")
    let all = stored ? JSON.parse(stored) : []

    all = all.map((c: any) => {
      if (c.id === id) {
        return { ...c, status, admin_response: adminResponse || c.admin_response }
      }
      return c
    })

    localStorage.setItem("all_complaints", JSON.stringify(all))

    setTimeout(() => {
      setSelectedComplaint(null)
      setResponse("")
      fetchComplaints()
      setIsResponding(false)
    }, 500)
  }

  function handleLogout() {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 flex flex-col fixed h-full text-slate-600 border-r border-slate-200">
        <div className="flex items-center gap-2 mb-10 pb-6 border-b border-slate-100">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">AdminPanel</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-indigo-50 text-indigo-700 shadow-sm transition-all duration-200">
            <LayoutDashboard className="w-5 h-5" />
            Complaints
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
      <main className="flex-1 ml-64 p-10 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Manage Complaints</h1>
          <p className="text-slate-500 mt-1">Review and resolve student issues across the campus.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Tickets", value: stats.total, icon: MessageSquare, color: "bg-indigo-600" },
            { label: "Pending Issues", value: stats.pending, icon: Clock, color: "bg-amber-500" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "bg-emerald-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl text-white", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by student, email or content..."
              className="pl-10 h-11 bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {["all", "pending", "resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-semibold capitalize transition-all",
                  filterStatus === status ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900",
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <Card className="text-center py-20 border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <CardContent>
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No matching complaints found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredComplaints.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-all border-slate-200 overflow-hidden group">
                <div
                  className={cn(
                    "h-1 w-full",
                    c.status === "resolved"
                      ? "bg-emerald-500"
                      : c.status === "in-progress"
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]",
                            c.status === "resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200",
                          )}
                        >
                          {c.status}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">#{c.id.slice(0, 8)}</span>
                      </div>
                      <div>
                        <p className="text-slate-600 leading-relaxed text-sm">{c.complaint_text}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 items-center">
                        <span className="font-semibold text-slate-700">{c.student_name}</span>
                        <span>•</span>
                        <span>{c.student_email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 justify-end items-end">
                      {c.status === "pending" && (
                        <Button
                          onClick={() => {
                            setSelectedComplaint(c)
                            setResponse("")
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white h-9 px-4"
                        >
                          Resolve Issue
                        </Button>
                      )}
                      {c.status === "resolved" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedComplaint(c)
                            setResponse(c.admin_response || "")
                          }}
                          className="h-9 px-4 border-slate-200"
                        >
                          View Resolution
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Resolve Dialog */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedComplaint?.status === "resolved" ? "Resolution Details" : "Resolve Complaint"}
              </DialogTitle>
              <DialogDescription>
                Submitted by {selectedComplaint?.student_name} ({selectedComplaint?.student_email})
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 italic text-slate-600 text-sm max-h-[200px] overflow-y-auto">
                "{selectedComplaint?.complaint_text}"
              </div>
              <div className="space-y-2">
                <Label htmlFor="response">Resolution Message</Label>
                <Textarea
                  id="response"
                  placeholder="Type the resolution or response here..."
                  className="min-h-[120px]"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={selectedComplaint?.status === "resolved"}
                />
              </div>
            </div>
            <DialogFooter>
              {selectedComplaint?.status === "pending" ? (
                <Button
                  onClick={() => handleUpdateStatus(selectedComplaint.id, "resolved", response)}
                  disabled={isResponding || !response.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isResponding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Resolved"}
                </Button>
              ) : (
                <Button onClick={() => setSelectedComplaint(null)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={null}>
      <AdminDashboardContent />
    </Suspense>
  )
}
