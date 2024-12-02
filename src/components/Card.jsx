import { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import { FiThumbsUp } from "react-icons/fi";
import debounce from "lodash.debounce"; // Install lodash for debounce

// Debounced update function outside the component to avoid re-creation on each render
const debouncedUpdateLikeCount = debounce((updateLikeCount, movieId, likeCount) => {
  if (typeof updateLikeCount === "function") {
    updateLikeCount(movieId, likeCount);
  }
}, 500);

function Card({ result, updateLikeCount }) {
  const [voteCount, setVoteCount] = useState(0);

  // Use a memoized callback to prevent unnecessary re-renders
  const handleVote = useCallback((e) => {
    e.preventDefault();
    setVoteCount((prev) => prev + 1);
  }, []);

  // Trigger debounced update of like count when voteCount changes
  useEffect(() => {
    debouncedUpdateLikeCount(updateLikeCount, result.id, voteCount);

    // Cleanup debounce on unmount
    return () => debouncedUpdateLikeCount.cancel();
  }, [voteCount, updateLikeCount, result.id]);

  return (
    <div className="group flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 sm:m-4">
      <Link href={`/movie/${result.id}`} prefetch={false}>
        <div>
          <div className="relative w-full overflow-hidden group-hover:scale-105 transition-all duration-500 ease-in-out aspect-video">
            {/* Lazy-load video with preload="none" to avoid blocking other elements */}
            <video
              src={result.file_url}
              muted
              loop
              playsInline
              // preload="none" // Prevents video from blocking rendering
              loading="lazy" // Lazy-load video to prioritize other elements
              className="object-cover w-full h-full absolute top-0 left-0"
            />
          </div>
          <div className="p-4">
            <h2 className="text-3xl font-semibold text-white group-hover:text-yellow-400 transition-all duration-300">
              {result.title}
            </h2>
            <p className="text-sm text-gray-300 mt-2 line-clamp-3">
              {result.description}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-end p-4">
        <button
          onClick={handleVote}
          className="flex items-center text-yellow-400 hover:text-yellow-300"
          aria-label="Like this movie"
        >
          <FiThumbsUp className="h-5 mr-2" />
          <span>{voteCount}</span>
        </button>
      </div>
    </div>
  );
}

// Use React.memo to prevent unnecessary re-renders
export default memo(Card);
