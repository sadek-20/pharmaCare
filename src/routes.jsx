import CustomerManagement from "./pages/CustomerManagement";
import Dashboard from "./pages/Dashboard";
import InvoiceManagement from "./pages/InvoiceManagement";
import MedicineManagement from "./pages/MedicineManagement";
import SupplierManagement from "./pages/SupplierManagement";
import Transactions from "./pages/Transactions";

// Route configuration for the pharmacy management system
export const routes = [
  {
    path: "dashboard",
    name: "Dashboard",
    component: Dashboard,
    icon: "LayoutDashboard",
  },
  {
    path: "medicines",
    name: "Medicines",
    component: MedicineManagement,
    icon: "Pill",
  },
  {
    path: "invoice",
    name: "Invoice Management",
    component: InvoiceManagement,
    icon: "FileText",
  },
  {
    path: "customers",
    name: "Customers",
    component: CustomerManagement,
    icon: "Users",
  },
  {
    path: "suppliers",
    name: "Suppliers",
    component: SupplierManagement,
    icon: "Truck",
  },
  {
    path: "transactions",
    name: "Transactions",
    component: Transactions,
    icon: "Receipt",
  },
];

// Get route component by path
export const getRouteComponent = (path) => {
  const route = routes.find((r) => r.path === path);
  return route ? route.component : routes[0].component;
};

// Get default route
export const getDefaultRoute = () => routes[0].path;
