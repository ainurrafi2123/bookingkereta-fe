'use client';
import Footer from "@/components/sections/footer";

export default function NotFound() {
  return (
      <>
        <div className="relative bg-gray-100 flex items-center justify-center py-50 px-4">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-44">
              {/* Train Image */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src="/src/kereta-404.png"
                  alt="404 Train"
                  className="w-full max-w-md h-auto object-contain"
                />
              </div>
              
              {/* Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-6xl md:text-6xl font-bold text-gray-800 mb-4">
                  Oops!
                </h1>
                <p className="text-md md:text-2xl text-gray-500">
                  We couldn't find the page<br />you were looking for
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-8 bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-full transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <span>←</span>
                  <span>Go home</span>
                </button>
              </div>
            </div>
        </div>
        {/* <Footer/> */}
      </>
  );
}