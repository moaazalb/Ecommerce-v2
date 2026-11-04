"use client";

import type { JSX } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "@/styles/privacy.css";
import Helmet from "../layout/helmet";
import { sections } from "@/lib/data/privacySections";

/**
 * Privacy Policy page explaining how the store collects,
 * uses, and protects customer information.
 *
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
export default function PrivacyPolicy(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Helmet title={t("privacy.title")}>
      <main className="privacy-page">
        <section className="privacy-hero">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="privacy-hero-content"
            >
              <span className="privacy-label">{t("privacy.label")}</span>
              <h1>{t("privacy.title")}</h1>
              <p>{t("privacy.description")}</p>
              <div className="privacy-breadcrumb">
                <Link href="/">{t("common.home")}</Link>
                <i className="ri-arrow-right-s-line" />
                <span>{t("privacy.title")}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="privacy-content-section">
          <div className="container">
            <div className="privacy-card">
              <div className="privacy-intro">
                <i className="ri-shield-check-line" />
                <div>
                  <h2>{t("privacy.introTitle")}</h2>
                  <p>{t("privacy.introDescription")}</p>
                  <span>{t("privacy.lastUpdated")}</span>
                </div>
              </div>

              <div className="privacy-divider" />

              {sections.map((section, index) => (
                <motion.article
                  key={section.title}
                  className="privacy-section"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <h3>{t(section.title)}</h3>
                  <p>{t(section.content)}</p>
                </motion.article>
              ))}

              {/** 
           * 
           *   <div className="privacy-contact">
              <i className="ri-customer-service-2-line" />
              <div>
                <h3>{t("privacy.contactTitle")}</h3>
                <p>
                  {t("privacy.contactDescription")}
                </p>
                <Link href="/contact" className="privacy-contact-link">
                  {t("privacy.contactButton")} <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>
          */}
            </div>
          </div>
        </section>
      </main>
    </Helmet>
  );
}
