
"use client";

import { useState, useEffect, useRef, type JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { auth, db } from "@/firebase.config";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import logo from "../../../public/assets/images/eco-logo.png";
import userIcon from "../../../public/assets/images/user-icon.png";
import type { RootState, AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import "@/styles/header.css";


interface NavLinkItem {
  path: string;
  display: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/", display: "Home" },
  { path: "/shop", display: "Shop" },
  { path: "/cart", display: "Cart" },
];

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, totalQuantity } = useSelector(
  (state: RootState) => state.cart
);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentUser, isAdmin, authLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

useEffect(() => {
  setProfileImage(currentUser?.photoURL || null);
}, [currentUser?.photoURL]);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Close menus with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const navigateToCart = () => {
    router.push("/cart");
  };

  /**
 * Saves the current user's cart to Firestore before logging out.
 * Clears the Redux cart only after the logout succeeds.
 *
 * @returns {Promise<void>} A promise that resolves when logout is completed.
 */
  const handleLogout = async (): Promise<void> => {
    if (!currentUser || isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Save the user's cart in Firestore before signing out.
      const cartRef = doc(db, "carts", currentUser.uid);

      await setDoc(
        cartRef,
        {
          cartItems,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Sign out only after the cart has been saved successfully.
      await signOut(auth);

      // Clear the Redux cart after successful logout.
      dispatch(cartActions.clearCart());

      setIsProfileOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/login");
    } catch (error: unknown) {
      console.error("Logout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save cart or log out."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`header ${isSticky ? "sticky__header" : ""}`}>
      <div className="container">
        <div className="nav__wrapper">

          {/* Brand */}
          <Link href="/" className="logo" aria-label="Ecommerce home">
            <Image src={logo} alt="" priority />
            <span>ECOMMERCE</span>
          </Link>

          {/* Main Navigation */}
          <div
            className={`navigation ${isMenuOpen ? "active__menu" : ""}`}
          >
            <button
              type="button"
              className="menu__overlay"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
              tabIndex={isMenuOpen ? 0 : -1}
            />

            <nav
              id="mobile-navigation"
              className="menu__panel"
              aria-label="Main navigation"
            >
              <ul className="menu">
                {NAV_LINKS.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/" &&
                      pathname.startsWith(`${item.path}/`));

                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={isActive ? "active__link" : ""}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.display}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Header Actions */}
          <div className="nav__icons">

            {/* Wishlist placeholder */}
            <span
              className="fav__icon"
              role="img"
              aria-label="Wishlist, 2 items"
              title="Wishlist"
            >
              <i className="ri-heart-line" aria-hidden="true" />
              <span className="badge">2</span>
            </span>

            {/* Shopping Cart */}
            <button
              type="button"
              className="cart__icon"
              onClick={navigateToCart}
              aria-label={`Shopping cart, ${totalQuantity} items`}
              title="Shopping cart"
            >
              <i className="ri-shopping-bag-line" aria-hidden="true" />

              {totalQuantity > 0 && (
                <span className="badge">{totalQuantity}</span>
              )}
            </button>

            {/* Account */}
            <div className="profile" ref={profileRef}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                className="profile__trigger"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Account menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
              {profileImage ? (
              <img
                key={profileImage}
                src={profileImage}
                alt="User profile"
                width={38}
                height={38}
                className="profile__image"
              />
            ) : (
              <Image
                src={userIcon}
                alt="User profile"
                width={38}
                height={38}
              />
            )}

                <i
                  className={`ri-arrow-down-s-line profile__arrow ${
                    isProfileOpen ? "profile__arrow--open" : ""
                  }`}
                  aria-hidden="true"
                />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="profile__actions"
                  >
                    {currentUser ? (
                      <div className="profile__menu-list">
                        <div className="profile__user">
                          <span className="profile__user-label">
                            Signed in as
                          </span>
                          <span className="user__email">
                            {currentUser.email || "Account"}
                          </span>
                          {!isAdmin && (
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <i className="ri-user-settings-line" />
                              Profile Settings
                            </Link>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <i className="ri-dashboard-line" />
                            Admin Dashboard
                          </Link>
                        )}

                       <button
                        type="button"
                        className="logout__btn"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <i className="ri-logout-box-r-line" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                      </div>
                    ) : (
                      <div className="profile__menu-list">
                        <Link
                          href="/login"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="ri-login-box-line" />
                          Login
                        </Link>

                        <Link
                          href="/signup"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="ri-user-add-line" />
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile__menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <i
                className={
                  isMenuOpen ? "ri-close-line" : "ri-menu-3-line"
                }
                aria-hidden="true"
              />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
