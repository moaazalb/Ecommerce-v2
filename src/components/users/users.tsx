"use client";
import { useState } from "react";
import Helmet from "../layout/Helmet";
import Image from "next/image";
import { Container, Row, Col, Table, Button, Spinner } from "reactstrap";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import { toast } from "react-toastify";
import type { User } from "@/models/user";
import "@/styles/users.css";

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
   * @param {string} id The user ID (uid).
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
    <Helmet title="Users">
      <section className="users__section py-5">
        <Container>
          {/* Header */}
          <Row className="mb-4 align-items-center">
            <Col lg="6" md="6">
              <h2 className="users__title">Users Management</h2>
              <p className="users__subtitle text-muted">View and manage registered store accounts.</p>
            </Col>
            <Col lg="6" md="6" className="text-md-end mt-3 mt-md-0">
              <div className="users__count-badge d-inline-block">
                Total Users: <strong>{usersData?.length || 0}</strong>
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
                      <th>Avatar</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-5">
                          <Spinner color="primary" size="sm" />
                          <span className="ms-2 text-muted fw-medium">Loading users...</span>
                        </td>
                      </tr>
                    ) : usersData?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-5 text-muted">
                          <i className="ri-user-unfollow-line fs-2 d-block mb-2"></i>
                          <span>No users found.</span>
                        </td>
                      </tr>
                    ) : (
                      usersData?.map((user) => {
                        const userId = user.uid || user.id;
                        return (
                          <tr key={userId}>
                            <td>
                              <div className="user__avatar-box">
                                <Image
                                  src={user.photoURL || "/default-avatar.png"}
                                  alt={user.displayName || "User profile image"}
                                  fill
                                  className="object-fit-cover"
                                  sizes="45px"
                                />
                              </div>
                            </td>
                            <td className="fw-semibold text-dark">{user.displayName || "N/A"}</td>
                            <td className="text-muted">{user.email}</td>
                            <td className="text-end">
                              <Button
                                color="danger"
                                size="sm"
                                className="delete__btn"
                                onClick={() => handleDeleteUser(userId)}
                                disabled={deletingId === userId}
                              >
                                <i className="ri-delete-bin-line me-1"></i>
                                {deletingId === userId ? "Deleting..." : "Delete"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })
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