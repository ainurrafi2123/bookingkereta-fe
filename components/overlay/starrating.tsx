// components/sections/testimonials/StarRating.tsx
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
}

export default function StarRating({ rating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating
              ? 'fill-red-500 text-red-500'
              : 'fill-gray-300 text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}