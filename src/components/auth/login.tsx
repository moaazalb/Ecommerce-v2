"use client";

import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword,  getIdTokenResult } from "firebase/auth";
import { toast } from "react-toastify";

import Helmet from "../layout/helmet";
import { auth } from "@/firebase.config";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/login.schema";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import { cartActions } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store/store";
import type { CartItem } from "@/types/cart";
import "@/styles/login.css";

/**
 * Login page component.
 *
 * Provides an accessible login form using React Hook Form and Zod
 * for validation, and Firebase Authentication for user sign-in.
 *
 * Supports password visibility toggling and loading feedback.
 *
 * @returns {JSX.Element} The rendered Login page.
 */
export default function Login(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  
  /**
   * Handles login form submission and authenticates the user
   * using Firebase Authentication.
   *
   * Restores the user's saved shopping cart from Firestore
   * after successful authentication.
   *
   * @param {LoginFormValues} data - Validated login form data.
   * @returns {Promise<void>} A promise that resolves when authentication completes.
   */
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userId = userCredential.user.uid;

      // Retrieve the user's saved cart.
      const cartRef = doc(db, "carts", userId);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const savedItems = cartSnapshot.data().cartItems;

        dispatch(
          cartActions.setCart(
            Array.isArray(savedItems) ? (savedItems as CartItem[]) : []
          )
        );
      } else {
        dispatch(cartActions.setCart([]));
      }

      toast.success("Successfully logged in");
      const tokenResult = await getIdTokenResult(
        userCredential.user,
        true
      );

      const isAdmin = tokenResult.claims.admin === true;

      if (isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/shop");
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to log in."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <Helmet title="Login">
      <section className="auth__section">
        <div className="container">
          <div className="auth__layout">

            {/* Login introduction */}
            <div className="auth__intro">
              <span className="auth__eyebrow">
                WELCOME BACK
              </span>

              <h1>
                Good to see
                <br />
                you <span>again.</span>
              </h1>

              <p>
                Sign in to your account and continue discovering
                products you'll love. Your next favorite find is
                just a few clicks away.
              </p>

              <div className="auth__intro-footer">
                <span className="auth__intro-line" />
                <span>Simple shopping. Timeless style.</span>
              </div>
            </div>

            {/* Login form */}
            <div className="auth__card">
              <div className="auth__card-header">
                <span className="auth__card-icon">
                  <i className="ri-user-line" />
                </span>

                <h2>Welcome back</h2>

                <p>Enter your details to access your account.</p>
              </div>

              <form
                className="auth__form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Email */}
                <div className="auth__field">
                  <label htmlFor="login-email">
                    Email address
                  </label>

                  <div
                    className={`auth__input-wrapper ${
                      errors.email ? "has-error" : ""
                    }`}
                  >
                    <i className="ri-mail-line auth__input-icon" />

                    <input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "login-email-error" : undefined
                      }
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="login-email-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="auth__field">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <div
                    className={`auth__input-wrapper ${
                      errors.password ? "has-error" : ""
                    }`}
                  >
                    <i className="ri-lock-line auth__input-icon" />

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={
                        errors.password
                          ? "login-password-error"
                          : undefined
                      }
                      {...register("password")}
                    />

                    <button
                      type="button"
                      className="auth__password-toggle"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <i
                        className={
                          showPassword
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        }
                      />
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="login-password-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="auth__btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="auth__spinner"
                        aria-hidden="true"
                      />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <i className="ri-arrow-right-line" />
                    </>
                  )}
                </button>

                {/* Register link */}
                <p className="auth__switch">
                  Don't have an account?
                  <Link href="/signup">Create an account</Link>
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>
    </Helmet>
  );
}
