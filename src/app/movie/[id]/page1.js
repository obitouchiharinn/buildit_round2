// "use client";
// import { useState, useEffect } from "react";
// import Navbar from "@/components/Navbar";
// import Results from "@/components/Results";
// import supabase from "@/components/supabaseClient";

// export default function MoviePage() {
//   const [category, setCategory] = useState("fetchTrending"); // Default category is Trending
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     async function fetchMovies() {
//       let query;
//       if (category === "fetchTrending") {
//         query = supabase.from("upload").select("*").order("release_date", { ascending: false });
//       } else if (category === "fetchTopRated") {
//         query = supabase.from("upload").select("*").order("like_count", { ascending: false });
//       }

//       const { data, error } = await query;

//       if (error) {
//         console.error("Error fetching data:", error);
//       } else {
//         setMovies(data);
//       }
//     }

//     fetchMovies();
//   }, [category]);

//   return (
//     <div>
//       {/* Pass setCategory and category to Navbar */}
//       <Navbar setCategory={setCategory} category={category} />

//       {/* Results section */}
//       <Results results={movies} />
//     </div>
//   );
// }
