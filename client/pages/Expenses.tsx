import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import {
  Fuel,
  Search,
  Plus,
  Menu,
  DollarSign,
  Droplet,
  Navigation,
  TrendingUp,
  Calendar,
  Edit2,
  Eye,
  MoreVertical,
} from "lucide-react";

interface Expense {
  id: string;
  date: string;
  vehicleId: string;
  vehicleName: string;
  category: "Fuel" | "Toll" | "Parking" | "Maintenance" | "Other";
  description: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  odometer: number;
  quantity?: number;
  unitPrice?: number;
}

const mapExpense = (row: any): Expense => ({
  id: `EXP${String(row.id).padStart(3, "0")}`,
  date: row.date || "",
  vehicleId: row.vehicle_id,
  vehicleName: row.vehicle_name,
  category: row.category,
  description: row.description,
  amount: Number(row.amount || 0),
  status: row.status,
  odometer: Number(row.odometer || 0),
  quantity: row.quantity ? Number(row.quantity) : undefined,
  unitPrice: row.unit_price ? Number(row.unit_price) : undefined,
});

const getCategoryColor = (category: string) => {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Fuel: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <Droplet className="w-4 h-4" />,
    },
    Toll: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      icon: <Navigation className="w-4 h-4" />,
    },
    Parking: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: <Navigation className="w-4 h-4" />,
    },
    Maintenance: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    Other: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <DollarSign className="w-4 h-4" />,
    },
  };
  return colors[category] || colors.Other;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return colors[status] || colors.Pending;
};

export default function Expenses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data = await response.json();
        if (data?.ok) {
          setExpenses(data.data.map(mapExpense));
        }
      } catch {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "All" || expense.category === filterCategory;
    const matchesStatus = filterStatus === "All" || expense.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenses = filteredExpenses
    .filter((e) => e.category === "Fuel")
    .reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = filteredExpenses
    .filter((e) => e.status === "Approved")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalFuelLiters = filteredExpenses
    .filter((e) => e.category === "Fuel")
    .reduce((sum, e) => sum + (e.quantity || 0), 0);

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
            { icon: "BarChart", label: "Dashboard", href: "/dashboard" },
            { icon: "Truck", label: "Vehicles", href: "/vehicles" },
            { icon: "Users", label: "Drivers", href: "/drivers" },
            { icon: "Route", label: "Trips", href: "/trips" },
            { icon: "Wrench", label: "Maintenance", href: "/maintenance" },
            { icon: Fuel, label: "Fuel & Expenses", href: "/expenses", active: true },
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
            <h1 className="text-xl font-bold text-foreground">Fuel & Expense Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
            <Plus className="w-5 h-5" />
            Log Expense
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Fuel Costs</p>
                  <Droplet className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">${fuelExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Fuel Liters</p>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-foreground">{totalFuelLiters}L</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">${approvedExpenses.toLocaleString()}</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by vehicle, description, or expense ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Categories</option>
                <option>Fuel</option>
                <option>Toll</option>
                <option>Parking</option>
                <option>Maintenance</option>
                <option>Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading expenses..." : `Showing ${filteredExpenses.length} of ${expenses.length} expenses`}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/5 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Expense ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Odometer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense, i) => {
                      const categoryColor = getCategoryColor(expense.category);
                      return (
                        <tr key={i} className="border-b border-border hover:bg-secondary/5 transition">
                          <td className="px-6 py-4">
                            <p className="text-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{expense.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{expense.vehicleName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full ${categoryColor.bg} w-fit`}
                            >
                              {categoryColor.icon}
                              <span className={`text-xs font-semibold ${categoryColor.text}`}>
                                {expense.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-muted-foreground text-sm">{expense.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-primary">${expense.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-foreground">{expense.odometer.toLocaleString()} km</p>
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

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <Fuel className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No expenses found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
