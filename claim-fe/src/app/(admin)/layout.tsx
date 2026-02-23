"use client";

import React, { FC, ReactNode, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useUserData } from "@/hooks/useUserData";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useModal } from "@/hooks/useModal";
import ModalChangeDefaultPassword from "@/components/ui/modal/ChangeDefaultPasswordModal";
import LoadingBoxJump from "@/components/loading/LoadingBoxJump";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const userData = useUserData();
  const infoModal = useModal();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  useEffect(() => {
    if (userData?.useDefaultPassword) {
      infoModal.openModal();
    }
  }, [userData?.useDefaultPassword, infoModal]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingBoxJump />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader user={userData} />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>

      <ModalChangeDefaultPassword
        username={userData.username}
        isOpen={infoModal.isOpen}
        onClose={infoModal.closeModal}
      />
    </>
  );
};

export default AdminLayout;
