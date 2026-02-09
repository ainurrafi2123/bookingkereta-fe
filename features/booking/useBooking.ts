// features/booking/hooks/useBooking.ts
import { create } from 'zustand';
import type { Passenger } from '@/lib/types/booking';   // atau '../../types/booking'

interface BookingState {
  scheduleId: number | null;
  passengers: Passenger[];                    // ← tambah tipe di sini
  selectedSeatIds: number[];
  setScheduleId: (id: number) => void;
  setPassengers: (passengers: Passenger[]) => void;          // ← eksplisit Passenger[]
  updatePassenger: (index: number, updates: Partial<Passenger>) => void;
  setSelectedSeats: (seatIds: number[]) => void;
  reset: () => void;
}

export const useBooking = create<BookingState>((set) => ({
  scheduleId: null,
  passengers: [],                             // TS sekarang tahu ini Passenger[]
  selectedSeatIds: [],
  setScheduleId: (id) => set({ scheduleId: id }),
  setPassengers: (passengers) => set({ passengers }),          // passengers sekarang Passenger[]
  updatePassenger: (index, updates) =>
    set((state) => {
      const newPassengers = [...state.passengers];
      newPassengers[index] = { ...newPassengers[index], ...updates };
      return { passengers: newPassengers };
    }),
  setSelectedSeats: (seatIds) => set({ selectedSeatIds: seatIds }),
  reset: () => set({ scheduleId: null, passengers: [], selectedSeatIds: [] }),
}));