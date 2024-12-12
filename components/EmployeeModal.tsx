"use client";

import { useEffect, useState } from "react";
import { useEmployees } from "../contexts/EmployeeContext";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLoading } from "../contexts/LoadingContext";
import { DialogHeader } from "./DialogHeader";
import { formatDate } from "../utils/dateUtils";
import { employeeFields, personalInfoFields } from "../utils/employeeFields";
import { InfoItem } from "./common/InfoItem";
import { errorMessages } from "../utils/errorMessages";
import { showErrorToast, showSuccessToast } from "../utils/notifications";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Employee } from "../types/employee";
import { getItem } from "../utils/indexedDB";
import { colorMap } from "../utils/employeeFields";

interface EmployeeModalProps {
  employeeId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export function EmployeeModal({
  employeeId,
  onClose: propsonClose,
  onEdit,
}: EmployeeModalProps) {
  const {
    departments,
    locations,
    positions,
    deleteEmployee,
    refreshLocations,
    refreshEmployees,
  } = useEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { isLoading } = useLoading();
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        try {
          await refreshLocations();
          const foundEmployee = await getItem<Employee>(
            "employees",
            employeeId
          );
          if (foundEmployee) {
            setEmployee(foundEmployee);
          } else {
            console.error(`Employee with id ${employeeId} not found`);
            showErrorToast("エラー", "従業員データの取得に失敗しました。");
            propsonClose();
          }
        } catch (error) {
          console.error("Error fetching employee:", error);
          showErrorToast(
            "エラー",
            "従業員データの取得中にエラーが発生しました。"
          );
          propsonClose();
        }
      } else {
        setEmployee(null);
      }
    };
    fetchEmployee();
  }, [employeeId, propsonClose, refreshLocations]);

  if (!employeeId || !employee) return null;

  const department = departments.find((d) => d.id === employee.department);
  const location = locations.find((l) => l.id === employee.location);

  const handleDelete = () => {
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(employee.id);
      await refreshEmployees();
      showSuccessToast(
        "社員情報を削除しました",
        `${employee.lastName} ${employee.firstName}さんの情報を削除しました。`
      );
      propsonClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
      showErrorToast("削除に失敗しました", errorMessages.deleteEmployee);
    } finally {
      setShowDeleteConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmDialog(false);
  };

  const handleEdit = () => {
    onEdit(employee.id);
    propsonClose();
  };

  const truncateIntroduction = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const maxIntroLength = 100;

  const basicInfoFields = employeeFields.filter(
    (field) =>
      !personalInfoFields.includes(field.key) &&
      ![
        "employeeNumber",
        "department",
        "position",
        "location",
        "hireDate",
        "updatedAt",
      ].includes(field.key)
  );

  const workInfoFields = employeeFields.filter(
    (field) =>
      [
        "employeeNumber",
        "department",
        "position",
        "location",
        "hireDate",
      ].includes(field.key) &&
      (field.key !== "position" ||
        (employee[field.key] && employee[field.key] !== "none"))
  );

  const getPositionName = (positionId: string) => {
    if (!positionId || positionId === "none") return null;
    const position = positions.find((p) => p.id === positionId);
    return position ? position.name : null;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={propsonClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="w-full overflow-hidden shadow-lg">
          <DialogHeader title="社員詳細" onClose={propsonClose} />
          <CardContent className="px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-[40%]">
                  <div className="relative w-full max-w-[300px] max-h-[300px] mx-auto">
                    <div className="w-[300px] h-[300px] relative">
                      <Image
                        src={
                          employee.imageUrl ||
                          "https://placehold.jp/300x300.png"
                        }
                        alt={`${employee.lastName} ${employee.firstName}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.jp/300x300.png";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:w-[60%] flex flex-col h-[300px]">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-foreground mb-1">
                        {employee.lastName} {employee.firstName}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {employee.lastNameKana} {employee.firstNameKana}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex-1 bg-card rounded-lg shadow-sm border border-border p-4 overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => setIsIntroExpanded(!isIntroExpanded)}
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      自己紹介
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap break-words">
                      {isIntroExpanded
                        ? employee.introduction || "自己紹介はありません。"
                        : truncateIntroduction(
                            employee.introduction || "自己紹介はありません。",
                            maxIntroLength
                          )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="space-y-8">
                <Section title="基本情報">
                  {basicInfoFields.map((field) => (
                    <InfoItem
                      key={field.key}
                      icon={field.icon}
                      label={field.label}
                      color={field.color as keyof typeof colorMap}
                      useCard
                    >
                      <p className="text-lg font-medium text-foreground">
                        {field.key === "birthDate"
                          ? formatDate(employee[field.key] || "")
                          : (employee[field.key as keyof Employee] as string) ||
                            ""}
                      </p>
                    </InfoItem>
                  ))}
                </Section>

                <Separator />

                <Section title="業務情報">
                  {workInfoFields.map((field) => (
                    <InfoItem
                      key={field.key}
                      icon={field.icon}
                      label={field.label}
                      color={field.color as keyof typeof colorMap}
                      useCard
                    >
                      <p className="text-lg font-medium text-foreground">
                        {field.key === "position"
                          ? getPositionName(employee[field.key] || "")
                          : field.key === "department"
                          ? department?.name
                          : field.key === "location"
                          ? location?.name
                          : field.key === "hireDate"
                          ? formatDate(employee[field.key])
                          : employee[field.key as keyof Employee]}
                      </p>
                    </InfoItem>
                  ))}
                </Section>

                <Separator />

                <Section title="システム情報">
                  <InfoItem
                    icon={
                      employeeFields.find((f) => f.key === "updatedAt")!.icon
                    }
                    label="最終更新日"
                    color="gray"
                    useCard
                  >
                    <p className="text-lg font-medium text-foreground">
                      {formatDate(employee.updatedAt)}
                    </p>
                  </InfoItem>
                </Section>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-8 py-4 bg-muted">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  削除
                </>
              )}
            </Button>
            <Button variant="default" onClick={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              編集
            </Button>
          </CardFooter>
        </Card>
        <AlertDialog
          open={showDeleteConfirmDialog}
          onOpenChange={setShowDeleteConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>社員情報を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。本当に{employee.lastName}{" "}
                {employee.firstName}さんの情報を削除しますか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                キャンセル
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
