"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function PDFDownloadButton({
  targetId,
  fileName
}: {
  targetId: string;
  fileName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    const element = document.getElementById(targetId);

    if (!element) {
      alert("Preview not found.");
      return;
    }

    setLoading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 28;
      const usableWidth = pdfWidth - margin * 2;
      const usableHeight = pdfHeight - margin * 2;

      const ratio = Math.min(
        usableWidth / canvas.width,
        usableHeight / canvas.height
      );

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;
      const x = (pdfWidth - renderWidth) / 2;
      const y = margin;

      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);

      pdf.setFontSize(9);
      pdf.setTextColor(140, 140, 140);
      pdf.text("Generated with Resume MVP Free Plan", pdfWidth - 180, pdfHeight - 14);

      const safeFileName = (fileName || "resume")
        .trim()
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");

      pdf.save(`${safeFileName || "resume"}.pdf`);
    } catch {
      alert("Could not generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
    >
      {loading ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
