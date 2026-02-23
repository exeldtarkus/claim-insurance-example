"use client";

import Lottie from "lottie-react";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import { useRouter } from "next/navigation";
import { ThemeToggleButton } from "../common/ThemeToggleButton";

const Lamp404 = () => {
  const animationData = useLottieAnimation("404/Animation-404-lamp.json");
  const router = useRouter();

  if (!animationData) return null;

  return (
    <div
      onClick={() => router.push("/")}
      className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors cursor-pointer"
      title="Click anywhere to go home"
    >
      <div className="w-[300px] md:w-[1000px] pointer-events-none">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <p className="mt-4 text-base md:text-lg font-semibold tracking-wide text-black dark:text-white animate-[pulse_3s_ease-in-out_infinite] pointer-events-none select-none">
        click anywhere to go home
      </p>

      <div className="fixed bottom-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
        <ThemeToggleButton />
      </div>

      <div></div>
    </div>
  );
};

export default Lamp404;
