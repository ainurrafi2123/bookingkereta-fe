
'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, User } from "lucide-react";
import { YOUTH_AGE_OPTIONS, getPassengerSummary } from "@/data/hero";

type PassengerSelectorProps = {
  isDefaultPassenger: boolean;
  setIsDefaultPassenger: (val: boolean) => void;
  adults: number;
  setAdults: (val: number) => void;
  elderly: number;
  setElderly: (val: number) => void;
  youth: number;
  setYouth: (val: number) => void;
  youthAges: Record<number, string>;
  setYouthAges: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onClose?: () => void;
};

export default function PassengerSelector({
  isDefaultPassenger,
  setIsDefaultPassenger,
  adults,
  setAdults,
  elderly,
  setElderly,
  youth,
  setYouth,
  youthAges,
  setYouthAges,
  onClose,
}: PassengerSelectorProps) {
  const addYouth = () => {
    setYouth(youth + 1);
    setYouthAges((prev) => ({ ...prev, [youth]: "0-5 tahun" }));
  };

  const removeYouth = () => {
    if (youth <= 0) return;
    setYouth(youth - 1);
    setYouthAges((prev) => {
      const newAges = { ...prev };
      delete newAges[youth - 1];
      return newAges;
    });
  };

  return (
    <div className="w-96 p-6">
      <h3 className="font-semibold text-lg mb-4">Penumpang</h3>

      {/* Checkbox default */}
      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="default-passenger"
          checked={isDefaultPassenger}
          onCheckedChange={(checked) => {
            setIsDefaultPassenger(!!checked);
            if (checked) {
              setAdults(1);
              setElderly(0);
              setYouth(0);
              setYouthAges({});
            }
          }}
        />
        <Label htmlFor="default-passenger" className="cursor-pointer font-normal">
          Pilihan saya
        </Label>
      </div>

      {!isDefaultPassenger && (
        <div className="space-y-6">
          {/* Dewasa */}
          <PassengerCounter
            label="Dewasa"
            subLabel="26-57 tahun"
            count={adults}
            onDecrease={() => setAdults(Math.max(0, adults - 1))}
            onIncrease={() => setAdults(adults + 1)}
          />

          {/* Lansia */}
          <div className="border-t pt-6">
            <PassengerCounter
              label="Lansia"
              subLabel="58+ tahun"
              count={elderly}
              onDecrease={() => setElderly(Math.max(0, elderly - 1))}
              onIncrease={() => setElderly(elderly + 1)}
            />
          </div>

          {/* Pemuda */}
          <div className="border-t pt-6">
            <PassengerCounter
              label="Pemuda"
              subLabel="0-25 tahun"
              count={youth}
              onDecrease={removeYouth}
              onIncrease={addYouth}
            />

            {youth > 0 && (
              <div className="space-y-3 mt-3">
                {Array.from({ length: youth }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">
                      Pemuda {index + 1}
                    </span>
                    <Select
                      value={youthAges[index] || "0-5 tahun"}
                      onValueChange={(value) =>
                        setYouthAges((prev) => ({ ...prev, [index]: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih usia" />
                      </SelectTrigger>
                      <SelectContent>
                        {YOUTH_AGE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t flex justify-end">
        <Button onClick={onClose}>Selesai</Button>
      </div>
    </div>
  );
}

// Komponen kecil pembantu
function PassengerCounter({
  label,
  subLabel,
  count,
  onDecrease,
  onIncrease,
}: {
  label: string;
  subLabel: string;
  count: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-gray-500">{subLabel}</div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onDecrease} disabled={count === 0}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center font-medium">{count}</span>
          <Button variant="outline" size="icon" onClick={onIncrease}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {count > 0 && (
        <div className="text-sm text-gray-600 mt-2">
          {label} {count}
        </div>
      )}
    </div>
  );
}