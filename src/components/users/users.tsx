"use client";

import { useState } from "react";
import Image from "next/image";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "@/custom-hooks/useGetData";
import { toast } from "react-toastify";
import type { User } from "@/models/user";

/**
 * Users component for displaying and managing registered users in the admin dashboard.
 * 
 * @returns {JSX.Element} The rendered Users component.
 */
export default function Users() {
  const { data: usersData, loading } = useGetData("users") as { data: User[]; loading: boolean };
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Deletes a user from Firestore by ID after confirmation.
   * 
   * @param {string} id - The user ID (uid).
   * @returns {Promise<void>}
   */
  const handleDeleteUser = async (id: string): Promise<void> => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete user.";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" aria-label="Users Table">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-5 text-center font-bold">
                      Loading .....
                    </td>
                  </tr>
                ) : usersData?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  usersData?.map((user) => (
                    <tr key={user.uid || user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={user.photoURL || "/default-avatar.png"}
                            alt={user.displayName || "User profile image"}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.displayName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.uid || user.id)}
                          disabled={deletingId === (user.uid || user.id)}
                          aria-label={`Delete user ${user.displayName}`}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === (user.uid || user.id) ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
