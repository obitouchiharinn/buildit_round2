'use client';

import Card from './Card'; // Import Card component

export default function Results({ results, updateLikeCount }) {
  return (
    <section
      aria-label="Search Results"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {results && results.length > 0 ? (
        results.map((result) => (
          <Card
            key={result.id}
            result={result}
            updateLikeCount={updateLikeCount}
          />
        ))
      ) : (
        <p
          className="text-gray-500 text-center"
          aria-live="polite"
          aria-label="No results found"
        >
          No results found
        </p>
      )}
    </section>
  );
}
