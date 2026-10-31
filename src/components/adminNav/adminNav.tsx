
"use client";

import "@/styles/admin-nav.css";
import { useState, useEffect } from "react";
import { Container } from "reactstrap";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import Helmet from "../layout/helmet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "@/firebase.config";
import { cartActions } from "@/store/slices/cartSlice";


interface AdminNavItem {
  display: string;
  path: string;
  icon: string;
}

const admin__nav: AdminNavItem[] = [
  {
    display: "Dashboard",
    path: "/admin/dashboard",
    icon: "ri-dashboard-3-line",
  },
  {
    display: "All Products",
    path: "/admin/allProducts",
    icon: "ri-shopping-bag-3-line",
  },
  {
    display: "Add Product",
    path: "/admin/addProduct",
    icon: "ri-add-circle-line",
  },
  {
    display: "Users",
    path: "/admin/users",
    icon: "ri-group-line",
  },
  {
  display: "Orders",
  path: "/admin/orders",
  icon: "ri-file-list-3-line",
},
];

/**
 * Admin navigation component.
 *
 * Displays the administration header, user profile, search field,
 * and navigation links for the admin dashboard.
 *
 * @returns {JSX.Element} The rendered admin navigation.
 */
const AdminNav = () => {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setProfileImage(currentUser?.photoURL || null);
  }, [currentUser?.photoURL]);

  const handleLogout = async () => {
  try {
    await signOut(auth);

    dispatch(cartActions.clearCart());

    toast.success("Logged out successfully!");

    router.replace("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Failed to log out. Please try again.");
  }
};

  return (
    <Helmet title="Admin Navigation">
      <header className="admin__header">
        <Container>
          <div className="admin__nav-wrapper-top">
            {/* Brand */}
            <div className="admin__logo">
              <Link href="/admin/dashboard">
                <i className="ri-store-3-line" />
                <span className="admin__logo-name">Ecommerce</span>
                <span className="admin__logo-badge">Admin</span>
              </Link>
            </div>

            {/* Search */}
            <div className="admin__search-box">
              <i className="ri-search-line search__icon" />
              <input
                type="search"
                placeholder="Search products, users..."
                aria-label="Search admin dashboard"
              />
              <span className="admin__search-shortcut">⌘ K</span>
            </div>

            {/* Actions */}
            <div className="admin__nav-top-right">
              <button
                type="button"
                className="admin__icon-button"
                aria-label="Notifications"
                title="Notifications"
              >
                <i className="ri-notification-3-line" />
                <span className="admin__notification-dot" />
              </button>

              <div className="admin__settings-wrapper">
              <button
                type="button"
                className={`admin__icon-button ${
                  isSettingsOpen ? "settings-active" : ""
                }`}
                aria-label="Settings"
                title="Settings"
                aria-expanded={isSettingsOpen}
                onClick={() => setIsSettingsOpen((prev) => !prev)}
              >
                <i className="ri-settings-3-line" />
              </button>

              {isSettingsOpen && (
                <>
                  <div
                    className="admin__dropdown-overlay"
                    onClick={() => setIsSettingsOpen(false)}
                  />

                  <div className="admin__settings-dropdown">
                    <Link
                      href="/"
                      className="admin__dropdown-item"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <i className="ri-store-2-line" />
                      <span>View Store</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="admin__dropdown-item"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <i className="ri-user-settings-line" />
                      <span>Profile Settings</span>
                    </Link>

                    <button
                      type="button"
                      className="admin__dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <i className="ri-logout-box-r-line" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

              <div className="admin__profile">
              {profileImage ? (
                <img
                  key={profileImage}
                  src={profileImage}
                  alt="Admin profile"
                  className="user-profile"
                />
              ) : (
                <div className="profile__placeholder">
                  <i className="ri-user-3-line" />
                </div>
              )}
            </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Admin navigation menu */}
      <nav className="admin__menu" aria-label="Admin navigation">
        <Container>
          <ul className="admin__menu-list">
            {admin__nav.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li className="admin__menu-item" key={item.path}>
                  <Link
                    href={item.path}
                    className={`admin__menu-link ${
                      isActive ? "active__admin-menu" : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <i className={item.icon} />
                    <span>{item.display}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>
    </Helmet>
  );
};

export default AdminNav;
