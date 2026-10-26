import React, { JSX } from "react";
import Link from "next/link";
import "./footer.css";

interface FooterLink {
  path: string;
  display: string;
}

const TOP_CATEGORIES: FooterLink[] = [
  { path: "/shop?category=mobile", display: "Mobile Phones" },
  { path: "/shop?category=sofa", display: "Modern Sofa" },
  { path: "/shop?category=chair", display: "Arm Chair" },
  { path: "/shop?category=watch", display: "Smart Watches" },
];

const USEFUL_LINKS: FooterLink[] = [
  { path: "/shop", display: "Shop" },
  { path: "/cart", display: "Cart" },
  { path: "/login", display: "Login" },
  { path: "/privacy", display: "Privacy Policy" },
];

/**
 * Footer component displaying site branding, top categories, useful links, and contact information.
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h1 className="text-white">Ecommerce</h1>
            <p className="footer__text mt-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut eaque est excepturi
              provident facilis fuga mollitia sunt eos hic ducimus?
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Top Categories</h4>
              <ul className="list-group">
                {TOP_CATEGORIES.map((item) => (
                  <li key={item.path} className="list-group-item ps-0 border-0">
                    <Link href={item.path}>{item.display}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Useful Links</h4>
              <ul className="list-group">
                {USEFUL_LINKS.map((item) => (
                  <li key={item.path} className="list-group-item ps-0 border-0">
                    <Link href={item.path}>{item.display}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Contact</h4>
              <ul className="list-group footer__contact">
                <li className="list-group-item ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-map-pin-line"></i>
                  </span>
                  <p>Syria, Damascus</p>
                </li>
                <li className="list-group-item ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-phone-line"></i>
                  </span>
                  <p>+963 936862796</p>
                </li>
                <li className="list-group-item ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-mail-line"></i>
                  </span>
                  <p>mohazalbari02@gmail.com</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12">
            <p className="footer__copyright">
              Copyright {year} developed by Moaaz Albari. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}