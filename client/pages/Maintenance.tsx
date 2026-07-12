import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Wrench,
  Search,
  Plus,
  Menu,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Edit2,
  Eye,
  MoreVertical,
  TrendingUp,
} from "lucide-react";

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: "Preventive" | "Corrective" | "Emergency";
  startDate: string;
  completionDate?: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Overdue";
  cost: number;
  technician: string;
  description: string;
  nextDueDate?: string;
}

const mapMaintenance = (row: any): MaintenanceRecord => ({
  id: `MNT${String(row.id).padStart(3, "0")}`,
  vehicleId: row.vehicle_id,
  vehicleName: row.vehicle_name,
  type: row.type,
  startDate: row.start_date || "",
  completionDate: row.completion_date || undefined,
  status: row.status,
  cost: Number(row.cost || 0),
  technician: row.technician,
  description: row.description,
  nextDueDate: row.next_due_date || undefined,
});

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Scheduled: { bg: "bg-blue-100", text: "text-blue-700", icon: <Calendar className="w-4 h-4" /> },
    "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: <TrendingUp className="w-4 h-4" /> },
    Completed: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
    Overdue: { bg: "bg-red-100", text: "text-red-700", icon: <AlertCircle className="w-4 h-4" /> },
  };
  return colors[status] || colors.Scheduled;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    Preventive: "bg-blue-100 text-blue-700",
    Corrective: "bg-amber-100 text-amber-700",
    Emergency: "bg-red-100 text-red-700",
  };
  return colors[type] || colors.Preventive;
};

export default function Maintenance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaintenance = async () => {
      try {
        const response = await fetch("/api/maintenance");
        const data = await response.json();
        if (data?.ok) {
          setMaintenanceRecords(data.data.map(mapMaintenance));
        }
      } catch {
        setMaintenanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadMaintenance();
  }, []);

  const filteredMaintenance = maintenanceRecords.filter((m) => {
    const matchesSearch =
      m.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.technician.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || m.status === filterStatus;
    const matchesType = filterType === "All" || m.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCost = filteredMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const completedCount = filteredMaintenance.filter((m) => m.status === "Completed").length;
  const overdueCount = filteredMaintenance.filter((m) => m.status === "Overdue").length;

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
            { icon: "Users", label: "Drivers", href: "/drivers" },
            { icon: "Route", label: "Trips", href: "/trips" },
            { icon: Wrench, label: "Maintenance", href: "/maintenance", active: true },
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
            <h1 className="text-xl font-bold text-foreground">Maintenance Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
            <Plus className="w-5 h-5" />
            New Work Order
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                <p className="text-3xl font-bold text-foreground">{filteredMaintenance.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                <p className="text-3xl font-bold text-destructive">{overdueCount}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-primary">${totalCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by vehicle, record ID, or technician..."
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
                <option>Scheduled</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Overdue</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Types</option>
                <option>Preventive</option>
                <option>Corrective</option>
                <option>Emergency</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading maintenance records..." : `Showing ${filteredMaintenance.length} of ${maintenanceRecords.length} records`}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/5 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Record ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Technician</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaintenance.map((record, i) => {
                      const statusColor = getStatusColor(record.status);
                      return (
                        <tr key={i} className="border-b border-border hover:bg-secondary/5 transition">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{record.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{record.vehicleName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg} w-fit`}
                            >
                              {statusColor.icon}
                              <span className={`text-xs font-semibold ${statusColor.text}`}>
                                {record.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{new Date(record.startDate).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-muted-foreground">{record.technician}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-primary">${record.cost.toLocaleString()}</p>
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

            {filteredMaintenance.length === 0 && (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No maintenance records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
