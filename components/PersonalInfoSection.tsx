import React, { useMemo } from 'react';
import { Employee } from '../types/employee';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns/format";
import ja from "date-fns/locale/ja";
import { cn } from "@/lib/utils";
import { CustomDatePicker } from './CustomDatePicker';
import { FormSection } from './common/FormSection';
import { InfoItem } from './common/InfoItem';
import { employeeFields, personalInfoFields } from '../utils/employeeFields';

/**
 * PersonalInfoSectionProps インターフェース
 * PersonalInfoSection コンポーネントのプロパティを定義します。
 */
interface PersonalInfoSectionProps {
  formData: Employee;
  handleChange: (field: keyof Employee, value: any) => void;
}

/**
 * PersonalInfoSection コンポーネント
 * 従業員の個人情報を入力するフォームセクションを表示します。
 * 
 * @param props PersonalInfoSectionProps
 * @returns JSX.Element
 */
export function PersonalInfoSection({ formData, handleChange }: PersonalInfoSectionProps) {
  const isPersonalField = (field: string) => personalInfoFields.includes(field);
  const isExcludedField = (field: string) => ['employeeNumber', 'department', 'position', 'location', 'hireDate', 'updatedAt'].includes(field);

  const getFieldLabel = useMemo(() => (field: string, index: number) => {
    if (field.includes('Kana')) {
      return index % 2 === 0 ? 'セイ' : 'メイ';
    }
    return index % 2 === 0 ? '姓' : '名';
  }, []);

  const getFieldPlaceholder = useMemo(() => (field: string, index: number) => {
    if (field.includes('Kana')) {
      return index % 2 === 0 ? 'ヤマダ' : 'タロウ';
    }
    return index % 2 === 0 ? '山田' : '太郎';
  }, []);

  return (
    <FormSection title="基本情報">
      {personalInfoFields.map((field, index) => (
        <InfoItem
          key={field}
          icon={employeeFields.find(f => f.key === 'gender')!.icon}
          label={getFieldLabel(field, index)}
          required
          color={index < 2 ? 'blue' : 'indigo'}
          useCard
        >
          <Input
            id={field}
            required
            placeholder={getFieldPlaceholder(field, index)}
            value={formData[field]}
            onChange={(e) => handleChange(field as keyof Employee, e.target.value)}
            className="text-black"
            aria-label={getFieldLabel(field, index)}
          />
        </InfoItem>
      ))}
      {employeeFields.filter(field => !isPersonalField(field.key) && !isExcludedField(field.key)).map(field => (
        <InfoItem
          key={field.key}
          icon={field.icon}
          label={field.label}
          required={field.key === 'email'}
          color={field.color}
          useCard
        >
          {field.key === 'gender' ? (
            <Select
              value={formData[field.key]}
              onValueChange={(value) => handleChange(field.key, value)}
              aria-label={field.label}
            >
              <SelectTrigger className="text-black">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男性">男性</SelectItem>
                <SelectItem value="女性">女性</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectContent>
            </Select>
          ) : field.key === 'birthDate' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal text-black",
                    !formData.birthDate && "text-muted-foreground"
                  )}
                  aria-label="生年月日を選択"
                  aria-haspopup="dialog"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.birthDate ? format(formData.birthDate, 'PPP', { locale: ja }) : <span>生年月日を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" role="dialog" aria-label="日付選択">
                <CustomDatePicker
                  selected={formData.birthDate}
                  onSelect={(date) => handleChange('birthDate', date)}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              id={field.key}
              type={field.key === 'email' ? 'email' : field.key === 'phoneNumber' ? 'tel' : 'text'}
              required={field.key === 'email'}
              placeholder={field.key === 'email' ? 'taro.yamada@example.com' : field.key === 'phoneNumber' ? '03-1234-5678' : ''}
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

