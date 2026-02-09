"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SocialLoginButtons from "@/components/content/social-login-buttons";
import Link from "next/link";
import { useLogin } from "@/features/auth/useLogin";

export default function LoginForm() {
  const { form, error, isLoading, onSubmit } = useLogin();
  

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="shrink-0 mb-3">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p className="mt-1 text-sm text-gray-600">
            Selamat datang kembali di Senro 👋
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@contoh.com"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Masukkan password"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={onSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </div>
          </Form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Atau lanjut dengan</span>
            </div>
          </div>

          <SocialLoginButtons />

          <p className="text-center text-sm text-gray-600 pt-1 pb-2">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .flex-1::-webkit-scrollbar {
          width: 6px;
        }
        .flex-1::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .flex-1::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .flex-1::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}