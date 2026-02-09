// components/sections/footer/PaymentIcon.tsx

type PaymentIconProps = {
  src: string;
  alt: string;
};

export default function PaymentIcon({ src, alt }: PaymentIconProps) {
  return (
    <div className="bg-white rounded border border-gray-200 p-2 flex items-center justify-center h-10 min-w-20">
      <img src={src} alt={alt} className="h-6 w-auto object-contain" />
    </div>
  );
}
