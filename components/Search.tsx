"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useEmployees } from "../contexts/EmployeeContext";

interface SearchProps {
  onSearchResults: (results: string[]) => void;
}

export function Search({ onSearchResults }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchEmployees } = useEmployees();

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);

      if (term.trim() === "") {
        onSearchResults([]);
        return;
      }

      try {
        const results = await searchEmployees(term);
        onSearchResults(results);
      } catch (error) {
        console.error("Error searching employees:", error);
        // エラー処理を追加することもできます（例：エラー通知の表示）
      }
    },
    [searchEmployees, onSearchResults]
  );

  return (
    <div className="p-2">
      <Input
        type="search"
        placeholder="社員名または部署名で検索"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
