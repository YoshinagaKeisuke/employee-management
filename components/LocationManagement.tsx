"use client";

import React from "react";
import { GenericManagementTable } from "./common/GenericManagementTable";
import { useManagementData } from "../hooks/useManagementData";
import { LocationManagementItem } from "../types/management";

export function LocationManagement() {
  const {
    items,
    setItems,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
  } = useManagementData<LocationManagementItem>("locations");

  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-4">拠点管理</h2> */}
      <GenericManagementTable
        type="locations"
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
