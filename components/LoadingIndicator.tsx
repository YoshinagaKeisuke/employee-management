"use client";

/**
 * このファイルは、アプリケーション全体で使用されるローディングインジケータコンポーネントを定義します。
 * ローディング状態を視覚的に表現し、ユーザーに処理中であることを伝えます。
 */

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLoading } from "../contexts/LoadingContext";

/**
 * LoadingIndicator コンポーネント
 * アプリケーションのローディング状態を表示します。
 * LoadingContextを使用して、ローディング状態を管理します。
 *
 * @returns {JSX.Element | null} ローディング中はローディングインジケータを、そうでない場合はnullを返します。
 */
export function LoadingIndicator() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-full p-4 shadow-lg"
      >
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </motion.div>
    </motion.div>
  );
}
