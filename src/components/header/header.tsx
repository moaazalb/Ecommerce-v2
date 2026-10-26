"use client";

import { useState, useEffect, JSX, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { auth } from "@/firebase.config";
import useAuth from "@/custom-hooks/useAuth";
import logo from "@/assets/images/eco-logo.png";
import userIcon from "@/assets/images/user-icon.png";
import type { RootState } from "@/redux/store";
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
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const { currentUser } = useAuth() as { currentUser: { photoURL?: string; email?: string } | null };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (): void => setIsSticky(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (): void => setIsMenuOpen((prev) => !prev);
  const toggleProfileActions = (): void => setIsProfileOpen((prev) => !prev);
  const navigateToCart = (): void => router.push("/cart");

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      setIsProfileOpen(false);
      router.push("/");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to log out.");
    }
  };

  return (
    <header className={`header ${isSticky ? "sticky__header" : ""}`}>
      <div className="container">
        <div className="nav__wrapper">
          {/* Logo */}
          <Link href="/" className="logo">
            <Image src={logo} alt="logo" priority />
            <h1>Ecommerce</h1>
          </Link>

          {/* Navigation Links (Desktop & Mobile Drawer) */}
          <div className={`navigation ${isMenuOpen ? "active__menu" : ""}`}>
            {isMenuOpen && <div className="menu__overlay" onClick={toggleMenu} />}
            <ul className="menu" onClick={() => setIsMenuOpen(false)}>
              {NAV_LINKS.map((item) => (
                <li className="nav__item" key={item.path}>
                  <Link
                    href={item.path}
                    className={pathname === item.path ? "nav__active" : ""}
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Icons & Profile */}
          <div className="nav__icons">
            <span className="fav__icon" title="Wishlist">
              <i className="ri-heart-line"></i>
              <span className="badge">2</span>
            </span>

            <span className="cart__icon" onClick={navigateToCart} title="Cart">
              <i className="ri-shopping-bag-line"></i>
              {totalQuantity > 0 && <span className="badge">{totalQuantity}</span>}
            </span>

            {/* Profile Dropdown */}
            <div className="profile" ref={profileRef}>
              <motion.div whileTap={{ scale: 0.95 }} className="profile__img-wrapper">
                <Image
                  src={currentUser?.photoURL || userIcon}
                  alt="profile"
                  width={36}
                  height={36}
                  onClick={toggleProfileActions}
                />
              </motion.div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="profile__actions"
                  >
                    {currentUser ? (
                      <div className="profile__menu-list">
                        <span className="user__email">{currentUser.email || "Account"}</span>
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}>
                          Dashboard
                        </Link>
                        <button className="logout__btn" onClick={handleLogout}>
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="profile__menu-list">
                        <Link href="/login" onClick={() => setIsProfileOpen(false)}>
                          Login
                        </Link>
                        <Link href="/signup" onClick={() => setIsProfileOpen(false)}>
                          Sign Up
                        </Link>
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}>
                          Dashboard
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="mobile__menu" onClick={toggleMenu}>
              <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}