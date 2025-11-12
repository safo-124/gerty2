import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 glass">
        <h1 className="text-3xl font-bold mb-2 text-center">Join Our Academy</h1>
        <p className="text-center opacity-80 mb-8">Start your chess journey today</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input placeholder="John Doe" className="glass" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="your@email.com" className="glass" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" className="glass" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <Input type="password" placeholder="••••••••" className="glass" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">I am a...</label>
            <select className="w-full px-3 py-2 rounded-md glass border">
              <option>Student</option>
              <option>Coach</option>
              <option>Parent</option>
            </select>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 rounded" />
            <span className="opacity-80">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>
          <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            Create Account
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
