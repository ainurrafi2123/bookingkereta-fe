import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const DestinationSection = () => {
  // Data destinasi populer di Indonesia
  const destinations = [
    {
      id: 1,
      from: "Jakarta",
      to: "Bandung",
      price: "Rp 150.000",
      image: "/src/destinations/jakarta-bandung.jpg",
    },
    {
      id: 2,
      from: "Surabaya",
      to: "Malang",
      price: "Rp 75.000",
      image: "/src/destinations/surabaya-malang.jpg",
    },
    {
      id: 3,
      from: "Jakarta",
      to: "Yogyakarta",
      price: "Rp 200.000",
      image: "/src/destinations/jakarta-yogyakarta.jpg",
    },
    {
      id: 4,
      from: "Bandung",
      to: "Surabaya",
      price: "Rp 250.000",
      image: "/src/destinations/bandung-surabaya.jpg",
    },
    {
      id: 5,
      from: "Jakarta",
      to: "Semarang",
      price: "Rp 180.000",
      image: "/src/destinations/jakarta-semarang.jpg",
    },
    {
      id: 6,
      from: "Surabaya",
      to: "Jakarta",
      price: "Rp 220.000",
      image: "/src/destinations/surabaya-jakarta.jpg",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Destinasi Populer dengan Keberangkatan
          </h2>
          <p className="text-gray-600 text-lg">
            Temukan rute kereta favorit Anda dengan harga terbaik
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group bg-blue-200 rounded-b-sm shadow-md hover:shadow-sm transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.from} to ${destination.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                {/* Route and Price on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <h3 className="text-xl font-bold">
                      {destination.from} - {destination.to}
                    </h3>
                    <span className="text-2xl font-bold">
                      {destination.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Link */}
              <div className="p-4">
                <div className="flex items-center  gap-3 mb-4">
                  <button className="w-full bg-white text-blue-800 hover:text-blue-900 border rounded-sm font-medium text-sm flex items-center justify-start gap-2 py-2 px-4 hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* View Details Button */}
                  <Button className="bg-amber-600 rounded-sm hover:bg-blue-700 text-white px-6">
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show All Button */}
        <div className="max-w-2xl mx-auto px-6 text-center py-24 ">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We're here to help
            </h2>

            <p className="text-gray-600 text-lg mb-4">
              Find clear FAQs online and customer service available at the end of the phone seven days a week
            </p>

            <img
              src="/src/faq.png"
              alt="FAQ Icon"
              className="mx-auto h-42 w-42 rounded-md"
            />
          </div>
          {/* <Button
            variant="outline"
            className="px-8 py-6 text-base font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all"
          >
            Show all directions
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;
