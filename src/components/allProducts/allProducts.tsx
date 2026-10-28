"use client";
import Helmet from "../layout/Helmet";
import { JSX, useState } from "react";
import Image from "next/image";
import { Container, Row, Col, Table, Button, Spinner } from "reactstrap";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import { toast } from "react-toastify";
import type { Product } from "@/models/product";
import "@/styles/all-products.css";

/**
 * AllProducts component for displaying and managing products in the admin dashboard.
 * 
 * @returns {JSX.Element} The rendered AllProducts component.
 */
export default function AllProducts(): JSX.Element {
  const { data: productsData, loading } = useGetData("products") as { data: Product[]; loading: boolean };
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Deletes a product by its ID after confirmation.
   * 
   * @param {string} id The ID of the product to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteProduct = async (id: string): Promise<void> => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "products", id));
      toast.success("Deleted successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete product.";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Helmet title="All Products">
      <section className="all__products-section py-5">
        <Container>
          {/* Header */}
          <Row className="mb-4 align-items-center">
            <Col lg="6" md="6">
              <h2 className="products__title">Products Inventory</h2>
              <p className="products__subtitle text-muted">Manage and monitor all store products in real-time.</p>
            </Col>
            <Col lg="6" md="6" className="text-md-end mt-3 mt-md-0">
              <div className="products__count-badge d-inline-block">
                Total Products: <strong>{productsData.length}</strong>
              </div>
            </Col>
          </Row>

          {/* Table Card Container */}
          <Row>
            <Col lg="12">
              <div className="table__wrapper">
                <Table hover responsive className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Spinner color="primary" size="sm" />
                          <span className="ms-2 text-muted fw-medium">Loading products...</span>
                        </td>
                      </tr>
                    ) : productsData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          <i className="ri-folder-open-line fs-2 d-block mb-2"></i>
                          <span>No products found.</span>
                        </td>
                      </tr>
                    ) : (
                      productsData.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="product__img-box">
                              <Image
                                src={item.imgUrl || "/placeholder.png"}
                                alt={item.productName || "Product image"}
                                fill
                                className="object-fit-cover"
                                sizes="45px"
                              />
                            </div>
                          </td>
                          <td className="fw-semibold text-dark">{item.productName}</td>
                          <td>
                            <span className="badge category__badge text-capitalize">
                              {item.category}
                            </span>
                          </td>
                          <td className="fw-bold text-dark">${item.price}</td>
                          <td className="text-end">
                            <Button
                              color="danger"
                              size="sm"
                              className="delete__btn"
                              onClick={() => handleDeleteProduct(item.id)}
                              disabled={deletingId === item.id}
                            >
                              <i className="ri-delete-bin-line me-1"></i>
                              {deletingId === item.id ? "Deleting..." : "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}