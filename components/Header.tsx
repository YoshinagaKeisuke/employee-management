import React from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  ChevronLeft,
  Settings,
  UserPlus,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  handleNewEmployee: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ toggleSidebar, isSidebarOpen, handleNewEmployee }) => (
    <header className="h-16 bg-[rgb(2,65,115)] shadow-sm flex items-center justify-between px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="mr-4 text-white"
        aria-label={isSidebarOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
      <h1 className="text-3xl font-bold text-white flex-grow text-center hover:text-gray-200 transition-colors duration-200">
        社員一覧
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleNewEmployee}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>新規社員登録</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
);

Header.displayName = "Header";
