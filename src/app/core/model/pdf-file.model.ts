import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfError } from "./pdf-error.model";
import { PdfPage } from "./pdf-page.model";

export interface PdfFile {
  uuid: string;
  originalFile: File;
  pdfError?: PdfError;
  selected: boolean;

  // pdf proxy
  documentProxy?: PDFDocumentProxy;
  pagesProxy: PdfPage[];
}
