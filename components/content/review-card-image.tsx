// components/sections/testimonials/ReviewCardWithImage.tsx
import { Play } from 'lucide-react';
import { ReviewWithImage } from '@/data/testimonials';

interface ReviewCardWithImageProps {
  review: ReviewWithImage;
}

export default function ReviewCardWithImage({ review }: ReviewCardWithImageProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 group cursor-pointer">
        <img
          src={review.image}
          alt={review.name}
          className="w-full h-full object-cover"
        />
        {review.hasVideo && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-gray-900 fill-gray-900 ml-1" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xs">📍</span>
          </div>
          {review.route}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
            <p className="text-xs text-gray-500">{review.persona}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
      </div>
    </div>
  );
}