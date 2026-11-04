import { ServiceItem } from "@/types/service";

/**
 * Static service data listing customer benefits.
 */
const serviceData: ServiceItem[] = [
  {
    icon: "ri-truck-line",
    title: "services.freeShipping.title",
    subtitle: "services.freeShipping.subtitle",
    bg: "#fdefe6",
  },
  {
    icon: "ri-refresh-line",
    title: "services.easyReturns.title",
    subtitle: "services.easyReturns.subtitle",
    bg: "#ceebe9",
  },
  {
    icon: "ri-secure-payment-line",
    title: "services.securePayment.title",
    subtitle: "services.securePayment.subtitle",
    bg: "#e2f2b2",
  },
  {
    icon: "ri-exchange-dollar-line",
    title: "services.moneyBack.title",
    subtitle: "services.moneyBack.subtitle",
    bg: "#d6e5fb",
  },
];

export default serviceData;
