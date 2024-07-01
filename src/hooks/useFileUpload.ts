import { useState } from 'react';

type FileUploadHookT = {
  file: File | null;
  preview: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
};

type Props = {
  maxSizeMB?: number;
};

export const useFileUpload = ({
  maxSizeMB = 5
}: Props = {}): FileUploadHookT => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const maxFileSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxFileSizeBytes) {
        alert(`File size should not exceed ${maxSizeMB} MB`);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  return { file: selectedFile, preview: filePreview, handleFileChange, reset };
};
