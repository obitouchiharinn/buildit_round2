"use client";

export default function NavbarItem({ title, param, isActive, setCategory }) {
  const handleClick = () => {
    setCategory(param); // Set the selected category
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 text-lg font-semibold ${isActive ? 'underline text-yellow-500' : 'text-gray-700'}`}
    >
      {title}
    </button>
  );
}
