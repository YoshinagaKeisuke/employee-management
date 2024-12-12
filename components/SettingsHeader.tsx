import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const SettingsHeader: React.FC = () => (
  <header className="h-16 bg-[rgb(2,65,115)] shadow-sm flex items-center justify-between px-6">
    <Link href="/">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 text-white"
        aria-label="戻る"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </Link>
    <h1 className="text-3xl font-bold text-white flex-grow text-center">
      設定
    </h1>
    <div className="w-10"></div> {/* 右側のスペース調整用 */}
  </header>
);
