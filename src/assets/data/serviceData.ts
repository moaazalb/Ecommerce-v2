import { ServiceItem } from "@/models/service";


/**
 * Static service data listing customer benefits (shipping, returns, payment, guarantee).
 */
const serviceData: ServiceItem[] = [
  {
    icon: "ri-truck-line",
    title: "Free Shipping",
    subtitle: "On all orders over $50",
    bg: "#fdefe6",
  },
  {
    icon: "ri-refresh-line",
    title: "Easy Returns",
    subtitle: "30-day hassle-free policy",
    bg: "#ceebe9",
  },
  {
    icon: "ri-secure-payment-line",
    title: "Secure Payment",
    subtitle: "100% protected checkout",
    bg: "#e2f2b2",
  },
  {
    icon: "ri-exchange-dollar-line",
    title: "Money Back Guarantee",
    subtitle: "Full refund within 14 days",
    bg: "#d6e5fb",
  },
];

export default serviceData;
