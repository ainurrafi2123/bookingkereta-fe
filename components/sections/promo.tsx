'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy data promo
  const promos = [
    {
      id: 1,
      title: 'Diskon hingga 30% + Cashback Rp 400.000',
      code: 'TIKETNEW',
      image: '/src/promo/promo1.webp',
      description: 'Promo spesial untuk pengguna baru'
    },
    {
      id: 2,
      title: 'Diskon & Cashback hingga 2 Juta',
      code: 'TIKETNEW',
      image: '/src/promo/promo2.webp',
      description: 'Promo spesial pengguna baru'
    },
    {
      id: 3,
      title: 'Pembayaran dengan OVO',
      code: 'OVOKERETA',
      image: '/src/promo/promo3.webp',
      description: 'Dapatkan cashback dengan OVO'
    },
    {
      id: 4,
      title: 'Hemat 25% untuk Rute Jakarta-Bandung',
      code: 'JKTBDG25',
      image: '/src/promo/promo4.webp',
      description: 'Berlaku untuk pembelian hari ini'
    },
    {
      id: 5,
      title: 'Gratis Bagasi Tambahan',
      code: 'FREEBAG',
      image: '/src/promo/promo5.webp',
      description: 'Untuk semua kelas eksekutif'
    },
    {
      id: 6,
      title: 'Cashback 15% Pakai GoPay',
      code: 'GOPAYKERETA',
      image: '/src/promo/promo6.webp',
      description: 'Maksimal cashback Rp 50.000'
    }
  ];

  // Hitung jumlah slides berdasarkan screen size
  const itemsPerSlide = {
    mobile: 1,
    desktop: 3
  };

  const totalSlides = Math.ceil(promos.length / itemsPerSlide.desktop);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get visible promos for current slide
  const getVisiblePromos = () => {
    const start = currentSlide * itemsPerSlide.desktop;
    return promos.slice(start, start + itemsPerSlide.desktop);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Promo Spesial Untukmu
          </h2>

          {/* Navigation Buttons - Hidden on mobile */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Promo Cards Container */}
        <div className="relative ">
          {/* Desktop Grid - 3 columns */}
          <div className=" hidden md:grid md:grid-cols-3 gap-6">
            {getVisiblePromos().map((promo) => (
              <div
                key={promo.id}
                onClick={() => console.log('Promo clicked:', promo.id)}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
                  />
                </div>

                {/* Overlay Info - Appears on hover */}
                {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                    <p className="text-sm text-gray-200">{promo.description}</p>
                  </div>
                </div> */}
              </div>
            ))}
          </div>

          {/* Mobile Carousel - 1 column */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {promos.map((promo) => (
                  <div
                    key={promo.id}
                    onClick={() => console.log('Promo clicked:', promo.id)}
                    className="min-w-full px-2"
                  >
                    <div className="cursor-pointer rounded-2xl overflow-hidden shadow-lg active:scale-95 transition-transform">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Promo Code Badge */}
                        {/* {promo.code && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                              Kode: {promo.code}
                            </span>
                          </div>
                        )} */}

                        {/* Info Overlay - Always visible on mobile */}
                        {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end">
                          <div className="p-4 text-white w-full">
                            <h3 className="font-bold text-base mb-1">{promo.title}</h3>
                            <p className="text-xs text-gray-200">{promo.description}</p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {promos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicator - Desktop only */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;