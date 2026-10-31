
"use client";

import "@/styles/admin-nav.css";
import { Container } from "reactstrap";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import Helmet from "../layout/helmet";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavItem {
  display: string;
  path: string;
  icon: string;
}

const admin__nav: AdminNavItem[] = [
  {
    display: "Dashboard",
    path: "/admin/Dashboard",
    icon: "ri-dashboard-3-line",
  },
  {
    display: "All Products",
    path: "/admin/AllProducts",
    icon: "ri-shopping-bag-3-line",
  },
  {
    display: "Add Product",
    path: "/admin/AddProduct",
    icon: "ri-add-circle-line",
  },
  {
    display: "Users",
    path: "/admin/Users",
    icon: "ri-group-line",
  },
  {
  display: "Orders",
  path: "/admin/Orders",
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

  return (
    <Helmet title="Admin Navigation">
      <header className="admin__header">
        <Container>
          <div className="admin__nav-wrapper-top">
            {/* Brand */}
            <div className="admin__logo">
              <Link href="/admin/Dashboard">
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

              <button
                type="button"
                className="admin__icon-button"
                aria-label="Settings"
                title="Settings"
              >
                <i className="ri-settings-3-line" />
              </button>

              <div className="admin__profile">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User profile"
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
