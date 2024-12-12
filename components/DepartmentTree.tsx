/**
 * @file components/DepartmentTree.tsx
 * @description 部署ツリーを表示するコンポーネントを定義します。
 * 部署の階層構造を表示し、ユーザーが部署を選択できるようにします。
 */

'use client'

/**
 * このファイルは、部署ツリーを表示するコンポーネントを定義します。
 * 部署の階層構造を表示し、ユーザーが部署を選択できるようにします。
 */

import { ChevronRight, ChevronDown, Users, Building2, Briefcase } from 'lucide-react'
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "./Search"
import { motion, AnimatePresence } from "framer-motion"
import { useEmployees } from '../contexts/EmployeeContext'
import { Department } from '../types/department'

interface DepartmentTreeProps {
  onSelect: (departmentId: string) => void;
  selectedDepartmentId: string;
}

/**
 * TreeNode コンポーネントのプロップスの型定義
 */
interface TreeNodeProps {
  department: Department;
  level: number;
  onSelect: (departmentId: string) => void;
  selectedDepartmentId: string;
  isVisible: boolean;
}

// 部署レベルに応じた背景色を定義
const levelColors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-pink-100",
];

/**
 * TreeNode コンポーネント
 * 部署ツリーの各ノードを表示します。
 */
function TreeNode({ department, level, onSelect, selectedDepartmentId, isVisible }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { departments } = useEmployees();
  const childDepartments = departments.filter(d => d.parentId === department.id);
  const hasChildren = childDepartments.length > 0;

  if (!isVisible) return null;

  const bgColorClass = levelColors[level % levelColors.length];

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal hover:bg-accent/50 transition-all duration-200",
          selectedDepartmentId === department.id && `${bgColorClass} font-medium`,
          "rounded-md overflow-hidden"
        )}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect(department.id);
        }}
      >
        {hasChildren && (
          <div className="text-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        {!hasChildren && <div className="w-4" />}
        {level === 0 ? <Building2 className="h-4 w-4 text-foreground" /> : <Briefcase className="h-4 w-4 text-foreground" />}
        <span className="truncate text-sm font-medium">{department.name}</span>
      </Button>
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {childDepartments.map((child) => (
              <TreeNode
                key={child.id}
                department={child}
                level={level + 1}
                onSelect={onSelect}
                selectedDepartmentId={selectedDepartmentId}
                isVisible={isVisible}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * DepartmentTree コンポーネント
 * 部署ツリー全体を管理し、検索機能を含みます。
 */
export function DepartmentTree({ onSelect, selectedDepartmentId }: DepartmentTreeProps) {
  const [searchResults, setSearchResults] = useState<string[]>([])
  const { departments, isLoading } = useEmployees();
  const [rootDepartments, setRootDepartments] = useState<Department[]>([]);

  useEffect(() => {
    setRootDepartments(departments.filter(d => !('parentId' in d) || d.parentId === null));
  }, [departments]);

  // 検索結果を処理する関数
  const handleSearchResults = (results: string[]) => {
    setSearchResults(results)
  }

  // 部署が表示可能かどうかを判断する関数
  const isDepartmentVisible = (departmentId: string) => {
    return searchResults.length === 0 || searchResults.includes(departmentId)
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="h-full bg-background">
      <div className="p-4">
        <Search onSearchResults={handleSearchResults} />
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-1 pb-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 font-normal hover:bg-accent/50 transition-all duration-200",
              selectedDepartmentId === 'all' && "bg-purple-100 font-medium",
              "rounded-md overflow-hidden"
            )}
            onClick={() => onSelect('all')}
          >
            <Users className="h-4 w-4 text-foreground" />
            <span className="truncate text-sm font-medium">全社員</span>
          </Button>
          {rootDepartments.map((department) => (
            <TreeNode
              key={department.id}
              department={department}
              level={0}
              onSelect={onSelect}
              selectedDepartmentId={selectedDepartmentId}
              isVisible={isDepartmentVisible(department.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

