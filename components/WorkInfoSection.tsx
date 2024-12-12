import React, { useMemo } from "react";
import { Employee } from "../types/employee";
import { Department } from "../types/department";
import { Location } from "../types/location";
import { Position } from "../types/position";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";
import ja from "date-fns/locale/ja";
import { cn } from "@/lib/utils";
import { CustomDatePicker } from "./CustomDatePicker";
import { FormSection } from "./common/FormSection";
import { InfoItem } from "./common/InfoItem";
import { employeeFields } from "../utils/employeeFields";

/**
 * WorkInfoSectionProps インターフェース
 * WorkInfoSection コンポーネントのプロパティを定義します。
 */
interface WorkInfoSectionProps {
  formData: Employee;
  handleChange: (field: keyof Employee, value: any) => void;
  departments: Department[];
  locations: Location[];
  positions: Position[];
}

/**
 * WorkInfoSection コンポーネント
 * 従業員の業務情報を入力するフォームセクションを表示します。
 *
 * @param props WorkInfoSectionProps
 * @returns JSX.Element
 */
export function WorkInfoSection({
  formData,
  handleChange,
  departments,
  locations,
  positions,
}: WorkInfoSectionProps) {
  const workInfoFields = useMemo(
    () => ["employeeNumber", "department", "position", "location", "hireDate"],
    []
  );

  const renderSelect = useMemo(
    () =>
      (
        field: string,
        options: { id: string; name: string; order: number }[],
        placeholder: string
      ) =>
        (
          <Select
            value={formData[field] || "none"}
            onValueChange={(value) =>
              handleChange(field, value === "none" ? "" : value)
            }
            aria-label={employeeFields.find((f) => f.key === field)?.label}
          >
            <SelectTrigger className="text-black">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{placeholder}</SelectItem>
              {options
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ),
    [formData, handleChange]
  );

  const renderDatePicker = useMemo(
    () => (field: string) =>
      (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal text-black",
                !formData[field] && "text-muted-foreground"
              )}
              aria-label={`${
                employeeFields.find((f) => f.key === field)?.label
              }を選択`}
              aria-haspopup="dialog"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData[field] ? (
                format(new Date(formData[field]), "PPP", { locale: ja })
              ) : (
                <span>
                  {employeeFields.find((f) => f.key === field)?.label}を選択
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            role="dialog"
            aria-label="日付選択"
          >
            <CustomDatePicker
              selected={formData[field] ? new Date(formData[field]) : undefined}
              onSelect={(date) =>
                handleChange(
                  field,
                  date ? date.toISOString().split("T")[0] : ""
                )
              }
              isHireDate={field === "hireDate"}
            />
          </PopoverContent>
        </Popover>
      ),
    [formData, handleChange]
  );

  return (
    <FormSection title="業務情報">
      {employeeFields
        .filter((field) => workInfoFields.includes(field.key))
        .map((field) => (
          <InfoItem
            key={field.key}
            icon={field.icon}
            label={field.label}
            required={
              field.key === "employeeNumber" || field.key === "department"
            }
            color={field.color}
            useCard
          >
            {field.key === "department" &&
              renderSelect(field.key, departments, "部署を選択")}
            {field.key === "location" &&
              renderSelect(field.key, locations, "拠点を選択")}
            {field.key === "position" &&
              renderSelect(field.key, positions, "役職を選択")}
            {field.key === "hireDate" && renderDatePicker(field.key)}
            {field.key === "employeeNumber" && (
              <Input
                id={field.key}
                type="text"
                required
                placeholder="EMP001"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="text-black"
                aria-label={field.label}
              />
            )}
          </InfoItem>
        ))}
    </FormSection>
  );
}
