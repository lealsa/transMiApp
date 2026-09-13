"use client"

import { useState } from "react"
import { Clock, Info } from "lucide-react"
import { useApp } from "@/lib/AppContext"
import { ROUTES_DATABASE } from "@/lib/transmilenioData"

export default function HorariosPage() {
  const { language } = useApp()
  const [dayType, setDayType] = useState<"weekday" | "saturday" | "sunday">("weekday")

  const isEs = language === "es"

  // Schedule datasets per day type
  const schedules = {
    weekday: [
      { band: "4:30 - 7:00 a.m.", every: isEs ? "Cada 4 - 6 min" : "Every 4 - 6 mins", load: isEs ? "Alta" : "High", loadBg: "var(--accent-light)", loadColor: "var(--accent-dark)" },
      { band: "7:00 - 9:00 a.m. (Pico)", every: isEs ? "Cada 3 - 4 min" : "Every 3 - 4 mins", load: isEs ? "Máxima" : "Peak", loadBg: "#fee2e2", loadColor: "#b91c1c" },
      { band: "9:00 a.m. - 4:30 p.m.", every: isEs ? "Cada 5 - 8 min" : "Every 5 - 8 mins", load: isEs ? "Normal" : "Normal", loadBg: "var(--sage-bg)", loadColor: "var(--sage-text)" },
      { band: "4:30 - 7:30 p.m. (Pico)", every: isEs ? "Cada 3 - 5 min" : "Every 3 - 5 mins", load: isEs ? "Máxima" : "Peak", loadBg: "#fee2e2", loadColor: "#b91c1c" },
      { band: "7:30 - 11:00 p.m.", every: isEs ? "Cada 6 - 10 min" : "Every 6 - 10 mins", load: isEs ? "Baja" : "Low", loadBg: "var(--surf2)", loadColor: "var(--neu7b)" },
    ],
    saturday: [
      { band: "5:00 - 8:00 a.m.", every: isEs ? "Cada 6 - 8 min" : "Every 6 - 8 mins", load: isEs ? "Normal" : "Normal", loadBg: "var(--sage-bg)", loadColor: "var(--sage-text)" },
      { band: "8:00 a.m. - 1:00 p.m.", every: isEs ? "Cada 5 - 7 min" : "Every 5 - 7 mins", load: isEs ? "Alta" : "High", loadBg: "var(--accent-light)", loadColor: "var(--accent-dark)" },
      { band: "1:00 - 6:00 p.m.", every: isEs ? "Cada 6 - 9 min" : "Every 6 - 9 mins", load: isEs ? "Normal" : "Normal", loadBg: "var(--sage-bg)", loadColor: "var(--sage-text)" },
      { band: "6:00 - 10:30 p.m.", every: isEs ? "Cada 8 - 12 min" : "Every 8 - 12 mins", load: isEs ? "Baja" : "Low", loadBg: "var(--surf2)", loadColor: "var(--neu7b)" },
    ],
    sunday: [
      { band: "5:30 - 9:00 a.m.", every: isEs ? "Cada 10 - 15 min" : "Every 10 - 15 mins", load: isEs ? "Baja" : "Low", loadBg: "var(--surf2)", loadColor: "var(--neu7b)" },
      { band: "9:00 a.m. - 6:00 p.m.", every: isEs ? "Cada 8 - 10 min" : "Every 8 - 10 mins", load: isEs ? "Normal" : "Normal", loadBg: "var(--sage-bg)", loadColor: "var(--sage-text)" },
      { band: "6:00 - 10:00 p.m.", every: isEs ? "Cada 12 - 15 min" : "Every 12 - 15 mins", load: isEs ? "Baja" : "Low", loadBg: "var(--surf2)", loadColor: "var(--neu7b)" },
    ],
  }

  const currentRows = schedules[dayType]

  return (
    <div className="p-4 flex flex-col gap-4 bg-[var(--bg)] text-[var(--ink)] min-h-full">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6 text-[var(--accent-dark)] stroke-[2.75]" />
        <h2 className="font-heading text-3xl m-0">{isEs ? "Horarios de servicio" : "Service schedules"}</h2>
      </div>

      {/* Day selector pills */}
      <div className="flex gap-1.5 p-1 bg-[var(--surf)] rounded-full border border-[var(--border2)]">
        <button
          type="button"
          onClick={() => setDayType("weekday")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            dayType === "weekday"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Entre semana" : "Weekday"}
        </button>
        <button
          type="button"
          onClick={() => setDayType("saturday")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            dayType === "saturday"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Sábado" : "Saturday"}
        </button>
        <button
          type="button"
          onClick={() => setDayType("sunday")}
          className={`flex-1 py-2 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${
            dayType === "sunday"
              ? "bg-[var(--accent)] text-[#f5ead8] shadow-xs"
              : "bg-transparent text-[var(--neu6)]"
          }`}
        >
          {isEs ? "Domingo" : "Sunday"}
        </button>
      </div>

      {/* Schedule Table */}
      <div className="bg-[var(--surf)] rounded-[28px] p-4 border border-[var(--border2)] shadow-xs">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] pb-2.5 border-b border-[var(--border)]">
                {isEs ? "Franja horaria" : "Time band"}
              </th>
              <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] pb-2.5 border-b border-[var(--border)]">
                {isEs ? "Frecuencia" : "Every"}
              </th>
              <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--neu6)] pb-2.5 border-b border-[var(--border)]">
                {isEs ? "Ocupación" : "Load"}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((r, idx) => (
              <tr key={idx}>
                <td className="py-3 border-b border-[var(--border2)] font-medium text-[var(--ink)]">
                  {r.band}
                </td>
                <td className="py-3 border-b border-[var(--border2)] text-right text-[var(--neu7b)]">
                  {r.every}
                </td>
                <td className="py-3 border-b border-[var(--border2)] text-right">
                  <span
                    className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: r.loadBg, color: r.loadColor }}
                  >
                    {r.load}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operational Note */}
      <div className="flex gap-2.5 items-start bg-[var(--surf2)] rounded-2xl p-3.5 px-4 text-xs text-[var(--neu7b)] leading-relaxed">
        <Info className="w-4 h-4 text-[var(--neu6)] flex-none mt-0.5 stroke-[2.75]" />
        <span>
          {isEs
            ? "* Los horarios y frecuencias corresponden a la programación oficial del sistema TransMilenio."
            : "* Schedules and frequencies match official TransMilenio operating tables."}
        </span>
      </div>

      {/* Per-Route Operating Matrix */}
      <div>
        <h3 className="font-heading text-xl mb-3">{isEs ? "Horarios por Ruta" : "Schedule per Route"}</h3>
        <div className="flex flex-col gap-2">
          {ROUTES_DATABASE.map((route, idx) => (
            <div key={idx} className="bg-[var(--surf)] border border-[var(--border2)] rounded-2xl p-3 px-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-8 rounded-xl flex items-center justify-center font-heading text-xs font-semibold text-white flex-none" style={{ backgroundColor: route.color || "var(--accent)" }}>
                  {route.code}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[var(--ink)] truncate">{route.name}</div>
                  <div className="text-[11px] text-[var(--neu7)] truncate">
                    {dayType === "weekday" ? route.hoursWeekday : dayType === "saturday" ? route.hoursSaturday : route.hoursSunday}
                  </div>
                </div>
              </div>

              <div className="text-right flex-none">
                <span className="text-[11px] font-semibold text-[var(--accent-dark)] bg-[var(--accent-light)] px-2.5 py-1 rounded-full">
                  ⚡ {route.frequencyPeak}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}