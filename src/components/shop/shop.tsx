"use client";

import "@/styles/shop.css"
import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import ProductsList from "@/components/ui/ProductList";
import CommmonSection from "@/components/ui/CommonSection";
import products from "@/assets/data/products";
import Helmet from "../layout/Helmet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
};

export default function Shop() {
  const [productsData, setProductsData] = useState(products);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterValue = e.target.value;
    if (filterValue === "sofa") {
      const filteredProducts = products.filter((item) => item.category === "sofa");
      setProductsData(filteredProducts);
    } else if (filterValue === "mobile") {
      const filteredProducts = products.filter((item) => item.category === "mobile");
      setProductsData(filteredProducts);
    } else if (filterValue === "chair") {
      const filteredProducts = products.filter((item) => item.category === "chair");
      setProductsData(filteredProducts);
    } else if (filterValue === "wireless") {
      const filteredProducts = products.filter((item) => item.category === "wireless");
      setProductsData(filteredProducts);
    } else if (filterValue === "watch") {
      const filteredProducts = products.filter((item) => item.category === "watch");
      setProductsData(filteredProducts);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const searchedProducts = products.filter(
      (item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProductsData(searchedProducts);
  };

  return (
    <Helmet title='Shop'>     
     <CommmonSection title="products" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Filter By Category</option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="filter__widget text-end">
                <select>
                  <option>Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search...."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {productsData.length === 0 ? (
              <h1 className="text-center">No Products are found!</h1>
            ) : (
              <ProductsList data={productsData} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}