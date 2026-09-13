"use client"

import { AlertTriangle, Clock } from "lucide-react"
import { useApp } from "@/lib/AppContext"

export interface AlertItem {
  id: string
  tag: string
  tagColor: string
  time: string
  title: string
  body: string
  action?: string
}

export function SystemAlertBanner({ onClick }: { onClick?: () => void }) {
  const { language } = useApp()
  const isEs = language === "es"

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full border-0 border-l-4 border-[var(--accent)] rounded-[24px] bg-[var(--accent-light)] p-3.5 px-4 flex gap-3 items-start cursor-pointer hover:bg-[var(--accent-tint-hover)] transition-colors shadow-xs"
    >
      <AlertTriangle className="w-5 h-5 text-[var(--accent-dark)] flex-none mt-0.5 stroke-[2.75]" />
      <div>
        <div className="font-semibold text-sm text-[var(--accent-dark)]">
          {isEs ? "Cierre temporal: Estación Calle 26" : "Temporary closure: Calle 26 station"}
        </div>
        <div className="text-xs text-[var(--accent-dark)] leading-relaxed mt-0.5">
          {isEs
            ? "Mantenimiento en vagón central. Desvíos hacia estación Profamilia."
            : "Maintenance at central platform. Detours via Profamilia station."}
        </div>
      </div>
    </button>
  )
}

export function Alerts() {
  const { language } = useApp()
  const isEs = language === "es"

  const alertsList: AlertItem[] = [
    {
      id: "1",
      tag: isEs ? "Urgente" : "Urgent",
      tagColor: "bg-[var(--accent-light)] text-[var(--accent-dark)]",
      time: isEs ? "Hace 5 min" : "5 mins ago",
      title: isEs ? "Demora en Troncal Caracas" : "Delays on Caracas Trunk Line",
      body: isEs
        ? "Alto flujo vehicular en Calle 26 afecta tiempos en rutas B14, F23 y K9."
        : "Heavy traffic on Calle 26 impacts travel times on B14, F23 and K9 routes.",
      action: isEs ? "Ver rutas alternativas" : "View alternative routes",
    },
    {
      id: "2",
      tag: isEs ? "Mantenimiento" : "Maintenance",
      tagColor: "bg-[var(--sage-bg)] text-[var(--sage-text)]",
      time: isEs ? "Hace 20 min" : "20 mins ago",
      title: isEs ? "Cierre de vagón en Portal Suba" : "Platform closure at Portal Suba",
      body: isEs
        ? "El vagón 2 permanecerá cerrado hasta las 11:00 a.m. por reparaciones."
        : "Platform 2 will remain closed until 11:00 a.m. for repairs.",
    },
    {
      id: "3",
      tag: isEs ? "Informativo" : "Info",
      tagColor: "bg-[var(--surf2)] text-[var(--neu7b)]",
      time: isEs ? "Hace 1 hora" : "1 hour ago",
      title: isEs ? "Nuevos horarios de fin de semana" : "Updated weekend schedules",
      body: isEs
        ? "Las rutas alimentadoras de Usme extienden su horario de domingo hasta las 10:30 p.m."
        : "Usme feeder routes extend Sunday schedule until 10:30 p.m.",
    },
  ]

  return (
    <div className="p-4 flex flex-col gap-3 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-3xl m-0">{isEs ? "Avisos del sistema" : "System Alerts"}</h2>
        <span className="text-xs text-[var(--neu6)]">{isEs ? "Actualizado ahora" : "Updated just now"}</span>
      </div>

      <div className="flex flex-col gap-3">
        {alertsList.map((a) => (
          <div
            key={a.id}
            className="bg-[var(--surf)] rounded-3xl p-4 flex flex-col gap-2 border border-[var(--border2)] shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${a.tagColor}`}>
                {a.tag}
              </span>
              <span className="text-[11.5px] text-[var(--neu6)] ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3 stroke-[2.75]" />
                {a.time}
              </span>
            </div>
            <div className="font-heading text-lg leading-snug">{a.title}</div>
            <div className="text-xs text-[var(--neu7b)] leading-relaxed">{a.body}</div>
            {a.action && (
              <button
                type="button"
                className="self-start border-0 bg-transparent text-[var(--accent-dark)] font-semibold text-xs cursor-pointer p-0 hover:underline mt-1"
              >
                {a.action} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}