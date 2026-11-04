"use client";

import { useMemo, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import ProductsList from "@/components/ui/productList";
import CommmonSection from "@/components/ui/commonSection";
import Helmet from "../layout/helmet";
import staticProducts from "../../lib/data/products";
import useGetData from "@/custom-hooks/useGetData/useGetData";
import { useTranslation } from "react-i18next";
import "@/styles/shop.css";

/**
 * Shop page component.
 *
 * Allows users to browse products, filter by category,
 * search by product name, and sort products by price.
 *
 * @returns {JSX.Element} The rendered Shop page.
 */
export default function Shop() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const { data: firestoreProducts } = useGetData("products");

  /**
   * Combines static products with products fetched from Firestore.
   */
  const allProducts = useMemo(() => {
    return [...staticProducts, ...firestoreProducts];
  }, [firestoreProducts]);

  /**
   * Filters and sorts products based on the selected options.
   *
   * Search, category filtering, and sorting work together.
   */
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search by product name
    if (searchTerm.trim()) {
      result = result.filter((item) =>
        item.productName
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      );
    }

    // Sort by price
    if (sortOrder === "ascending") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "descending") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [allProducts, searchTerm, selectedCategory, sortOrder]);

  /**
   * Resets all shop filters to their default values.
   */
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("default");
  };

  return (
    <Helmet title={t("shop.title")}>
      <div className="shop-page">
        <CommmonSection title={t("shop.products")} />

        {/* Filters and Search */}
        <section className="shop__filter-section">
          <Container>
            <Row className="align-items-center">
              {/* Category Filter */}
              <Col lg="3" md="6" className="mb-3 mb-lg-0">
                <div className="filter__widget">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label={t("shop.filterCategory")}
                  >
                    <option value="all">{t("shop.allCategories")}</option>
                    <option value="sofa">{t("shop.categories.sofa")}</option>
                    <option value="mobile">
                      {t("shop.categories.mobile")}
                    </option>
                    <option value="chair">{t("shop.categories.chair")}</option>
                    <option value="watch">{t("shop.categories.watch")}</option>
                    <option value="wireless">
                      {t("shop.categories.wireless")}
                    </option>
                  </select>
                </div>
              </Col>

              {/* Sorting */}
              <Col lg="3" md="6" className="mb-3 mb-lg-0">
                <div className="filter__widget">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    aria-label={t("shop.sortByPrice")}
                  >
                    <option value="default">{t("shop.defaultSorting")}</option>
                    <option value="ascending">
                      {t("shop.priceLowToHigh")}
                    </option>
                    <option value="descending">
                      {t("shop.priceHighToLow")}
                    </option>
                  </select>
                </div>
              </Col>

              {/* Search */}
              <Col lg="4" md="9">
                <div className="search__box">
                  <input
                    type="search"
                    placeholder={t("shop.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={t("shop.searchLabel")}
                  />
                  <span>
                    <i className="ri-search-line"></i>
                  </span>
                </div>
              </Col>

              {/* Reset */}
              <Col lg="2" md="3" className="mt-3 mt-lg-0">
                <button
                  type="button"
                  className="shop__reset-btn"
                  onClick={handleReset}
                >
                  <i className="ri-refresh-line"></i>
                  {t("shop.reset")}
                </button>
              </Col>
            </Row>

            {/* Results Information */}
            <div className="shop__results-info">
              <p>
                {t("shop.showing")} <strong>{filteredProducts.length}</strong>{" "}
                {t("shop.productCount", {
                  count: filteredProducts.length,
                })}
              </p>
            </div>
          </Container>
        </section>

        {/* Products */}
        <section className="shop__products-section pt-0">
          <Container>
            <Row>
              {filteredProducts.length === 0 ? (
                <Col lg="12">
                  <div className="shop__empty-state">
                    <i className="ri-search-line"></i>
                    <h3>{t("shop.noProductsFound")}</h3>
                    <p>{t("shop.noProductsDescription")}</p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="shop__reset-btn"
                    >
                      {t("shop.clearFilters")}
                    </button>
                  </div>
                </Col>
              ) : (
                <ProductsList data={filteredProducts} />
              )}
            </Row>
          </Container>
        </section>
      </div>
    </Helmet>
  );
}
