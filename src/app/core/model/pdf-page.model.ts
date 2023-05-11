import { PDFPageProxy } from "pdfjs-dist";

export interface PdfPage {
  uuid: string;
  pageNumber: number;
  pdfPage: PDFPageProxy;
  display: boolean;
}
