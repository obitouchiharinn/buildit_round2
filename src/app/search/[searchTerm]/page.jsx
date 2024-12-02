"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correctly capture the dynamic route parameter using useParams
import supabase from "@/components/supabaseClient"; // Supabase client configuration
import Card from "@/components/Card"; // Import the Card component

export default function SearchResults() {
  const { searchTerm } = useParams(); // Capture the dynamic route parameter
  const [results, setResults] = useState([]); // State to hold search results
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    // Skip fetching if no searchTerm is provided
    if (!searchTerm) {
      setLoading(false);
      return;
    }

    // Check for cached results in localStorage
    const cachedResults = localStorage.getItem(searchTerm);

    if (cachedResults) {
      setResults(JSON.parse(cachedResults)); // Use cached results if available
      setLoading(false);
    } else {
      fetchMovies(); // Otherwise, fetch from Supabase
    }
  }, [searchTerm]);

  // Function to fetch search results from Supabase
  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("upload") // Replace "upload" with your Supabase table name
      .select("id, title, description, file_url") // Select fields you need
      .ilike("title", `%${searchTerm}%`); // Perform case-insensitive search

    if (error) {
      console.error("Error fetching movies:", error);
      setResults([]); // Show no results on error
    } else {
      setResults(data); // Update results state with fetched data
      localStorage.setItem(searchTerm, JSON.stringify(data)); // Cache the results
    }
    setLoading(false); // Stop the loading state
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold">Loading...</p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-lg font-semibold">
        No results found for "{searchTerm}".
      </p>
    );
  }

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
