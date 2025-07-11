import { ImageHelper } from "@/core/helpers/ImageHelper";
import React from "react"
import { Trash2, Image } from "react-feather"

interface InputImageProps {
  images: (File | string)[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  label?: string;
  className?: string;
  error?: string;
}

const InputOneImage = ({
  images,
  onImageUpload,
  onRemoveImage,
  className = "",
  label,
  error,
}: InputImageProps) => (
    <div className={`${className}`}>
        <div className="flex gap-4 flex-wrap">
            {images.length === 0 && (
                <label className="w-30 h-30 border border-dashed border-gray-300 flex flex-col items-center justify-center rounded cursor-pointer text-gray-500 text-sm">
                    <label>Inputkan Gambar</label>
                    <span><Image size={50} /></span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                    />
                </label>
            )}
            {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded overflow-hidden shadow">
                    <img
                        src={ImageHelper(img)}
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover rounded"
                    />
                    <button
                        type="button"
                        onClick={() => onRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
        {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
    </div>
)

export default InputOneImage;
