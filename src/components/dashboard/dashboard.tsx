"use client";

import { JSX } from "react";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import "@/styles/dashboard.css";

/**
 * Dashboard component displaying the main store statistics.
 *
 * Total sales include confirmed and delivered orders only.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard(): JSX.Element {
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

  const statistics = [
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      loading: ordersLoading,
      error: ordersError,
      icon: "ri-money-dollar-circle-line",
      className: "revenue__box",
      description: "Confirmed and delivered orders",
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      loading: ordersLoading,
      error: ordersError,
      icon: "ri-shopping-bag-3-line",
      className: "order__box",
      description: "Total registered orders",
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      loading: productsLoading,
      error: productsError,
      icon: "ri-shopping-basket-line",
      className: "products__box",
      description: "Available products",
    },
    {
      title: "Total Users",
      value: users.length.toString(),
      loading: usersLoading,
      error: usersError,
      icon: "ri-user-line",
      className: "users__box",
      description: "Registered users",
    },
  ];

  return (
    <section className="dashboard">
      <div className="container-fluid">
        <div className="dashboard__header">
          <div>
            <span className="dashboard__eyebrow">OVERVIEW</span>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's what's happening with your store.</p>
          </div>
        </div>

        <div className="row g-4">
          {statistics.map((item) => (
            <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
              <div className={`dashboard__card ${item.className}`}>
                <div className="dashboard__card-top">
                  <div className="dashboard__card-icon">
                    <i className={item.icon} />
                  </div>

                  <span className="dashboard__card-label">
                    {item.title}
                  </span>
                </div>

                <div className="dashboard__card-bottom">
                  <h3>
                    {item.loading
                      ? "..."
                      : item.error
                        ? "--"
                        : item.value}
                  </h3>

                  <p>
                    {item.error ? "Failed to load data" : item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}