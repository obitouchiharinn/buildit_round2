"use client";
import NavbarItem from "./NavbarItem";

export default function Navbar({ setCategory, category }) {
  return (
    <div className="flex dark:bg-gray-600 bg-amber-100 p-4 lg:text-lg justify-center gap-10">
      <NavbarItem
        title="Trending"
        param="fetchTrending"
        isActive={category === "fetchTrending"}
        setCategory={setCategory} // Pass setCategory here
      />
      <NavbarItem
        title="Top Rated"
        param="fetchTopRated"
        isActive={category === "fetchTopRated"}
        setCategory={setCategory} // Pass setCategory here
      />
    </div>
  );
}
