"use client";

import { JSX, FormEvent, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "@/firebase.config";
import { cartActions } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store/store";
import type { Product, ProductCategory } from "@/types/product";
import { useTranslation } from "react-i18next";
import products from "../../lib/data/products";
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
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<"desc" | "rev">("desc");
  const [rating, setRating] = useState<number>(5);
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [reviewName, setReviewName] = useState<string>("");

  /**
   * Fetches the requested product from Firestore using its document ID.
   */
  useEffect(() => {
    let isMounted = true;
    /**
     * Retrieves the product document from Firestore.
     *
     * @returns {Promise<void>} A promise that resolves after fetching the product.
     */
    const fetchProduct = async (): Promise<void> => {
      try {
        setLoading(true);

        const productRef = doc(db, "products", id);
        const productSnapshot = await getDoc(productRef);

        if (!productSnapshot.exists()) {
          // If the product is not in Firestore, look for it in dummy data.
          const staticProduct = products.find(
            (item) => String(item.id) === String(id),
          );
          if (isMounted) {
            setProduct(staticProduct ?? null);
          }
          return;
        }
        const data = productSnapshot.data();
        const fetchedProduct: Product = {
          id: productSnapshot.id,
          productName: data.productName || "",
          imgUrl: data.imgUrl || "",
          category: data.category as ProductCategory,
          price: Number(data.price) || 0,
          shortDesc: data.shortDesc || "",
          description: data.description || "",
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
          avgRating: Number(data.avgRating) || 0,
        };

        if (isMounted) {
          setProduct(fetchedProduct);
        }
      } catch (error: unknown) {
        console.error("Error fetching product:", error);

        if (isMounted) {
          setProduct(null);
          toast.error(t("productDetails.errors.loadFailed"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  /**
   * Resolves a product image URL for Next.js Image.
   *
   * @param {Product["imgUrl"]} image - The product image.
   * @returns {string} The resolved image URL.
   */
  const getProductImage = (image: Product["imgUrl"]): string => {
    return typeof image === "string" ? image : image.src;
  };

  /**
   * Adds the current product to the shopping cart.
   */
  const addToCart = (): void => {
    if (!product) return;
    dispatch(
      cartActions.addItem({
        id: product.id,
        productName: product.productName,
        price: Number(product.price),
        imgUrl: getProductImage(product.imgUrl),
      }),
    );
    toast.success(t("productDetails.addedSuccessfully"));
  };

  /**
   * Handles customer review submission.
   *
   * @param {FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!reviewName.trim()) {
      toast.error(t("productDetails.errors.enterName"));
      return;
    }
    if (!reviewMsg.trim()) {
      toast.error(t("productDetails.errors.enterReview"));
      return;
    }
    toast.success(t("productDetails.reviewSubmitted"));
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
      <span
        className="product__stars"
        aria-label={t("productDetails.ratingAria", {
          rating: safeRating,
        })}
      >
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
          />
        ))}
      </span>
    );
  };

  // Display loading state while fetching the product.
  if (loading) {
    return (
      <div className="product__not-found">
        <div className="container">
          <h2>{t("productDetails.loading")}</h2>
        </div>
      </div>
    );
  }

  // Display not found message if the product does not exist.
  if (!product) {
    return (
      <div className="product__not-found">
        <div className="container">
          <i className="ri-shopping-bag-3-line"></i>
          <h2>{t("productDetails.notFound")}</h2>
          <p>{t("productDetails.notFoundDescription")}</p>
          <button onClick={() => router.push("/shop")} className="buy__btn">
            {t("productDetails.backToShop")}
          </button>
        </div>
      </div>
    );
  }

  const { imgUrl, price, avgRating, reviews, category } = product;

  const productName = t(`products.items.${product.id}.name`, {
    defaultValue: product.productName,
  });

  const shortDesc = t(`products.items.${product.id}.shortDesc`, {
    defaultValue: product.shortDesc,
  });

  const description = t(`products.items.${product.id}.description`, {
    defaultValue: product.description,
  });

  const categoryLabel = t(`shop.categories.${product.category}`, {
    defaultValue: product.category,
  });

  /**
   * Finds static products that belong to the same category,
   * excluding the current product.
   *
   * @returns Related products from the local products data.
   */
  const relatedProducts = products.filter(
    (item) => item.category === category && item.id !== product.id,
  );

  return (
    <div className="product__details-page">
      {/* Product Header */}
      <section className="product__header">
        <div className="container">
          <div className="product__breadcrumb">
            <span onClick={() => router.push("/")}>{t("common.home")}</span>
            <i className="ri-arrow-right-s-line"></i>
            <span onClick={() => router.push("/shop")}>{t("common.shop")}</span>
            <i className="ri-arrow-right-s-line"></i>
            <span className="current">{productName}</span>
          </div>

          <h1>{productName}</h1>
        </div>
      </section>

      <section className="product__main-section">
        <div className="container">
          {/* Product Image and Information */}
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
                    src={getProductImage(imgUrl)}
                    alt={productName}
                    width={600}
                    height={600}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <span className="product__category">{categoryLabel}</span>
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
                <span className="product__eyebrow">
                  {t("productDetails.eyebrow")}
                </span>

                <h2>{productName}</h2>

                <div className="product__rating">
                  {renderStars(Number(avgRating) || 0)}

                  <span className="product__rating-value">{avgRating}</span>

                  <span className="product__rating-label">
                    {t("productDetails.reviewsCount", {
                      count: reviews.length,
                    })}
                  </span>
                </div>

                <div className="product__price-wrapper">
                  <span className="product__price">${price}</span>
                  <span className="product__price-note">
                    {t("productDetails.taxNote")}
                  </span>
                </div>

                <div className="product__short-description">
                  <p>{shortDesc}</p>
                </div>

                <div className="product__details-divider"></div>

                <div className="product__features">
                  <div>
                    <i className="ri-truck-line"></i>
                    <span>{t("productDetails.features.fastShipping")}</span>
                  </div>

                  <div>
                    <i className="ri-shield-check-line"></i>
                    <span>{t("productDetails.features.secureShopping")}</span>
                  </div>

                  <div>
                    <i className="ri-refresh-line"></i>
                    <span>{t("productDetails.features.easyReturns")}</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2 }}
                  className="buy__btn product__add-btn"
                  onClick={addToCart}
                >
                  <i className="ri-shopping-cart-line"></i>
                  {t("productDetails.addToCart")}
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
                {t("productDetails.descriptionTab")}
              </button>

              <button
                type="button"
                className={tab === "rev" ? "active__tab" : ""}
                onClick={() => setTab("rev")}
              >
                {t("productDetails.reviewsTab", {
                  count: reviews.length,
                })}
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
                <h3>{t("productDetails.productDescription")}</h3>
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
                  <h3>{t("productDetails.customerReviews")}</h3>

                  {reviews.length === 0 ? (
                    <p className="review__empty">
                      {t("productDetails.noReviews")}
                    </p>
                  ) : (
                    <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="review__item">
                          <div className="review__avatar">
                            <i className="ri-user-line"></i>
                          </div>

                          <div className="review__body">
                            <h4>{t("productDetails.customer")}</h4>
                            {renderStars(Number(item.rating) || 0)}
                            <p>{item.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="review__form">
                  <h3>{t("productDetails.shareExperience")}</h3>

                  <p className="review__form-subtitle">
                    {t("productDetails.reviewSubtitle")}
                  </p>

                  <form onSubmit={submitHandler}>
                    <div className="form__group">
                      <label htmlFor="review-name">
                        {t("productDetails.yourName")}
                      </label>

                      <input
                        id="review-name"
                        type="text"
                        placeholder={t("productDetails.namePlaceholder")}
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <label>{t("productDetails.yourRating")}</label>

                      <div
                        className="rating__group"
                        role="group"
                        aria-label={t("productDetails.selectRating")}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            className={rating >= num ? "selected" : ""}
                            onClick={() => setRating(num)}
                            aria-label={t("productDetails.starsCount", {
                              count: num,
                            })}
                            aria-pressed={rating === num}
                          >
                            <i className="ri-star-s-fill"></i>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form__group">
                      <label htmlFor="review-message">
                        {t("productDetails.yourReview")}
                      </label>

                      <textarea
                        id="review-message"
                        rows={4}
                        placeholder={t("productDetails.reviewPlaceholder")}
                        value={reviewMsg}
                        onChange={(e) => setReviewMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="buy__btn review__submit">
                      {t("productDetails.submitReview")}
                      <i className="ri-send-plane-line"></i>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="related__products-section">
              <h2>{t("productDetails.relatedProducts")}</h2>

              <div className="row">
                {relatedProducts.slice(0, 4).map((item) => {
                  const relatedName = t(`products.items.${item.id}.name`, {
                    defaultValue: item.productName,
                  });

                  const relatedCategory = t(
                    `shop.categories.${item.category}`,
                    { defaultValue: item.category },
                  );

                  return (
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
                            src={getProductImage(item.imgUrl)}
                            alt={relatedName}
                            width={400}
                            height={400}
                            sizes="(max-width: 576px) 50vw, 25vw"
                          />
                        </div>

                        <div className="product__info">
                          <span className="related__category">
                            {relatedCategory}
                          </span>

                          <h3>{relatedName}</h3>

                          <div className="related__bottom">
                            <span className="price">${item.price}</span>
                            <i className="ri-arrow-right-line"></i>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
