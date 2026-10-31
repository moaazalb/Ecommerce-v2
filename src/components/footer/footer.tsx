import { type JSX } from "react";
import Link from "next/link";
import "@/styles/footer.css";

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

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="row g-4 g-lg-5">

            {/* Brand */}
            <div className="col-lg-4 col-md-6">
              <div className="footer__brand">
                <Link href="/" className="footer__logo">
                  <span className="footer__logo-mark">
                    <i className="ri-shopping-bag-3-line" />
                  </span>
                  <span>ECOMMERCE</span>
                </Link>

                <p className="footer__text">
                  Discover a better way to shop. Explore quality products,
                  timeless style, and everyday essentials — all in one place.
                </p>

                <div className="footer__brand-caption">
                  <span className="footer__caption-line" />
                  <span>SHOP WITH CONFIDENCE</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="col-lg-3 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">Top Categories</h2>

                <ul>
                  {TOP_CATEGORIES.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <i className="ri-arrow-right-s-line" />
                        {item.display}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Useful Links */}
            <div className="col-lg-2 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">Explore</h2>

                <ul>
                  {USEFUL_LINKS.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <i className="ri-arrow-right-s-line" />
                        {item.display}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">Get in Touch</h2>

                <ul className="footer__contact">
                  <li>
                    <span className="footer__contact-icon">
                      <i className="ri-map-pin-line" />
                    </span>
                    <span>Syria, Damascus</span>
                  </li>

                  <li>
                    <span className="footer__contact-icon">
                      <i className="ri-phone-line" />
                    </span>
                    <a href="tel:+963936862796">
                      +963 936862796
                    </a>
                  </li>

                  <li>
                    <span className="footer__contact-icon">
                      <i className="ri-mail-line" />
                    </span>
                    <a href="mailto:mohazalbari02@gmail.com">
                      mohazalbari02@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} <span>ECOMMERCE</span>. All rights reserved.
          </p>

          <p className="footer__made">
            Designed & developed by <span>Moaaz Albari</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
