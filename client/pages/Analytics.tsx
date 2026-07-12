import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Truck,
  Users,
  Route,
  Wrench,
  TrendingUp,
  AlertCircle,
  LogOut,
  Menu,
  BarChart3,
  DollarSign,
  Fuel,
  CalendarRange,
  Gauge,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: false },
  { icon: Truck, label: "Vehicles", href: "/vehicles", active: false },
  { icon: Users, label: "Drivers", href: "/drivers", active: false },
  { icon: Route, label: "Trips", href: "/trips", active: false },
  { icon: Wrench, label: "Maintenance", href: "/maintenance", active: false },
  { icon: Fuel, label: "Fuel & Expenses", href: "/expenses", active: false },
  { icon: TrendingUp, label: "Analytics", href: "/analytics", active: true },
];

const summaryCards = [
  { title: "Fleet Utilization", value: "76%", change: "+4.2%", trend: "up", icon: Gauge },
  { title: "On-time Performance", value: "94.8%", change: "+2.1%", trend: "up", icon: ShieldCheck },
  { title: "Revenue per Trip", value: "$482", change: "+8.4%", trend: "up", icon: DollarSign },
  { title: "Fuel Efficiency", value: "8.4 mpg", change: "-3.1%", trend: "down", icon: Fuel },
];

const insightCards = [
  {
    title: "Peak demand window",
    value: "06:00–09:00",
    description: "Dispatch volume peaks early in the day, aligning with commuter flows.",
  },
  {
    title: "Maintenance risk",
    value: "4 vehicles",
    description: "Preventive maintenance is due this week for high-utilization units.",
  },
  {
    title: "Cost control",
    value: "$12.4K",
    description: "Savings achieved from optimized route consolidation and fuel planning.",
  },
];

const performanceRows = [
  { label: "Average Idle Time", value: "18 min" },
  { label: "Trip Completion Rate", value: "97.2%" },
  { label: "Driver Attendance", value: "98.6%" },
  { label: "Incident Rate", value: "0.4 / 100 trips" },
];

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50">
      <div className={`${sidebarOpen ? "w-64" : "w-20"} flex flex-col border-r border-slate-200 bg-slate-950 text-slate-100 transition-all duration-300`}>
        <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
          <BrandLogo className={sidebarOpen ? "justify-start" : "justify-center"} textClassName={sidebarOpen ? "text-lg font-semibold text-white" : "hidden"} />
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                item.active ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-sky-600" />
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Admin User</div>
                <div className="truncate text-xs text-slate-400">admin@transitops.com</div>
              </div>
            )}
          </button>
          <button onClick={() => (window.location.href = "/")} className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Analytics & Reporting</h1>
                <p className="text-sm text-slate-500">KPI trends, operational health, and reporting snapshots</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <CalendarRange className="h-4 w-4" />
              Last 30 Days
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{card.title}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${card.trend === "up" ? "text-emerald-600" : "text-amber-600"}`}>
                    <ArrowUpRight className={`h-4 w-4 ${card.trend === "down" ? "rotate-90" : ""}`} />
                    {card.change}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Operational trend</h2>
                  <p className="text-sm text-slate-500">Fleet activity versus target performance</p>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">+12% vs last month</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[70, 92, 84].map((value, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-24 rounded-lg bg-gradient-to-t from-sky-600 to-sky-300" style={{ height: `${value}%` }} />
                    <p className="mt-3 text-sm font-medium text-slate-700">Week {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {insightCards.map((card, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Performance snapshot</h2>
              <div className="mt-5 space-y-3">
                {performanceRows.map((row, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Executive summary</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                TransitOps is maintaining strong operational stability, with utilization trending upward and improvement in on-time performance. The next focus is reducing idle time and prioritizing preventive maintenance before peak demand.
              </p>
              <button className="mt-5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
