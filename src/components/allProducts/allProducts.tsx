"use client";
import Helmet from "../Layout/Helmet";
import { JSX, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import  useGetData  from "@/custom-hooks/useGetData";
import { toast } from "react-toastify";
import type { Product } from "@/models/product";

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
   * @param {string} id - The ID of the product to delete.
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
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" aria-label="Products Table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-5 text-center font-bold">
                    Loading......
                  </td>
                </tr>
              ) : productsData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-5 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                productsData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12">
                        <Image
                          src={item.imgUrl || "/placeholder.png"}
                          alt={item.productName || "Product image"}
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        disabled={deletingId === item.id}
                        aria-label={`Delete ${item.productName}`}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    </Helmet>
  );
}
