"use client";

import Helmet from "../Layout/Helmet";
import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "@/firebase.config";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login.schema";
import "@/styles/login.css";

/**
 * Login page component.
 *
 * Authenticates users with Firebase Authentication and redirects
 * to the checkout page on success.
 *
 * @returns {JSX.Element} The rendered Login page.
 */
export default function Login(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  /**
   * Handles form submission and signs the user in.
   *
   * @param {LoginFormValues} data - Validated form data.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Successfully logged in");
      router.push("/checkout");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Helmet title="Login">
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto text-center">
            <h3 className="fw-bold mb-4">Login</h3>

            <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                />
                {errors.email && (
                  <p role="alert" className="form__error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form__group">
                <input
                  type="password"
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
                />
                {errors.password && (
                  <p role="alert" className="form__error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" className="auth__btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text__form">
                Don&apos;t have an account? <Link href="/signup">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
    </Helmet>
  );
}