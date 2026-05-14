"use client";

import { useState, useRef } from "react";
import { fileUpload } from "../api/upload/api";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fileUpload(file);
      // Assuming res.url contains the uploaded image URL
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative w-20 h-20 border rounded-lg overflow-hidden group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => onChange("")}
                className="text-white text-xs bg-red-500 px-1.5 py-0.5 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
          </button>
          {value && (
             <p className="text-[10px] text-gray-400 mt-1 truncate max-w-xs">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
