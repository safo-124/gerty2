import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-purple-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Chess Academy</h3>
            <p className="text-sm opacity-90 mb-4">
              Leading chess education platform combining professional training with social impact.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-amber-400 transition-colors">
                  Student Programs
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-amber-400 transition-colors">
                  Become a Coach
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="hover:text-amber-400 transition-colors">
                  Our Coaches
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-amber-400 transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-400 transition-colors">
                  News & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/student" className="hover:text-amber-400 transition-colors">
                  Beginner Courses
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-amber-400 transition-colors">
                  Advanced Training
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-amber-400 transition-colors">
                  Tournament Preparation
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-amber-400 transition-colors">
                  NGO Programs
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors">
                  Chess Store
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-amber-400 transition-colors">
                  Support Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="opacity-90">
                  123 Chess Avenue<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+1234567890" className="opacity-90 hover:text-amber-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@chessacademy.org" className="opacity-90 hover:text-amber-400 transition-colors">
                  info@chessacademy.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm opacity-80">
              © {new Date().getFullYear()} Chess Academy. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                Accessibility
              </Link>
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
