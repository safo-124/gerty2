import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Trophy, Users, BookOpen, Heart, Calendar, Award, GraduationCap, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative min-h-[75vh] lg:flex lg:items-center overflow-hidden">
        {/* Purple background matching Tampere */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:items-center">
            {/* Mobile Image - Shows on top for mobile */}
            <div className="lg:hidden pt-6">
              <div className="relative rounded-lg overflow-hidden shadow-2xl h-[300px]">
                <Image 
                  src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=1200&auto=format&fit=crop"
                  alt="Chess students learning together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Text content */}
            <div className="text-white py-12">
              <p className="text-sm md:text-base font-medium mb-4 tracking-wide uppercase opacity-90">
                Welcome to Our Chess Academy
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="block">Multidisciplinary opportunities</span>
                <span className="block mt-2">for learning, competition and</span>
                <span className="block mt-2">international collaboration</span>
              </h1>
              <div className="space-y-3">
                <Link href="/student" className="flex items-center text-lg hover:underline group">
                  <span className="mr-2">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Chess Academy Programs</span>
                </Link>
                <Link href="/donate" className="flex items-center text-lg hover:underline group">
                  <span className="mr-2">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">NGO & Community Impact</span>
                </Link>
              </div>
            </div>

            {/* Desktop Image - Shows on right for desktop */}
            <div className="hidden lg:block">
              <div className="relative rounded-lg overflow-hidden shadow-2xl h-[500px]">
                <Image 
                  src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=1200&auto=format&fit=crop"
                  alt="Chess students learning together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Cards - Programs Overview */}
      <section className="py-16 px-4 bg-white/40 dark:bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass p-8 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-4">
                <GraduationCap className="w-12 h-12 text-amber-600" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chess Academy</h2>
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-4">PROFESSIONAL TRAINING</p>
                </div>
              </div>
              <p className="mb-6 opacity-90">
                Our Chess Academy is one of the most comprehensive chess education platforms. Almost all internationally 
                recognized training methods are represented, bringing together classical study and modern digital learning.
              </p>
              <Button asChild variant="outline" className="glass">
                <Link href="/about">Read more about Chess Academy</Link>
              </Button>
            </Card>

            <Card className="glass p-8 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-4">
                <Heart className="w-12 h-12 text-rose-600" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">NGO & Community</h2>
                  <p className="text-sm text-rose-700 dark:text-rose-400 font-medium mb-4">SOCIAL IMPACT</p>
                </div>
              </div>
              <p className="mb-6 opacity-90">
                Our NGO initiative brings chess education to underserved communities. We believe in the power of chess 
                to develop critical thinking, creativity, and a strong sense of community engagement.
              </p>
              <Button asChild variant="outline" className="glass">
                <Link href="/donate">Read more about our NGO</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Study Programs Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-strong p-8">
              <h2 className="text-2xl font-bold mb-4">Learn at Chess Academy</h2>
              <p className="mb-6 opacity-90">
                Our academy offers you an inspiring and diverse choice of programs covering all skill levels, from beginner 
                to grandmaster preparation. Students Guide provides study-related instructions and schedules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                  <Link href="/student">Student Programs</Link>
                </Button>
                <Button asChild variant="outline" className="glass">
                  <Link href="/about">Student&apos;s Guide</Link>
                </Button>
              </div>
            </Card>

            <Card className="glass-strong p-8">
              <h2 className="text-2xl font-bold mb-4">Become a Coach</h2>
              <p className="mb-6 opacity-90">
                Join our team of expert coaches and share your passion for chess. We offer professional development, 
                competitive compensation, and the opportunity to make a lasting impact on students worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                  <Link href="/coach">Coach Programs</Link>
                </Button>
                <Button asChild variant="outline" className="glass">
                  <Link href="/coaches">Meet Our Coaches</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* News/Blog Section */}
      <section className="py-16 px-4 glass-strong">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Button asChild variant="link" className="text-amber-700 dark:text-amber-400">
              <Link href="/blog">All news →</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">NEWS • TOURNAMENTS</p>
              <h3 className="text-lg font-bold mb-3">International Chess Championship brings players from 30 countries</h3>
              <p className="text-sm opacity-80 mb-4">Published on 10.11.2025</p>
            </Card>
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">NEWS • RESEARCH</p>
              <h3 className="text-lg font-bold mb-3">Study shows chess improves academic performance in students by 23%</h3>
              <p className="text-sm opacity-80 mb-4">Published on 8.11.2025</p>
            </Card>
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">NEWS • COMMUNITY</p>
              <h3 className="text-lg font-bold mb-3">Chess for Change program reaches 1,000 students in rural communities</h3>
              <p className="text-sm opacity-80 mb-4">Published on 5.11.2025</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Tournaments/Events Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Tournaments</h2>
            <Button asChild variant="link" className="text-amber-700 dark:text-amber-400">
              <Link href="/tournaments">All tournaments →</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Calendar className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">RAPID TOURNAMENT</p>
                  <h3 className="text-lg font-bold">Monthly Blitz Championship</h3>
                </div>
              </div>
              <p className="text-sm opacity-80 mb-2">15.11.2025 18:00–22:00 (UTC+2)</p>
              <p className="text-sm opacity-80">Online Platform</p>
            </Card>
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Trophy className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">CHAMPIONSHIP</p>
                  <h3 className="text-lg font-bold">Winter Grand Prix 2025</h3>
                </div>
              </div>
              <p className="text-sm opacity-80 mb-2">20.11.2025–22.11.2025</p>
              <p className="text-sm opacity-80">City Chess Center</p>
            </Card>
            <Card className="glass p-6 hover:shadow-xl transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Users className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">COMMUNITY EVENT</p>
                  <h3 className="text-lg font-bold">Simultaneous Exhibition with GM</h3>
                </div>
              </div>
              <p className="text-sm opacity-80 mb-2">25.11.2025 14:00–17:00 (UTC+2)</p>
              <p className="text-sm opacity-80">Main Campus</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats/Impact Section */}
      <section className="py-16 px-4 glass-strong">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <div className="text-4xl font-bold text-amber-700 dark:text-amber-400 mb-2">1,200+</div>
              <div className="text-sm font-medium">Active Students</div>
            </div>
            <div>
              <Award className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <div className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-2">50+</div>
              <div className="text-sm font-medium">Expert Coaches</div>
            </div>
            <div>
              <Trophy className="w-12 h-12 mx-auto mb-4 text-rose-600" />
              <div className="text-4xl font-bold text-rose-700 dark:text-rose-400 mb-2">250+</div>
              <div className="text-sm font-medium">Tournaments Held</div>
            </div>
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <div className="text-4xl font-bold text-red-700 dark:text-red-400 mb-2">$75K+</div>
              <div className="text-sm font-medium">Donated to Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content - Success Stories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Student Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass p-8 hover:shadow-xl transition-all">
              <BookOpen className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">From Beginner to Champion</h3>
              <p className="mb-4 opacity-90">
                &ldquo;I started with zero knowledge of chess. Within 18 months, I won my first regional tournament. 
                The structured curriculum and supportive coaches made all the difference.&rdquo;
              </p>
              <Button asChild variant="link" className="text-amber-700 dark:text-amber-400 p-0">
                <Link href="/blog">Read more from our students →</Link>
              </Button>
            </Card>
            <Card className="glass p-8 hover:shadow-xl transition-all">
              <Users className="w-10 h-10 text-rose-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Building Communities Through Chess</h3>
              <p className="mb-4 opacity-90">
                &ldquo;Our NGO program brought chess to 500 children in rural areas. Seeing their critical thinking skills 
                develop and watching them compete internationally has been incredibly rewarding.&rdquo;
              </p>
              <Button asChild variant="link" className="text-amber-700 dark:text-amber-400 p-0">
                <Link href="/donate">Learn about our community impact →</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Store/Shop Teaser */}
      <section className="py-16 px-4 glass-strong">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Visit Our Chess Store</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Browse premium chess sets, books, training materials, and exclusive merchandise. 
            All proceeds support our educational mission.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
            <Link href="/shop">Explore Store</Link>
          </Button>
        </div>
      </section>

      {/* Join/CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-strong p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Global Chess Community</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Become part of a meaningful community where learning chess goes hand in hand with making a positive 
              social impact. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-lg px-12">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass text-lg px-12">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
