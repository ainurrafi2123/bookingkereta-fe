// components/sections/testimonials/QuoteCard.tsx
import { QuoteReview } from '@/data/testimonials';

interface QuoteCardProps {
  review: QuoteReview;
}

export default function QuoteCard({ review }: QuoteCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
      <img
          src={review.icon}
          alt={review.name}
          className="w-8 h-8 "
        />
      <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
        {review.quote}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
          <p className="text-xs text-gray-500">{review.persona}</p>
        </div>
      </div>
    </div>
  );
}