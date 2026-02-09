// components/trains/train-form-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateTrain } from "@/features/trains/useCreateTrains";
import { useUpdateTrain } from "@/features/trains/useUpdateTrains";
import { Train } from "@/lib/types/trains";
import { Loader2 } from "lucide-react";

// ✅ FIX: Tambahkan 'as const'
const trainSchema = z.object({
  nama_kereta: z
    .string()
    .min(1, "Nama kereta harus diisi")
    .max(255, "Nama terlalu panjang"),
  kelas_kereta: z.enum(["ekonomi", "bisnis", "eksekutif"] as const),
  deskripsi: z.string().optional(),
});

type TrainFormValues = z.infer<typeof trainSchema>;

interface TrainFormDialogProps {
  train: Train | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "create" | "edit";
}

export function TrainFormDialog({
  train,
  open,
  onOpenChange,
  onSuccess,
  mode,
}: TrainFormDialogProps) {
  const {
    createTrain,
    loading: createLoading,
    error: createError,
  } = useCreateTrain();
  const {
    updateTrain,
    loading: updateLoading,
    error: updateError,
  } = useUpdateTrain();

  const loading = mode === "create" ? createLoading : updateLoading;
  const error = mode === "create" ? createError : updateError;

  const form = useForm<TrainFormValues>({
    resolver: zodResolver(trainSchema),
    defaultValues: {
      nama_kereta: "",
      kelas_kereta: "ekonomi",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && train) {
        form.reset({
          nama_kereta: train.nama_kereta,
          kelas_kereta: train.kelas_kereta,
          deskripsi: train.deskripsi || "",
        });
      } else if (mode === "create") {
        form.reset({
          nama_kereta: "",
          kelas_kereta: "ekonomi",
          deskripsi: "",
        });
      }
    }
  }, [train, mode, open, form]);

  const onSubmit = async (values: TrainFormValues) => {
    let result;

    if (mode === "create") {
      result = await createTrain(values);
    } else if (mode === "edit" && train) {
      result = await updateTrain(train.id, values);
    }

    if (result) {
      onOpenChange(false);
      onSuccess();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Kereta Baru" : "Edit Kereta"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Isi form di bawah untuk menambahkan kereta baru. Kode kereta akan dibuat otomatis."
              : "Ubah informasi kereta. Klik simpan untuk menyimpan perubahan."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_kereta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kereta *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Argo Bromo Anggrek"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Nama lengkap kereta</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kelas_kereta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas Kereta *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas kereta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ekonomi">Ekonomi</SelectItem>
                      <SelectItem value="bisnis">Bisnis</SelectItem>
                      <SelectItem value="eksekutif">Eksekutif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tentang kereta (opsional)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : mode === "create" ? (
                  "Tambah Kereta"
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
