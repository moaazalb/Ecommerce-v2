"use client";

import Helmet from "../layout/helmet";
import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "@/firebase.config";
import {
  createSignupSchema,
  type SignupFormValues,
} from "@/lib/validations/signup.schema";
import { useTranslation } from "react-i18next";
import "@/styles/signup.css";

/**
 * Signup page component.
 *
 * Creates a Firebase Auth user, uploads the profile image to Firebase Storage,
 * updates the user profile and stores the user document in Firestore.
 *
 * Supports password visibility toggling, profile image selection,
 * form validation and loading feedback.
 *
 * @returns {JSX.Element} The rendered Signup page.
 */
export default function Signup(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const signupSchema = createSignupSchema(t);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });
  const selectedFile = watch("file")?.[0];

  /**
   * Handles form submission and creates a new user account.
   *
   * Creates the Firebase Authentication user, uploads the profile image
   * to Firebase Storage, updates the authentication profile and saves
   * the user information in Firestore.
   *
   * @param {SignupFormValues} data - Validated signup form data.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    setLoading(true);

    try {
      const { username, email, password, file } = data;
      const avatar = file[0];

      // Upload profile image to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", avatar);
      cloudinaryFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(t("signup.errors.imageUploadFailed"));
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const downloadURL: string = cloudinaryData.secure_url;
      // Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: username,
        photoURL: downloadURL,
      });
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        photoURL: downloadURL,
      });
      toast.success(t("signup.success"));
      router.push("/login");
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      toast.error(t("signup.errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Helmet title={t("signup.title")}>
      <section className="auth__section signup__section">
        <div className="container">
          <div className="auth__layout signup__layout">
            {/* Signup introduction */}
            <div className="auth__intro signup__intro">
              <span className="auth__eyebrow">{t("signup.eyebrow")}</span>
              <h1>
                {t("signup.introTitle")}
                <br />
                {t("signup.introSubtitle")} <span>{t("signup.story")}</span>
              </h1>
              <p>{t("signup.introDescription")}</p>

              <div className="auth__intro-footer">
                <span className="auth__intro-line" />
                <span>{t("signup.tagline")}</span>
              </div>
            </div>

            {/* Signup form */}
            <div className="auth__card signup__card">
              <div className="auth__card-header">
                <span className="auth__card-icon">
                  <i className="ri-user-add-line" />
                </span>
                <h2>{t("signup.heading")}</h2>
                <p>{t("signup.formDescription")}</p>
              </div>

              <form
                className="auth__form signup__form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Username */}
                <div className="auth__field">
                  <label htmlFor="signup-username">
                    {t("signup.fields.username")}
                  </label>
                  <div
                    className={`auth__input-wrapper ${
                      errors.username ? "has-error" : ""
                    }`}
                  >
                    <i className="ri-user-line auth__input-icon" />
                    <input
                      id="signup-username"
                      type="text"
                      placeholder={t("signup.placeholders.username")}
                      autoComplete="username"
                      aria-invalid={errors.username ? "true" : "false"}
                      aria-describedby={
                        errors.username ? "signup-username-error" : undefined
                      }
                      {...register("username")}
                    />
                  </div>

                  {errors.username && (
                    <p
                      id="signup-username-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="auth__field">
                  <label htmlFor="signup-email">
                    {t("signup.fields.email")}
                  </label>

                  <div
                    className={`auth__input-wrapper ${
                      errors.email ? "has-error" : ""
                    }`}
                  >
                    <i className="ri-mail-line auth__input-icon" />

                    <input
                      id="signup-email"
                      type="email"
                      placeholder={t("signup.placeholders.email")}
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "signup-email-error" : undefined
                      }
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="signup-email-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="auth__field">
                  <label htmlFor="signup-password">
                    {t("signup.fields.password")}
                  </label>

                  <div
                    className={`auth__input-wrapper ${
                      errors.password ? "has-error" : ""
                    }`}
                  >
                    <i className="ri-lock-line auth__input-icon" />

                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("signup.placeholders.password")}
                      autoComplete="new-password"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={
                        errors.password ? "signup-password-error" : undefined
                      }
                      {...register("password")}
                    />

                    <button
                      type="button"
                      className="auth__password-toggle"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword
                          ? t("signup.hidePassword")
                          : t("signup.showPassword")
                      }
                    >
                      <i
                        className={
                          showPassword ? "ri-eye-off-line" : "ri-eye-line"
                        }
                      />
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="signup-password-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Profile Image */}
                <div className="auth__field signup__upload-field">
                  <label htmlFor="signup-avatar">
                    {t("signup.fields.profilePicture")}
                  </label>

                  <div
                    className={`signup__upload ${
                      errors.file ? "has-error" : ""
                    }`}
                  >
                    <span className="signup__upload-icon">
                      <i className="ri-image-add-line" />
                    </span>

                    <div className="signup__upload-content">
                      <label htmlFor="signup-avatar">
                        {selectedFile
                          ? t("signup.changeProfilePicture")
                          : t("signup.chooseProfilePicture")}
                      </label>

                      <span>
                        {selectedFile
                          ? selectedFile.name
                          : t("signup.imageFormats")}
                      </span>
                    </div>

                    <i className="ri-upload-2-line signup__upload-action" />

                    <input
                      id="signup-avatar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-invalid={errors.file ? "true" : "false"}
                      aria-describedby={
                        errors.file ? "signup-avatar-error" : undefined
                      }
                      {...register("file")}
                    />
                  </div>

                  {errors.file && (
                    <p
                      id="signup-avatar-error"
                      className="form__error"
                      role="alert"
                    >
                      {errors.file.message as string}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="auth__btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="auth__spinner" aria-hidden="true" />
                      {t("signup.creatingAccount")}
                    </>
                  ) : (
                    <>
                      {t("signup.submit")}
                      <i className="ri-arrow-right-line" />
                    </>
                  )}
                </button>

                {/* Login link */}
                <p className="auth__switch">
                  {t("signup.haveAccount")}
                  <Link href="/login">{t("signup.login")}</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Helmet>
  );
}
