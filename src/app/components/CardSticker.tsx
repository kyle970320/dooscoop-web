import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

type CardStickerProps = {
  urls: string[];
  currentIndex: number;
  fadeSeconds?: number;
  position?: [number, number, number];
  size?: [number, number];
};

export default function CardSticker({
  urls,
  currentIndex,
  fadeSeconds = 0.6,
  position = [0, 0, 0.02],
  size = [0.7, 0.9],
}: CardStickerProps) {
  const textures = useTexture(urls);
  const textureList = Array.isArray(textures) ? textures : [textures];

  useEffect(() => {
    textureList.forEach((tex) => {
      tex.flipY = true;
      tex.needsUpdate = true;
    });
  }, [textureList]);

  const hasImages = urls.length > 0;
  const normalizedIndex = useMemo(() => {
    if (!hasImages) return 0;
    const length = urls.length;
    return ((currentIndex % length) + length) % length;
  }, [currentIndex, hasImages, urls.length]);

  const [activeIndex, setActiveIndex] = useState<number>(normalizedIndex);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const progressRef = useRef(1);

  useEffect(() => {
    if (!hasImages) return;
    if (urls.length <= 1) {
      setActiveIndex(0);
      setPrevIndex(null);
      setIsTransitioning(false);
      progressRef.current = 1;
      return;
    }

    if (normalizedIndex === activeIndex) return;

    if (fadeSeconds <= 0) {
      setActiveIndex(normalizedIndex);
      setPrevIndex(null);
      setIsTransitioning(false);
      progressRef.current = 1;
      return;
    }

    setPrevIndex(activeIndex);
    setActiveIndex(normalizedIndex);
    setIsTransitioning(true);
    progressRef.current = 0;
  }, [activeIndex, fadeSeconds, hasImages, normalizedIndex, urls.length]);

  useFrame((_, delta) => {
    if (!isTransitioning) return;
    if (fadeSeconds <= 0) {
      progressRef.current = 1;
      setPrevIndex(null);
      setIsTransitioning(false);
      return;
    }

    progressRef.current += delta / fadeSeconds;
    if (progressRef.current >= 1) {
      progressRef.current = 1;
      setPrevIndex(null);
      setIsTransitioning(false);
    }
  });

  if (!hasImages) return null;

  const clampedProgress = Math.max(0, Math.min(1, progressRef.current));
  const easedProgress =
    clampedProgress * clampedProgress * (3 - 2 * clampedProgress);

  const activeTexture = textureList[activeIndex];
  const previousTexture =
    prevIndex !== null && prevIndex < textureList.length
      ? textureList[prevIndex]
      : null;

  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      {previousTexture && (
        <mesh position={[0, 0, -0.0001]}>
          <planeGeometry args={size} />
          <meshBasicMaterial
            map={previousTexture}
            transparent
            depthWrite={false}
            opacity={1 - easedProgress}
          />
        </mesh>
      )}
      {activeTexture && (
        <meshBasicMaterial
          map={activeTexture}
          transparent
          depthWrite={false}
          opacity={easedProgress}
        />
      )}
    </mesh>
  );
}
