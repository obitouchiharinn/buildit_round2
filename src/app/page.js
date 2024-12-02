'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import supabase from "@/components/supabaseClient";

// Dynamically import components for better performance
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Results = dynamic(() => import("@/components/Results"), { ssr: false });

export default function MoviePage() {
  const [category, setCategory] = useState("fetchTrending");
  const [movies, setMovies] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  /**
   * Fetch Movies from Supabase
   * - Debounced and cached in sessionStorage for reduced API calls.
   */
  const fetchMovies = useCallback(
    async (category) => {
      // Check sessionStorage first
      const cachedMovies = sessionStorage.getItem(category);
      if (cachedMovies) {
        setMovies(JSON.parse(cachedMovies));
        return;
      }

      try {
        let query = supabase.from("upload").select("*");

        if (category === "fetchTrending") {
          query = query.order("id", { ascending: true });
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        // Sort movies for "fetchTopRated" based on likes
        const sortedMovies =
          category === "fetchTopRated"
            ? data.sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0))
            : data;

        setMovies(sortedMovies);
        sessionStorage.setItem(category, JSON.stringify(sortedMovies)); // Cache results
      } catch (err) {
        console.error("Fetch movies error:", err);
      }
    },
    [likeCounts] // Dependency on likeCounts
  );

  // Debounced category change handler
  useEffect(() => {
    fetchMovies(category);
  }, [category, fetchMovies]);

  /**
   * Update Like Count (Optimized)
   */
  const updateLikeCount = useCallback((movieId, likeCount) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [movieId]: likeCount,
    }));
  }, []);

  return (
    <div>
      {/* Memoize Navbar to prevent unnecessary re-renders */}
      <Navbar setCategory={setCategory} category={category} />
      {/* Memoize Results for better performance */}
      <Results results={movies} updateLikeCount={updateLikeCount} />
    </div>
  );
}
