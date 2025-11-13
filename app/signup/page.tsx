"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"STUDENT" | "COACH">("STUDENT")
  const [agreeTos, setAgreeTos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!agreeTos) {
      setError("You must agree to the Terms of Service and Privacy Policy.")
      return
    }
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Signup failed")
      }
      // Session cookie set by API, redirect to coaches as a welcome page
      router.push("/coaches")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 glass">
        <h1 className="text-3xl font-bold mb-2 text-center">Join Our Academy</h1>
        <p className="text-center opacity-80 mb-8">Start your chess journey today</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input placeholder="John Doe" className="glass" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="your@email.com" className="glass" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" className="glass" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <Input type="password" placeholder="••••••••" className="glass" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">I am a...</label>
            <select className="w-full px-3 py-2 rounded-md glass border" value={role} onChange={(e) => setRole((e.target.value.toUpperCase() as "STUDENT" | "COACH"))}>
              <option value="STUDENT">Student</option>
              <option value="COACH">Coach</option>
            </select>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 rounded" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} />
            <span className="opacity-80">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="opacity-80">Already have an account? </span>
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}
