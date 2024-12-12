import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { colorMap } from "../../utils/employeeFields";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  color: keyof typeof colorMap;
  useCard?: boolean;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  children,
  required = false,
  color,
  useCard = false,
}) => {
  const colorClasses = colorMap[color];
  const Icon = icon;
  const content = (
    <>
      <Label
        htmlFor={label.replace("*", "")}
        className="flex items-center text-gray-700 mb-2"
      >
        <div className={`p-2 rounded-full ${colorClasses} bg-opacity-20 mr-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium text-sm">{label.replace("*", "")}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </>
  );

  if (useCard) {
    return (
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-md ${colorClasses}`}
      >
        <CardContent className="p-4">{content}</CardContent>
      </Card>
    );
  }

  return <div className="space-y-2">{content}</div>;
};
