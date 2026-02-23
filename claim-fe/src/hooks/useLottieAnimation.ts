import { useEffect, useState } from "react";

export default function useLottieAnimation(path: string) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  const pathAnimation = `/animations/${path}`;

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const res = await fetch(pathAnimation);
        if (!res.ok) throw new Error(`Failed to load animation at ${pathAnimation}`);
        const json = await res.json();
        setAnimationData(json);
      } catch (err) {
        console.error("[useLottieAnimation]", err);
      }
    };

    fetchAnimation();
  }, [pathAnimation]);

  return animationData;
}
