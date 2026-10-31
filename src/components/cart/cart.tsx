
"use client";

import Helmet from "../layout/helmet";
import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import type { RootState } from "@/store/store";
import type { CartItem } from "@/types/cart";
import "@/styles/cart.css";

/**
 * Tr component representing a table row for a cart item.
 *
 * @param {Object} props - Component props.
 * @param {CartItem} props.item - The cart item object.
 * @returns {JSX.Element} The rendered table row.
 */
function Tr({ item }: { item: CartItem }): JSX.Element {
  const dispatch = useDispatch();

  /**
   * Removes the selected product from the shopping cart.
   */
  const handleDeleteProduct = (): void => {
    dispatch(cartActions.deleteItem(item.id));
  };

  return (
    <tr>
      <td>
        <div className="cart__product-image">
          <Image
            src={item.imgUrl}
            alt={item.productName || "Cart item"}
            width={90}
            height={90}
          />
        </div>
      </td>

      <td>
        <span className="cart__product-name">
          {item.productName}
        </span>
      </td>

      <td>
        <span className="cart__product-price">
          ${Number(item.price).toFixed(2)}
        </span>
      </td>

      <td>
        <span className="cart__quantity">
          {item.quantity}
        </span>
      </td>

      <td>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleDeleteProduct}
          className="cart__delete-btn"
          aria-label={`Delete ${item.productName} from cart`}
        >
          <i className="ri-delete-bin-line" aria-hidden="true" />
        </motion.button>
      </td>
    </tr>
  );
}

/**
 * Cart page component for viewing and managing items in the shopping cart.
 *
 * @returns {JSX.Element} The rendered Cart page.
 */
export default function Cart(): JSX.Element {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  return (
    <Helmet title="Cart">
      <main className="cart-page">
        {/* Page Header */}
        <section className="cart__header">
          <div className="container">
            <span className="cart__eyebrow">YOUR SHOPPING BAG</span>
            <h1>Shopping Cart</h1>
            <p>
              Review your selected products before proceeding to checkout.
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="cart__section">
          <div className="container">
            {cartItems.length === 0 ? (
              <div className="cart__empty">
                <div className="cart__empty-icon">
                  <i className="ri-shopping-bag-3-line" />
                </div>

                <h2>Your cart is empty</h2>

                <p>
                  Looks like you haven't added anything to your cart yet.
                  Explore our collection and find something you love.
                </p>

                <Link href="/shop" className="cart__shop-btn">
                  <i className="ri-shopping-bag-line" />
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {/* Products Table */}
                <div className="col-lg-8">
                  <div className="cart__card">
                    <div className="cart__card-header">
                      <div>
                        <h2>Your Items</h2>
                        <p>
                          {cartItems.length}{" "}
                          {cartItems.length === 1 ? "product" : "products"} in
                          your cart
                        </p>
                      </div>

                      <span className="cart__items-count">
                        {cartItems.length}
                      </span>
                    </div>

                    <div className="cart__table-wrapper">
                      <table className="table cart__table align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Qty</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cartItems.map((item) => (
                            <Tr item={item} key={item.id} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                  <div className="cart__summary">
                    <div className="cart__summary-header">
                      <h2>Order Summary</h2>
                      <i className="ri-file-list-3-line" />
                    </div>

                    <div className="cart__summary-row">
                      <span>Subtotal</span>
                      <strong>${Number(totalAmount).toFixed(2)}</strong>
                    </div>

                    <div className="cart__summary-row">
                      <span>Shipping</span>
                      <span className="cart__shipping-label">
                        Calculated at checkout
                      </span>
                    </div>

                    <div className="cart__summary-divider" />

                    <div className="cart__summary-total">
                      <span>Total</span>
                      <strong>${Number(totalAmount).toFixed(2)}</strong>
                    </div>

                    <p className="cart__summary-note">
                      Taxes and shipping costs will be calculated during
                      checkout.
                    </p>

                    <Link href="/checkout" className="cart__checkout-btn">
                      Proceed to Checkout
                      <i className="ri-arrow-right-line" />
                    </Link>

                    <Link href="/shop" className="cart__continue-btn">
                      <i className="ri-arrow-left-line" />
                      Continue Shopping
                    </Link>

                    <div className="cart__secure-note">
                      <i className="ri-shield-check-line" />
                      Secure checkout experience
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </Helmet>
  );
}
