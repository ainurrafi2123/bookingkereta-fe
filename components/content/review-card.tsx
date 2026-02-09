// components/sections/testimonials/ReviewCard.tsx
import { Review } from '@/data/testimonials';
import StarRating from '@/components/overlay/starrating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.company}</p>
        </div>
        {review.rating !== undefined && <StarRating rating={review.rating} />}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
    </div>
  );
}