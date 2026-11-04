"use client";

import Helmet from "../layout/helmet";
import { JSX, useState } from "react";
import Image from "next/image";
import { Container, Table, Button, Spinner } from "reactstrap";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import { toast } from "react-toastify";
import type { Product } from "@/types/product";
import { useTranslation } from "react-i18next";
import "@/styles/all-products.css";

/**
 * AllProducts component for displaying and managing products
 * in the admin dashboard.
 *
 * Provides product inventory information, loading and empty states,
 * and the ability to delete products from Firestore.
 *
 * @returns {JSX.Element} The rendered AllProducts component.
 */
export default function AllProducts(): JSX.Element {
  const { t } = useTranslation();
  const { data, loading } = useGetData("products") as {
    data: Product[] | undefined;
    loading: boolean;
  };
  const productsData = data ?? [];
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Deletes a product by its ID.
   *
   * @param {string} id The ID of the product to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteProduct = async (id: string): Promise<void> => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "products", id));
      toast.success(t("allProducts.deleteSuccess"));
    } catch (error: unknown) {
      console.error("Failed to delete product:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("allProducts.errors.deleteFailed");
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Displays a confirmation toast before deleting a product.
   *
   * @param {Product} product The product selected for deletion.
   */
  const confirmDeleteProduct = (product: Product): void => {
    toast(
      ({ closeToast }) => (
        <div className="delete-confirm-toast">
          <div className="delete-confirm-toast__content">
            <i className="ri-error-warning-line" />

            <div>
              <h4>{t("allProducts.confirmTitle")}</h4>
              <p>
                {t("allProducts.confirmMessage")}{" "}
                <strong>{product.productName}</strong>?
              </p>
            </div>
          </div>

          <div className="delete-confirm-toast__actions">
            <button
              type="button"
              className="delete-confirm-toast__cancel"
              onClick={closeToast}
            >
              {t("allProducts.cancel")}
            </button>

            <button
              type="button"
              className="delete-confirm-toast__confirm"
              onClick={() => {
                closeToast();
                void handleDeleteProduct(product.id);
              }}
            >
              {t("allProducts.delete")}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        position: "top-center",
        className: "delete-confirm-toast-wrapper",
      },
    );
  };

  return (
    <Helmet title={t("allProducts.title")}>
      <section className="all__products-section">
        <Container fluid="xl">
          {/* Page header */}
          <div className="all-products__header">
            <div className="all-products__heading">
              <span className="all-products__eyebrow">
                {t("allProducts.eyebrow")}
              </span>

              <h1 className="products__title">{t("allProducts.title")}</h1>

              <p className="products__subtitle">
                {t("allProducts.description")}
              </p>
            </div>

            <div className="products__count-badge">
              <span className="products__count-icon">
                <i className="ri-shopping-bag-3-line" aria-hidden="true" />
              </span>

              <div>
                <span className="products__count-label">
                  <span className="products__count-label">
                    {t("allProducts.totalProducts")}
                  </span>
                </span>
                <strong>{loading ? "—" : productsData.length}</strong>
              </div>
            </div>
          </div>

          {/* Inventory table */}
          <div className="all-products__card">
            <div className="all-products__card-header">
              <div>
                <h2>{t("allProducts.inventoryTitle")}</h2>
                <p>{t("allProducts.inventoryDescription")}</p>
              </div>

              <span className="all-products__live-status">
                <span aria-hidden="true" />
                {t("allProducts.inventory")}
              </span>
            </div>

            <div className="table__wrapper">
              <Table hover responsive className="all-products__table mb-0">
                <thead>
                  <tr>
                    <th scope="col">{t("allProducts.product")}</th>
                    <th scope="col">{t("allProducts.category")}</th>
                    <th scope="col">{t("allProducts.price")}</th>
                    <th scope="col" className="text-end">
                      {t("allProducts.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="all-products__state">
                          <Spinner color="primary" />
                          <h3>{t("allProducts.loading")}</h3>
                          <p>{t("allProducts.loadingDescription")}</p>
                        </div>
                      </td>
                    </tr>
                  ) : productsData.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="all-products__state">
                          <div className="all-products__empty-icon">
                            <i
                              className="ri-inbox-archive-line"
                              aria-hidden="true"
                            />
                          </div>
                          <h3>{t("allProducts.emptyTitle")}</h3>
                          <p>{t("allProducts.emptyDescription")}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    productsData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="all-products__product">
                            <div className="product__img-box">
                              <Image
                                src={item.imgUrl || "/placeholder.png"}
                                alt={
                                  item.productName ||
                                  t("allProducts.productImage")
                                }
                                fill
                                className="product__image"
                                sizes="64px"
                              />
                            </div>

                            <div className="all-products__product-info">
                              <span className="all-products__product-name">
                                {item.productName || t("allProducts.untitled")}
                              </span>
                              <span className="all-products__product-id">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="category__badge">
                            {item.category
                              ? t(`shop.categories.${item.category}`, {
                                  defaultValue: item.category,
                                })
                              : t("allProducts.uncategorized")}
                          </span>
                        </td>

                        <td>
                          <span className="all-products__price">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </td>

                        <td className="text-end">
                          <Button
                            type="button"
                            className="delete__btn"
                            onClick={() => confirmDeleteProduct(item)}
                            disabled={deletingId !== null}
                            aria-label={t("allProducts.deleteProduct", {
                              name:
                                item.productName || t("allProducts.product"),
                            })}
                          >
                            {deletingId === item.id ? (
                              <>
                                <Spinner size="sm" />
                                <span>{t("allProducts.deleting")}</span>
                              </>
                            ) : (
                              <>
                                <i
                                  className="ri-delete-bin-6-line"
                                  aria-hidden="true"
                                />
                                <span>{t("allProducts.delete")}</span>
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {!loading && productsData.length > 0 && (
              <div className="all-products__card-footer">
                <span>
                  {t("allProducts.showing")}{" "}
                  <strong>{productsData.length}</strong>{" "}
                  {t("allProducts.productCount", {
                    count: productsData.length,
                  })}
                </span>

                <span className="all-products__footer-note">
                  <i className="ri-shield-check-line" aria-hidden="true" />
                  {t("allProducts.inventoryManagement")}
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>
    </Helmet>
  );
}
