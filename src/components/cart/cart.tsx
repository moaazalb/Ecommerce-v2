"use client";

import Helmet from "../Layout/Helmet";
import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store";
import type { CartItem } from "@/models/cart";
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

  const handleDeleteProduct = (): void => {
    dispatch(cartActions.deleteItem(item.id));
  };

  return (
    <tr>
      <td>
        <Image
          src={item.imgUrl}
          alt={item.productName || "Cart item"}
          width={80}
          height={80}
        />
      </td>
      <td>{item.productName}</td>
      <td>${item.price}</td>
      <td>{item.quantity}px</td>
      <td>
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={handleDeleteProduct}
          className="ri-delete-bin-line"
          role="button"
          aria-label={`Delete ${item.productName} from cart`}
        ></motion.i>
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
      <div className="bg-light py-4">
        <div className="container">
          <h1 className="fs-2 fw-semibold m-0">Shopping Cart</h1>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart</h2>
              ) : (
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="col-lg-3">
              <h6 className="d-flex align-items-center justify-content-between">
                Subtotal
                <span className="fs-4 fw-bold">${totalAmount}</span>
              </h6>
              <p className="fs-6 mt-2">Taxes and shipping will calculate in checkout</p>
              <div className="mt-4">
                <Link href="/shop" className="btn btn-dark w-100 mb-3">
                  Continue Shopping
                </Link>
                <Link href="/checkout" className="btn btn-outline-dark w-100">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Helmet>
  );
}