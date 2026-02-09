// components/hero/HeroBookingSection.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from 'next';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Calendar as CalendarIcon, User } from "lucide-react";
import PassengerSelector from "@/components/content/PassengerSelector";
import { formatDate, getPassengerSummary } from "@/data/hero";
import { format } from "date-fns";

export default function HeroBookingSection() {
  const router = useRouter();
  
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departDate, setDepartDate] = useState(new Date());
  const [departOpen, setDepartOpen] = useState(false);
  const [passengerOpen, setPassengerOpen] = useState(false);

  // Passenger states
  const [isDefaultPassenger, setIsDefaultPassenger] = useState(true);
  const [adults, setAdults] = useState(1);
  const [elderly, setElderly] = useState(0);
  const [youth, setYouth] = useState(0);
  const [youthAges, setYouthAges] = useState<Record<number, string>>({});

  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // ✅ Handle search - redirect ke /search dengan params
  const handleSearch = () => {
    if (!fromCity || !toCity) {
      alert('Mohon isi kota asal dan tujuan');
      return;
    }

    const params = new URLSearchParams();
    params.set('from', fromCity);
    params.set('to', toCity);
    params.set('date', format(departDate, 'yyyy-MM-dd'));
    
    // Optional: include passenger info
    if (!isDefaultPassenger) {
      params.set('adults', adults.toString());
      if (elderly > 0) params.set('elderly', elderly.toString());
      if (youth > 0) params.set('youth', youth.toString());
    }

    router.push(`/search?${params.toString()}` as Route);
  };

  return (
    <div>
      {/* Hero Background */}
      <div
        className="relative h-[61vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/kereta.jpg')" }}
      >
        <div className="relative max-w-6xl mx-auto px-6 pt-22">
          <h1 className="text-white text-5xl font-bold mb-4 drop-shadow-lg">
            Perjalanan global di satu tempat
          </h1>
          <p className="text-white text-xl drop-shadow-md">
            Pesan tiket kereta, bus, pesawat, dan feri
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Dari */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Dari</Label>
              <input
                type="text"
                placeholder="Pilih kota atau stasiun"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center">
              <Button variant="ghost" size="icon" onClick={swapCities} className="mt-6">
                <ArrowLeftRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Ke */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Ke</Label>
              <input
                type="text"
                placeholder="Mau ke mana?"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Tanggal */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Berangkat</Label>
              <Popover open={departOpen} onOpenChange={setDepartOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:bg-gray-50 transition">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{formatDate(departDate)}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departDate}
                    onSelect={(date) => {
                      setDepartDate(date ?? new Date());
                      setDepartOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Penumpang */}
            <div className="md:col-span-3">
              <Label className="text-sm font-medium text-gray-700">Penumpang</Label>
              <Popover open={passengerOpen} onOpenChange={setPassengerOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:bg-gray-50 transition">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      {getPassengerSummary(isDefaultPassenger, adults, elderly, youth)}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="start">
                  <PassengerSelector
                    isDefaultPassenger={isDefaultPassenger}
                    setIsDefaultPassenger={setIsDefaultPassenger}
                    adults={adults}
                    setAdults={setAdults}
                    elderly={elderly}
                    setElderly={setElderly}
                    youth={youth}
                    setYouth={setYouth}
                    youthAges={youthAges}
                    setYouthAges={setYouthAges}
                    onClose={() => setPassengerOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Button Cari */}
            <div className="md:col-span-2">
              <Button 
                onClick={handleSearch}
                disabled={!fromCity || !toCity}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mt-6"
              >
                Cari Tiket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}