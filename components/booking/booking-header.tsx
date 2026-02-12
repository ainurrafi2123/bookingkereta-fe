"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingHeaderProps {
  currentStep: 1 | 2;
}

export function BookingHeader({ currentStep }: BookingHeaderProps) {
  const steps = [
    { id: 1, label: "Detail Pemesanan" },
    { id: 2, label: "Pilih Metode Bayar" },
  ];

  return (
    <div className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo Section */}
        <div className="h-16 flex items-center">
          <Link href="/">
            <Image
              src="/src/Senro-malam.png"
              alt="Senro Logo"
              width={140}
              height={45}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Stepper Section */}
        <div className="flex items-center space-x-4 h-12">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center group">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-xs font-medium whitespace-nowrap",
                      isActive
                        ? "text-gray-900"
                        : isCompleted
                        ? "text-blue-600"
                        : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="mx-4 w-6 h-[1.5px] bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
