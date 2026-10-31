"use client";

import { JSX } from "react";
import "@/styles/services.css";
import { motion } from "framer-motion";
import serviceData from "@/assets/data/serviceData";

/**
 * Services component displaying company features (shipping, returns, secure payment, etc.).
 *
 * @returns {JSX.Element} The rendered Services section.
 */
export default function Services(): JSX.Element {
  return (
    <section className="services">
      <div className="container">
        <div className="row g-4">
          {serviceData.map((item) => (
            <div className="col-lg-3 col-md-6 col-sm-6" key={item.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="services__item"
                style={{ background: item.bg }}
              >
                <span className="services__icon">
                  <i className={item.icon} aria-hidden="true"></i>
                </span>

                <div className="services__content">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}