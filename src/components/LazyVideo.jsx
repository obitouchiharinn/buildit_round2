// src/components/LazyVideo.jsx
import { useEffect, useRef } from "react";

const LazyVideo = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load(); // Lazy load the video
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="none" // Prevents the video from blocking rendering
      loading="lazy" // Lazy-load video to prioritize other elements
      className="object-cover w-full h-full absolute top-0 left-0"
    />
  );
};

export default LazyVideo;
