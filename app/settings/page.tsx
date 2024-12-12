/**
 * @file app/settings/page.tsx
 * @description このファイルは設定ページのコンポーネントを定義します。
 * 拠点、役職、部署の管理機能を提供します。
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationManagement } from "../../components/LocationManagement";
import { PositionManagement } from "../../components/PositionManagement";
import { DepartmentManagement } from "../../components/DepartmentManagement";
import { SettingsHeader } from "../../components/SettingsHeader";

/**
 * SettingsPage コンポーネント
 * 設定ページの全体的な構造とレイアウトを定義します。
 * 拠点、役職、部署の管理タブを含みます。
 */
export default function SettingsPage() {
  const tabs = [
    { id: "locations", label: "拠点", content: <LocationManagement /> },
    { id: "positions", label: "役職", content: <PositionManagement /> },
    { id: "departments", label: "部署", content: <DepartmentManagement /> },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <SettingsHeader />
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
