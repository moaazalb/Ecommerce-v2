import React, { JSX } from "react";
import "@/styles/common-section.css";

interface CommonSectionProps {
  title: string;
}

/**
 * CommonSection component for rendering banner section titles across pages.
 *
 * @param {CommonSectionProps} props - Component props containing the title.
 * @returns {JSX.Element} The rendered common section.
 */
export default function CommonSection({
  title,
}: CommonSectionProps): JSX.Element {
  return (
    <section className="common__section">
      <div className="container">
        <h1>{title}</h1>
      </div>
    </section>
  );
}