"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Text, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { useRouter } from "next/navigation"
import { User, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1, 100, 100]} position={[0, 0, 0]}>
          <MeshDistortMaterial color="#4f46e5" attach="material" distort={0.3} speed={1.5} roughness={0} />
        </Sphere>
      </Float>

      <Text position={[0, 2.5, 0]} fontSize={0.5} color="#1e293b" font="/fonts/Geist-Bold.ttf">
        Complaint Portal
      </Text>
    </>
  )
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-50">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md p-12 rounded-[32px] shadow-2xl border border-white/20 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome</h1>
          <p className="text-slate-500 mb-12">Who are you logging in as?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <button
              onClick={() => router.push("/student/login")}
              className={cn(
                "group relative flex flex-col items-center justify-center p-8 h-56 rounded-3xl transition-all duration-500",
                "bg-gradient-to-br from-indigo-100 to-blue-200 hover:from-indigo-200 hover:to-blue-300",
                "hover:-translate-y-2 hover:shadow-xl active:scale-95",
              )}
            >
              <div className="mb-6 p-4 bg-white/50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-1">Student</h3>
              <p className="text-sm text-indigo-700/70">Raise a Complaint</p>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => router.push("/admin/login")}
              className={cn(
                "group relative flex flex-col items-center justify-center p-8 h-56 rounded-3xl transition-all duration-500",
                "bg-gradient-to-br from-purple-100 to-pink-200 hover:from-purple-200 hover:to-pink-300",
                "hover:-translate-y-2 hover:shadow-xl active:scale-95",
              )}
            >
              <div className="mb-6 p-4 bg-white/50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-1">Admin</h3>
              <p className="text-sm text-purple-700/70">Resolve Issues</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
