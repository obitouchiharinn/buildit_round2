'use client';

import { memo } from 'react';
import Card from './Card'; // Import Card component

// Memoize Results to avoid unnecessary re-renders
function Results({ results, updateLikeCount }) {
  if (!results || results.length === 0) {
    return (
      <p
        className="text-gray-500 text-center"
        aria-live="polite"
        aria-label="No results found"
      >
        No results found
      </p>
    );
  }

  return (
    <section
      aria-label="Search Results"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {results.map((result) => (
        <Card
          key={result.id}
          result={result}
          updateLikeCount={updateLikeCount}
        />
      ))}
    </section>
  );
}

// Memoize Results to avoid re-renders unless props change
export default memo(Results);
