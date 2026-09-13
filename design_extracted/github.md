repo: lealsa/transMiApp
branch: main

## Last sync
date: 2026-09-12T05:36:30Z

### Updated in this project
- Synced the refactor: app split into /, /mapa, /rutas, /horarios, /configuraciones with extracted components
- Recreation now covers all five routes, the 5-item bottom nav and the light/dark theme tokens
- New design realigned to the same IA (Inicio, Mapa, Rutas, Horarios, Config) and gained the theme setting

## Screen map
| Project screen | Repo files |
| --- | --- |
| Recreation — Inicio | app/page.tsx, components/{Header,RoutePlanner,QuickActions,Alerts}.tsx |
| Recreation — Mapa | app/mapa/page.tsx, components/ui/map.tsx |
| Recreation — Rutas | app/rutas/page.tsx, components/RouteTypes.tsx |
| Recreation — Horarios | app/horarios/page.tsx |
| Recreation — Configuraciones | app/configuraciones/page.tsx, components/theme-provider.tsx |
| Recreation — Bottom nav, theme | components/BottomNav.tsx, app/layout.tsx, app/globals.css |
| TrasmiApp — Home / planner / alerts | app/page.tsx, components/{RoutePlanner,Alerts}.tsx |
| TrasmiApp — Map, Station | app/mapa/page.tsx |
| TrasmiApp — Routes, Route detail | app/rutas/page.tsx, components/RouteTypes.tsx |
| TrasmiApp — Schedules | app/horarios/page.tsx |
| TrasmiApp — Settings | app/configuraciones/page.tsx |
| TrasmiApp — Results, Trip, Onboarding | new (no source screens) |
