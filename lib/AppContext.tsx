"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useTheme } from "next-themes"

export type AccentId = "terracotta" | "sage" | "ochre" | "clay" | "plum" | "slate"

export interface AccentOption {
  id: AccentId
  base: string
  dark: string
  light: string
  hover: string
  tintHover: string
  labelEs: string
  labelEn: string
}

export const ACCENT_PALETTE: AccentOption[] = [
  { id: "terracotta", base: "#c67139", dark: "#8c491a", light: "#ffe1d0", hover: "#b2622d", tintHover: "#fcd5bf", labelEs: "Terracota", labelEn: "Terracotta" },
  { id: "sage", base: "#7a8a5e", dark: "#4d5a3a", light: "#e1eecc", hover: "#69794e", tintHover: "#d6e6be", labelEs: "Salvia", labelEn: "Sage" },
  { id: "ochre", base: "#b8873a", dark: "#7c5a22", light: "#f6e6c3", hover: "#a1742e", tintHover: "#f0dcb0", labelEs: "Ocre", labelEn: "Ochre" },
  { id: "clay", base: "#b5563f", dark: "#7c3a28", light: "#f3d9cf", hover: "#9e4732", tintHover: "#eac6b8", labelEs: "Arcilla", labelEn: "Clay" },
  { id: "plum", base: "#8a5a7a", dark: "#5e3c53", light: "#ecdae6", hover: "#774b69", tintHover: "#e2c9da", labelEs: "Ciruela", labelEn: "Plum" },
  { id: "slate", base: "#4f7285", dark: "#33505f", light: "#d8e6ea", hover: "#416071", tintHover: "#c6d9df", labelEs: "Pizarra", labelEn: "Slate" },
]

interface AppContextType {
  language: "es" | "en"
  setLanguage: (lang: "es" | "en") => void
  beginnerMode: boolean
  setBeginnerMode: (val: boolean | ((prev: boolean) => boolean)) => void
  disruptionAlerts: boolean
  setDisruptionAlerts: (val: boolean | ((prev: boolean) => boolean)) => void
  accentColor: string
  setAccentColor: (color: string) => void
  onboardingDone: boolean
  setOnboardingDone: (val: boolean) => void
  currentAccent: {
    base: string
    dark: string
    light: string
    hover: string
    tintHover: string
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<"es" | "en">("es")
  const [beginnerMode, setBeginnerModeState] = useState<boolean>(true)
  const [disruptionAlerts, setDisruptionAlertsState] = useState<boolean>(true)
  const [accentColor, setAccentColorState] = useState<string>("terracotta")
  const [onboardingDone, setOnboardingDoneState] = useState<boolean>(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("trasmi_lang") as "es" | "en"
      if (savedLang) setLanguageState(savedLang)

      const savedBeginner = localStorage.getItem("trasmi_beginner")
      if (savedBeginner !== null) setBeginnerModeState(savedBeginner === "true")

      const savedAlerts = localStorage.getItem("trasmi_alerts")
      if (savedAlerts !== null) setDisruptionAlertsState(savedAlerts === "true")

      const savedAccent = localStorage.getItem("trasmi_accent")
      if (savedAccent) setAccentColorState(savedAccent)

      const savedOnboarding = localStorage.getItem("trasmi_onboarding")
      if (savedOnboarding !== null) setOnboardingDoneState(savedOnboarding === "true")
      else setOnboardingDoneState(false) // default to showing onboarding if never set
    } catch (e) {
      console.warn("Could not load preferences from localStorage", e)
    }
  }, [])

  const setLanguage = (lang: "es" | "en") => {
    setLanguageState(lang)
    localStorage.setItem("trasmi_lang", lang)
  }

  const setBeginnerMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setBeginnerModeState(prev => {
      const next = typeof val === "function" ? val(prev) : val
      localStorage.setItem("trasmi_beginner", String(next))
      return next
    })
  }

  const setDisruptionAlerts = (val: boolean | ((prev: boolean) => boolean)) => {
    setDisruptionAlertsState(prev => {
      const next = typeof val === "function" ? val(prev) : val
      localStorage.setItem("trasmi_alerts", String(next))
      return next
    })
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    localStorage.setItem("trasmi_accent", color)
  }

  const setOnboardingDone = (val: boolean) => {
    setOnboardingDoneState(val)
    localStorage.setItem("trasmi_onboarding", String(val))
  }

  // Derive current accent values
  const preset = ACCENT_PALETTE.find(p => p.id === accentColor)
  const currentAccent = preset
    ? { base: preset.base, dark: preset.dark, light: preset.light, hover: preset.hover, tintHover: preset.tintHover }
    : { base: accentColor, dark: accentColor, light: `${accentColor}33`, hover: accentColor, tintHover: `${accentColor}22` }

  // Update root CSS variables when accent color changes
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--accent", currentAccent.base)
    root.style.setProperty("--accent-dark", currentAccent.dark)
    root.style.setProperty("--accent-light", currentAccent.light)
    root.style.setProperty("--accent-hover", currentAccent.hover)
    root.style.setProperty("--accent-tint-hover", currentAccent.tintHover)
  }, [currentAccent])

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        beginnerMode,
        setBeginnerMode,
        disruptionAlerts,
        setDisruptionAlerts,
        accentColor,
        setAccentColor,
        onboardingDone,
        setOnboardingDone,
        currentAccent,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
