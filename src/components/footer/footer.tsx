import { type JSX } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TOP_CATEGORIES, USEFUL_LINKS } from "@/lib/data/footer";
import "@/styles/footer.css";

export default function Footer(): JSX.Element {
  const { t } = useTranslation();
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
                  <span>{t("footer.brand")}</span>
                </Link>

                <p className="footer__text">{t("footer.description")}</p>

                <div className="footer__brand-caption">
                  <span className="footer__caption-line" />
                  <span>{t("footer.contact")}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="col-lg-3 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">{t("footer.topCategories")}</h2>
                <ul>
                  {TOP_CATEGORIES.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <i className="ri-arrow-right-s-line" />
                        {t(item.display)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Useful Links */}
            <div className="col-lg-2 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">{t("footer.explore")}</h2>
                <ul>
                  {USEFUL_LINKS.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <i className="ri-arrow-right-s-line" />
                        {t(item.display)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <div className="footer__quick-links">
                <h2 className="footer__heading">{t("footer.contact")}</h2>

                <ul className="footer__contact">
                  <li>
                    <span className="footer__contact-icon">
                      <i className="ri-map-pin-line" />
                    </span>
                    <span>{t("footer.location")}</span>
                  </li>

                  <li>
                    <span className="footer__contact-icon">
                      <i className="ri-phone-line" />
                    </span>
                    <a href="tel:+963936862796">+963 936862796</a>
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
            © {year} <span>{t("footer.brand")}</span> {t("footer.copyright")}
          </p>

          <p className="footer__made">
            {t("footer.designedBy")} <span>{t("footer.owner")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
