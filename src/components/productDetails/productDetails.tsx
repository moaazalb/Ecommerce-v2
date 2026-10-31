"use client";

import { JSX, FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import products from "@/assets/data/products";
import "@/styles/productId.css";

/**
 * ProductDetails component.
 *
 * Displays product information, ratings, descriptions, customer reviews,
 * related products, and allows customers to add products to their cart.
 *
 * @returns {JSX.Element} The rendered product details page.
 */
export default function ProductDetails(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const product = products.find((item) => String(item.id) === String(id));

  const [tab, setTab] = useState<"desc" | "rev">("desc");
  const [rating, setRating] = useState<number>(5);
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [reviewName, setReviewName] = useState<string>("");

  if (!product) {
    return (
      <div className="product__not-found">
        <div className="container">
          <i className="ri-shopping-bag-3-line"></i>
          <h2>Product not found!</h2>
          <p>The product you're looking for may have been removed or is unavailable.</p>
          <button
            onClick={() => router.push("/shop")}
            className="buy__btn"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const {
    imgUrl,
    productName,
    price,
    avgRating,
    reviews,
    shortDesc,
    description,
    category,
  } = product;

  /**
   * Finds products that belong to the same category, excluding the current product.
   *
   * @returns Related products from the same category.
   */
  const relatedProducts = products.filter(
    (item) => item.category === category && item.id !== product.id
  );

  /**
   * Adds the current product to the shopping cart.
   */
  const addToCart = (): void => {
    dispatch(
      cartActions.addItem({
        id: product.id,
        productName: product.productName,
        price: product.price,
        imgUrl: product.imgUrl,
      })
    );

    toast.success("Product added successfully");
  };

  /**
   * Handles customer review submission.
   *
   * @param {FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!reviewName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!reviewMsg.trim()) {
      toast.error("Please enter a review message.");
      return;
    }

    toast.success("Review submitted successfully!");

    setReviewName("");
    setReviewMsg("");
    setRating(5);
  };

  /**
   * Renders rating stars based on the provided rating value.
   *
   * @param {number} value - Rating value between 0 and 5.
   * @returns {JSX.Element} The rendered rating stars.
   */
  const renderStars = (value: number): JSX.Element => {
    const safeRating = Math.max(0, Math.min(5, value));

    return (
      <span className="product__stars" aria-label={`${safeRating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={
              safeRating >= star
                ? "ri-star-s-fill"
                : safeRating >= star - 0.5
                  ? "ri-star-half-s-line"
                  : "ri-star-s-line"
            }
            aria-hidden="true"
          ></i>
        ))}
      </span>
    );
  };

  return (
    <div className="product__details-page">
      {/* Product Header */}
      <section className="product__header">
        <div className="container">
          <div className="product__breadcrumb">
            <span onClick={() => router.push("/")}>Home</span>
            <i className="ri-arrow-right-s-line"></i>
            <span onClick={() => router.push("/shop")}>Shop</span>
            <i className="ri-arrow-right-s-line"></i>
            <span className="current">{productName}</span>
          </div>

          <h1>{productName}</h1>
        </div>
      </section>

      <section className="product__main-section">
        <div className="container">
          <div className="row product__main-wrapper">
            {/* Product Image */}
            <div className="col-lg-6 col-md-6">
              <motion.div
                className="product__image-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="product__image">
                  <Image
                    src={imgUrl}
                    alt={productName}
                    width={600}
                    height={600}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <span className="product__category">{category}</span>
              </motion.div>
            </div>

            {/* Product Information */}
            <div className="col-lg-6 col-md-6">
              <motion.div
                className="product__details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="product__eyebrow">Product Details</span>

                <h2>{productName}</h2>

                <div className="product__rating">
                  {renderStars(Number(avgRating) || 0)}

                  <span className="product__rating-value">
                    {avgRating}
                  </span>

                  <span className="product__rating-label">
                    ({reviews.length} reviews)
                  </span>
                </div>

                <div className="product__price-wrapper">
                  <span className="product__price">${price}</span>
                  <span className="product__price-note">
                    Tax included where applicable
                  </span>
                </div>

                <div className="product__short-description">
                  <p>{shortDesc}</p>
                </div>

                <div className="product__details-divider"></div>

                <div className="product__features">
                  <div>
                    <i className="ri-truck-line"></i>
                    <span>Fast Shipping</span>
                  </div>

                  <div>
                    <i className="ri-shield-check-line"></i>
                    <span>Secure Shopping</span>
                  </div>

                  <div>
                    <i className="ri-refresh-line"></i>
                    <span>Easy Returns</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2 }}
                  className="buy__btn product__add-btn"
                  onClick={addToCart}
                >
                  <i className="ri-shopping-cart-line"></i>
                  Add to Cart
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Description and Reviews */}
          <div className="product__tabs-section">
            <div className="product__tabs">
              <button
                type="button"
                className={tab === "desc" ? "active__tab" : ""}
                onClick={() => setTab("desc")}
              >
                Description
              </button>

              <button
                type="button"
                className={tab === "rev" ? "active__tab" : ""}
                onClick={() => setTab("rev")}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {tab === "desc" ? (
              <motion.div
                key="description"
                className="tab__content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3>Product Description</h3>
                <p>{description}</p>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                className="product__review"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="review__list">
                  <h3>Customer Reviews</h3>

                  {reviews.length === 0 ? (
                    <p className="review__empty">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="review__item">
                          <div className="review__avatar">
                            <i className="ri-user-line"></i>
                          </div>

                          <div className="review__body">
                            <h4>Customer</h4>
                            {renderStars(Number(item.rating) || 0)}
                            <p>{item.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="review__form">
                  <h3>Share Your Experience</h3>
                  <p className="review__form-subtitle">
                    Your feedback helps other customers make better decisions.
                  </p>

                  <form onSubmit={submitHandler}>
                    <div className="form__group">
                      <label htmlFor="review-name">Your Name</label>
                      <input
                        id="review-name"
                        type="text"
                        placeholder="Enter your name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <label>Your Rating</label>

                      <div
                        className="rating__group"
                        role="group"
                        aria-label="Select your rating"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            className={rating >= num ? "selected" : ""}
                            onClick={() => setRating(num)}
                            aria-label={`${num} stars`}
                            aria-pressed={rating === num}
                          >
                            <i className="ri-star-s-fill"></i>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form__group">
                      <label htmlFor="review-message">Your Review</label>
                      <textarea
                        id="review-message"
                        rows={4}
                        placeholder="Write your review here..."
                        value={reviewMsg}
                        onChange={(e) => setReviewMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="buy__btn review__submit">
                      Submit Review
                      <i className="ri-send-plane-line"></i>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related__section">
              <div className="related__heading">
                <span>You May Also Like</span>
                <h2>Related Products</h2>
              </div>

              <div className="row">
                {relatedProducts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="product__item"
                      onClick={() => router.push(`/shop/${item.id}`)}
                    >
                      <div className="related__image">
                        <Image
                          src={item.imgUrl}
                          alt={item.productName}
                          width={400}
                          height={400}
                          sizes="(max-width: 576px) 50vw, 25vw"
                        />
                      </div>

                      <div className="product__info">
                        <span className="related__category">
                          {item.category}
                        </span>

                        <h3>{item.productName}</h3>

                        <div className="related__bottom">
                          <span className="price">${item.price}</span>
                          <i className="ri-arrow-right-line"></i>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}