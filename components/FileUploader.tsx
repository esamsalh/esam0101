
import React, { useCallback, useRef } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, isProcessing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
        ${isProcessing ? 'border-indigo-200 bg-slate-50 pointer-events-none' : 'border-indigo-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/30'}
      `}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={inputRef}
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
      />
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-cloud-arrow-up text-indigo-600 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          {isProcessing ? 'Processing Documents...' : 'Upload your documents'}
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Drag and drop images here, or click to browse. Supports JPG, PNG, and JPEG formats.
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-language text-indigo-500"></i> Arabic / English
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-table text-indigo-500"></i> Table Recognition
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-file-lines text-indigo-500"></i> Layout Preservation
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
