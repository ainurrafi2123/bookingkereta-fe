// components/search/search-form-compact.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, Calendar as CalendarIcon, Search, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Route } from "next";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get("from") || "");
  const [toCity, setToCity] = useState(searchParams.get("to") || "");
  const [departDate, setDepartDate] = useState<Date>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : new Date(),
  );
  const [departOpen, setDepartOpen] = useState(false);

  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };
  const [adults, setAdults] = useState(
    parseInt(searchParams.get("adults") || "1"),
  );
  const [elderly, setElderly] = useState(
    parseInt(searchParams.get("elderly") || "0"),
  );
  const [youth, setYouth] = useState(
    parseInt(searchParams.get("youth") || "0"),
  );

  const [passengerOpen, setPassengerOpen] = useState(false);

  const handleSearch = () => {
    if (!fromCity || !toCity) return;

    const params = new URLSearchParams();
    params.set('from', fromCity);
    params.set('to', toCity);
    params.set('date', format(departDate, 'yyyy-MM-dd'));

    params.set('adults', adults.toString());
    params.set('elderly', elderly.toString());
    params.set('youth', youth.toString());

    router.push(`/search?${params.toString()}` as Route);
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Dari */}
        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-gray-700">Dari</Label>
          <Input
            placeholder="Kota/stasiun asal"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Swap */}
        <div className="md:col-span-1 flex justify-center">
          <Button variant="ghost" size="icon" onClick={swapCities}>
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Ke */}
        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-gray-700">Ke</Label>
          <Input
            placeholder="Kota/stasiun tujuan"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Tanggal */}
        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-gray-700">Berangkat</Label>
          <Popover open={departOpen} onOpenChange={setDepartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(departDate, "dd MMM yyyy", { locale: id })}
              </Button>
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
          <Label className="text-xs font-medium text-gray-700">Penumpang</Label>

          <Popover open={passengerOpen} onOpenChange={setPassengerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <User className="mr-2 h-4 w-4" />
                {adults} Dewasa
                {elderly > 0 && `, ${elderly} Lansia`}
                {youth > 0 && `, ${youth} Anak`}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4" align="start">
              {/* Dewasa */}
              <div className="flex justify-between items-center mb-3">
                <span>Dewasa</span>
                <Input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-20"
                />
              </div>

              {/* Lansia */}
              <div className="flex justify-between items-center mb-3">
                <span>Lansia</span>
                <Input
                  type="number"
                  min={0}
                  value={elderly}
                  onChange={(e) => setElderly(Number(e.target.value))}
                  className="w-20"
                />
              </div>

              {/* Anak */}
              <div className="flex justify-between items-center">
                <span>Anak</span>
                <Input
                  type="number"
                  min={0}
                  value={youth}
                  onChange={(e) => setYouth(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Button Cari */}
        <div className="md:col-span-2">
          <Button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-600 text-white font-semibold rounded-lg mt-6"
            disabled={!fromCity || !toCity}
          >
            <Search className="mr-2 h-4 w-4" />
            Cari
          </Button>
        </div>
      </div>
    </div>
  );
}
