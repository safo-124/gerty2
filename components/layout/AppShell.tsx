import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AppShellProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  topbar?: React.ReactNode
}

export function AppShell({ children, sidebar, topbar }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-strong px-4 py-2 flex items-center justify-between sticky top-0 z-40">
        <div className="font-semibold">Chess Academy</div>
        {topbar ?? (
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost"><Link href="/admin">Admin</Link></Button>
            <Button asChild variant="ghost"><Link href="/coach">Coach</Link></Button>
            <Button asChild variant="ghost"><Link href="/student">Student</Link></Button>
          </nav>
        )}
      </header>
      <div className="flex flex-1">
        {sidebar && (
          <aside className="w-64 p-4 hidden md:block glass">
            {sidebar}
          </aside>
        )}
        <main className={cn("flex-1 p-4", "space-y-6")}>{children}</main>
      </div>
      <footer className="text-xs text-center py-4 opacity-70">
        © {new Date().getFullYear()} Chess Academy & Charity
      </footer>
    </div>
  )
}

export function DemoSidebar() {
  return (
    <nav className="space-y-2 text-sm">
      <div className="font-medium mb-2">Navigation</div>
      <ul className="space-y-1">
        <li><Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button></li>
        <li><Button variant="ghost" size="sm" className="w-full justify-start">Lessons</Button></li>
        <li><Button variant="ghost" size="sm" className="w-full justify-start">Donations</Button></li>
        <li><Button variant="ghost" size="sm" className="w-full justify-start">Users</Button></li>
      </ul>
    </nav>
  )
}
