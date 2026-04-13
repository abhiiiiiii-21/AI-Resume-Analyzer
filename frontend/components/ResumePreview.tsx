"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Resume } from "@/types/resume";
import DefaultTheme from "./ResumeThemes/DefaultTheme";
import ModernTheme from "./ResumeThemes/ModernTheme";
import ProfessionalTheme from "./ResumeThemes/ProfessionalTheme";
import CompactTheme from "./ResumeThemes/CompactTheme";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Sparkles } from "lucide-react";

interface ResumePreviewProps {
  data: Resume;
  theme: string;
}

export default function ResumePreview({ data, theme }: ResumePreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getThemeComponent = () => {
    switch (theme) {
      case "modern":
        return <ModernTheme data={data} />;
      case "professional":
        return <ProfessionalTheme data={data} />;
      case "compact":
        return <CompactTheme data={data} />;
      default:
        return <DefaultTheme data={data} />;
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-180px)] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#050505] transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C4ED6] dark:text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex-1 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative p-8 border border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="w-full h-full border border-neutral-300 dark:border-neutral-700/50 rounded overflow-hidden bg-white ">
          <PDFViewer className="w-full h-full" showToolbar={false} style={{ width: '100%', height: '100%' }}>
            {getThemeComponent()}
          </PDFViewer>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <PDFDownloadLink
          document={getThemeComponent()}
          fileName={`resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'builder'}.pdf`}
          className="w-full max-w-sm"
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all font-semibold text-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              Generate PDF Resume
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
