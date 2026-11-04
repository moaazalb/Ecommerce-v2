"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/dashboard.css";
import { statistics } from "@/lib/data/statistics";

/**
 * Dashboard component displaying the main store statistics.
 *
 * Total sales include confirmed and delivered orders only.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard(): JSX.Element {
  const { t } = useTranslation();
 
  return (
    <section className="dashboard">
      <div className="container-fluid">
        <div className="dashboard__header">
          <div>
            <span className="dashboard__eyebrow">
              {t("dashboard.eyebrow")}
            </span>
            <h2>{t("dashboard.title")}</h2>
            <p>{t("dashboard.welcome")}</p>
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
                  {t(item.title)}
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
                    {item.error
                      ? t("dashboard.loadError")
                      : t(item.description)}
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