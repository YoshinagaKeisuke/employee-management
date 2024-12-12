import React from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import { FormSection } from "./common/FormSection";

interface ProfileImageSectionProps {
  imageUrl: string;
  handleImageChange: (file: File | null, error: string) => void;
  imageError: string;
}

export function ProfileImageSection({
  imageUrl,
  handleImageChange,
  imageError,
}: ProfileImageSectionProps) {
  return (
    <FormSection title="プロフィール画像">
      <div className="col-span-2">
        <ProfileImageUpload
          onImageChange={handleImageChange}
          currentImageUrl={imageUrl}
          aria-label="プロフィール画像のアップロード"
        />
        {imageError && (
          <p className="text-red-500 mt-2" role="alert" aria-live="assertive">
            {imageError}
          </p>
        )}
      </div>
    </FormSection>
  );
}
