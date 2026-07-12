import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Route,
  Search,
  Plus,
  Menu,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Truck,
  Users,
  Edit2,
  Eye,
  MoreVertical,
  TrendingUp,
} from "lucide-react";

interface Trip {
  id: string;
  source: string;
  destination: string;
  driver: string;
  vehicle: string;
  status: "Draft" | "Scheduled" | "Dispatched" | "In Progress" | "Completed" | "Cancelled";
  cargoType: string;
  cargoWeight: number;
  plannedDistance: number;
  estimatedTime: number;
  scheduledDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  revenue: number;
}

const mapTrip = (row: any): Trip => ({
  id: `TRP${String(row.id).padStart(3, "0")}`,
  source: row.source,
  destination: row.destination,
  driver: row.driver,
  vehicle: row.vehicle,
  status: row.status,
  cargoType: row.cargo_type,
  cargoWeight: Number(row.cargo_weight || 0),
  plannedDistance: Number(row.planned_distance || 0),
  estimatedTime: Number(row.estimated_time || 0),
  scheduledDate: row.scheduled_date || "",
  priority: row.priority,
  revenue: Number(row.revenue || 0),
});

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Draft: { bg: "bg-gray-100", text: "text-gray-700", icon: <Clock className="w-4 h-4" /> },
    Scheduled: { bg: "bg-blue-100", text: "text-blue-700", icon: <Clock className="w-4 h-4" /> },
    Dispatched: { bg: "bg-purple-100", text: "text-purple-700", icon: <TrendingUp className="w-4 h-4" /> },
    "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: <TrendingUp className="w-4 h-4" /> },
    Completed: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
    Cancelled: { bg: "bg-red-100", text: "text-red-700", icon: <AlertCircle className="w-4 h-4" /> },
  };
  return colors[status] || colors.Draft;
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    Low: "bg-blue-100 text-blue-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };
  return colors[priority] || colors.Low;
};

export default function Trips() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        if (data?.ok) {
          setTrips(data.data.map(mapTrip));
        }
      } catch {
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || trip.status === filterStatus;
    const matchesPriority = filterPriority === "All" || trip.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalRevenue = filteredTrips.reduce((sum, trip) => sum + trip.revenue, 0);
  const completedTrips = filteredTrips.filter((t) => t.status === "Completed").length;

  return (
    <div className="flex h-screen bg-secondary/5">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 border-b border-sidebar-border flex items-center justify-center gap-3 px-4">
          <BrandLogo
            className={sidebarOpen ? "justify-start" : "justify-center"}
            textClassName={sidebarOpen ? "text-lg font-semibold" : "hidden"}
          />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {[
            { icon: CheckCircle, label: "Dashboard", href: "/dashboard" },
            { icon: "Truck", label: "Vehicles", href: "/vehicles" },
            { icon: Users, label: "Drivers", href: "/drivers" },
            { icon: Route, label: "Trips", href: "/trips", active: true },
            { icon: "Wrench", label: "Maintenance", href: "/maintenance" },
            { icon: "Fuel", label: "Fuel & Expenses", href: "/expenses" },
            { icon: "BarChart", label: "Analytics", href: "/analytics" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.href || "#"}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {typeof item.icon === "string" ? (
                <div className="w-5 h-5 flex-shrink-0 bg-sidebar-foreground/20 rounded" />
              ) : (
                <item.icon className="w-5 h-5 flex-shrink-0" />
              )}
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

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
            <h1 className="text-xl font-bold text-foreground">Trip Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
            <Plus className="w-5 h-5" />
            Schedule Trip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* KPI Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-foreground">{filteredTrips.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedTrips}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by trip ID, source, destination, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Status</option>
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Dispatched</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading trips..." : `Showing ${filteredTrips.length} of ${trips.length} trips`}
            </div>

            {/* Table View */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/5 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Trip ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Cargo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Distance</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip, i) => {
                      const statusColor = getStatusColor(trip.status);
                      return (
                        <tr key={i} className="border-b border-border hover:bg-secondary/5 transition">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{trip.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-foreground text-sm">
                                <MapPin className="w-4 h-4" />
                                {trip.source}
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <MapPin className="w-3 h-3" />
                                {trip.destination}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{trip.driver}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg} w-fit`}
                            >
                              {statusColor.icon}
                              <span className={`text-xs font-semibold ${statusColor.text}`}>
                                {trip.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(trip.priority)}`}>
                              {trip.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{trip.cargoType}</p>
                            <p className="text-xs text-muted-foreground">{trip.cargoWeight} tons</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{trip.plannedDistance} km</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-primary">${trip.revenue.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-secondary/10 rounded transition text-muted-foreground">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 hover:bg-secondary/10 rounded transition text-muted-foreground">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 hover:bg-secondary/10 rounded transition text-muted-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredTrips.length === 0 && (
              <div className="text-center py-12">
                <Route className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No trips found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
