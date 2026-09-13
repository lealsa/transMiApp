"use client"

import { Bus, Navigation, Clock, BellRing } from "lucide-react"
import { useApp } from "@/lib/AppContext"

export function Onboarding({ onStart }: { onStart: () => void }) {
  const { language, setLanguage, beginnerMode, setBeginnerMode } = useApp()

  const isEs = language === "es"

  const title = isEs ? "Muévete por Bogotá sin adivinar" : "Navigate Bogotá with confidence"
  const sub = isEs
    ? "Rutas, llegadas en vivo y avisos del sistema, explicados en español claro."
    : "Routes, live arrivals and system alerts, explained clearly."

  const points = isEs
    ? [
        { icon: Navigation, title: "Planea en dos toques", body: "Escribe a dónde vas y elige la mejor opción." },
        { icon: Clock, title: "Mira el bus llegar", body: "Minutos reales, no horarios teóricos." },
        { icon: BellRing, title: "Entérate antes", body: "Demoras y cierres alertados a tiempo." },
      ]
    : [
        { icon: Navigation, title: "Plan in two taps", body: "Type your destination and pick the best option." },
        { icon: Clock, title: "Watch the bus arrive", body: "Real-time minutes, not ideal schedules." },
        { icon: BellRing, title: "Stay informed", body: "Disruptions and closures notified early." },
      ]


  return (
    <div className="min-h-full p-6 flex flex-col gap-5 bg-[var(--bg)] text-[var(--ink)]">
      {/* Header with App Brand and Language switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[#f5ead8] flex items-center justify-center shadow-xs">
            <Bus className="w-5 h-5 stroke-[2.75]" />
          </div>
          <span className="font-heading text-xl text-[var(--ink)]">TrasmiApp</span>
        </div>
        <div className="flex border border-[var(--border)] rounded-full overflow-hidden p-0.5 bg-[var(--surf)]">
          <button
            type="button"
            onClick={() => setLanguage("es")}
            className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
              isEs ? "bg-[var(--accent)] text-[#f5ead8]" : "bg-transparent text-[var(--neu6)]"
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
              !isEs ? "bg-[var(--accent)] text-[#f5ead8]" : "bg-transparent text-[var(--neu6)]"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Graphic Hero card */}
      <div className="relative h-36 rounded-[32px] bg-[var(--surf)] overflow-hidden flex items-center justify-center shadow-xs border border-[var(--border2)]">
        <div className="absolute w-44 h-44 rounded-full bg-[#f6a06b] opacity-40 -left-10 -top-12" />
        <div className="absolute w-32 h-32 rounded-full bg-[#aebf92] opacity-50 -right-6 -bottom-8" />
        <div className="relative z-10 w-16 h-16 rounded-full bg-[var(--accent)] text-[#f5ead8] flex items-center justify-center shadow-md">
          <Navigation className="w-8 h-8 stroke-[2.75]" />
        </div>
      </div>

      {/* Main Title & Description */}
      <div>
        <h1 className="font-heading text-3xl leading-tight m-0 mb-2 tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        <p className="m-0 text-sm leading-relaxed text-[var(--neu7b)] font-medium">
          {sub}
        </p>
      </div>

      {/* Feature Points */}
      <div className="flex flex-col gap-3">
        {points.map((p, idx) => {
          const IconComp = p.icon
          return (
            <div key={idx} className="flex gap-3 items-start bg-[var(--surf)] rounded-3xl p-3.5 border border-[var(--border2)]">
              <div className="w-9 h-9 flex-none rounded-full bg-[var(--bg)] text-[var(--accent-dark)] flex items-center justify-center">
                <IconComp className="w-4.5 h-4.5 stroke-[2.75]" />
              </div>
              <div>
                <div className="font-heading text-base leading-tight text-[var(--ink)]">{p.title}</div>
                <div className="text-xs text-[var(--neu7)] leading-relaxed mt-0.5">{p.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Beginner Mode Toggle Row */}
      <button
        type="button"
        onClick={() => setBeginnerMode(prev => !prev)}
        className="flex items-center justify-between bg-[var(--surf)] rounded-3xl p-3.5 border border-[var(--border2)] text-left cursor-pointer hover:bg-[var(--surf2)] transition-colors w-full"
      >
        <div>
          <div className="font-heading text-base text-[var(--ink)]">
            {isEs ? "Modo principiante" : "Beginner mode"}
          </div>
          <div className="text-xs text-[var(--neu7)] mt-0.5">
            {isEs ? "Muestra consejos paso a paso" : "Show helpful step-by-step tips"}
          </div>
        </div>
        <div
          className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
            beginnerMode ? "bg-[var(--accent)] justify-end" : "bg-[var(--neu6)] justify-start"
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
        </div>
      </button>

      {/* Start Action Button */}
      <button
        type="button"
        onClick={onStart}
        className="mt-auto w-full h-13 border-0 rounded-full bg-[var(--accent)] text-[#f5ead8] font-heading text-lg cursor-pointer hover:bg-[var(--accent-hover)] transition-all active:scale-[0.99] shadow-md flex items-center justify-center"
      >
        {isEs ? "Empezar" : "Get Started"}
      </button>
    </div>
  )
}
