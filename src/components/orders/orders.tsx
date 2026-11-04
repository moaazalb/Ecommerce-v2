"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { JSX } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import Helmet from "@/components/layout/helmet";
import { Col, Container, Row, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import "@/styles/orders.css";
import { Order, OrderFilter, OrderStatus } from "@/types/order";
import { formatOrderDate } from "@/lib/helper";

/**
 * Admin orders management page.
 *
 * Displays orders, customer details, purchased products,
 * order totals, and allows administrators to update order statuses.
 *
 * @returns {JSX.Element} The rendered orders management page.
 */
export default function Orders(): JSX.Element {
  const { t, i18n } = useTranslation();
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
    status: OrderStatus,
  ): Promise<void> => {
    try {
      setUpdatingId(orderId);

      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: serverTimestamp(),
      });

      toast.success(t("orders.statusUpdated"));
    } catch (error: unknown) {
      console.error("Failed to update order status:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : t("orders.errors.updateFailed"),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Helmet title={t("orders.title")}>
      <section className="orders-page">
        <Container>
          <div className="orders-page__header">
            <div>
              <h2>{t("orders.heading")}</h2>
              <p>{t("orders.description")}</p>
            </div>

            <div className="orders-page__count">
              {data.length} {t("orders.totalOrders")}
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
                {t(`orders.filters.${status}`)}
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
              <p>{t("orders.loading")}</p>
            </div>
          ) : error ? (
            <div className="orders-state orders-state--error">
              <i className="ri-error-warning-line" />
              <p>{t("orders.errors.loadFailed", { error })}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-state">
              <i className="ri-inbox-line" />
              <h4>{t("orders.emptyTitle")}</h4>
              <p>{t("orders.emptyDescription")}</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => {
                const status = order.status ?? "pending";

                return (
                  <article className="order-card" key={order.id}>
                    <div className="order-card__header">
                      <div>
                        <span className="order-card__label">
                          {t("orders.orderId")}
                        </span>
                        <h4>#{order.id.slice(0, 10)}</h4>
                        <p>
                          {formatOrderDate(
                            order.createdAt,
                            i18n.language,
                            t("orders.errors.dateUnavailable"),
                          )}
                        </p>
                      </div>

                      <span className={`order-status order-status--${status}`}>
                        {t(`orders.status.${status}`)}
                      </span>
                    </div>

                    <div className="order-card__body">
                      <Row>
                        <Col lg="5" className="mb-4 mb-lg-0">
                          <div className="order-section">
                            <h5>{t("orders.customerInformation")}</h5>
                            <p>
                              <i className="ri-user-line" />
                              {order.customer?.name || t("orders.noName")}
                            </p>

                            <p>
                              <i className="ri-mail-line" />
                              {order.customer?.email || t("orders.noEmail")}
                            </p>

                            <p>
                              <i className="ri-phone-line" />
                              {order.customer?.phone || t("orders.noPhone")}
                            </p>

                            <p>
                              <i className="ri-map-pin-line" />
                              {[
                                order.customer?.streetAddress,
                                order.customer?.postalCode,
                                order.customer?.country,
                              ]
                                .filter(Boolean)
                                .join(", ") || t("orders.noAddress")}
                            </p>
                          </div>
                        </Col>

                        <Col lg="7">
                          <div className="order-section">
                            <h5>
                              {t("orders.orderedProducts", {
                                count: order.items?.length ?? 0,
                              })}
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
                                      Number(item.price) * Number(item.quantity)
                                    ).toFixed(2)}
                                  </strong>
                                </div>
                              ))}

                              {!order.items?.length && (
                                <p className="text-muted">
                                  {t("orders.noProducts")}
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
                          {t("orders.itemsCount", {
                            count: order.totalQuantity ?? 0,
                          })}{" "}
                          · {t("orders.subtotal")}: $
                          {Number(order.subtotal ?? 0).toFixed(2)}
                        </span>

                        <strong>
                          {t("orders.total")}: $
                          {Number(order.totalAmount ?? 0).toFixed(2)}
                        </strong>
                      </div>

                      <div className="order-card__actions">
                        <label htmlFor={`status-${order.id}`}>
                          {t("orders.updateStatus")}
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            void handleStatusChange(
                              order.id,
                              event.target.value as OrderStatus,
                            )
                          }
                        >
                          <option value="pending">
                            {t("orders.status.pending")}
                          </option>
                          <option value="confirmed">
                            {t("orders.status.confirmed")}
                          </option>
                          <option value="delivered">
                            {t("orders.status.delivered")}
                          </option>
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
