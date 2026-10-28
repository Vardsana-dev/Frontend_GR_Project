"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Download,
  ExternalLink,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

interface PrintGrReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
}

export function PrintGrReportModal({
  isOpen,
  onClose,
  pdfUrl,
  loading,
  error,
  onRetry,
  title = "ລາຍງານການກວດຮັບສິນຄ້າ (PDF)",
  subtitle,
}: PrintGrReportModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showInPageFullscreen, setShowInPageFullscreen] = useState(false);

  // Reset fullscreen toggle when opening or when loading begins
  useEffect(() => {
    if (loading) {
      setShowInPageFullscreen(false);
    }
  }, [loading]);

  const handleOpenFullscreenTab = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
    onClose();
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch (err) {
        console.warn("Direct iframe print failed, fallback to window.open:", err);
      }
    }
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    const today = new Date().toISOString().slice(0, 10);
    link.download = `GR_Report_${today}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogOverlay className="bg-black/50 backdrop-blur-xs z-[100]" />

      <DialogContent
        showCloseButton={false}
        className={
          showInPageFullscreen
            ? "fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 z-[101] bg-white gap-0 outline-none overflow-hidden flex flex-col"
            : "max-w-md sm:max-w-lg w-full p-0 border border-gray-100 shadow-2xl rounded-2xl z-[101] bg-white gap-0 outline-none overflow-hidden flex flex-col"
        }
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Preview and print Goods Receipt PDF report
        </DialogDescription>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#1e40af]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e3a8a] leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons (only when in in-page fullscreen view) */}
          <div className="flex items-center gap-2">
            {showInPageFullscreen && pdfUrl && !loading && (
              <>
                <Button
                  onClick={handlePrint}
                  className="h-9 px-4 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg flex items-center gap-2 text-xs font-semibold shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>ພິມ (Print)</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="h-9 px-3.5 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center gap-2 text-xs font-semibold"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span className="hidden sm:inline">ດາວໂຫຼດ</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleOpenFullscreenTab}
                  title="ເປີດໃນແທັບໃໝ່"
                  className="h-9 w-9 p-0 text-gray-500 hover:text-gray-900 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {loading ? (
          /* ==================== 1. LOADING POPUP (Like in user screenshot) ==================== */
          <div className="flex flex-col items-center justify-center p-10 text-center animate-in fade-in-50 duration-200">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-[#1e40af] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#1e40af]" />
              </div>
            </div>
            <h3 className="text-base font-bold text-[#1e3a8a] mb-1.5">
              ກຳລັງສ້າງ ແລະ ໂຫຼດລາຍງານ PDF...
            </h3>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              ກະລຸນາລໍຖ້າຈັກໜ່ອຍ ລະບົບກຳລັງດຶງຂໍ້ມູນ ແລະ ສ້າງເອກະສານລາຍງານຈາກລະບົບ
            </p>
          </div>
        ) : error ? (
          /* ==================== 2. ERROR POPUP ==================== */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-in fade-in-50 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              ບໍ່ສາມາດດຶງລາຍງານ PDF ໄດ້
            </h3>
            <p className="text-xs text-red-600 mb-5">{error}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="h-9 px-5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg flex items-center gap-2 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                ລອງໃໝ່ອີກຄັ້ງ
              </Button>
            )}
          </div>
        ) : showInPageFullscreen && pdfUrl ? (
          /* ==================== 3. IN-PAGE FULLSCREEN IFRAME ==================== */
          <div className="flex-1 w-full h-full bg-gray-100/60 relative overflow-hidden">
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="w-full h-full border-0 bg-white"
              title="GR Report PDF Preview"
            />
          </div>
        ) : pdfUrl ? (
          /* ==================== 4. READY POPUP (Fallback if browser blocked auto-popup) ==================== */
          <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-200">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1e40af] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-[#1e40af]" />
            </div>
            <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">
              ສ້າງລາຍງານ PDF ສຳເລັດແລ້ວ!
            </h3>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">
              ກະລຸນາກົດປຸ່ມດ້ານລຸ່ມເພື່ອເປີດເບິ່ງໄຟລ໌ເຕັມຈໍ
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              <Button
                onClick={handleOpenFullscreenTab}
                className="w-full h-11 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ເປີດເບິ່ງເຕັມຈໍ (Open Full Screen)</span>
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
              <button
                onClick={() => setShowInPageFullscreen(true)}
                className="text-[#1e40af] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>ເບິ່ງເຕັມຈໍໃນໜ້ານີ້</span>
              </button>
              <span>•</span>
              <button
                onClick={handleDownload}
                className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ດາວໂຫຼດ</span>
              </button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
