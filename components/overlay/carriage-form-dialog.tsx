// components/carriages/carriage-form-dialog.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCarriage } from '@/features/carriages/useCreateCarriages';
import { useUpdateCarriage } from '@/features/carriages/useUpdateCarriages';
import { useTrains } from '@/features/trains/useTrains';
import { Carriage } from '@/lib/types/carriages';
import { Loader2 } from 'lucide-react';

// ✅ FIX 1: Gunakan z.number() langsung, bukan z.coerce.number()
const carriageSchema = z.object({
  id_kereta: z.number().min(1, 'Pilih kereta'),
  nama_gerbong: z
    .string()
    .min(1, 'Nama gerbong harus diisi')
    .max(50, 'Nama terlalu panjang'),
  kelas_gerbong: z.enum(['ekonomi', 'bisnis', 'eksekutif'] as const),
  kuota: z.number().min(1, 'Kuota minimal 1').int('Kuota harus bilangan bulat'),
});

type CarriageFormValues = z.infer<typeof carriageSchema>;

interface CarriageFormDialogProps {
  carriage: Carriage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

export function CarriageFormDialog({
  carriage,
  open,
  onOpenChange,
  onSuccess,
  mode,
}: CarriageFormDialogProps) {
  const { trains, loading: trainsLoading } = useTrains();
  const { createCarriage, loading: createLoading, error: createError } =
    useCreateCarriage();
  const { updateCarriage, loading: updateLoading, error: updateError } =
    useUpdateCarriage();

  const loading = mode === 'create' ? createLoading : updateLoading;
  const error = mode === 'create' ? createError : updateError;

  const form = useForm<CarriageFormValues>({
    resolver: zodResolver(carriageSchema),
    defaultValues: {
      id_kereta: 0,
      nama_gerbong: '',
      kelas_gerbong: 'ekonomi',
      kuota: 50,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && carriage) {
        form.reset({
          id_kereta: carriage.id_kereta,
          nama_gerbong: carriage.nama_gerbong,
          kelas_gerbong: carriage.kelas_gerbong,
          kuota: carriage.kuota,
        });
      } else if (mode === 'create') {
        form.reset({
          id_kereta: 0,
          nama_gerbong: '',
          kelas_gerbong: 'ekonomi',
          kuota: 50,
        });
      }
    }
  }, [carriage, mode, open, form]);

  const onSubmit = async (values: CarriageFormValues) => {
    let result;

    if (mode === 'create') {
      result = await createCarriage(values);
    } else if (mode === 'edit' && carriage) {
      // Exclude id_kereta from update payload
      const { id_kereta, ...updateData } = values;
      result = await updateCarriage(carriage.id, updateData);
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
            {mode === 'create' ? 'Tambah Gerbong Baru' : 'Edit Gerbong'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi form di bawah untuk menambahkan gerbong baru.'
              : 'Ubah informasi gerbong. Klik simpan untuk menyimpan perubahan.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Select Kereta - Only for create mode */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="id_kereta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kereta *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))} // ✅ FIX: Parse to number
                      value={field.value?.toString() || ''}
                      disabled={trainsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kereta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trains.map((train) => (
                          <SelectItem key={train.id} value={train.id.toString()}>
                            {train.nama_kereta} ({train.kode_kereta})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pilih kereta untuk gerbong ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Display kereta info in edit mode */}
            {mode === 'edit' && carriage?.kereta && (
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-sm font-medium">Kereta:</p>
                <p className="text-sm text-muted-foreground">
                  {carriage.kereta.nama_kereta} ({carriage.kereta.kode_kereta})
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="nama_gerbong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Gerbong *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: A1, B2, VIP-1" {...field} />
                  </FormControl>
                  <FormDescription>Nama atau kode gerbong</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kelas_gerbong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas Gerbong *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas gerbong" />
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
              name="kuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuota Penumpang *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Contoh: 60"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} // ✅ FIX: Parse to number
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Jumlah maksimal penumpang dalam gerbong
                  </FormDescription>
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
                ) : mode === 'create' ? (
                  'Tambah Gerbong'
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}