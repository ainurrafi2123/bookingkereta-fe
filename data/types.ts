
export interface YouthAge {
  [key: number]: string;
}

export type PassengerType = "adults" | "elderly" | "youth";

export interface BookingFormState {
  fromCity: string;
  toCity: string;
  departDate: Date;
  isDefaultPassenger: boolean;
  adults: number;
  elderly: number;
  youth: number;
  youthAges: YouthAge;
}