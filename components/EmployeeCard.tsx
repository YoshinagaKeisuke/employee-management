/**
 * @file components/EmployeeCard.tsx
 * @description 従業員カードコンポーネントを定義します。
 * このコンポーネントは従業員の基本情報を表示するカードUIを提供します。
 */

import { Employee } from '../types/employee';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion";
import { useEmployees } from '../contexts/EmployeeContext';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const { positions } = useEmployees();

  const getPositionName = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : '';
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="w-24 flex-shrink-0 overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
          <CardContent className="p-2 flex flex-col items-center h-36">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-1">
              <Image
                src={employee.imageUrl || 'https://placehold.jp/150x150.png'}
                alt={employee.imageUrl ? `${employee.lastName} ${employee.firstName}` : 'デフォルトプロフィール画像'}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
            <div className="min-w-0 text-center flex flex-col justify-center">
              <h3 className="font-semibold text-xs text-center mt-1 truncate w-full text-gray-800">
                {employee.lastName} {employee.firstName}
              </h3>
              <div className="mt-0.5">
                {employee.position && (
                  <Badge 
                    variant="secondary" 
                    className="text-[9px] font-bold px-1.5 py-0.5"
                  >
                    {getPositionName(employee.position)}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

