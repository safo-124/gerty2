"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Menu, ChevronDown } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; role: "ADMIN"|"COACH"|"STUDENT"; name?: string } | null>(null)

  React.useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              ♔
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">Chess Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/tournaments">Tournaments</NavLink>
            <NavLink href="/coaches">Coaches</NavLink>
            
            {/* Dropdown for Community */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Community <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong">
                <DropdownMenuItem asChild>
                  <Link href="/donate" className="cursor-pointer">Donate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/shop" className="cursor-pointer">Shop</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="glass">
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-strong">
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <form method="POST" action="/api/auth/logout">
                      <button type="submit" className="w-full text-left">Logout</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="glass">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="glass">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    ♔
                  </div>
                  Chess Academy
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <MobileNavLink href="/about" onClick={() => setOpen(false)}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/blog" onClick={() => setOpen(false)}>
                  Blog
                </MobileNavLink>
                <MobileNavLink href="/tournaments" onClick={() => setOpen(false)}>
                  Tournaments
                </MobileNavLink>
                <MobileNavLink href="/coaches" onClick={() => setOpen(false)}>
                  Coaches
                </MobileNavLink>
                <MobileNavLink href="/donate" onClick={() => setOpen(false)}>
                  Donate
                </MobileNavLink>
                <MobileNavLink href="/shop" onClick={() => setOpen(false)}>
                  Shop
                </MobileNavLink>
                
                <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                  {user ? (
                    <form method="POST" action="/api/auth/logout" onSubmit={() => setOpen(false)}>
                      <Button type="submit" variant="outline" size="sm" className="glass w-full">Logout</Button>
                    </form>
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm" className="glass w-full">
                        <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 w-full">
                        <Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-all",
        "hover:bg-white/10 dark:hover:bg-black/20"
      )}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block px-4 py-3 rounded-lg text-base font-medium transition-all",
        "hover:bg-white/10 dark:hover:bg-black/20"
      )}
    >
      {children}
    </Link>
  )
}
