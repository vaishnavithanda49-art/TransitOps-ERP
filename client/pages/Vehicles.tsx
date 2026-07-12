import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Truck,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Menu,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  model: string;
  manufacturer: string;
  type: "Truck" | "Van" | "Bus" | "Pickup";
  status: "Active" | "Maintenance" | "Retired" | "Inactive";
  odometer: number;
  capacity: number;
  lastMaintenance: string;
  nextMaintenance: string;
  registrationExpiry: string;
  assignedTo?: string;
}

const mapVehicle = (row: any): Vehicle => ({
  id: String(row.id),
  registrationNumber: row.registration_number,
  name: row.name,
  model: row.model,
  manufacturer: row.manufacturer,
  type: row.type,
  status: row.status,
  odometer: Number(row.odometer || 0),
  capacity: Number(row.capacity || 0),
  lastMaintenance: row.last_maintenance || "",
  nextMaintenance: row.next_maintenance || "",
  registrationExpiry: row.registration_expiry || "",
  assignedTo: row.assigned_to || undefined,
});

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Active: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    Maintenance: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <Wrench className="w-4 h-4" />,
    },
    Retired: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    Inactive: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Clock className="w-4 h-4" />,
    },
  };
  return colors[status] || colors.Inactive;
};

export default function Vehicles() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const data = await response.json();
        if (data?.ok) {
          setVehicles(data.data.map(mapVehicle));
        }
      } catch {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || vehicle.status === filterStatus;
    const matchesType = filterType === "All" || vehicle.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

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
            { icon: Truck, label: "Vehicles", href: "/vehicles", active: true },
            { icon: "Users", label: "Drivers", href: "/drivers" },
            { icon: "Route", label: "Trips", href: "/trips" },
            { icon: Wrench, label: "Maintenance", href: "/maintenance" },
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
            <h1 className="text-xl font-bold text-foreground">Vehicle Management</h1>
          </div>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
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
                  placeholder="Search by registration, name, or model..."
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
                <option>Active</option>
                <option>Maintenance</option>
                <option>Retired</option>
                <option>Inactive</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Types</option>
                <option>Truck</option>
                <option>Van</option>
                <option>Bus</option>
                <option>Pickup</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading vehicles..." : `Showing ${filteredVehicles.length} of ${vehicles.length} vehicles`}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/5 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Odometer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle, i) => {
                      const statusColor = getStatusColor(vehicle.status);
                      return (
                        <tr
                          key={i}
                          className="border-b border-border hover:bg-secondary/5 transition"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{vehicle.registrationNumber}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{vehicle.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-muted-foreground">{vehicle.model}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-foreground">{vehicle.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg} w-fit`}
                            >
                              {statusColor.icon}
                              <span className={`text-xs font-semibold ${statusColor.text}`}>
                                {vehicle.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{vehicle.odometer.toLocaleString()} km</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-muted-foreground">{vehicle.assignedTo || "—"}</p>
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

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No vehicles found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
