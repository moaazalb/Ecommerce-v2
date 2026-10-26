"use client";

import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, storage, db } from "@/firebase.config";
import { signupSchema, type SignupFormValues } from "@/lib/validations/signup.schema";
import "@/styles/login.css";

/**
 * Signup page component.
 *
 * Creates a Firebase Auth user, uploads the profile image to Firebase Storage,
 * updates the user profile and stores the user document in Firestore.
 *
 * @returns {JSX.Element} The rendered Signup page.
 */
export default function Signup(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  /**
   * Handles form submission and creates the account.
   *
   * @param {SignupFormValues} data - Validated form data.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    setLoading(true);

    try {
      const { username, email, password, file } = data;
      const avatar = file[0];

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload the profile image and wait for it to finish
      const storageRef = ref(storage, `images/${Date.now()}-${username}`);
      await uploadBytes(storageRef, avatar);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the Firebase Auth profile
      await updateProfile(user, {
        displayName: username,
        photoURL: downloadURL,
      });

      // Store the user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        photoURL: downloadURL,
      });

      toast.success("Account created");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto text-center">
            <h3 className="fw-bold mb-4">Sign up</h3>

            <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Username"
                  aria-invalid={errors.username ? "true" : "false"}
                  {...register("username")}
                />
                {errors.username && (
                  <p role="alert" className="form__error">
                    {errors.username.message}
                  </p>
                )}
              </div>

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

              <div className="form__group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-invalid={errors.file ? "true" : "false"}
                  {...register("file")}
                />
                {errors.file && (
                  <p role="alert" className="form__error">
                    {errors.file.message as string}
                  </p>
                )}
              </div>

              <button type="submit" className="auth__btn" disabled={loading}>
                {loading ? "Creating account..." : "Create an Account"}
              </button>

              <p className="text__form">
                Already have an account? <Link href="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}