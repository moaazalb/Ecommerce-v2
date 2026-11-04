
/** Available order statuses. */
export type OrderStatus = "pending" | "confirmed" | "delivered";

/** Customer information saved with an order. */
export interface OrderCustomer {
  name?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  country?: string;
}

/** Product information saved inside an order. */
export interface OrderItem {
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
  imgUrl?: string;
}

/** Firestore order document structure. */
export interface Order {
  id: string;
  userId: string;
  customer?: OrderCustomer;
  items?: OrderItem[];
  totalQuantity?: number;
  subtotal?: number;
  shippingCost?: number;
  totalAmount?: number;
  status?: OrderStatus;
  createdAt?: {
    toDate?: () => Date;
  } | Date | null;
}

/** Available order filters. */
export type OrderFilter = "all" | OrderStatus;
