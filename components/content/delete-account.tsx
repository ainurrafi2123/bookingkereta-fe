export function DeleteAccountSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Hapus Akun</h2>
      <p className="text-gray-600 mb-6">
        Silakan menghubungi Layanan Pelanggan untuk menghapus akun Anda.
      </p>
      <a
        href="mailto:help@omio.com"
        className="text-blue-600 hover:underline font-medium"
      >
        Kunjungi halaman kontak kami: help.omio.com
      </a>
    </div>
  );
}