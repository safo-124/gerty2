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
import { Menu, ChevronDown, User, LogOut, LayoutDashboard, Sparkles } from "lucide-react"

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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-gray-950/80 border-b border-gray-200 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                ♔
              </div>
              <div className="absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chess Academy
              </span>
              <div className="text-xs opacity-50 -mt-1">Master the Game</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-100/80 dark:bg-white/5 rounded-full px-2 py-1.5 border border-gray-200 dark:border-white/10">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/tournaments">Tournaments</NavLink>
            <NavLink href="/coaches">Coaches</NavLink>
            
            {/* Dropdown for Community */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                  Community <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-950 backdrop-blur-xl border border-gray-200 dark:border-white/20 mt-2">
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
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Dashboard button */}
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all">
                  <Link href={user.role === "ADMIN" ? "/admin" : user.role === "COACH" ? "/coach" : "/coaches"}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white dark:bg-transparent border-gray-300 dark:border-white/20 hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-white/5">
                      <User className="w-4 h-4 mr-2" />
                      {user.name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-gray-950 backdrop-blur-xl border border-gray-200 dark:border-white/20 mt-2 min-w-[200px]">
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "COACH" && (
                      <DropdownMenuItem asChild>
                        <Link href="/coach" className="flex items-center">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Coach Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <form method="POST" action="/api/auth/logout">
                        <button type="submit" className="w-full text-left flex items-center">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="bg-white dark:bg-transparent border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 hover:bg-gray-50 dark:hover:bg-white/5">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all">
                  <Link href="/signup">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="bg-gray-100 dark:bg-transparent border border-gray-300 dark:border-white/10 hover:border-purple-500/50 hover:bg-gray-200 dark:hover:bg-white/5">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-950 backdrop-blur-xl w-[320px] border-l border-gray-200 dark:border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                      ♔
                    </div>
                    <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-md opacity-50" />
                  </div>
                  <div>
                    <div className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Chess Academy
                    </div>
                    <div className="text-xs opacity-50 -mt-0.5">Master the Game</div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
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
                {user && (
                  <MobileNavLink
                    href={user.role === "ADMIN" ? "/admin" : user.role === "COACH" ? "/coach" : "/coaches"}
                    onClick={() => setOpen(false)}
                  >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </MobileNavLink>
                )}
                
                <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4 space-y-3">
                  {user ? (
                    <>
                      <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm">
                        <div className="flex items-center gap-2 opacity-70 mb-1">
                          <User className="w-4 h-4" />
                          Signed in as
                        </div>
                        <div className="font-medium truncate">{user.name || user.email}</div>
                      </div>
                      <form method="POST" action="/api/auth/logout" onSubmit={() => setOpen(false)}>
                        <Button type="submit" variant="outline" size="sm" className="bg-white dark:bg-transparent w-full border-gray-300 dark:border-white/20">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm" className="bg-white dark:bg-transparent w-full border-gray-300 dark:border-white/20">
                        <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 w-full shadow-lg shadow-purple-500/30">
                        <Link href="/signup" onClick={() => setOpen(false)}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Sign Up
                        </Link>
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
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        "hover:bg-gray-200 dark:hover:bg-white/10 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text"
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
        "block px-4 py-3 rounded-xl text-base font-medium transition-all border border-transparent",
        "hover:bg-gray-100 dark:hover:bg-white/5 hover:border-purple-500/30 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text"
      )}
    >
      {children}
    </Link>
  )
}
