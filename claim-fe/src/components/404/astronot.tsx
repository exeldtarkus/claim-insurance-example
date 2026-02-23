"use client";

import Lottie from "lottie-react";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import Link from "next/link";

const Astronaut404 = () => {
  const animationData = useLottieAnimation("404/Animation-404-astronot.json");

  if (!animationData) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <div className="w-[300px] md:w-[1000px]">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <h2 className="text-xl font-semibold mt-4">Oops! Page not found.</h2>

      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Astronaut404;
