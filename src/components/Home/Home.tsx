"use client";

import "@/styles/home.css";
import Helmet from "../Layout/Helmet";
import { useMemo, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Services from "@/components/services/services";
import ProductsList from "@/components/UI/productList";
import Clock from "@/components/UI/clock";
import productsData from "@/assets/data/products";
import heroImg from "@/assets/images/hero-img.png";
import counterImg from "@/assets/images/counter-timer-img.png";

/**
 * Home page component showcasing trending products, best sales, limited offers, and categories.
 *
 * @returns {JSX.Element} The rendered Home page.
 */
export default function Home(): JSX.Element {
  const year = new Date().getFullYear();

  const trendingProducts = useMemo(() => productsData.filter((p) => p.category === "chair"), []);
  const bestSalesProducts = useMemo(() => productsData.filter((p) => p.category === "sofa"), []);
  const mobileProducts = useMemo(() => productsData.filter((p) => p.category === "mobile"), []);
  const wirelessProducts = useMemo(() => productsData.filter((p) => p.category === "wireless"), []);
  const popularProducts = useMemo(() => productsData.filter((p) => p.category === "watch"), []);

  return (
    <Helmet title="Home">
      <section className="hero__section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="hero__content">
                <p className="hero__subtitle">Trending Product in {year}</p>
                <h2>Make Your Interior More Minimalistic &amp; Modern</h2>
                <p>
                  Discover curated home essentials designed to bring effortless elegance, clean lines, and functional comfort into your living space. Transform your environment into a calm, contemporary sanctuary.
                </p>
                <motion.div whileTap={{ scale: 1.1 }} className="buy__btn d-inline-block">
                  <Link href="/shop">SHOP NOW</Link>
                </motion.div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="hero__img">
                <Image src={heroImg} alt="Hero interior furniture" priority style={{ height: "auto" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services />

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="section__title">Trending Products</h2>
            </div>
            <ProductsList data={trendingProducts} />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="section__title">Best Sales</h2>
            </div>
            <ProductsList data={bestSalesProducts} />
          </div>
        </div>
      </section>

      <section className="timer__count">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 counter__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offers</h4>
                <h3 className="text-white fs-5 mb-3">Quality Armchair</h3>
              </div>
              <Clock />
              <motion.div
                whileTap={{ scale: 1.1 }}
                className="buy__btn store__btn d-inline-block"
              >
                <Link href="/shop">Visit Store</Link>
              </motion.div>
            </div>

            <div className="col-lg-6 col-md-12 text-end counter__img">
              <Image src={counterImg} alt="Limited offer armchair" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="section__title">New Arrivals</h2>
            </div>
            <ProductsList data={mobileProducts} />
            <ProductsList data={wirelessProducts} />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="section__title">Popular in Category</h2>
            </div>
            <ProductsList data={popularProducts} />
          </div>
        </div>
      </section>
    </Helmet>
  );
}