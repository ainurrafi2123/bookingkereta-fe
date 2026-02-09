
export const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
] as const;

export const YOUTH_AGE_OPTIONS = [
  { value: "0-5 tahun", label: "0-5 tahun" },
  { value: "6-12 tahun", label: "6-12 tahun" },
  { value: "13-17 tahun", label: "13-17 tahun" },
  { value: "18-25 tahun", label: "18-25 tahun" },
] as const;

// Helper function untuk format tanggal
export function formatDate(date: Date | null): string {
  if (!date) return "";
  const dayName = DAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${dayName}, ${day} ${month}`;
}

// Summary penumpang
export function getPassengerSummary(
  isDefault: boolean,
  adults: number,
  elderly: number,
  youth: number
): string {
  if (isDefault) return "1 Penumpang";
  const total = adults + elderly + youth;
  return `${total} Penumpang${total > 1 ? "" : ""}`;
}