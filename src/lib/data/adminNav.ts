import { AdminNavItem } from "@/types/adminNav";

export const admin__nav: AdminNavItem[] = [
  {
    display: "adminNav.dashboard",
    path: "/admin/dashboard",
    icon: "ri-dashboard-3-line",
  },
  {
    display: "adminNav.allProducts",
    path: "/admin/allProducts",
    icon: "ri-shopping-bag-3-line",
  },
  {
    display: "adminNav.addProduct",
    path: "/admin/addProduct",
    icon: "ri-add-circle-line",
  },
  {
    display: "adminNav.users",
    path: "/admin/users",
    icon: "ri-group-line",
  },
  {
    display: "adminNav.orders",
    path: "/admin/orders",
    icon: "ri-file-list-3-line",
  },
];