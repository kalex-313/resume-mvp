
"use client";

import { useState } from "react";

export function PDFDownloadButton({
  targetId,
  fileName
}: {
  targetId: string;
  fileName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);

    try {
      const gate = await fetch("/api/pdf/export", {
        method: "POST"
      });

      const gateData = await gate.json();

      if (!gate.ok) {
        if (gateData?.code === "PDF_LOCKED") {
          window.location.href = "/upgrade";
          return;
        }

        alert(gateData?.error || "Access denied.");
        return;
      }

      // ✅ 原本 PDF logic（保留）
      const element = document.getElementById(targetId);

      if (!element) {
        alert("Preview not found.");
        return;
      }

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

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

      const ratio = Math.min(
        (pdfWidth - margin * 2) / canvas.width,
        (pdfHeight - margin * 2) / canvas.height
      );

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;

      pdf.addImage(imgData, "PNG", margin, margin, renderWidth, renderHeight);

      pdf.save(`${fileName || "resume"}.pdf`);
    } catch {
      alert("Could not generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
    >
      {loading ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
