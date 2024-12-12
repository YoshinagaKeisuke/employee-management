import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, X } from "lucide-react";

/**
 * ProfileImageUploadコンポーネントのプロップスの型定義
 */
interface ProfileImageUploadProps {
  onImageChange: (file: File | null, error: string) => void;
  currentImageUrl?: string;
}

/**
 * ProfileImageUploadコンポーネントの参照で公開するメソッドの型定義
 */
export interface ProfileImageUploadRef {
  resetImage: () => void;
}

/**
 * プロフィール画像のアップロードを管理するコンポーネント
 *
 * このコンポーネントは、ユーザーがプロフィール画像をアップロード、プレビュー、
 * 削除することができる機能を提供します。ドラッグ＆ドロップとファイル選択の
 * 両方のアップロード方法をサポートしています。
 *
 * @param {ProfileImageUploadProps} props - コンポーネントのプロップス
 * @param {React.Ref<ProfileImageUploadRef>} ref - 親コンポーネントから参照するためのref
 */
const ProfileImageUpload = forwardRef<
  ProfileImageUploadRef,
  ProfileImageUploadProps
>(({ onImageChange, currentImageUrl }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [error, setError] = useState("");

  // 現在の画像URLが変更された場合、プレビューを更新
  useEffect(() => {
    if (currentImageUrl) {
      setImagePreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  // 親コンポーネントに公開するメソッドを定義
  useImperativeHandle(ref, () => ({
    resetImage: () => {
      setImagePreview(null);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onImageChange(null, "");
    },
  }));

  /**
   * ファイルのバリデーションを行う関数
   * @param {File} file - バリデーション対象のファイル
   * @returns {string} エラーメッセージ（エラーがない場合は空文字）
   */
  const validateFile = (file: File): string => {
    if (!file) return "";

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "ファイルサイズは5MB以内にしてください";
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return "JPG、PNG、GIF形式のファイルを選択してください";
    }

    return "";
  };

  /**
   * 画像が変更された際の処理
   * @param {File | null} file - 選択されたファイル
   */
  const handleImageChange = (file: File | null) => {
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setImagePreview(null);
        onImageChange(null, validationError);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onImageChange(file, "");
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      onImageChange(null, "");
    }
  };

  // 以下、イベントハンドラー関数

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange(null, "");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-4">
      {/* 画像プレビューエリア */}
      <div className="flex-shrink-0 w-40 h-40 relative mb-4 mx-auto md:mx-0">
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 border border-destructive rounded-full">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-xs text-destructive text-center mt-1">{error}</p>
          </div>
        ) : imagePreview ? (
          <Image
            src={imagePreview}
            alt="プロフィール"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted border border-border rounded-full">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {(imagePreview || error) && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-0 right-0 h-8 w-8 rounded-full transform translate-x-1/4 -translate-y-1/4"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ドラッグ＆ドロップエリア */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex-grow border-2 border-dashed rounded-lg p-4 transition-colors bg-background cursor-pointer hover:bg-accent/50 flex items-center relative ${
          isDragging
            ? "border-primary"
            : error
            ? "border-destructive"
            : "border-muted-foreground"
        }`}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 w-full">
          <Upload
            className={`w-8 h-8 ${
              error ? "text-destructive" : "text-muted-foreground"
            }`}
          />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ドラッグ＆ドロップ
              <span className="text-muted-foreground/50"> または </span>
              <span className="text-primary cursor-pointer hover:underline">
                ファイルを選択
              </span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG、PNG、GIF形式（5MB以内）
          </p>
        </div>
      </div>
    </div>
  );
});

ProfileImageUpload.displayName = "ProfileImageUpload";

export default ProfileImageUpload;
