import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ja } from "date-fns/locale";

interface CustomDatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  isHireDate?: boolean;
}

export function CustomDatePicker({
  selected,
  onSelect,
  isHireDate,
}: CustomDatePickerProps) {
  const today = new Date();
  const oneMonthLater = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // 日付が選択された場合、その日の23:59:59に設定
      const adjustedDate = new Date(date);
      adjustedDate.setHours(23, 59, 59, 999);
      onSelect(adjustedDate);
    } else {
      onSelect(undefined);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      locale={ja}
      disabled={(date) =>
        isHireDate
          ? date > oneMonthLater || date < new Date("1900-01-01")
          : date > new Date() || date < new Date("1900-01-01")
      }
      captionLayout="dropdown"
      fromDate={new Date("1900-01-01")}
      toDate={isHireDate ? oneMonthLater : new Date()}
      defaultMonth={selected || (isHireDate ? today : new Date())}
      classNames={{
        day_hidden: "invisible",
        dropdown:
          "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        caption_dropdowns: "flex gap-3 flex-row-reverse",
        vhidden: "hidden",
        caption_label: "hidden",
      }}
      initialFocus
    />
  );
}
