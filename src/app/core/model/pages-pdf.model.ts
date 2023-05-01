import { PDFPageProxy } from "pdfjs-dist";

export interface PagesPdf {
  uuid: string;
  pageNumber: number;
  pdfPage: PDFPageProxy;
  display: boolean;
}
