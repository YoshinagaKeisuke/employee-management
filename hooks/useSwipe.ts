/**
 * @file hooks/useSwipe.ts
 * @description このファイルはスワイプ操作を検出するためのカスタムフックを提供します。
 * モバイルデバイスでのスワイプジェスチャーを処理するのに役立ちます。
 */

import { useState, useEffect, TouchEvent } from "react";

/**
 * スワイプ操作を検出し、指定されたコールバック関数を実行するカスタムフック
 * @param {SwipeInput} options - スワイプ操作の設定オプション
 * @returns {void}
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
}: SwipeInput) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) =>
      setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
      if (isRightSwipe && onSwipeRight) onSwipeRight();
    };

    document.addEventListener("touchstart", onTouchStart as any);
    document.addEventListener("touchmove", onTouchMove as any);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart as any);
      document.removeEventListener("touchmove", onTouchMove as any);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, touchStart, touchEnd, minSwipeDistance]);
}

interface SwipeInput {
  /** 左スワイプ時に実行されるコールバック関数 */
  onSwipeLeft?: () => void;
  /** 右スワイプ時に実行されるコールバック関数 */
  onSwipeRight?: () => void;
  /** スワイプと認識する最小の距離（ピクセル単位）。デフォルトは50px */
  minSwipeDistance?: number;
}
