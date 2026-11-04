"use client";

import "@/styles/admin-nav.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { usePreferences } from "@/context/PreferencesContext";
import { admin__nav } from "@/lib/data/adminNav";

/**
 * Admin navigation component.
 *
 * Displays the administration header, user profile, search field,
 * and navigation links for the admin dashboard.
 *
 * @returns {JSX.Element} The rendered admin navigation.
 */
const AdminNav = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { theme, setTheme, language, setLanguage } = usePreferences();

  useEffect(() => {
    setProfileImage(currentUser?.photoURL || null);
  }, [currentUser?.photoURL]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(cartActions.clearCart());
      toast.success(t("adminNav.logoutSuccess"));
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("adminNav.errors.logoutFailed"));
    }
  };

  return (
    <Helmet title={t("adminNav.title")}>
      <header className="admin__header">
        <Container>
          <div className="admin__nav-wrapper-top">
            {/* Brand */}
            <div className="admin__logo">
              <Link href="/admin/dashboard">
                <i className="ri-store-3-line" />
                <span className="admin__logo-name">{t("header.brand")}</span>
                <span className="admin__logo-badge">{t("adminNav.badge")}</span>
              </Link>
            </div>

            {/* Search */}
            <div className="admin__search-box">
              <i className="ri-search-line search__icon" />
              <input
                type="search"
                placeholder={t("adminNav.searchPlaceholder")}
                aria-label={t("adminNav.searchLabel")}
              />
              <span className="admin__search-shortcut">⌘ K</span>
            </div>

            {/* Actions */}
            <div className="admin__nav-top-right">
              <button
                type="button"
                className="admin__icon-button"
                aria-label={t("adminNav.notifications")}
                title={t("adminNav.notifications")}
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
                  aria-label={t("adminNav.settings")}
                  title={t("adminNav.settings")}
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
                        <span>{t("adminNav.viewStore")}</span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        className="admin__dropdown-item"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        <i className="ri-user-settings-line" />
                        <span>{t("adminNav.profileSettings")}</span>
                      </Link>
                      {/* Theme Toggle */}
                      <button
                        type="button"
                        className="admin__dropdown-item"
                        onClick={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      >
                        <i
                          className={
                            theme === "light" ? "ri-moon-line" : "ri-sun-line"
                          }
                        />
                        <span>
                          {theme === "light" ? "Dark Mode" : "Light Mode"}
                        </span>
                      </button>

                      {/* Language Toggle */}
                      <button
                        type="button"
                        className="admin__dropdown-item"
                        onClick={() =>
                          setLanguage(language === "en" ? "ar" : "en")
                        }
                      >
                        <i className="ri-translate-2" />
                        <span>
                          {language === "en"
                            ? t("adminNav.arabic")
                            : t("adminNav.english")}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="admin__dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <i className="ri-logout-box-r-line" />
                        <span>{t("adminNav.logout")}</span>
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
                    alt={t("adminNav.profileImage")}
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
      <nav className="admin__menu" aria-label={t("adminNav.navigation")}>
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
                    <span>{t(item.display)}</span>
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
