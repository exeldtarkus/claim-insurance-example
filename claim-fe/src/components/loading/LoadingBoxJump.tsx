"use client";

import React from "react";
import Lottie from "lottie-react";
import useLottieAnimation from "@/hooks/useLottieAnimation";

const LoadingBoxJump = () => {
  const animationData = useLottieAnimation("loading/Animation-loading-box-jump.json");

  if (!animationData) return null;

  return (
    <div className="w-40 h-40 mx-auto">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
};

export default LoadingBoxJump;
