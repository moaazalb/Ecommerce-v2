"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import products from "@/assets/data/products";
import "@/styles/productId.css";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const product = products.find((item) => item.id === id);

  const [tab, setTab] = useState<"desc" | "rev">("desc");
  const [rating, setRating] = useState<number>(5);
  const [reviewMsg, setReviewMsg] = useState<string>("");

  if (!product) {
    return (
      <div className="product__not-found">
        <h2>Product not found!</h2>
        <button onClick={() => router.push("/shop")} className="buy__btn">
          Back to Shop
        </button>
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

  const relatedProducts = products.filter(
    (item) => item.category === category && item.id !== id
  );

  const addToCart = () => {
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

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMsg.trim()) {
      toast.error("Please enter a review message.");
      return;
    }
    toast.success("Review submitted successfully!");
    setReviewMsg("");
  };

  return (
    <div className="product__details-page">
      <section className="common__section">
        <div className="container">
          <h2>{productName}</h2>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row product__main-wrapper">
            <div className="col-lg-6 col-md-6">
              <div className="product__img">
                <Image src={imgUrl} alt={productName} priority />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="product__details">
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-half-s-line"></i></span>
                  </div>
                  <p>
                    (<span>{avgRating}</span> ratings)
                  </p>
                </div>

                <span className="product__price">${price}</span>
                <p className="mt-3">{shortDesc}</p>

                <motion.button
                  whileTap={{ scale: 1.1 }}
                  className="buy__btn mt-4"
                  onClick={addToCart}
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews ({reviews.length})
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-4">
                  <p>{description}</p>
                </div>
              ) : (
                <div className="product__review mt-4">
                  <div className="review__wrapper">
                    <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>Jhon Doe</h6>
                          <span>{item.rating} ( rating)</span>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter name"
                            required
                          />
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span key={num} onClick={() => setRating(num)}>
                              {num} <i className="ri-star-s-fill"></i>
                            </span>
                          ))}
                        </div>

                        <div className="form__group">
                          <textarea
                            rows={4}
                            placeholder="Review Message..."
                            value={reviewMsg}
                            onChange={(e) => setReviewMsg(e.target.value)}
                          />
                        </div>

                        <button type="submit" className="buy__btn">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="row mt-5">
              <div className="col-lg-12 mb-5">
                <h2 className="related__title">You might also like</h2>
              </div>
              {relatedProducts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  onClick={() => router.push(`/shop/${item.id}`)}
                >
                  <div className="product__item cursor-pointer">
                    <div className="product__img">
                      <Image src={item.imgUrl} alt={item.productName} />
                    </div>
                    <div className="p-2 product__info">
                      <h3 className="product__name">
                        <span className="text-dark">{item.productName}</span>
                      </h3>
                      <span className="text-center d-block text-muted">
                        {item.category}
                      </span>
                    </div>
                    <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
                      <span className="price">${item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}