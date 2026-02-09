import { CheckCircle2, ShieldCheck, Clock, Headphones } from "lucide-react";

const PartnersSection = () => {
  const advantages = [
    {
      icon: <CheckCircle2 className="w-8 h-8 text-gray-600" />,
      title: "Compare affordable train ticket prices easily",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gray-600" />,
      title: "Official and secure train tickets with guaranteed safety",
    },
    {
      icon: <Clock className="w-8 h-8 text-gray-600" />,
      title: "Instant booking confirmation available 24/7",
    },
    {
      icon: <Headphones className="w-8 h-8 text-gray-600" />,
      title: "Customer service on hand every step of the way",
    },
  ];
  return (
    <>
      {/* Keunggulan Section - Mirip referensi */}
      <section className="py-14 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {advantages.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">{item.icon}</div>
                <p className="text-sm md:text-md font-bold text-gray-900">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/src/ba-kereta.png"
                  alt="Woman traveling by train with mountain view"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Content - Text and Logos */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Trusted seller and official distributor for hundreds of
                operators
              </h2>

              {/* Partner Logos with Grayscale Filter */}
              <div className="mt-8">
                <img
                  src="/src/kereta-support.png"
                  alt="Partner Operators"
                  className="w-full h-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersSection;
