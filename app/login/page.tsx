import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 glass">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-center opacity-80 mb-8">Sign in to your academy account</p>

        <form className="space-y-4" method="POST" action="/api/auth/login">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input name="email" type="email" placeholder="your@email.com" className="glass" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input name="password" type="password" placeholder="••••••••" className="glass" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="opacity-80">Don&apos;t have an account? </span>
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-center opacity-60">
            By signing in, you agree to support our mission of bringing chess education to all.
          </p>
        </div>
      </Card>
    </div>
  )
}
