import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Users,
  Search,
  Plus,
  Menu,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  employeeId: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseCategory: string;
  status: "Available" | "On Duty" | "Off Duty" | "Suspended";
  safetyScore: number;
  rating: number;
  experience: number;
  joiningDate: string;
  phone: string;
  email: string;
  currentVehicle?: string;
}

const mapDriver = (row: any): Driver => ({
  id: `DRV${String(row.id).padStart(3, "0")}`,
  name: row.name,
  employeeId: row.employee_id,
  licenseNumber: row.license_number,
  licenseExpiry: row.license_expiry || "",
  licenseCategory: row.license_category,
  status: row.status,
  safetyScore: Number(row.safety_score || 0),
  rating: Number(row.rating || 0),
  experience: Number(row.experience || 0),
  joiningDate: row.joining_date || "",
  phone: row.phone,
  email: row.email,
  currentVehicle: row.current_vehicle || undefined,
});

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Available: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    "On Duty": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <Clock className="w-4 h-4" />,
    },
    "Off Duty": {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Clock className="w-4 h-4" />,
    },
    Suspended: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };
  return colors[status] || colors["Off Duty"];
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4) return "text-blue-600";
  if (rating >= 3) return "text-amber-600";
  return "text-red-600";
};

export default function Drivers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const response = await fetch("/api/drivers");
        const data = await response.json();
        if (data?.ok) {
          setDrivers(data.data.map(mapDriver));
        }
      } catch {
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, []);

  const filteredAndSortedDrivers = drivers
    .filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "All" || driver.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "safety") return b.safetyScore - a.safetyScore;
      if (sortBy === "experience") return b.experience - a.experience;
      return a.name.localeCompare(b.name);
    });

  const isLicenseExpiringSoon = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  };

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
            { icon: Users, label: "Drivers", href: "/drivers", active: true },
            { icon: "Route", label: "Trips", href: "/trips" },
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
            <h1 className="text-xl font-bold text-foreground">Driver Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
            <Plus className="w-5 h-5" />
            Add Driver
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or email..."
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
                <option>Available</option>
                <option>On Duty</option>
                <option>Off Duty</option>
                <option>Suspended</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="safety">Sort by Safety Score</option>
                <option value="experience">Sort by Experience</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading drivers..." : `Showing ${filteredAndSortedDrivers.length} of ${drivers.length} drivers`}
            </div>

            {/* Grid View */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedDrivers.map((driver, i) => {
                const statusColor = getStatusColor(driver.status);
                const licenseExpiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);

                return (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{driver.name}</h3>
                            <p className="text-xs text-muted-foreground">{driver.employeeId}</p>
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-secondary/10 rounded transition">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg} w-fit`}
                      >
                        {statusColor.icon}
                        <span className={`text-xs font-semibold ${statusColor.text}`}>
                          {driver.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-medium text-foreground">{driver.experience} years</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${getRatingColor(driver.rating)}`} />
                          <span className={`font-medium ${getRatingColor(driver.rating)}`}>
                            {driver.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Safety Score</span>
                        <span className="font-medium text-foreground">{driver.safetyScore}%</span>
                      </div>
                    </div>

                    {/* License Info */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-muted-foreground font-medium">License: {driver.licenseCategory}</p>
                      {licenseExpiringSoon && (
                        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Expires {new Date(driver.licenseExpiry).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary/5 transition text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary/5 transition text-sm font-medium">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAndSortedDrivers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No drivers found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
