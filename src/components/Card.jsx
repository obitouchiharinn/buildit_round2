import { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import { FiThumbsUp } from "react-icons/fi";
import debounce from "lodash.debounce"; // Ensure debounce is imported here

function Card({ result, updateLikeCount }) {
  const [voteCount, setVoteCount] = useState(0);

  // Memoize the vote handler to prevent unnecessary re-renders
  const handleVote = useCallback((e) => {
    e.preventDefault();
    setVoteCount((prev) => prev + 1);
  }, []);

  // Trigger debounced update of like count when voteCount changes
  useEffect(() => {
    // Create the debounced version of the update function
    const debouncedUpdateLikeCount = debounce((id, count) => {
      updateLikeCount(id, count);
    }, 500);

    // Call the debounced update function
    debouncedUpdateLikeCount(result.id, voteCount);

    // Cleanup debounce on unmount
    return () => debouncedUpdateLikeCount.cancel();
  }, [voteCount, updateLikeCount, result.id]);

  return (
    <div className="group flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 sm:m-4">
      <Link href={`/movie/${result.id}`} prefetch={false}>
        <div>
          <div className="relative w-full overflow-hidden group-hover:scale-105 transition-all duration-500 ease-in-out aspect-video">
            {/* Lazy-load video */}
            <video
              src={result.file_url}
              muted
              loop
              playsInline
              loading="lazy" // Lazy-load video
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

// Memoize the Card component to prevent unnecessary re-renders
export default memo(Card);
