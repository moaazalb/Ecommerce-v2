"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import Helmet from "@/components/layout/Helmet";
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import "@/styles/orders.css";

/** Available order statuses. */
type OrderStatus = "pending" | "confirmed" | "delivered";

/** Customer information saved with an order. */
interface OrderCustomer {
  name?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  country?: string;
}

/** Product information saved inside an order. */
interface OrderItem {
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
  imgUrl?: string;
}

/** Firestore order document structure. */
interface Order {
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
type OrderFilter = "all" | OrderStatus;

/**
 * Formats a Firestore timestamp or JavaScript date.
 *
 * @param {Order["createdAt"]} date The order creation date.
 * @returns {string} A formatted date or fallback text.
 */
function formatOrderDate(date: Order["createdAt"]): string {
  if (!date) return "Date unavailable";

  const parsedDate =
    date instanceof Date
      ? date
      : typeof date.toDate === "function"
        ? date.toDate()
        : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString();
}

/**
 * Returns the visual label for an order status.
 *
 * @param {OrderStatus} status The current order status.
 * @returns {string} The status label.
 */
function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    delivered: "Delivered",
  };

  return labels[status];
}

/**
 * Admin orders management page.
 *
 * Displays orders, customer details, purchased products,
 * order totals, and allows administrators to update order statuses.
 *
 * @returns {JSX.Element} The rendered orders management page.
 */
export default function Orders(): JSX.Element {
  const { data, loading, error } = useGetData("orders");
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /** Filters orders according to the selected status. */
  const filteredOrders = useMemo(() => {
    const orders = data as Order[];

    if (filter === "all") return orders;

    return orders.filter((order) => order.status === filter);
  }, [data, filter]);

  /**
   * Updates an order status in Firestore.
   *
   * @param {string} orderId The Firestore order document ID.
   * @param {OrderStatus} status The new order status.
   * @returns {Promise<void>}
   */
  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ): Promise<void> => {
    try {
      setUpdatingId(orderId);

      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: serverTimestamp(),
      });

      toast.success("Order status updated successfully!");
    } catch (error: unknown) {
      console.error("Failed to update order status:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Helmet title="Orders Management">
      <section className="orders-page">
        <Container>
          <div className="orders-page__header">
            <div>
              <h2>Orders Management</h2>
              <p>View and manage customer orders.</p>
            </div>

            <div className="orders-page__count">
              {data.length} Total Orders
            </div>
          </div>

          <div className="orders-filters">
            {(
              ["all", "pending", "confirmed", "delivered"] as OrderFilter[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                className={`orders-filters__button ${
                  filter === status ? "active" : ""
                }`}
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "All Orders" : getStatusLabel(status)}
                <span>
                  {status === "all"
                    ? data.length
                    : data.filter((order) => order.status === status).length}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="orders-state">
              <Spinner color="primary" />
              <p>Loading orders...</p>
            </div>
          ) : error ? (
            <div className="orders-state orders-state--error">
              <i className="ri-error-warning-line" />
              <p>Failed to load orders: {error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-state">
              <i className="ri-inbox-line" />
              <h4>No orders found</h4>
              <p>There are no orders in this category yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => {
                const status = order.status ?? "pending";

                return (
                  <article className="order-card" key={order.id}>
                    <div className="order-card__header">
                      <div>
                        <span className="order-card__label">Order ID</span>
                        <h4>#{order.id.slice(0, 10)}</h4>
                        <p>{formatOrderDate(order.createdAt)}</p>
                      </div>

                      <span
                        className={`order-status order-status--${status}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <div className="order-card__body">
                      <Row>
                        <Col lg="5" className="mb-4 mb-lg-0">
                          <div className="order-section">
                            <h5>Customer Information</h5>

                            <p>
                              <i className="ri-user-line" />
                              {order.customer?.name || "No name"}
                            </p>

                            <p>
                              <i className="ri-mail-line" />
                              {order.customer?.email || "No email"}
                            </p>

                            <p>
                              <i className="ri-phone-line" />
                              {order.customer?.phone || "No phone"}
                            </p>

                            <p>
                              <i className="ri-map-pin-line" />
                              {[
                                order.customer?.streetAddress,
                                order.customer?.postalCode,
                                order.customer?.country,
                              ]
                                .filter(Boolean)
                                .join(", ") || "No address"}
                            </p>
                          </div>
                        </Col>

                        <Col lg="7">
                          <div className="order-section">
                            <h5>
                              Ordered Products ({order.items?.length ?? 0})
                            </h5>

                            <div className="order-products">
                              {order.items?.map((item, index) => (
                                <div
                                  className="order-product"
                                  key={`${item.productId || item.productName}-${index}`}
                                >
                                  {item.imgUrl ? (
                                    <img
                                      src={item.imgUrl}
                                      alt={item.productName}
                                    />
                                  ) : (
                                    <div className="order-product__placeholder">
                                      <i className="ri-image-line" />
                                    </div>
                                  )}

                                  <div className="order-product__info">
                                    <h6>{item.productName}</h6>
                                    <p>
                                      ${Number(item.price).toFixed(2)} ×{" "}
                                      {item.quantity}
                                    </p>
                                  </div>

                                  <strong>
                                    $
                                    {(
                                      Number(item.price) *
                                      Number(item.quantity)
                                    ).toFixed(2)}
                                  </strong>
                                </div>
                              ))}

                              {!order.items?.length && (
                                <p className="text-muted">
                                  No products found in this order.
                                </p>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="order-card__footer">
                      <div className="order-total">
                        <span>
                          {order.totalQuantity ?? 0} Items · Subtotal: $
                          {Number(order.subtotal ?? 0).toFixed(2)}
                        </span>
                        <strong>
                          Total: $
                          {Number(order.totalAmount ?? 0).toFixed(2)}
                        </strong>
                      </div>

                      <div className="order-card__actions">
                        <label htmlFor={`status-${order.id}`}>
                          Update Status
                        </label>

                        <select
                          id={`status-${order.id}`}
                          value={status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            void handleStatusChange(
                              order.id,
                              event.target.value as OrderStatus
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        {updatingId === order.id && (
                          <Spinner size="sm" color="secondary" />
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </Helmet>
  );
}
