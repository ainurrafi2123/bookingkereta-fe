// features/seats/components/GenerateSeatButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGenerateSeats } from '@/features/seats/useGenerateSeats';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GenerateSeatButtonProps {
  gerbongId: number;
  gerbongName: string;
  onSuccess?: () => void;
}

export function GenerateSeatButton({ gerbongId, gerbongName, onSuccess }: GenerateSeatButtonProps) {
  const { generate, loading } = useGenerateSeats();

  const handleGenerate = async () => {
    try {
      await generate(gerbongId);
      toast.success('Kursi berhasil di-generate!');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal generate kursi');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Kursi
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate Kursi?</AlertDialogTitle>
          <AlertDialogDescription>
            Kursi akan otomatis dibuat untuk <strong>{gerbongName}</strong> berdasarkan kuota dan kelas gerbong.
            <br /><br />
            Proses ini tidak bisa di-undo kecuali dengan reset.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerate}>
            Ya, Generate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}