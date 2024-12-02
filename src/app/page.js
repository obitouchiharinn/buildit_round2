"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Results from "@/components/Results";
import supabase  from "@/components/supabaseClient"; // Named import for supabase

export default function MoviePage() {
  const [category, setCategory] = useState("fetchTrending"); // Default category is Trending
  const [movies, setMovies] = useState([]);
  const [likeCounts, setLikeCounts] = useState({}); // Track like counts for each movie

  // Fetch movies based on the selected category
  useEffect(() => {
    async function fetchMovies() {
      let query;

      // Adjust query for Trending: just use "first in, first served" or ID-based order
      if (category === "fetchTrending") {
        query = supabase.from("upload").select("*").order("id", { ascending: true });
      } else if (category === "fetchTopRated") {
        // Fetch all movies (like count will be updated in state)
        query = supabase.from("upload").select("*");
      }

      // Execute the query and check for errors
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        if (category === "fetchTopRated") {
          // For Top Rated, sort movies based on like counts in descending order
          const sortedMovies = data.sort((a, b) => {
            const aLikes = likeCounts[a.id] || 0;
            const bLikes = likeCounts[b.id] || 0;
            return bLikes - aLikes;
          });
          setMovies(sortedMovies);
        } else {
          // For Trending, just use the raw data
          setMovies(data);
        }
      }
    }

    fetchMovies();
  }, [category, likeCounts]); // Re-fetch when likeCounts or category changes

  // Function to update the like count for a movie
  const updateLikeCount = (movieId, likeCount) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [movieId]: likeCount, // Update the like count for the specific movie
    }));
  };

  return (
    <div>
      {/* Pass setCategory and category to Navbar */}
      <Navbar setCategory={setCategory} category={category} />

      {/* Results section */}
      <Results results={movies} updateLikeCount={updateLikeCount} />
    </div>
  );
}
