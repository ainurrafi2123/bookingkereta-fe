'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, XCircle } from 'lucide-react';
import { getBookingReceipt, type BookingReceipt } from '@/lib/api/booking';
import { useReactToPrint } from 'react-to-print';

interface ReceiptDialogProps {
  bookingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptDialog({
  bookingId,
  open,
  onOpenChange,
}: ReceiptDialogProps) {
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Receipt-${receipt?.kode_pemesanan_display || 'ticket'}`,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 12mm; 
      }
      @media print {
        html, body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
  });

  useEffect(() => {
    if (!bookingId || !open) return;

    const fetchReceipt = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookingReceipt(bookingId);
        setReceipt(data);
      } catch (err: any) {
        console.error('Failed to fetch receipt:', err);
        setError('Gagal memuat data receipt.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [bookingId, open]);

  const isCancelled = receipt?.status === 'cancelled';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Bukti Pemesanan</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="p-6 text-destructive">{error}</div>
        ) : receipt ? (
          <>
            <div ref={printRef}>
              {/* Inline styles for print */}
              <div style={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                maxWidth: 480,
                margin: '0 auto',
                padding: '16px 24px',
                position: 'relative',
                color: '#1e293b',
              }}>

                {/* Cancelled Watermark */}
                {isCancelled && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    fontSize: 64,
                    fontWeight: 800,
                    color: 'rgba(239, 68, 68, 0.12)',
                    letterSpacing: 8,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 1,
                    textTransform: 'uppercase',
                  }}>
                    DIBATALKAN
                  </div>
                )}

                {/* Header */}
                <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '2px solid #e2e8f0' }}>
                  <img
                    src="/src/Senro-malam.png"
                    alt="Senro Travel"
                    style={{ height: 40, margin: '0 auto 8px auto', display: 'block' }}
                  />
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#475569',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    margin: 0,
                  }}>
                    {receipt.perusahaan.nama}
                  </p>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {receipt.perusahaan.npwp}
                  </p>
                </div>

                {/* Cancelled Banner */}
                {isCancelled && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 16px',
                    margin: '12px 0',
                  }}>
                    <XCircle style={{ height: 18, width: 18, color: '#dc2626' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                      PEMESANAN DIBATALKAN
                    </span>
                  </div>
                )}

                {/* Kode Pemesanan */}
                <div style={{
                  textAlign: 'center',
                  backgroundColor: isCancelled ? '#fef2f2' : '#f8fafc',
                  border: `2px dashed ${isCancelled ? '#fca5a5' : '#cbd5e1'}`,
                  borderRadius: 8,
                  padding: '12px',
                  margin: '12px 0',
                }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                    Kode Pemesanan
                  </p>
                  <p style={{
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: 3,
                    margin: '4px 0 0 0',
                    textDecoration: isCancelled ? 'line-through' : 'none',
                    color: isCancelled ? '#ef4444' : '#1e293b',
                  }}>
                    {receipt.kode_pemesanan_display}
                  </p>
                </div>

                {/* Detail Pembayaran */}
                <div style={{ padding: '10px 0' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Detail Pembayaran
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Tanggal Pembayaran</span>
                    <span style={{ fontWeight: 500 }}>{receipt.detail_pembayaran.tanggal_pembayaran}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>Metode Pembayaran</span>
                    <span style={{ fontWeight: 500 }}>{receipt.detail_pembayaran.metode_pembayaran}</span>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '4px 0' }} />

                {/* Detail Perjalanan */}
                <div style={{ padding: '10px 0' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Detail Perjalanan
                  </p>
                  {receipt.detail_pemesanan.map((trip, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: 8,
                      padding: 12,
                      opacity: isCancelled ? 0.6 : 1,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{trip.kereta}</p>
                          <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 0' }}>No. KA: {trip.nomor_ka}</p>
                        </div>
                        <span style={{
                          fontSize: 10,
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}>
                          {receipt.rincian.kelas}
                        </span>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '6px 0' }} />
                      {/* Departure */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div style={{ marginTop: 5, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{trip.keberangkatan.split('|')[0].trim()}</p>
                          <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 0' }}>{trip.keberangkatan.split('|')[1]?.trim()}</p>
                        </div>
                      </div>
                      <div style={{ width: 2, height: 12, backgroundColor: '#cbd5e1', marginLeft: 3 }} />
                      {/* Arrival */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                        <div style={{ marginTop: 5, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f97316', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{trip.tujuan.split('|')[0].trim()}</p>
                          <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 0' }}>{trip.tujuan.split('|')[1]?.trim()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '4px 0' }} />

                {/* Detail Penumpang */}
                <div style={{ padding: '10px 0' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Detail Penumpang
                  </p>
                  {receipt.detail_penumpang.map((p, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: idx < receipt.detail_penumpang.length - 1 ? '1px solid #f1f5f9' : 'none',
                      fontSize: 12,
                      opacity: isCancelled ? 0.6 : 1,
                    }}>
                      <div>
                        <p style={{ fontWeight: 500, margin: 0 }}>{p.penumpang}</p>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 0' }}>NIK: {p.no_identitas}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 500, margin: 0 }}>{p.kursi}</p>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 0' }}>{p.kelas}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '4px 0' }} />

                {/* Rincian Harga */}
                <div style={{ padding: '10px 0' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Rincian Harga
                  </p>
                  {receipt.rincian.penumpang.map((p, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      padding: '3px 0',
                      opacity: isCancelled ? 0.6 : 1,
                    }}>
                      <span style={{ color: '#475569' }}>{p.nama}</span>
                      <span style={{
                        fontWeight: 500,
                        textDecoration: isCancelled ? 'line-through' : 'none',
                      }}>{p.harga}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderTop: '2px solid #e2e8f0',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Total Pembayaran</span>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isCancelled ? '#ef4444' : '#2563eb',
                    textDecoration: isCancelled ? 'line-through' : 'none',
                  }}>
                    {receipt.total_pembayaran}
                  </span>
                </div>

                {/* Info Pemesan */}
                <div style={{ padding: '10px 0', borderTop: '1px dashed #cbd5e1' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Info Pemesan
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Nama</span>
                    <span style={{ fontWeight: 500 }}>{receipt.pemesanan.nama}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Email</span>
                    <span style={{ fontWeight: 500 }}>{receipt.pemesanan.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>No. Telepon</span>
                    <span style={{ fontWeight: 500 }}>{receipt.pemesanan.no_telepon}</span>
                  </div>
                </div>

                {/* PPN Disclaimer */}
                <div style={{ textAlign: 'center', padding: '10px 0', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 8, color: '#94a3b8', margin: 0 }}>
                    {receipt.ppn_info} {receipt.ppn_disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Print Button */}
            <div style={{ padding: '8px 24px 24px 24px', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => handlePrint()} className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                {isCancelled ? 'Cetak Bukti Pembatalan (Refund)' : 'Cetak / Print'}
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
