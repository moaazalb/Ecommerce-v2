"use client";

import "@/styles/checkout.css";
import Helmet from "../layout/helmet";
import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout.schema";
import type { RootState } from "@/store/store";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase.config";
import { cartActions } from "@/store/slices/cartSlice";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import { useTranslation } from "react-i18next";
import { FIELDS } from "@/lib/data/fields";

/**
 * Checkout page component for handling customer billing information and order placement.
 *
 * @returns {JSX.Element} The rendered Checkout component.
 */
export default function Checkout(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, authLoading } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalQty = useSelector((state: RootState) => state.cart.totalQuantity);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const shippingCost = 0;
  const totalCost = totalAmount + shippingCost;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  /**
   * Handles checkout form submission and saves the order to Firestore.
   *
   * @param {CheckoutFormValues} data The validated customer billing information.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: CheckoutFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      // Ensure authentication has finished loading.
      if (authLoading) {
        throw new Error("checkout.errors.authLoading");
      }
      if (!currentUser) {
        toast.error(t("checkout.errors.loginRequired"));
        router.push("/login");
        return;
      }
      if (cartItems.length === 0) {
        toast.error(t("checkout.errors.emptyCart"));
        return;
      }
      // Prepare order items.
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        productName: item.productName,
        price: Number(item.price),
        quantity: item.quantity,
        imgUrl: item.imgUrl,
      }));

      // Save the order in Firestore.
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          streetAddress: data.streetAddress,
          postalCode: data.postalCode,
          country: data.country,
        },
        items: orderItems,
        totalQuantity: totalQty,
        subtotal: Number(totalAmount),
        shippingCost,
        totalAmount: Number(totalCost),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Clear the cart only after Firestore confirms the order was saved.
      dispatch(cartActions.clearCart());
      toast.success(t("checkout.success"));
      router.push("/");
    } catch (error: unknown) {
      console.error("Failed to place order:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(
        message.startsWith("checkout.")
          ? t(message)
          : t("checkout.errors.placeOrder"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Helmet title={t("checkout.title")}>
      <main className="checkout-page">
        {/* Page Header */}
        <section className="checkout__header">
          <div className="container">
            <span className="checkout__eyebrow">{t("checkout.title")}</span>
            <h1>{t("checkout.heading")}</h1>
            <p>{t("checkout.description")}</p>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="checkout__section">
          <div className="container">
            {totalQty === 0 ? (
              <div className="checkout__empty">
                <div className="checkout__empty-icon">
                  <i className="ri-shopping-cart-line" />
                </div>

                <h2>{t("checkout.emptyTitle")}</h2>
                <p>{t("checkout.emptyDescription")}</p>
                <button
                  type="button"
                  className="checkout__back-btn"
                  onClick={() => router.push("/shop")}
                >
                  <i className="ri-arrow-left-line" />
                  {t("checkout.backToShop")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-4">
                  {/* Billing Information */}
                  <div className="col-lg-8">
                    <div className="checkout__form-card">
                      <div className="checkout__card-header">
                        <div className="checkout__header-icon">
                          <i className="ri-user-3-line" />
                        </div>

                        <div>
                          <h2>{t("checkout.billingTitle")}</h2>
                          <p>{t("checkout.billingDescription")}</p>
                        </div>
                      </div>

                      <div className="checkout__form-grid">
                        {FIELDS.map((field) => {
                          const error = errors[field.name];

                          return (
                            <div
                              className="checkout__form-group"
                              key={field.name}
                            >
                              <label htmlFor={field.name}>
                                {t(field.label)}
                                <span>*</span>
                              </label>

                              <input
                                id={field.name}
                                type={field.type}
                                placeholder={t(field.placeholder)}
                                className={
                                  error
                                    ? "checkout__input checkout__input--error"
                                    : "checkout__input"
                                }
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={
                                  error ? `${field.name}-error` : undefined
                                }
                                {...register(field.name)}
                              />

                              {error && (
                                <p
                                  id={`${field.name}-error`}
                                  role="alert"
                                  className="checkout__error"
                                >
                                  {error.message as string}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="checkout__form-note">
                        <i className="ri-information-line" />
                        {t("checkout.formNote")}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="col-lg-4">
                    <div className="checkout__summary">
                      <div className="checkout__summary-header">
                        <h2>{t("checkout.orderSummary")}</h2>
                        <i className="ri-file-list-3-line" />
                      </div>

                      <div className="checkout__summary-items">
                        <div className="checkout__summary-row">
                          <span>{t("checkout.items")}</span>
                          <strong>{totalQty}</strong>
                        </div>

                        <div className="checkout__summary-row">
                          <span>{t("checkout.subtotal")}</span>
                          <strong>${Number(totalAmount).toFixed(2)}</strong>
                        </div>

                        <div className="checkout__summary-row">
                          <span>{t("checkout.shipping")}</span>
                          <strong className="checkout__free-shipping">
                            {t("checkout.free")}
                          </strong>
                        </div>
                      </div>

                      <div className="checkout__summary-divider" />

                      <div className="checkout__total">
                        <span>{t("checkout.totalCost")}</span>
                        <strong>${Number(totalCost).toFixed(2)}</strong>
                      </div>

                      <p className="checkout__summary-note">
                        {t("checkout.summaryNote")}
                      </p>

                      <button
                        type="submit"
                        className="checkout__submit-btn"
                        disabled={!isValid || isSubmitting || authLoading}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="checkout__spinner" />
                            {t("checkout.placingOrder")}
                          </>
                        ) : (
                          <>
                            {t("checkout.placeOrder")}
                            <i className="ri-arrow-right-line" />
                          </>
                        )}
                      </button>

                      <div className="checkout__secure-note">
                        <i className="ri-shield-check-line" />
                        {t("checkout.secureNote")}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </Helmet>
  );
}
