
"use client";

import { useEffect, useState, type JSX, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { auth, db } from "@/firebase.config";
import useAuth from "@/custom-hooks/useAuth/useAuth";
import userIcon from "../../../public/assets/images/user-icon.png";

import "@/styles/settings.css";

interface CloudinaryResponse {
  secure_url: string;
}

/**
 * Shared account settings component.
 *
 * Allows authenticated users and administrators to update
 * their display name and profile picture.
 *
 * @returns {JSX.Element} The rendered settings page.
 */
export default function Settings(): JSX.Element {
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
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
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
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload profile image.");
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
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      toast.error("Please log in to update your profile.");
      return;
    }

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
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

      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="settings__loading">Loading settings...</div>;
  }

  if (!currentUser) {
    return <div className="settings__loading">Please log in first.</div>;
  }

  return (
    <section className="settings">
      <div className="container">
        <div className="settings__header">
          <span className="settings__eyebrow">ACCOUNT PREFERENCES</span>
          <h1>Profile Settings</h1>
          <p>Manage your personal information and profile picture.</p>
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
                <h3>Profile Picture</h3>
                <p>JPG, PNG or WEBP. Maximum size 5 MB.</p>

                <label
                  htmlFor="profile-image"
                  className="settings__upload-btn"
                >
                  <i className="ri-camera-line" />
                  Change Photo
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
              <label htmlFor="profile-name">Full Name</label>

              <input
                id="profile-name"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Enter your name"
                maxLength={60}
                required
              />
            </div>

            <div className="settings__field">
              <label htmlFor="profile-email">Email Address</label>

              <input
                id="profile-email"
                type="email"
                value={currentUser.email || ""}
                readOnly
                disabled
              />

              <small>Email address cannot be changed here.</small>
            </div>

            <button
              type="submit"
              className="settings__save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="settings__spinner" />
                  Saving Changes...
                </>
              ) : (
                <>
                  Save Changes
                  <i className="ri-check-line" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
