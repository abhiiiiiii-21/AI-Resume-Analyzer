"use client";

import { AlertCircleIcon, XIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

export default function FileUpload() {
  const maxSize = 10 * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({ maxSize });

  const file = files[0];

  return (
    <div className="flex flex-col gap-3">
      {!file && (
        <div
          className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center cursor-pointer transition-colors"
          style={{
            borderColor: isDragging ? '#1C4ED6' : undefined,
            background: isDragging ? 'rgba(28,78,214,0.04)' : undefined,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#1C4ED6';
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(28,78,214,0.04)';
          }}
          onMouseLeave={e => {
            if (!isDragging) {
              (e.currentTarget as HTMLDivElement).style.borderColor = '';
              (e.currentTarget as HTMLDivElement).style.background = '';
            }
          }}
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
        >
          <input {...getInputProps()} aria-label="Upload file" className="sr-only" />

          <div
            className="size-8 rounded-md border flex items-center justify-center mb-3"
            style={{ borderColor: 'rgba(28,78,214,0.3)', background: 'rgba(28,78,214,0.06)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1C4ED6" strokeWidth="1.5">
              <path d="M8 2v8M5 7l3 3 3-3"/>
              <rect x="2" y="11" width="12" height="3" rx="1"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Drop PDF here</p>
          <p className="text-xs text-muted-foreground">
            or{' '}
            <span className="underline underline-offset-2" style={{ color: '#1C4ED6' }}>
              browse file
            </span>
            {' '}· max {formatBytes(maxSize)}
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="flex items-center gap-1.5 text-destructive text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {file && (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2.5">
          <div className="size-7 rounded flex items-center justify-center shrink-0" style={{ background: '#1C4ED6' }}>
            <span className="text-[9px] font-bold text-white tracking-wide">PDF</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground truncate">{file.file.name}</p>
            <p className="text-[11px] text-muted-foreground">{formatBytes(file.file.size)}</p>
          </div>
          <Button
            aria-label="Remove file"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => removeFile(file.id)}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      )}

      {file && (
        <button
          onClick={openFileDialog}
          className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity text-left"
          style={{ color: '#1C4ED6' }}
        >
          Replace file
        </button>
      )}
    </div>
  );
}