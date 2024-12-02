"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter for navigation
import supabase from "@/components/supabaseClient"; // Ensure this is configured correctly
import { IoArrowBackCircleSharp } from "react-icons/io5"; // Import the back icon

export default function MoviePage() {
  const { id } = useParams(); // Get the movie ID from the dynamic route
  const [movie, setMovie] = useState(null);
  const [isLandscape, setIsLandscape] = useState(false); // State to track video orientation
  const router = useRouter(); // Initialize the useRouter hook for navigation

  // Fetch the movie data from Supabase based on the ID
  useEffect(() => {
    if (!id) return; // Return early if no ID is available

    async function fetchMovie() {
      const { data, error } = await supabase
        .from("upload") // Ensure 'upload' is your table name
        .select("id, title, description, file_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching movie:", error);
      } else {
        setMovie(data);
      }
    }

    fetchMovie();
  }, [id]);

  // Check video orientation once the video is loaded
  const handleVideoLoaded = (event) => {
    const video = event.target;
    if (video.videoWidth > video.videoHeight) {
      setIsLandscape(true); // Landscape
    } else {
      setIsLandscape(false); // Portrait
    }
  };

  // Handle loading or error states
  if (!movie) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  // Handle back button click
  const handleBackButtonClick = () => {
    router.push("/"); // Navigate back to the main page
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6">
      
      {/* Title Section */}
      <div className="w-full bg-gray-100 py-4 px-8 flex items-center">
        {/* Back Button (Icon + EXIT) */}
        <button 
          onClick={handleBackButtonClick} 
          className="flex items-center text-3xl text-black font-semibold mr-4"
        >
          <IoArrowBackCircleSharp className="mr-2" /> {/* Icon with margin */}
          EXIT
        </button>
        
        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-bold text-center flex-grow"
          style={{ fontFamily: "Lora, serif" }}
        >
          {movie.title}
        </h1>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-[1200px] flex justify-center mb-6 py-6">
        <div
          className={`relative w-full ${isLandscape ? "h-[60vh]" : "h-[80vh]"}`} 
        >
          <video
            src={movie.file_url} // Video file URL from Supabase
            controls
            autoPlay
            muted
            loop
            className={`absolute top-0 left-0 w-full ${isLandscape ? "h-full object-cover" : "h-full object-contain"}`} 
            onLoadedMetadata={handleVideoLoaded} // Check the video orientation once it's loaded
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full bg-gray-50 py-4 px-6">
        <p
          className="text-black text-lg md:text-xl mt-6 text-center max-w-4xl mx-auto"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {movie.description}
        </p>
      </div>
    </div>
  );
}
