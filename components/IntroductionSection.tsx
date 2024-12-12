import React from "react";
import { Employee } from "../types/employee";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./common/FormSection";
import { InfoItem } from "./common/InfoItem";
import { employeeFields } from "../utils/employeeFields";

/**
 * IntroductionSectionProps インターフェース
 * IntroductionSection コンポーネントのプロパティを定義します。
 */
interface IntroductionSectionProps {
  formData: Employee;
  handleChange: (field: keyof Employee, value: string) => void;
}

/**
 * IntroductionSection コンポーネント
 * 従業員の自己紹介を入力するフォームセクションを表示します。
 *
 * @param props IntroductionSectionProps
 * @returns JSX.Element
 */
export function IntroductionSection({
  formData,
  handleChange,
}: IntroductionSectionProps) {
  const introductionField = employeeFields.find(
    (f) => f.key === "introduction"
  );

  return (
    <FormSection title="自己紹介">
      <div className="col-span-2">
        <InfoItem
          icon={
            introductionField?.icon ||
            employeeFields.find((f) => f.key === "employeeNumber")!.icon
          }
          label="自己紹介"
          color="gray"
          useCard
        >
          <Textarea
            id="introduction"
            rows={4}
            placeholder="自己紹介を入力してください"
            value={formData.introduction}
            onChange={(e) => handleChange("introduction", e.target.value)}
            className="text-black"
            aria-label="自己紹介"
          />
        </InfoItem>
      </div>
    </FormSection>
  );
}
