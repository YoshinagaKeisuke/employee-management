import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * DialogHeaderProps インターフェース
 * DialogHeaderコンポーネントのプロップスを定義します。
 */
interface DialogHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
}

/**
 * DialogHeader コンポーネント
 * モーダルやダイアログのヘッダー部分を表示します。
 * タイトル、説明（オプション）、閉じるボタンを含みます。
 * 
 * @param {DialogHeaderProps} props - コンポーネントのプロップス
 * @returns {JSX.Element} ダイアログヘッダーのJSX要素
 */
export function DialogHeader({ title, description, onClose }: DialogHeaderProps) {
  return (
    <CardHeader className="relative bg-[rgb(2,65,115)] py-4">
      {/* 閉じるボタン */}
      <div className="absolute top-2 right-2">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-gray-200">
          <X className="h-6 w-6" />
        </Button>
      </div>
      {/* タイトルと説明 */}
      <div className="text-center">
        <CardTitle className="text-2xl font-bold text-white mb-1">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-base text-gray-200 mb-0">
            {description}
          </CardDescription>
        )}
      </div>
    </CardHeader>
  );
}

