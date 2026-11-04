"use client";

import {
  useEffect,
  useState,
  type JSX,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { auth, db } from "@/firebase.config";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import userIcon from "../../../public/assets/images/user-icon.png";
import Helmet from "../layout/helmet";
import { CloudinaryResponse } from "@/types/cloudinary";
import "@/styles/settings.css";


/**
 * Shared account settings component.
 *
 * Allows authenticated users and administrators to update
 * their display name and profile picture.
 *
 * @returns {JSX.Element} The rendered settings page.
 */
export default function Settings(): JSX.Element {
  const { t } = useTranslation();
  const { currentUser, refreshUser, authLoading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setDisplayName(currentUser.displayName || "");
    setPhotoPreview(currentUser.photoURL || null);
  }, [currentUser]);

  /**
   * Handles profile image selection and preview.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - File input event.
   */
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error(t("settings.errors.invalidImage"));
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("settings.errors.imageTooLarge"));
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /**
   * Uploads the selected image to Cloudinary.
   *
   * @param {File} file - Selected profile image.
   * @returns {Promise<string>} Uploaded image URL.
   */
  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(t("settings.errors.cloudinaryConfig"));
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error(t("settings.errors.uploadFailed"));
    }
    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  };

  /**
   * Saves updated profile information to Firebase Authentication
   * and Firestore.
   *
   * @param {FormEvent<HTMLFormElement>} event - Form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error(t("settings.errors.loginRequired"));
      return;
    }
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      toast.error(t("settings.errors.emptyName"));
      return;
    }
    setLoading(true);
    try {
      let photoURL = user.photoURL || "";
      if (selectedFile) {
        photoURL = await uploadImage(selectedFile);
      }
      await updateProfile(user, {
        displayName: trimmedName,
        photoURL,
      });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: trimmedName,
        photoURL,
      });
      await refreshUser();
      setSelectedFile(null);
      toast.success(t("settings.success"));
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("settings.errors.updateFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="settings__loading">{t("settings.loading")}</div>;
  }

  if (!currentUser) {
    return (
      <div className="settings__loading">{t("settings.loginRequired")}</div>
    );
  }

  return (
    <Helmet title={t("settings.title")}>
      <section className="settings">
        <div className="container">
          <div className="settings__header">
            <span className="settings__eyebrow">{t("settings.eyebrow")}</span>
            <h1>{t("settings.title")}</h1>
            <p>{t("settings.description")}</p>
          </div>

          <div className="settings__card">
            <form onSubmit={handleSubmit}>
              <div className="settings__avatar-section">
                <div className="settings__avatar">
                  <Image
                    src={photoPreview || userIcon}
                    alt="Profile picture"
                    width={110}
                    height={110}
                    unoptimized={Boolean(photoPreview)}
                  />
                </div>

                <div className="settings__avatar-info">
                  <h3>{t("settings.profilePicture")}</h3>
                  <p>{t("settings.imageRequirements")}</p>
                  <label
                    htmlFor="profile-image"
                    className="settings__upload-btn"
                  >
                    <i className="ri-camera-line" />
                    {t("settings.changePhoto")}
                  </label>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              </div>

              <div className="settings__divider" />

              <div className="settings__field">
                <label htmlFor="profile-name"> {t("settings.fullName")}</label>

                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={t("settings.namePlaceholder")}
                  maxLength={60}
                  required
                />
              </div>

              <div className="settings__field">
                <label htmlFor="profile-email">{t("settings.email")}</label>
                <input
                  id="profile-email"
                  type="email"
                  value={currentUser.email || ""}
                  readOnly
                  disabled
                />
                <small>{t("settings.emailNote")}</small>
              </div>

              <button
                type="submit"
                className="settings__save-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="settings__spinner" />
                    {t("settings.saving")}
                  </>
                ) : (
                  <>
                    {t("settings.saveChanges")}
                    <i className="ri-check-line" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Helmet>
  );
}
