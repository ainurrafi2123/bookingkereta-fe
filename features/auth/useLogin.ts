// hooks/useLogin.ts
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schema/auth";
import { loginUser } from "@/lib/api/auth";
import { toast } from "sonner"; // 1. Import toast dari sonner

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Ambil params
  const [error, setError] = useState<string | null>(null);
  const hasShownToast = useRef(false);

  useEffect(() => {
    const registered = searchParams.get("registered");

    if (registered === "true" && !hasShownToast.current) {
      hasShownToast.current = true; // Tandai sudah muncul

      toast.success("Registrasi Berhasil!", {
        description: "Silakan login dengan akun baru Anda.",
      });

      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setError(null);

    try {
      const data = await loginUser(values);

      // Simpan token & user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.user.username ?? data.user.name,
          email: data.user.email,
          role: data.user.role,
          profile_photo: data.user.profile_photo,
        }),
      );

      // 2. Tampilkan Toast Sukses
      toast.success("Login Berhasil!", {
        description: `Selamat datang kembali, ${data.user.username ?? data.user.name}`,
      });

      // Redirect berdasarkan role
      if (data.user.role === "petugas") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const errorMessage =
        err?.status === 401 || err?.status === 422
          ? err.message || "Email atau password salah"
          : err?.message || "Gagal masuk. Silakan coba lagi.";

      setError(errorMessage);

      // 3. Tampilkan Toast Error
      toast.error("Login Gagal", {
        description: errorMessage,
      });

      console.error("Login failed:", err);
    }
  };

  return {
    form,
    error,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
