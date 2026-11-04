"use client";

import type { JSX } from "react";
import { useTranslation } from "react-i18next"
import { statistics } from "@/lib/data/statistics";
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
  const { t } = useTranslation();

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

  const statisticsValues = {
    totalSales: `$${totalSales.toFixed(2)}`,
    totalOrders: totalOrders.toString(),
    totalProducts: products.length.toString(),
    totalUsers: users.length.toString(),
  };

  const statisticsStates = {
    totalSales: { loading: ordersLoading, error: ordersError },
    totalOrders: { loading: ordersLoading, error: ordersError },
    totalProducts: { loading: productsLoading, error: productsError },
    totalUsers: { loading: usersLoading, error: usersError },
  };

  return (
    <section className="dashboard">
      <div className="container-fluid">
        <div className="dashboard__header">
          <div>
            <span className="dashboard__eyebrow">{t("dashboard.eyebrow")}</span>

            <h2>{t("dashboard.title")}</h2>
            <p>{t("dashboard.welcome")}</p>
          </div>
        </div>

        <div className="row g-4">
          {statistics.map((item) => {
            const state = statisticsStates[item.dataKey];

            return (
              <div className="col-12 col-sm-6 col-xl-3" key={item.dataKey}>
                <div className={`dashboard__card ${item.className}`}>
                  <div className="dashboard__card-top">
                    <div className="dashboard__card-icon">
                      <i className={item.icon} />
                    </div>

                    <span className="dashboard__card-label">
                      {t(item.title)}
                    </span>
                  </div>

                  <div className="dashboard__card-bottom">
                    <h3>
                      {state.loading
                        ? "..."
                        : state.error
                          ? "--"
                          : statisticsValues[item.dataKey]}
                    </h3>

                    <p>
                      {state.error
                        ? t("dashboard.loadError")
                        : t(item.description)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
