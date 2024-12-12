"use client";

import React, { useCallback } from "react";
import { GenericManagementTable } from "./common/GenericManagementTable";
import { useManagementData } from "../hooks/useManagementData";
import { DepartmentManagementItem } from "../types/management";
import { useToast } from "@/hooks/use-toast";

export function DepartmentManagement() {
  const {
    items,
    setItems,
    handleAdd: onAdd,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
    refreshItems,
  } = useManagementData<DepartmentManagementItem>("departments");
  const { toast } = useToast();

  const handleUpdateWithRefresh = async (
    id: string,
    item: Partial<DepartmentManagementItem>
  ) => {
    try {
      await handleUpdate(id, item);
      await refreshItems();
      toast({
        title: "更新成功",
        description: "部署情報が正常に更新されました。",
      });
    } catch (error) {
      console.error("Failed to update department:", error);
      toast({
        title: "エラー",
        description: `部署の更新に失敗しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleAdd = useCallback(
    async (newItem: Omit<DepartmentManagementItem, "id">) => {
      try {
        const itemToAdd = {
          ...newItem,
          parentId: newItem.parentId === "none" ? null : newItem.parentId,
        };
        await onAdd(itemToAdd);
        await refreshItems();
        toast({
          title: "追加成功",
          description: "新しい部署が正常に追加されました。",
        });
      } catch (error) {
        console.error("Failed to add department:", error);
        toast({
          title: "エラー",
          description: `部署の追加に失敗しました: ${
            error instanceof Error ? error.message : "不明なエラー"
          }`,
          variant: "destructive",
        });
      }
    },
    [onAdd, refreshItems, toast]
  );

  const getParentOptions = () =>
    items.filter((d) => d.parentId === null || d.parentId === undefined);

  return (
    <div>
      {/* Removed h2 tag */}
      <GenericManagementTable
        type="departments"
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdateWithRefresh}
        onDelete={handleDelete}
        getParentOptions={getParentOptions}
        setItems={setItems}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  );
}
