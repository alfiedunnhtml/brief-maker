"use client"

import { Navbar } from "@/components/navbar"


interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen">

      
      {/* Main Content */}
      <Navbar />
      <main className="relative z-10 pt-24 px-4 py-8 md:px-8 lg:px-12">
        <div className="flex flex-col items-center ">
          {children}
        </div>
      </main>
    </div>
  )
} 