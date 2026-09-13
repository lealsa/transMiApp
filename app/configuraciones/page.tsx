"use client"

import { useTheme } from "next-themes"
import { useApp, ACCENT_PALETTE } from "@/lib/AppContext"
import {
  Languages,
  Sprout,
  Bell,
  Sun,
  Moon,
  Monitor,
  Palette,
  Home,
  Briefcase,
  GraduationCap,
  Pencil,
  RotateCcw,
} from "lucide-react"

export default function ConfiguracionesPage() {
  const { theme, setTheme } = useTheme()
  const {
    language,
    setLanguage,
    beginnerMode,
    setBeginnerMode,
    disruptionAlerts,
    setDisruptionAlerts,
    accentColor,
    setAccentColor,
    setOnboardingDone,
  } = useApp()

  const isEs = language === "es"

  const savedPlaces = [
    { label: isEs ? "Casa" : "Home", addr: "Calle 145 #91-15 (Portal Suba)", icon: Home },
    { label: isEs ? "Trabajo" : "Work", addr: "Av. El Dorado #68-51 (Calle 26)", icon: Briefcase },
    { label: isEs ? "Universidad" : "University", addr: "Cra. 1 #18A-12 (Universidades)", icon: GraduationCap },
  ]

  const handleReplayIntro = () => {
    setOnboardingDone(false)
    window.location.href = "/"
  }

  return (
    <div className="p-4 flex flex-col gap-5 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      <h2 className="font-heading text-3xl m-0">{isEs ? "Perfil y Ajustes" : "Profile & Settings"}</h2>

      {/* User Profile Card */}
      <div className="flex items-center gap-3.5 bg-[var(--surf)] rounded-[30px] p-4 border border-[var(--border2)] shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-[#f5ead8] flex items-center justify-center font-heading text-xl shadow-xs">
          LS
        </div>
        <div>
          <div className="font-heading text-xl leading-tight">Laura Sánchez</div>
          <div className="text-xs text-[var(--neu7)] mt-0.5">
            {isEs ? "Usuario Frecuente • Bogotá" : "Frequent Commuter • Bogotá"}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] mb-2 px-1">
          {isEs ? "Preferencias de la app" : "App Preferences"}
        </div>
        <div className="bg-[var(--surf)] rounded-[30px] p-2 px-4 border border-[var(--border2)] shadow-xs flex flex-col">
          {/* Language Toggle */}
          <div className="flex items-center justify-between py-3.5 border-b border-[var(--border2)]">
            <div className="flex items-center gap-3 text-sm font-medium text-[var(--ink)]">
              <Languages className="w-5 h-5 text-[var(--accent-dark)] stroke-[2.75]" />
              {isEs ? "Idioma" : "Language"}
            </div>
            <div className="flex border border-[var(--border)] rounded-full overflow-hidden p-0.5 bg-[var(--bg)]">
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
                  isEs ? "bg-[var(--accent)] text-[#f5ead8]" : "bg-transparent text-[var(--neu6)]"
                }`}
              >
                Español
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
                  !isEs ? "bg-[var(--accent)] text-[#f5ead8]" : "bg-transparent text-[var(--neu6)]"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Beginner Mode Toggle */}
          <button
            type="button"
            onClick={() => setBeginnerMode(prev => !prev)}
            className="flex items-center justify-between py-3.5 border-b border-[var(--border2)] bg-transparent border-0 cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-[var(--ink)]">
              <Sprout className="w-5 h-5 text-[var(--sage-ink)] stroke-[2.75]" />
              {isEs ? "Modo principiante" : "Beginner mode"}
            </div>
            <div
              className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                beginnerMode ? "bg-[var(--accent)] justify-end" : "bg-[var(--neu6)] justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </div>
          </button>

          {/* Disruption Alerts Toggle */}
          <button
            type="button"
            onClick={() => setDisruptionAlerts(prev => !prev)}
            className="flex items-center justify-between py-3.5 bg-transparent border-0 cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-[var(--ink)]">
              <Bell className="w-5 h-5 text-[var(--accent-dark)] stroke-[2.75]" />
              {isEs ? "Alertas del sistema" : "Disruption alerts"}
            </div>
            <div
              className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                disruptionAlerts ? "bg-[var(--accent)] justify-end" : "bg-[var(--neu6)] justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </div>
          </button>
        </div>
      </div>

      {/* Theme Mode Section */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] mb-2 px-1">
          {isEs ? "Tema de la interfaz" : "Interface Theme"}
        </div>
        <div className="bg-[var(--surf)] rounded-[30px] p-2 border border-[var(--border2)] shadow-xs flex flex-col gap-1">
          {[
            { id: "light", label: isEs ? "Claro (Warm Sand)" : "Light (Warm Sand)", icon: Sun },
            { id: "dark", label: isEs ? "Oscuro (Warm Dark)" : "Dark (Warm Dark)", icon: Moon },
            { id: "system", label: isEs ? "Sistema" : "System default", icon: Monitor },
          ].map((item) => {
            const IconComp = item.icon
            const isSelected = theme === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`w-full flex items-center gap-3 p-3 px-4 rounded-2xl border-0 cursor-pointer transition-colors text-left font-medium text-sm ${
                  isSelected
                    ? "bg-[var(--bg)] text-[var(--accent-dark)] font-semibold shadow-xs"
                    : "bg-transparent text-[var(--ink)] hover:bg-[var(--hover)]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--neu6)]"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <IconComp className="w-4.5 h-4.5 text-[var(--accent-dark)] stroke-[2.75]" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent Colors Section */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] mb-2 px-1">
          {isEs ? "Color de acento principal" : "Accent Color Theme"}
        </div>
        <div className="bg-[var(--surf)] rounded-[30px] p-4 border border-[var(--border2)] shadow-xs flex gap-3.5 flex-wrap items-center">
          {ACCENT_PALETTE.map((c) => {
            const isSelected = accentColor === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setAccentColor(c.id)}
                className="border-0 bg-transparent cursor-pointer p-0.5 flex flex-col items-center gap-1 font-medium transition-transform active:scale-95"
              >
                <span
                  className={`w-9 h-9 rounded-full transition-all ${
                    isSelected ? "ring-3 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--surf)]" : ""
                  }`}
                  style={{ backgroundColor: c.base }}
                />
                <span className="text-[11px] text-[var(--neu7b)]">{isEs ? c.labelEs : c.labelEn}</span>
              </button>
            )
          })}

          {/* Custom Color Input */}
          <div className="flex flex-col items-center gap-1 p-0.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-dashed border-[var(--neu6)] flex items-center justify-center">
              <input
                type="color"
                value={accentColor.startsWith("#") ? accentColor : "#c67139"}
                onChange={(e) => setAccentColor(e.target.value)}
                className="absolute -top-3 -left-3 w-16 h-16 border-0 p-0 cursor-pointer"
              />
            </div>
            <span className="text-[11px] text-[var(--neu7b)]">{isEs ? "Personalizado" : "Custom"}</span>
          </div>
        </div>
      </div>

      {/* Saved Places Section */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] mb-2 px-1">
          {isEs ? "Lugares guardados" : "Saved Places"}
        </div>
        <div className="flex flex-col gap-2.5">
          {savedPlaces.map((p, idx) => {
            const IconComp = p.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[var(--surf)] rounded-3xl p-3 px-4 border border-[var(--border2)] shadow-xs"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--bg)] text-[var(--accent-dark)] flex items-center justify-center flex-none">
                  <IconComp className="w-4.5 h-4.5 stroke-[2.75]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[var(--ink)] truncate">{p.label}</div>
                  <div className="text-xs text-[var(--neu7)] truncate">{p.addr}</div>
                </div>
                <button
                  type="button"
                  aria-label="Edit place"
                  className="w-8 h-8 rounded-full border-0 bg-transparent text-[var(--neu6)] hover:bg-[var(--surf2)] flex items-center justify-center cursor-pointer"
                >
                  <Pencil className="w-4 h-4 stroke-[2.75]" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Replay Intro Action Button */}
      <button
        type="button"
        onClick={handleReplayIntro}
        className="w-full h-12 border border-[var(--border)] rounded-full bg-transparent font-heading text-sm text-[var(--ink)] flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--hover)] transition-colors mt-2"
      >
        <RotateCcw className="w-4 h-4 stroke-[2.75]" />
        {isEs ? "Ver introducción de la app nuevamente" : "Replay intro onboarding"}
      </button>
    </div>
  )
}