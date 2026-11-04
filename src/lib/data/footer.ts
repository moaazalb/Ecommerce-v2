import { FooterLink } from "@/types/footer";


export const TOP_CATEGORIES: FooterLink[] = [
  { path: "/shop?category=mobile", display: "footer.mobilePhones" },
  { path: "/shop?category=sofa", display: "footer.modernSofa" },
  { path: "/shop?category=chair", display: "footer.armChair" },
  { path: "/shop?category=watch", display: "footer.smartWatches" },
];

export const USEFUL_LINKS: FooterLink[] = [
  { path: "/shop", display: "footer.shop" },
  { path: "/cart", display: "footer.cart" },
  { path: "/checkout", display: "footer.checkout" },
  { path: "/privacy", display: "footer.privacyPolicy" },
];