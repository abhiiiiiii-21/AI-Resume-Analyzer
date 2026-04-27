"use client";

import { useId, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function InputText({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const id = useId();
  const max = 3000;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder="Paste the job description or role requirements…"
        required
        className="min-h-[160px] resize-none text-sm leading-relaxed border-border/60"
        style={{
          outline: 'none',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#1C4ED6';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,78,214,0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.boxShadow = '';
        }}
      />
      <p className="text-[11px] text-muted-foreground text-right tabular-nums">
        <span style={{ color: value.length > max * 0.9 ? '#1C4ED6' : undefined }}>
          {value.length}
        </span>
        {' '}/ {max}
      </p>
    </div>
  );
}