import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};
