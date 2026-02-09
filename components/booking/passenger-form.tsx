// components/booking/passenger-form.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Passenger } from "@/lib/types/booking";

interface PassengerFormProps {
  passenger: Passenger;
  index: number;
  onUpdate: (field: keyof Passenger, value: any) => void;
}

export function PassengerForm({
  passenger,
  index,
  onUpdate,
}: PassengerFormProps) {
  const getCategoryLabel = (kategori: string) => {
    return kategori.charAt(0).toUpperCase() + kategori.slice(1);
  };

  const getCategoryVariant = (kategori: string) => {
    switch (kategori) {
      case "dewasa":
        return "default";
      case "lansia":
        return "secondary";
      case "anak":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">
          Penumpang {index + 1}
          <Badge
            variant={getCategoryVariant(passenger.kategori)}
            className="ml-2"
          >
            {getCategoryLabel(passenger.kategori)}
          </Badge>
        </h4>
        {passenger.no_kursi && (
          <Badge
            variant="secondary"
            className="bg-blue-300 text-blue-900 hover:bg-blue-400"
          >
            Kursi {passenger.no_kursi}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`nik-${index}`}>
            NIK (16 digit) <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`nik-${index}`}
            value={passenger.nik}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 16);
              onUpdate("nik", val);
            }}
            placeholder="327501xxxxxxxxxx"
            maxLength={16}
            className={
              passenger.nik && passenger.nik.length !== 16
                ? "border-red-500"
                : ""
            }
          />
          {passenger.nik && passenger.nik.length !== 16 && (
            <p className="text-xs text-red-500">NIK harus 16 digit</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`nama-${index}`}>
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`nama-${index}`}
            value={passenger.nama}
            onChange={(e) => onUpdate("nama", e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className={
              passenger.nama && passenger.nama.trim().length < 3
                ? "border-red-500"
                : ""
            }
          />
          {passenger.nama && passenger.nama.trim().length < 3 && (
            <p className="text-xs text-red-500">Nama minimal 3 karakter</p>
          )}
        </div>
      </div>
    </Card>
  );
}
