"use client";

import "@/styles/admin-nav.css";
import { Container, Row } from "reactstrap";
import useAuth from "@/custom-hooks/useAuth";
import Helmet from "../Layout/Helmet";
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
];

const AdminNav = () => {
  const { currentUser } = useAuth();
  const pathname = usePathname();

  return (
    <Helmet title="Admin Nav">
      <header className="admin__header">
        <div className="admin__nav-top">
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <Link href="/admin/Dashboard">
                  <h2>
                    <i className="ri-store-3-line"></i> Ecommerce <span className="mt-1">Admin</span>
                  </h2>
                </Link>
              </div>

              <div className="search__box">
                <i className="ri-search-line search__icon"></i>
                <input type="text" placeholder="Search overall stats, products..." />
              </div>

              <div className="admin__nav-top-right">
                <span className="icon__badge" title="Notifications">
                  <i className="ri-notification-3-line"></i>
                  <span className="dot"></span>
                </span>
                <span className="icon__badge" title="Settings">
                  <i className="ri-settings-2-line"></i>
                </span>
                <div className="admin__profile">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User Profile"
                      className="user-profile"
                    />
                  ) : (
                    <div className="profile__placeholder">
                      <i className="ri-user-3-line"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigation">
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
                      >
                        <i className={item.icon}></i>
                        <span>{item.display}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AdminNav;