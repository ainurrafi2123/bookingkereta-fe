"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded hover:bg-gray-200"
    >
      <Menu size={20} />
    </button>
  );
}
