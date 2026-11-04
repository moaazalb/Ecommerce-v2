"use client"
import { HelmetProps } from "@/types/helmet";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


const Helmet = ({ title, children }: HelmetProps) => {
  const { t } = useTranslation();
  useEffect(() => {
     document.title = `${t("common.siteName")} - ${title}`;
  }, [title,t]);

  return <div className="w-100">{children}</div>;
};

export default Helmet;