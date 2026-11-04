import useGetData from "@/custom-hooks/useGetData/useGetData";

const {
  data: products,
  loading: productsLoading,
  error: productsError,
} = useGetData("products");
const {
  data: users,
  loading: usersLoading,
  error: usersError,
} = useGetData("users");
const {
  data: orders,
  loading: ordersLoading,
  error: ordersError,
} = useGetData("orders");
// Count all orders regardless of their status.
const totalOrders = orders.length;
// Calculate sales from confirmed and delivered orders only.
const totalSales = orders.reduce((total, order) => {
  if (order.status === "confirmed" || order.status === "delivered") {
    return total + Number(order.totalAmount || 0);
  }
  return total;
}, 0);


export const statistics = [
  {
    title: "dashboard.totalSales",
    value: `$${totalSales.toFixed(2)}`,
    loading: ordersLoading,
    error: ordersError,
    icon: "ri-money-dollar-circle-line",
    className: "revenue__box",
    description: "dashboard.salesDescription",
  },
  {
    title: "dashboard.orders",
    value: totalOrders.toString(),
    loading: ordersLoading,
    error: ordersError,
    icon: "ri-shopping-bag-3-line",
    className: "order__box",
    description: "dashboard.ordersDescription",
  },
  {
    title: "dashboard.totalProducts",
    value: products.length.toString(),
    loading: productsLoading,
    error: productsError,
    icon: "ri-shopping-basket-line",
    className: "products__box",
    description: "dashboard.productsDescription",
  },
  {
    title: "dashboard.totalUsers",
    value: users.length.toString(),
    loading: usersLoading,
    error: usersError,
    icon: "ri-user-line",
    className: "users__box",
    description: "dashboard.usersDescription",
  },
];
