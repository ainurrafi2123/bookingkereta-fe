// hooks/useRegister.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/schema/auth";
import { registerUser } from "@/lib/api/auth";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setError(null);

    try {
      await registerUser(values);
      // Bisa redirect ke dashboard atau halaman verifikasi
      // Untuk sekarang sesuai kode asli → ke login
      router.push("/login?registered=true"); 
    } catch (err: any) {
      if (err?.status === 422 && err.errors) {
        // Handle Laravel-like validation errors
        Object.entries(err.errors).forEach(([key, messages]) => {
          form.setError(key as keyof RegisterInput, {
            type: "manual",
            message: (messages as string[])[0],
          });
        });
        setError("Periksa kembali data yang Anda masukkan");
      } else {
        setError(err?.message || "Gagal mendaftar. Silakan coba lagi.");
      }
      console.error("Registration failed:", err);
    }
  };

  return {
    form,
    error,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}