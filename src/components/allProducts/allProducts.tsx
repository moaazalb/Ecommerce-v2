
"use client";

import Helmet from "../layout/helmet";
import { JSX, useState } from "react";
import Image from "next/image";
import { Container, Row, Col, Table, Button, Spinner } from "reactstrap";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import { toast } from "react-toastify";
import type { Product } from "@/types/product";
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

    toast.success("Product deleted successfully!");
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to delete product. Please try again.";

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
            <h4>Delete Product?</h4>
            <p>
              Are you sure you want to delete{" "}
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
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-toast__confirm"
            onClick={() => {
              closeToast();
              void handleDeleteProduct(product.id);
            }}
          >
            Delete
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
    }
  );
};


  return (
    <Helmet title="All Products">
      <section className="all__products-section">
        <Container fluid="xl">
          {/* Page header */}
          <div className="all-products__header">
            <div className="all-products__heading">
              <span className="all-products__eyebrow">
                INVENTORY MANAGEMENT
              </span>

              <h1 className="products__title">All Products</h1>

              <p className="products__subtitle">
                Manage your inventory, review product details, and keep your
                store up to date.
              </p>
            </div>

            <div className="products__count-badge">
              <span className="products__count-icon">
                <i className="ri-shopping-bag-3-line" aria-hidden="true" />
              </span>

              <div>
                <span className="products__count-label">
                  Total Products
                </span>
                <strong>{loading ? "—" : productsData.length}</strong>
              </div>
            </div>
          </div>

          {/* Inventory table */}
          <div className="all-products__card">
            <div className="all-products__card-header">
              <div>
                <h2>Product Inventory</h2>
                <p>All products currently available in your store.</p>
              </div>

              <span className="all-products__live-status">
                <span aria-hidden="true" />
                Inventory
              </span>
            </div>

            <div className="table__wrapper">
              <Table hover responsive className="all-products__table mb-0">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="all-products__state">
                          <Spinner color="primary" />
                          <h3>Loading products</h3>
                          <p>Please wait while we retrieve your inventory.</p>
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

                          <h3>No products yet</h3>
                          <p>
                            Your inventory is empty. Add a product to see it
                            listed here.
                          </p>
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
                                alt={item.productName || "Product image"}
                                fill
                                className="product__image"
                                sizes="64px"
                              />
                            </div>

                            <div className="all-products__product-info">
                              <span className="all-products__product-name">
                                {item.productName || "Untitled product"}
                              </span>

                              <span className="all-products__product-id">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="category__badge">
                            {item.category || "Uncategorized"}
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
                            aria-label={`Delete ${item.productName || "product"}`}
                          >
                            {deletingId === item.id ? (
                              <>
                                <Spinner size="sm" />
                                <span>Deleting</span>
                              </>
                            ) : (
                              <>
                                <i
                                  className="ri-delete-bin-6-line"
                                  aria-hidden="true"
                                />
                                <span>Delete</span>
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
                  Showing{" "}
                  <strong>{productsData.length}</strong>{" "}
                  {productsData.length === 1 ? "product" : "products"}
                </span>

                <span className="all-products__footer-note">
                  <i className="ri-shield-check-line" aria-hidden="true" />
                  Inventory management
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>
    </Helmet>
  );
}
