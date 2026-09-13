"use client"

import { useState } from "react"
import { ArrowLeft, Bell, BellRing, CheckCircle2, Circle } from "lucide-react"
import { useApp } from "@/lib/AppContext"

export function TripProgress({ onBack }: { onBack: () => void }) {
  const { language } = useApp()
  const [notify, setNotify] = useState(false)

  const isEs = language === "es"

  const stops = [
    { name: "Portal Suba", note: "Origen", time: "8:30 a.m.", status: "done" },
    { name: "21 Ángeles", note: "Pasó hace 5 min", time: "8:40 a.m.", status: "done" },
    { name: "Av. Chile", note: "Siguiente parada", time: "8:47 a.m.", status: "current" },
    { name: "Calle 26", note: "Transbordo con K9", time: "8:56 a.m.", status: "next" },
    { name: "Plaza de Bolívar", note: "Destino final", time: "9:05 a.m.", status: "next" },
  ]

  return (
    <div className="flex flex-col min-h-full bg-[var(--bg)] text-[var(--ink)]">
      {/* Top Banner */}
      <div className="bg-[var(--accent-dark)] text-[#f5ead8] p-5 pb-6 rounded-b-[34px] shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-[38px] h-[38px] border-0 rounded-full bg-white/20 text-[#f5ead8] flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.75]" />
          </button>
          <span className="text-xs tracking-wider uppercase opacity-90 font-semibold">
            {isEs ? "Viaje en curso" : "Trip in progress"}
          </span>
        </div>

        <div className="text-xs opacity-85">{isEs ? "Siguiente estación:" : "Next station:"}</div>
        <h2 className="font-heading text-3xl leading-tight my-1">Av. Chile</h2>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-4xl leading-none">2</span>
            <span className="text-sm opacity-85">min</span>
          </div>
          <div className="h-8 w-px bg-white/30" />
          <div className="text-xs opacity-90 leading-tight">
            {isEs ? "Llegada estimada:" : "Est. arrival:"}<br />
            <strong className="font-heading text-base font-normal">8:47 a.m.</strong>
          </div>
        </div>
      </div>

      {/* Stop Timeline */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col">
          {stops.map((s, idx) => {
            const isDone = s.status === "done"
            const isCurrent = s.status === "current"
            const isLast = idx === stops.length - 1

            return (
              <div key={idx} className="flex gap-3.5 items-stretch">
                {/* Timeline Axis */}
                <div className="w-5 flex-none flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? "bg-[var(--accent)] ring-4 ring-[var(--accent-light)]"
                        : isDone
                        ? "bg-[var(--sage-ink)]"
                        : "bg-[var(--surf2)] border-2 border-[var(--neu6)]"
                    }`}
                  />
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[32px] ${
                        isDone ? "bg-[var(--sage-ink)]" : "bg-[var(--border)]"
                      }`}
                    />
                  )}
                </div>

                {/* Stop Content */}
                <div className="pb-4 flex-1 flex justify-between gap-2">
                  <div>
                    <div
                      className={`text-sm ${
                        isCurrent
                          ? "font-heading text-[var(--accent-dark)] font-medium text-base"
                          : isDone
                          ? "font-medium text-[var(--neu7b)]"
                          : "text-[var(--neu6)]"
                      }`}
                    >
                      {s.name}
                    </div>
                    <div className="text-xs text-[var(--neu6)]">{s.note}</div>
                  </div>
                  <div className="text-xs font-semibold text-[var(--neu7)]">{s.time}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Notification toggle button */}
        <button
          type="button"
          onClick={() => setNotify(!notify)}
          className={`w-full py-3.5 px-4 rounded-full border-0 font-heading text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
            notify
              ? "bg-[var(--sage-bg)] text-[var(--sage-text)]"
              : "bg-[var(--accent-light)] text-[var(--accent-dark)] hover:bg-[var(--accent-tint-hover)]"
          }`}
        >
          {notify ? <BellRing className="w-4.5 h-4.5 stroke-[2.75]" /> : <Bell className="w-4.5 h-4.5 stroke-[2.75]" />}
          {notify
            ? isEs ? "Aviso activado (te avisaremos)" : "Alert active (we'll notify you)"
            : isEs ? "Avisarme al llegar" : "Notify me when close"}
        </button>
      </div>
    </div>
  )
}
