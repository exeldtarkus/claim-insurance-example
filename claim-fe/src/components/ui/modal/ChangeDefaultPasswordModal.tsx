/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Auth from "@/services/auth";
import { useRouter } from "next/navigation";

interface ModalChangeDefaultPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const ModalChangeDefaultPassword: React.FC<ModalChangeDefaultPasswordProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Password fields cannot be empty.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const response = await Auth.updatePassword({
      username,
      password: "password-default",
      newPassword,
    });

    if (response.errorMessage) {
      setError(response.errorMessage);
      setIsSubmitting(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    onClose();

    setIsSubmitting(false);
    const success = await Auth.logout();
    if (success) {
      router.push("/signin");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg"
      showCloseButton={false}
      disableBackdropClick={true}
      disableEscClose={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Change Password
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-blue-100 mb-6">
            Please enter your new password and confirm it.
          </p>

          {/* New Password Input */}
          <div className="text-left mb-4 relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setError("Passwords do not match.");
                } else {
                  setError("");
                }
              }}
              className="w-full px-4 py-2 pr-10 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer z-30"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
              )}
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="text-left mb-4 relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);
                if (newPassword && value && newPassword !== value) {
                  setError("Passwords do not match.");
                } else {
                  setError("");
                }
              }}
              className="w-full px-4 py-2 pr-10 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter new password"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer z-30"
            >
              {showConfirmPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
              )}
            </span>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 mt-1 mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-3 text-sm font-medium text-white rounded-lg transition ${
                isSubmitting
                  ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Password"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalChangeDefaultPassword;
