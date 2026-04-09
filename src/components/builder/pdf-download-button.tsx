"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type PDFDownloadButtonProps = {
  targetId: string;
  fileName?: string;
};

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PAGE_PADDING_PX = 36;
const PAGE_GAP_PX = 16;

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

function createPage() {
  const page = document.createElement("div");
  page.style.width = `${A4_WIDTH_PX}px`;
  page.style.height = `${A4_HEIGHT_PX}px`;
  page.style.background = "#ffffff";
  page.style.boxSizing = "border-box";
  page.style.overflow = "hidden";
  page.style.position = "relative";
  page.style.pageBreakAfter = "always";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.padding = `${PAGE_PADDING_PX}px`;
  inner.style.boxSizing = "border-box";
  inner.style.display = "flex";
  inner.style.flexDirection = "column";
  inner.style.gap = `${PAGE_GAP_PX}px`;
  inner.style.background = "#ffffff";

  page.appendChild(inner);

  return {
    page,
    inner,
  };
}

function normalizeBlock(block: HTMLElement, kind: "header" | "section") {
  block.style.width = "100%";
  block.style.maxWidth = "100%";
  block.style.margin = "0";
  block.style.transform = "none";
  block.style.position = "static";
  block.style.left = "0";
  block.style.top = "0";
  block.style.right = "auto";
  block.style.boxShadow = "none";
  block.style.breakInside = "avoid";
  block.style.pageBreakInside = "avoid";
  block.style.overflowWrap = "anywhere";
  block.style.wordBreak = "break-word";
  block.style.backgroundClip = "padding-box";

  if (kind === "header") {
    block.style.borderRadius = "16px";
  }

  block.querySelectorAll<HTMLElement>("*").forEach((node) => {
    node.style.transform = "none";
    node.style.scrollBehavior = "auto";
    node.style.overflowWrap = "anywhere";
    node.style.wordBreak = "break-word";
  });
}

function buildPaginatedDocument(target: HTMLElement, stage: HTMLDivElement) {
  const rootClone = target.cloneNode(true) as HTMLElement;
  rootClone.style.width = `${A4_WIDTH_PX}px`;
  rootClone.style.maxWidth = `${A4_WIDTH_PX}px`;
  rootClone.style.margin = "0";
  rootClone.style.padding = "0";
  rootClone.style.background = "#ffffff";
  rootClone.style.border = "0";
  rootClone.style.borderRadius = "0";
  rootClone.style.boxShadow = "none";

  const header = rootClone.firstElementChild as HTMLElement | null;
  const content = rootClone.children.item(1) as HTMLElement | null;

  if (!header || !content) {
    throw new Error("Could not prepare resume preview for PDF.");
  }

  const sectionBlocks = Array.from(content.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );

  const pages: HTMLDivElement[] = [];
  const pageInnerMaxHeight = A4_HEIGHT_PX - PAGE_PADDING_PX * 2;

  let currentPage = createPage();
  stage.appendChild(currentPage.page);
  pages.push(currentPage.page);

  const headerClone = header.cloneNode(true) as HTMLElement;
  normalizeBlock(headerClone, "header");
  currentPage.inner.appendChild(headerClone);

  for (const originalSection of sectionBlocks) {
    const sectionClone = originalSection.cloneNode(true) as HTMLElement;
    normalizeBlock(sectionClone, "section");

    currentPage.inner.appendChild(sectionClone);
    const usedHeight = currentPage.inner.scrollHeight;

    if (
      usedHeight > pageInnerMaxHeight &&
      currentPage.inner.children.length > 1
    ) {
      currentPage.inner.removeChild(sectionClone);

      currentPage = createPage();
      stage.appendChild(currentPage.page);
      pages.push(currentPage.page);

      currentPage.inner.appendChild(sectionClone);

      const singleSectionHeight = currentPage.inner.scrollHeight;
      if (singleSectionHeight > pageInnerMaxHeight) {
        // Keep the oversize section on the page instead of losing it.
        // It may still span visually, but this is safer than forcing blank pages.
      }
    }
  }

  return pages;
}

async function renderPageToCanvas(page: HTMLDivElement) {
  return html2canvas(page, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: A4_WIDTH_PX,
    height: A4_HEIGHT_PX,
    windowWidth: A4_WIDTH_PX,
    windowHeight: A4_HEIGHT_PX,
    scrollX: 0,
    scrollY: 0,
  });
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
      document.body.appendChild(stage);

      const pages = buildPaginatedDocument(target, stage);

      await waitForFonts();
      await new Promise((resolve) => setTimeout(resolve, 120));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await renderPageToCanvas(pages[index]);
        const image = canvas.toDataURL("image/png");

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(image, "PNG", 0, 0, 210, 297);
      }

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
