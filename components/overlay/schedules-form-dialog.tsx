// components/schedules/schedule-form-dialog.tsx
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
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { useCreateSchedule } from '@/features/schedules/useCreateSchedules';
import { useUpdateSchedule } from '@/features/schedules/useUpdateSchedules';
import { useTrains } from '@/features/trains/useTrains';
import { Schedule } from '@/lib/types/schedules';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const scheduleSchema = z
  .object({
    id_kereta: z.number().min(1, 'Pilih kereta'),
    asal_keberangkatan: z
      .string()
      .min(1, 'Asal keberangkatan harus diisi')
      .max(100, 'Terlalu panjang'),
    tujuan_keberangkatan: z
      .string()
      .min(1, 'Tujuan keberangkatan harus diisi')
      .max(100, 'Terlalu panjang'),
    tanggal_berangkat: z.date().refine((date) => date !== null && date !== undefined, {
      message: 'Tanggal berangkat harus diisi',
    }),
    tanggal_kedatangan: z.date().refine((date) => date !== null && date !== undefined, {
      message: 'Tanggal kedatangan harus diisi',
    }),
    harga_dewasa: z.number().min(0, 'Harga tidak boleh negatif'),
    harga_anak: z.number().min(0, 'Harga tidak boleh negatif'),
    harga_lansia: z.number().min(0, 'Harga tidak boleh negatif'),
    status: z.enum(['active', 'completed', 'cancelled', 'maintenance'] as const).optional(),
  })
  .refine((data) => data.tanggal_kedatangan > data.tanggal_berangkat, {
    message: 'Tanggal kedatangan harus setelah tanggal berangkat',
    path: ['tanggal_kedatangan'],
  });

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleFormDialogProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

export function ScheduleFormDialog({
  schedule,
  open,
  onOpenChange,
  onSuccess,
  mode,
}: ScheduleFormDialogProps) {
  const { trains, loading: trainsLoading } = useTrains();
  const { createSchedule, loading: createLoading, error: createError } = useCreateSchedule();
  const { updateSchedule, loading: updateLoading, error: updateError } = useUpdateSchedule();

  const loading = mode === 'create' ? createLoading : updateLoading;
  const error = mode === 'create' ? createError : updateError;

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      id_kereta: 0,
      asal_keberangkatan: '',
      tujuan_keberangkatan: '',
      tanggal_berangkat: undefined,
      tanggal_kedatangan: undefined,
      harga_dewasa: 0,
      harga_anak: 0,
      harga_lansia: 0,
      status: 'active',
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && schedule) {
        form.reset({
          id_kereta: schedule.id_kereta,
          asal_keberangkatan: schedule.asal_keberangkatan,
          tujuan_keberangkatan: schedule.tujuan_keberangkatan,
          tanggal_berangkat: new Date(schedule.tanggal_berangkat),
          tanggal_kedatangan: new Date(schedule.tanggal_kedatangan),
          harga_dewasa: schedule.harga_dewasa,
          harga_anak: schedule.harga_anak,
          harga_lansia: schedule.harga_lansia,
          status: schedule.status,
        });
      } else if (mode === 'create') {
        form.reset({
          id_kereta: 0,
          asal_keberangkatan: '',
          tujuan_keberangkatan: '',
          tanggal_berangkat: undefined,
          tanggal_kedatangan: undefined,
          harga_dewasa: 0,
          harga_anak: 0,
          harga_lansia: 0,
          status: 'active',
        });
      }
    }
  }, [schedule, mode, open, form]);

  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00';
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const onSubmit = async (values: ScheduleFormValues) => {
    let result;

    if (mode === 'create') {
      const { status, ...createData } = values;
      const formattedData = {
        ...createData,
        tanggal_berangkat: formatDateTime(createData.tanggal_berangkat),
        tanggal_kedatangan: formatDateTime(createData.tanggal_kedatangan),
      };
      result = await createSchedule(formattedData);
    } else if (mode === 'edit' && schedule) {
      const { id_kereta, asal_keberangkatan, tujuan_keberangkatan, ...updateData } = values;
      const formattedData = {
        ...updateData,
        tanggal_berangkat: formatDateTime(updateData.tanggal_berangkat),
        tanggal_kedatangan: formatDateTime(updateData.tanggal_kedatangan),
      };
      result = await updateSchedule(schedule.id, formattedData);
    }

    if (result) {
      onOpenChange(false);
      onSuccess();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Jadwal Baru' : 'Edit Jadwal'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi form di bawah untuk menambahkan jadwal baru. Kode jadwal akan dibuat otomatis.'
              : 'Ubah informasi jadwal. Asal dan tujuan tidak dapat diubah.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Alert untuk edit mode */}
            {mode === 'edit' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Asal dan tujuan keberangkatan tidak dapat diubah setelah jadwal dibuat.
                </AlertDescription>
              </Alert>
            )}

            {/* Select Kereta - Create only */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="id_kereta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kereta *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Display kereta in edit mode */}
            {mode === 'edit' && schedule?.kereta && (
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-sm font-medium">Kereta:</p>
                <p className="text-sm text-muted-foreground">
                  {schedule.kereta.nama_kereta} ({schedule.kereta.kode_kereta})
                </p>
              </div>
            )}

            {/* Rute - Create only or display in edit */}
            <div className="grid grid-cols-2 gap-4">
              {mode === 'create' ? (
                <>
                  <FormField
                    control={form.control}
                    name="asal_keberangkatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asal Keberangkatan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Jakarta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tujuan_keberangkatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tujuan Keberangkatan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Surabaya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <div className="col-span-2 rounded-md border p-3 bg-muted/50">
                  <p className="text-sm font-medium mb-1">Rute:</p>
                  <p className="text-sm text-muted-foreground">
                    {schedule?.asal_keberangkatan} → {schedule?.tujuan_keberangkatan}
                  </p>
                </div>
              )}
            </div>

            {/* Tanggal dengan DateTimePicker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tanggal_berangkat"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Berangkat *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih tanggal & waktu"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tanggal_kedatangan"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Kedatangan *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih tanggal & waktu"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Harga */}
            <div className="space-y-3">
              <FormLabel>Harga Tiket *</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="harga_dewasa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Dewasa
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="harga_anak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Anak-anak
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="harga_lansia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Lansia
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription className="text-xs">
                Masukkan harga dalam Rupiah (IDR)
              </FormDescription>
            </div>

            {/* Status - Edit only */}
            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
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
                  'Tambah Jadwal'
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