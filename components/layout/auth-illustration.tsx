'use client';
import  { useState, useEffect } from 'react';

const AuthIllustration = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data gambar untuk carousel
  const pictures = [
    {
      id: 1,
      title: 'Perjalanan Nyaman',
      image: '/src/experience/experience1.jpg',
      // description: 'Nikmati perjalanan kereta yang nyaman'
    },
    {
      id: 2,
      title: 'Pemandangan Indah',
      image: '/src/experience/experience2.jpg',
      // description: 'Saksikan pemandangan spektakuler'
    },
    {
      id: 3,
      title: 'Layanan Terbaik',
      image: '/src/experience/experience3.jpg',
      // description: 'Pelayanan premium untuk Anda'
    }
  ];

  // Auto slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pictures.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [pictures.length]);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-2 relative overflow-hidden">

      {/* Carousel Container */}
      <div className="relative w-full max-w-md ">
        {/* Images */}
        <div className="relative h-120 ">
          {pictures.map((picture, index) => (
            <div
              key={picture.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            >
              <div className="relative h-full w-full rounded-sm overflow-hidden shadow-sm">
                <img
                  src={picture.image}
                  alt={picture.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        {/* <div className="flex justify-center z-50">
          {pictures.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'w-8 bg-blue'
                  : 'w-2 bg-blue/50 hover:bg-blue/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}

      </div>
    </div>
  );
};

export default AuthIllustration;