"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import supabase from "@/components/supabaseClient";
import dynamic from "next/dynamic";

const Card = dynamic(() => import("@/components/Card"), {
  ssr: false,
  loading: () => <p>Loading cards...</p>, // Lightweight fallback
});

export default function SearchResults() {
  const { searchTerm } = useParams(); // Capture dynamic route parameter
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) {
      setLoading(false);
      return;
    }

    // Fetch cached or fresh results
    const fetchData = async () => {
      const cachedResults = sessionStorage.getItem(searchTerm);

      if (cachedResults) {
        setResults(JSON.parse(cachedResults));
        setLoading(false);
      } else {
        await fetchMovies();
      }
    };

    fetchData();
  }, [searchTerm]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("upload")
        .select("id, title, description, file_url")
        .ilike("title", `%${searchTerm}%`);

      if (error) throw error;

      const movies = data || [];
      setResults(movies);
      sessionStorage.setItem(searchTerm, JSON.stringify(movies));
    } catch (err) {
      console.error("Error fetching movies:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <main className="px-6 py-4">
        <p className="text-center text-lg font-semibold">Loading...</p>
      </main>
    );
  }

  // Render no results state
  if (results.length === 0) {
    return (
      <main className="px-6 py-4">
        <p className="text-center text-lg font-semibold">
          No results found for "{searchTerm}".
        </p>
      </main>
    );
  }

  // Render results
  return (
    <main className="px-6 py-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Search Results for "{searchTerm}"
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.id} result={result} updateLikeCount={() => {}} />
        ))}
      </div>
    </main>
  );
}
