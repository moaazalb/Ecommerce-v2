"use client";

import type { JSX } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import "@/styles/privacy.css"

/**
 * Privacy Policy page explaining how the store collects,
 * uses, and protects customer information.
 *
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
export default function PrivacyPolicy(): JSX.Element {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "When you use our website, we may collect personal information such as your name, email address, phone number, shipping address, and account details. We also collect information about your orders and shopping activity.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use your information to process orders, manage your account, provide customer support, improve our website, communicate important updates, and maintain the security of our services.",
    },
    {
      title: "3. Information Sharing",
      content:
        "We do not sell your personal information. We may share necessary information with service providers who help us operate our store, process orders, manage payments, and deliver products.",
    },
    {
      title: "4. Data Security",
      content:
        "We take reasonable measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of internet transmission or electronic storage is completely secure.",
    },
    {
      title: "5. Cookies and Website Technologies",
      content:
        "Our website may use cookies and similar technologies to improve your browsing experience, remember preferences, and understand how visitors interact with our website.",
    },
    {
      title: "6. Third-Party Services",
      content:
        "Our store uses third-party services, including Firebase for authentication and database services and Cloudinary for image hosting. These providers may process information according to their own privacy policies.",
    },
    {
      title: "7. Your Privacy Rights",
      content:
        "You may request access to, correction of, or deletion of your personal information, subject to applicable legal requirements. You can also contact us with questions about how your information is handled.",
    },
    {
      title: "8. Children's Privacy",
      content:
        "Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children.",
    },
    {
      title: "9. Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be published on this page along with an updated revision date.",
    },
    {
      title: "10. Contact Us",
      content:
        "If you have questions or concerns about this Privacy Policy or the way we handle your personal information, please contact our support team.",
    },
  ];

  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="privacy-hero-content"
          >
            <span className="privacy-label">YOUR PRIVACY MATTERS</span>
            <h1>Privacy Policy</h1>
            <p>
              Your trust matters to us. Learn how we collect, use, and protect
              your personal information.
            </p>
            <div className="privacy-breadcrumb">
              <Link href="/">Home</Link>
              <i className="ri-arrow-right-s-line" />
              <span>Privacy Policy</span>
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
                <h2>Your Privacy Is Important</h2>
                <p>
                  This policy explains how we handle your personal information
                  when you visit or shop through our website.
                </p>
                <span>Last updated: October 31, 2026</span>
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
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </motion.article>
            ))}

            <div className="privacy-contact">
              <i className="ri-customer-service-2-line" />
              <div>
                <h3>Need More Information?</h3>
                <p>
                  Our team is here to help with any privacy-related questions.
                </p>
                <Link href="/contact" className="privacy-contact-link">
                  Contact Us <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}