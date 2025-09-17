import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { validateFile } from "@/lib/websocket/config";
import { toast } from "sonner";
import { ChatMessage } from "@/types/chat";

interface UseFileUploadProps {
  courseId: string;
  sendMessage: any;
  setPendingMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const useFileUpload = ({
  courseId,
  sendMessage,
  setPendingMessages,
}: UseFileUploadProps) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(`File error: ${validation.error}`);
        return;
      }

      const tempId = uuidv4();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      const uploadToCloudinary = async (file: File): Promise<string> => {
        if (!cloudName || !uploadPreset) {
          throw new Error(
            "Cloudinary config missing (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)"
          );
        }

        const isImage = file.type.startsWith("image/");
        const endpoint = isImage
          ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);

        const res = await fetch(endpoint, { method: "POST", body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            `Cloudinary upload failed: ${res.status} ${JSON.stringify(err)}`
          );
        }

        const data = await res.json();
        const fileUrl = (data.secure_url || data.url) as string;

        try {
          await sendMessage({
            courseId,
            tempId,
            type: "FILE",
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          }).unwrap();
        } catch (error) {
          toast.error(
            "Failed to send file message after upload. Please try again."
          );
          setPendingMessages((prev) =>
            prev.map((m) =>
              m.tempId === tempId ? { ...m, status: "ERROR" } : m
            )
          );
        }

        if (event.target) event.target.value = "";
        return fileUrl;
      };

      uploadToCloudinary(file).catch((err) => {
        toast.error(`Upload error: ${err.message}`);
        setPendingMessages((prev) =>
          prev.map((m) => (m.tempId === tempId ? { ...m, status: "ERROR" } : m))
        );
        if (event.target) event.target.value = "";
      });
    },
    [courseId, sendMessage, setPendingMessages]
  );

  return { handleFileUpload };
};
