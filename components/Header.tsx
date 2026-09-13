"use client"

import Link from "next/link"
import { Bell, User } from "lucide-react"
import { useApp } from "@/lib/AppContext"

export function Header() {
  const { language } = useApp()

  const greeting = language === "es" ? "¿A DÓNDE VAMOS HOY?" : "WHERE TO TODAY?"
  const title = "TrasmiApp"

  return (
    <div className="flex items-start justify-between gap-3 pt-2 pb-1">
      <div>
        <div className="text-[12.5px] tracking-[0.09em] uppercase text-[var(--neu6)] font-semibold">
          {greeting}
        </div>
        <h2 className="font-heading text-3xl leading-tight m-0 text-[var(--ink)]">
          {title}
        </h2>
      </div>
      <div className="flex gap-2 flex-none">
        <Link href="/configuraciones" className="no-underline">
          <button
            type="button"
            aria-label="Profile & Settings"
            className="w-10 h-10 rounded-full border-0 bg-[var(--surf)] text-[var(--neu7b)] flex items-center justify-center cursor-pointer hover:bg-[var(--surf2)] transition-colors"
          >
            <User className="w-5 h-5 stroke-[2.75]" />
          </button>
        </Link>
      </div>
    </div>
  )
}
