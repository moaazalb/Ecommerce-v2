/**
 * Static configuration for dashboard statistics cards.
 */
export const statistics = [
  {
    title: "dashboard.totalSales",
    icon: "ri-money-dollar-circle-line",
    className: "revenue__box",
    description: "dashboard.salesDescription",
    dataKey: "totalSales",
  },
  {
    title: "dashboard.orders",
    icon: "ri-shopping-bag-3-line",
    className: "order__box",
    description: "dashboard.ordersDescription",
    dataKey: "totalOrders",
  },
  {
    title: "dashboard.totalProducts",
    icon: "ri-shopping-basket-line",
    className: "products__box",
    description: "dashboard.productsDescription",
    dataKey: "totalProducts",
  },
  {
    title: "dashboard.totalUsers",
    icon: "ri-user-line",
    className: "users__box",
    description: "dashboard.usersDescription",
    dataKey: "totalUsers",
  },
] as const;