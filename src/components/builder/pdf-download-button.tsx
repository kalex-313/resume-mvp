"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type PDFDownloadButtonProps = {
  targetId: string;
  fileName?: string;
};

const A4_WIDTH_PX = 794;
const PDF_MARGIN_MM = 10;
const PDF_PAGE_WIDTH_MM = 210;
const PDF_PAGE_HEIGHT_MM = 297;

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function waitForFonts() {
  const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fontSet?.ready) {
    await fontSet.ready;
  }
}

function createStageContainer() {
  const stage = document.createElement("div");
  stage.style.position = "fixed";
  stage.style.left = "-10000px";
  stage.style.top = "0";
  stage.style.width = `${A4_WIDTH_PX}px`;
  stage.style.background = "#ffffff";
  stage.style.padding = "0";
  stage.style.margin = "0";
  stage.style.zIndex = "-1";
  stage.style.opacity = "1";
  stage.style.pointerEvents = "none";
  stage.style.boxSizing = "border-box";
  return stage;
}

function prepareClone(target: HTMLElement) {
  const clone = target.cloneNode(true) as HTMLElement;
  clone.style.width = "100%";
  clone.style.maxWidth = "100%";
  clone.style.margin = "0";
  clone.style.transform = "none";
  clone.style.position = "static";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.right = "auto";
  clone.style.boxShadow = "none";
  clone.style.breakInside = "avoid";

  clone.querySelectorAll<HTMLElement>("*").forEach((node) => {
    node.style.transform = "none";
    node.style.scrollBehavior = "auto";
  });

  return clone;
}

function addCanvasToPdf(pdf: jsPDF, canvas: HTMLCanvasElement) {
  const contentWidthMm = PDF_PAGE_WIDTH_MM - PDF_MARGIN_MM * 2;
  const pageContentHeightMm = PDF_PAGE_HEIGHT_MM - PDF_MARGIN_MM * 2;
  const pageSliceHeightPx = Math.floor(
    (canvas.width * pageContentHeightMm) / contentWidthMm
  );

  let renderedHeightPx = 0;
  let pageIndex = 0;

  while (renderedHeightPx < canvas.height) {
    const sliceHeightPx = Math.min(
      pageSliceHeightPx,
      canvas.height - renderedHeightPx
    );

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const pageContext = pageCanvas.getContext("2d");
    if (!pageContext) {
      throw new Error("Could not render PDF page");
    }

    pageContext.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx
    );

    const pageImage = pageCanvas.toDataURL("image/png");
    const pageHeightMm = (sliceHeightPx * contentWidthMm) / canvas.width;

    if (pageIndex > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      pageImage,
      "PNG",
      PDF_MARGIN_MM,
      PDF_MARGIN_MM,
      contentWidthMm,
      pageHeightMm
    );

    renderedHeightPx += sliceHeightPx;
    pageIndex += 1;
  }
}

export function PDFDownloadButton({
  targetId,
  fileName = "resume",
}: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    const target = document.getElementById(targetId);

    if (!target) {
      alert("Could not find the resume preview to export.");
      return;
    }

    setLoading(true);

    const stage = createStageContainer();

    try {
      const clone = prepareClone(target);
      stage.appendChild(clone);
      document.body.appendChild(stage);

      await waitForFonts();
      await new Promise((resolve) => setTimeout(resolve, 120));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX,
        scrollX: 0,
        scrollY: 0,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      addCanvasToPdf(pdf, canvas);

      const safeName = sanitizeFileName(fileName) || "resume";
      pdf.save(`${safeName}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    } finally {
      stage.remove();
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {loading ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
}
