import { Order } from "@/types/order";

/**
 * Formats a Firestore timestamp or JavaScript date.
 *
 * @param {Order["createdAt"]} date The order creation date.
 * @returns {string} A formatted date or fallback text.
 */
export function formatOrderDate(
  date: Order["createdAt"],
  language: string,
  fallback: string,
): string {
  if (!date) return fallback;

  const parsedDate =
    date instanceof Date
      ? date
      : typeof date.toDate === "function"
        ? date.toDate()
        : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleString(language === "ar" ? "ar" : "en");
}
