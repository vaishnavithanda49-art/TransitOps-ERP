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
} from "lucide-react";
import { useState } from "react";

interface KPICard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent" | "destructive";
}

const kpiCards: KPICard[] = [
  {
    title: "Active Vehicles",
    value: "247",
    change: "+12%",
    icon: <Truck className="w-6 h-6" />,
    color: "primary",
  },
  {
    title: "Available Vehicles",
    value: "189",
    change: "+5%",
    icon: <Truck className="w-6 h-6" />,
    color: "secondary",
  },
  {
    title: "In Maintenance",
    value: "24",
    change: "-3%",
    icon: <Wrench className="w-6 h-6" />,
    color: "accent",
  },
  {
    title: "Drivers Available",
    value: "156",
    change: "+8%",
    icon: <Users className="w-6 h-6" />,
    color: "primary",
  },
  {
    title: "Active Trips",
    value: "89",
    change: "+18%",
    icon: <Route className="w-6 h-6" />,
    color: "secondary",
  },
  {
    title: "Fleet Utilization",
    value: "76%",
    change: "+4%",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "primary",
  },
  {
    title: "Fuel Consumption",
    value: "1,240L",
    change: "-6%",
    icon: <Fuel className="w-6 h-6" />,
    color: "accent",
  },
  {
    title: "Total Revenue",
    value: "$45,230",
    change: "+22%",
    icon: <DollarSign className="w-6 h-6" />,
    color: "secondary",
  },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Truck, label: "Vehicles", href: "/vehicles", active: false },
  { icon: Users, label: "Drivers", href: "/drivers", active: false },
  { icon: Route, label: "Trips", href: "/trips", active: false },
  { icon: Wrench, label: "Maintenance", href: "/maintenance", active: false },
  { icon: Fuel, label: "Fuel & Expenses", href: "/expenses", active: false },
  { icon: TrendingUp, label: "Analytics", href: "/analytics", active: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
      secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
      accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
      destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="flex h-screen bg-secondary/5">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-center gap-3 px-4">
          <BrandLogo
            className={sidebarOpen ? "justify-start" : "justify-center"}
            textClassName={sidebarOpen ? "text-lg font-semibold" : "hidden"}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex-shrink-0" />
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">Admin User</div>
                <div className="text-xs text-sidebar-foreground/60 truncate">admin@transitops.com</div>
              </div>
            )}
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors mt-2"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary/10 rounded-lg transition text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary/10 rounded-lg transition text-muted-foreground relative">
              <AlertCircle className="w-5 h-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Date Range Filter */}
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <select className="px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>All Vehicles</option>
                <option>Trucks</option>
                <option>Vans</option>
                <option>Buses</option>
              </select>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((kpi, i) => {
                const colors = getColorClasses(kpi.color);
                return (
                  <div
                    key={i}
                    className={`${colors.bg} border ${colors.border} rounded-lg p-6 hover:shadow-md transition-shadow animate-fade-up`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.text} p-2 bg-white rounded-lg`}>{kpi.icon}</div>
                      {kpi.change && (
                        <div className={`text-xs font-semibold ${kpi.change.startsWith("+") ? "text-green-600" : "text-amber-600"}`}>
                          {kpi.change}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Section */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Trips */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Recent Trips</h2>
                <div className="space-y-3">
                  {[
                    { id: "TRP001", status: "Completed", route: "New York → Boston", time: "2 hours ago" },
                    { id: "TRP002", status: "In Progress", route: "Chicago → Detroit", time: "1 hour ago" },
                    { id: "TRP003", status: "Scheduled", route: "Los Angeles → Phoenix", time: "Today" },
                    { id: "TRP004", status: "Completed", route: "Dallas → Houston", time: "4 hours ago" },
                  ].map((trip, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary/5 rounded-lg transition border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{trip.id}</p>
                        <p className="text-sm text-muted-foreground">{trip.route}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          trip.status === "Completed" ? "bg-green-100 text-green-700" :
                          trip.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {trip.status}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{trip.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Vehicle Status</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operating</span>
                      <span className="font-bold text-foreground">189</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Under Maintenance</span>
                      <span className="font-bold text-foreground">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Idle</span>
                      <span className="font-bold text-foreground">34</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Driver Status</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-bold text-foreground">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">On Duty</span>
                      <span className="font-bold text-foreground">92</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Off Duty</span>
                      <span className="font-bold text-foreground">58</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
