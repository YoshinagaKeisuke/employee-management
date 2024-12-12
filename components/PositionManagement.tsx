"use client";

import React from "react";
import { GenericManagementTable } from "./common/GenericManagementTable";
import { useManagementData } from "../hooks/useManagementData";
import { PositionManagementItem } from "../types/management";

export function PositionManagement() {
  const {
    items,
    setItems,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
  } = useManagementData<PositionManagementItem>("positions");

  return (
    <div>
      {/* Removed: <h2 className="text-2xl font-bold mb-4">役職管理</h2> */}
      <GenericManagementTable
        type="positions"
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        setItems={setItems}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  );
}
