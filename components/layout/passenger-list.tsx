import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PassengerList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Penumpang Lain</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambahkan
        </Button>
      </div>

      <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
        Anda belum menambahkan penumpang lain.
      </div>
    </div>
  );
}