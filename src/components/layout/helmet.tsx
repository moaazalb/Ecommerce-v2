"use client"
import { ReactNode, useEffect } from "react";

interface HelmetProps {
  title: string;
  children: ReactNode;
}

const Helmet = ({ title, children }: HelmetProps) => {
  useEffect(() => {
    document.title = "Ecommerce - " + title;
  }, [title]);

  return <div className="w-100">{children}</div>;
};

export default Helmet;