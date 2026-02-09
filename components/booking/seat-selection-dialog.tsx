// components/booking/seat-selection-dialog.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useAvailableSeats } from "@/features/booking/useAvailableSeats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeatSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: number;
  requiredCount: number;
  onConfirm: (seats: { id: number; no: string }[]) => void;
  preSelectedSeatIds?: number[];
}

export function SeatSelectionDialog({
  open,
  onOpenChange,
  scheduleId,
  requiredCount,
  onConfirm,
  preSelectedSeatIds = [],
}: SeatSelectionDialogProps) {
  const { seatsData, isLoading, error, refetch } =
    useAvailableSeats(scheduleId);
  const [selectedSeats, setSelectedSeats] = useState<
    { id: number; no: string }[]
  >([]);
  const [selectedGerbongId, setSelectedGerbongId] = useState<string>("");

  // Initialize with pre-selected seats
  useEffect(() => {
    if (preSelectedSeatIds.length > 0 && seatsData) {
      const preSelected: { id: number; no: string }[] = [];
      seatsData.gerbong.forEach((g) => {
        g.kursi.forEach((k) => {
          if (preSelectedSeatIds.includes(k.id)) {
            preSelected.push({ id: k.id, no: k.no_kursi });
          }
        });
      });
      setSelectedSeats(preSelected);
    }
  }, [preSelectedSeatIds, seatsData]);

  // Set default gerbong when data is loaded
  useEffect(() => {
    if (seatsData && seatsData.gerbong.length > 0 && !selectedGerbongId) {
      setSelectedGerbongId(seatsData.gerbong[0].id_gerbong.toString());
    }
  }, [seatsData, selectedGerbongId]);

  const handleSeatClick = (seatId: number, seatNo: string, status: string) => {
    if (status === "booked") return;

    const isSelected = selectedSeats.some((s) => s.id === seatId);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
    } else {
      if (selectedSeats.length < requiredCount) {
        setSelectedSeats([...selectedSeats, { id: seatId, no: seatNo }]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === requiredCount) {
      onConfirm(selectedSeats);
      onOpenChange(false);
    }
  };

  const canConfirm = selectedSeats.length === requiredCount;

  // Group seats by gerbong for selection
  const gerbongOptions = useMemo(() => {
    if (!seatsData) return [];
    return seatsData.gerbong.map((g) => ({
      id: g.id_gerbong,
      name: g.nama_gerbong,
      kelas: g.kelas,
      seats: g.kursi,
    }));
  }, [seatsData]);

  const currentGerbong = useMemo(() => {
    return gerbongOptions.find((g) => g.id.toString() === selectedGerbongId);
  }, [gerbongOptions, selectedGerbongId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pilih Kursi</DialogTitle>
          <DialogDescription>
            Pilih {requiredCount} kursi untuk penumpang Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selection Info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium">
              Kursi dipilih: {selectedSeats.length} / {requiredCount}
            </span>
            {selectedSeats.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {selectedSeats.map((seat) => (
                  <Badge key={seat.id} variant="default">
                    {seat.no}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Legend & Carriage Selection */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-green-500 bg-green-50 rounded" />
                <span>Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 bg-blue-100 rounded" />
                <span>Dipilih</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <span>Terisi</span>
              </div>
            </div>

            {!isLoading && !error && gerbongOptions.length > 0 && (
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Gerbong:</span>
                <Select
                  value={selectedGerbongId}
                  onValueChange={setSelectedGerbongId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Gerbong" />
                  </SelectTrigger>
                  <SelectContent>
                    {gerbongOptions.map((gerbong) => (
                      <SelectItem
                        key={gerbong.id}
                        value={gerbong.id.toString()}
                      >
                        {gerbong.name} ({gerbong.kelas})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Seat Grid */}
          {!isLoading && !error && currentGerbong && (
            <div className="mt-6">
              <div className="mb-4 text-center">
                <Badge variant="outline" className="text-sm py-1 px-4">
                  {currentGerbong.name} - {currentGerbong.kelas.toUpperCase()}
                </Badge>
              </div>
              <SeatGridLayout
                seats={currentGerbong.seats}
                kelas={currentGerbong.kelas}
                selectedSeatIds={selectedSeats.map((s) => s.id)}
                onSeatClick={handleSeatClick}
              />
            </div>
          )}
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Konfirmasi ({selectedSeats.length}/{requiredCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Seat Grid Layout Component
interface SeatGridLayoutProps {
  seats: {
    id: number;
    no_kursi: string;
    baris: number;
    kolom: string;
    status: "available" | "booked";
  }[];
  kelas: string;
  selectedSeatIds: number[];
  onSeatClick: (id: number, no: string, status: string) => void;
}

function SeatGridLayout({
  seats,
  kelas,
  selectedSeatIds,
  onSeatClick,
}: SeatGridLayoutProps) {
  const is2x2 = kelas === "eksekutif" || kelas === "bisnis";
  const columns = is2x2
    ? ["A", "B", "C", "D"]
    : ["A", "B", "C", "D", "E", "F"];

  // Group seats by row
  const seatMap = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.baris]) {
        acc[seat.baris] = [];
      }
      acc[seat.baris].push(seat);
      return acc;
    },
    {} as Record<number, typeof seats>
  );

  return (
    <div className="space-y-4">
      {/* Header Kolom */}
      <div className="flex justify-center gap-2">
        <div className="flex gap-2">
          {columns.slice(0, is2x2 ? 2 : 3).map((col) => (
            <div
              key={col}
              className="w-12 text-center text-sm font-medium text-muted-foreground"
            >
              {col}
            </div>
          ))}
        </div>
        <div className="w-8" /> {/* Gang tengah */}
        <div className="flex gap-2">
          {columns.slice(is2x2 ? 2 : 3).map((col) => (
            <div
              key={col}
              className="w-12 text-center text-sm font-medium text-muted-foreground"
            >
              {col}
            </div>
          ))}
        </div>
      </div>

      {/* Seat Rows */}
      <div className="space-y-2">
        {Object.entries(seatMap)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([baris, rowSeats]) => (
            <div
              key={baris}
              className="flex items-center justify-center gap-2"
            >
              {/* Nomor Baris */}
              <span className="w-8 text-sm font-medium text-muted-foreground text-right">
                {baris}
              </span>

              {/* Left Side */}
              <div className="flex gap-2">
                {rowSeats
                  .filter((s) =>
                    columns.slice(0, is2x2 ? 2 : 3).includes(s.kolom)
                  )
                  .sort((a, b) => a.kolom.localeCompare(b.kolom))
                  .map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      onClick={() =>
                        onSeatClick(seat.id, seat.no_kursi, seat.status)
                      }
                    />
                  ))}
              </div>

              {/* Gang Tengah */}
              <div className="w-8" />

              {/* Right Side */}
              <div className="flex gap-2">
                {rowSeats
                  .filter((s) =>
                    columns.slice(is2x2 ? 2 : 3).includes(s.kolom)
                  )
                  .sort((a, b) => a.kolom.localeCompare(b.kolom))
                  .map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      onClick={() =>
                        onSeatClick(seat.id, seat.no_kursi, seat.status)
                      }
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Individual Seat Button
interface SeatButtonProps {
  seat: {
    id: number;
    no_kursi: string;
    status: "available" | "booked";
  };
  isSelected: boolean;
  onClick: () => void;
}

function SeatButton({ seat, isSelected, onClick }: SeatButtonProps) {
  const getClassName = () => {
    if (seat.status === "booked") {
      return "w-12 h-12 bg-gray-300 text-gray-500 rounded cursor-not-allowed";
    }
    if (isSelected) {
      return "w-12 h-12 border-2 border-blue-500 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200";
    }
    return "w-12 h-12 border-2 border-green-500 bg-green-50 text-green-700 rounded cursor-pointer hover:bg-green-100";
  };

  return (
    <button
      onClick={onClick}
      disabled={seat.status === "booked"}
      className={`${getClassName()} flex items-center justify-center text-xs font-medium transition-colors`}
      title={seat.status === "booked" ? "Kursi sudah terisi" : seat.no_kursi}
    >
      {seat.no_kursi}
    </button>
  );
}
