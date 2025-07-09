import React from "react";
import { Modal } from "@/views/components/Modal";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File | string) => void;
}

export const ImportModal = ({ open, onClose, onImport }: ImportModalProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [url, setUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImport = () => {
    if (file) {
      onImport(file);
    } else if (url) {
      onImport(url);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add new subscribers">
      <div className="space-y-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="text-center">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {Math.round(file.size / 1024)}KB - Ready to import
              </p>
            </div>
          ) : (
            <>
              <p className="font-medium">Drag & Drop or Choose file to upload</p>
              <p className="text-sm text-gray-500">CSV or TXT</p>
            </>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">or</div>

        <div className="space-y-2">
          <p className="font-medium">Import from URL</p>
          <input
            type="text"
            placeholder="Add file URL"
            className="w-full p-2 border border-gray-300 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => window.open("/help-center", "_blank")}
          >
            Help Center
          </button>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleImport}
              disabled={!file && !url}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};