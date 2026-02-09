// components/sections/testimonials/TestimonialSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import ReviewCard from "@/components/content/review-card";
import ReviewCardWithImage from "@/components/content/review-card-image";
import QuoteCard from "@/components/content/Quote";
export default function TestimonialSection() {
  const { cards } = testimonials;

  // Kelompokkan per kolom (bisa diubah jadi lebih dinamis nanti)
  const column1 = [cards[0], cards[1]];
  const column2 = [cards[2], cards[3]];
  const column3 = [cards[4], cards[5]];

  return (
    <section className="bg-white mb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-22">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bagikan Perjalananmu, Ciptakan Cerita Baru
          </h2>
          <p className="text-gray-600 text-lg">
            Jelajahi rute kereta favorit dan dapatkan harga terbaik untuk setiap
            momen berharga
          </p>
        </div>

        {/* Grid Testimoni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Kolom 1 */}
          <div className="space-y-6">
            {column1.map((item, idx) => {
              if (item.type === "review-with-image")
                return <ReviewCardWithImage key={idx} review={item.data} />;
              if (item.type === "review")
                return <ReviewCard key={idx} review={item.data} />;
              return null;
            })}
          </div>

          {/* Kolom 2 */}
          <div className="space-y-6">
            {column2.map((item, idx) => {
              if (item.type === "quote")
                return <QuoteCard key={idx} review={item.data} />;
              if (item.type === "review-with-image")
                return <ReviewCardWithImage key={idx} review={item.data} />;
              return null;
            })}
          </div>

          {/* Kolom 3 */}
          <div className="space-y-6">
            {column3.map((item, idx) => {
              if (item.type === "review")
                return <ReviewCard key={idx} review={item.data} />;
              if (item.type === "review-with-image")
                return <ReviewCardWithImage key={idx} review={item.data} />;
              return null;
            })}
          </div>
        </div>

        {/* Button Tengah */}
        <div className="flex justify-center">
          <Button
            className="bg-white/40 backdrop-blur-md text-gray-900
            border border-black/40 shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          hover:bg-white/60 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 px-6 py-6 text-lg rounded-xl"
          > 
            Lihat Testimoni Lainnya
          </Button>
        </div>
      </div>
    </section>
  );
}
