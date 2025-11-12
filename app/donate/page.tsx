import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const donationTiers = [
  { amount: 25, impact: "Provides chess set for 1 student" },
  { amount: 50, impact: "Sponsors 1 month of lessons" },
  { amount: 100, impact: "Funds tournament entry for 5 students" },
  { amount: 500, impact: "Establishes a chess club in a school" },
]

export default function DonatePage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">Support Our Mission</h1>
        <p className="text-xl text-center mb-12 opacity-80">
          Your donation helps bring chess education to underserved communities worldwide.
        </p>

        {/* Impact Stats */}
        <Card className="p-8 glass mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Your Impact</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="opacity-80">Students Sponsored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="opacity-80">Schools Reached</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">1000+</div>
              <div className="opacity-80">Chess Sets Donated</div>
            </div>
          </div>
        </Card>

        {/* Donation Tiers */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {donationTiers.map((tier) => (
            <Card key={tier.amount} className="p-6 glass hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-blue-600 mb-2">${tier.amount}</div>
              <p className="opacity-80 mb-4">{tier.impact}</p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                Donate ${tier.amount}
              </Button>
            </Card>
          ))}
        </div>

        {/* Custom Donation Form */}
        <Card className="p-8 glass">
          <h2 className="text-2xl font-semibold mb-6">Custom Donation</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount ($)</label>
              <Input type="number" placeholder="Enter amount" className="glass" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input placeholder="Your name" className="glass" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" placeholder="your@email.com" className="glass" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <Textarea placeholder="Leave a message of support..." className="glass" />
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              Complete Donation
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
