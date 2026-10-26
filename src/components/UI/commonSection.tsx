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
export default function CommonSection({ title }: CommonSectionProps): JSX.Element {
  return (
    <section className="bg-gray-800 text-white py-12 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </section>
  );
}
