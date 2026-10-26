"use client";

import "@/styles/checkout.css";
import Helmet from "../Layout/Helmet";
import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout.schema";
import type { RootState } from "@/redux/store";

interface FieldConfig {
  name: Path<CheckoutFormValues>;
  label: string;
  type: string;
  placeholder: string;
}

const FIELDS: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
  { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Phone number" },
  { name: "streetAddress", label: "Street Address", type: "text", placeholder: "Street address" },
  { name: "postalCode", label: "Postal Code", type: "text", placeholder: "Postal code" },
  { name: "country", label: "Country", type: "text", placeholder: "Country" },
];

/**
 * Checkout page component for handling customer billing information and order placement.
 *
 * @returns {JSX.Element} The rendered Checkout component.
 */
export default function Checkout(): JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: CheckoutFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Order placed:", data);
      toast.success("Order placed successfully!");
      router.push("/home");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Helmet title="Checkout">
      <div className="bg-light py-4">
        <div className="container">
          <h1 className="fs-2 fw-semibold m-0">Checkout</h1>
        </div>
      </div>

      <section>
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row">
              <div className="col-lg-8 mb-4">
                <h6 className="mb-4 fw-bold">Billing Information</h6>

                <div className="billing__form">
                  {FIELDS.map((field) => {
                    const error = errors[field.name];
                    return (
                      <div className="form__group mb-3" key={field.name}>
                        <label htmlFor={field.name} className="form-label">
                          {field.label} <span className="text-danger">*</span>
                        </label>
                        <input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="rounded p-2"
                          style={error ? { borderColor: "#dc3545" } : undefined}
                          aria-invalid={error ? "true" : "false"}
                          aria-describedby={error ? `${field.name}-error` : undefined}
                          {...register(field.name)}
                        />
                        {error && (
                          <p id={`${field.name}-error`} role="alert" className="text-danger small mt-1">
                            {error.message as string}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="checkout__cart">
                  <h6>
                    Total Qty: <span>{totalQty} items</span>
                  </h6>
                  <h6>
                    Subtotal: <span>${totalAmount}</span>
                  </h6>
                  <h6>
                    <span>
                      Shipping: <br />
                      Free shipping
                    </span>
                    <span>${shippingCost}</span>
                  </h6>
                  <h4>
                    Total Cost: <span>${totalCost}</span>
                  </h4>
                  <button
                    type="submit"
                    className="auth__btn w-100"
                    disabled={!isValid || isSubmitting}
                    style={!isValid || isSubmitting ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
                  >
                    {isSubmitting ? "Placing Order..." : "Place an order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Helmet>
  );
}