import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiThumbsUp } from "react-icons/fi";
import debounce from "lodash.debounce";

export default function Card({ result, updateLikeCount }) {
  const generateRandomLikes = () => Math.floor(Math.random() * 100);
  const [voteCount, setVoteCount] = useState(generateRandomLikes);

  // Debounce the updateLikeCount function
  const debouncedUpdateLikeCount = useCallback(
    debounce((movieId, likeCount) => {
      if (typeof updateLikeCount === "function") {
        updateLikeCount(movieId, likeCount);
      }
    }, 500), // Delay the update by 500ms
    [updateLikeCount]
  );

  useEffect(() => {
    debouncedUpdateLikeCount(result.id, voteCount);

    // Cleanup debounce on component unmount
    return () => debouncedUpdateLikeCount.cancel();
  }, [voteCount, debouncedUpdateLikeCount, result.id]);

  const handleVote = (e) => {
    e.preventDefault();
    setVoteCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="group flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 sm:m-4">
      <Link href={`/movie/${result.id}`} prefetch={false}>
        <div>
          <div
            className="relative w-full overflow-hidden group-hover:scale-105 transition-all duration-500 ease-in-out"
            style={{ paddingTop: "56.25%" }} // 16:9 Aspect Ratio
          >
            {/* Video Element */}
            <video
              src={result.file_url}
             
              muted
              loop
              playsInline
              preload="metadata"
              className="object-cover w-full h-full absolute top-0 left-0"
              style={{ width: "100%", height: "100%" }}
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










