"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { auth } from "@/firebase.config";
import useAuth from "@/custom-hooks/useAuth";
import logo from "@/assets/images/eco-logo.png";
import userIcon from "@/assets/images/user-icon.png";
import type { RootState } from "@/redux/store";
import "./header.css";

interface NavLinkItem {
  path: string;
  display: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/home", display: "Home" },
  { path: "/shop", display: "Shop" },
  { path: "/cart", display: "Cart" },
];

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const { currentUser } = useAuth() as { currentUser: { photoURL?: string } | null };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = (): void => setIsMenuOpen((prev) => !prev);
  const toggleProfileActions = (): void => setIsProfileOpen((prev) => !prev);
  const navigateToCart = (): void => router.push("/cart");

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/home");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to log out.");
    }
  };

  return (
    <header className={isSticky ? "sticky__header" : "header"}>
      <div className="container">
        <div className="row">
          <div className="nav__wrapper">
            <div className="logo">
              <Image src={logo} alt="logo" />
              <div>
                <h1>Ecommerce</h1>
              </div>
            </div>

            <div
              className={`navigation ${isMenuOpen ? "active__menu" : ""}`}
              onClick={toggleMenu}
            >
              <ul className="menu">
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

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
                <span className="badge">2</span>
              </span>

              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>

              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser?.photoURL || userIcon.src}
                  alt="profile"
                  onClick={toggleProfileActions}
                />

                {isProfileOpen && (
                  <div className="profile__actions" onClick={toggleProfileActions}>
                    {currentUser ? (
                      <span onClick={handleLogout}>Logout</span>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center flex-column">
                        <Link href="/signup">Signup</Link>
                        <Link href="/login">Login</Link>
                        <Link href="/dashboard">Dashboard</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mobile__menu">
                <span onClick={toggleMenu}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}