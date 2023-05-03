import { ElementRef, Injectable } from "@angular/core";
import { catchError, concatMap, from, map, mergeMap, Observable, Observer, range, switchMap, toArray } from "rxjs";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfError, PdfErrorType } from "../model/pdf-error.model";
import { PagesPdf } from "../model/pages-pdf.model";
import { v4 } from "uuid";

@Injectable({
  providedIn: "root"
})
export class PdfManagerService {

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  // Charge un fichier PDF et renvoie un Observable qui émet le PDFDocumentProxy si le chargement réussit
  loadPdfFile(file: File): Observable<PDFDocumentProxy> {
    return from(this.loadPdfFileAsync(file)).pipe(
      map((pdf) => {
        this.checkPdfPermissions(pdf);
        return pdf;
      }),
      catchError((error) => {
        throw this.mapPdfError(error);
      })
    );
  }

  loadPdfPages(file: File): Observable<PagesPdf[]> {
    return this.loadPdfFile(file).pipe(
      mergeMap((pdf) => {
        return range(1, pdf.numPages).pipe(
          concatMap((pageNumber) => {
            return from(pdf.getPage(pageNumber)).pipe(
              map((page) => {
                const pagePdf: PagesPdf = {
                  uuid: v4(),
                  pageNumber: pageNumber,
                  pdfPage: page,
                  display: true,
                };
                return pagePdf;
              }),
            );
          }),
          toArray()
        );
      })
    );
  }


  buildFirstPageCanvas(pdf: PDFDocumentProxy, firstPageCanvas: ElementRef<HTMLCanvasElement>): void {
    pdf.getPage(1).then(page => {

      const canvas = firstPageCanvas.nativeElement;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({scale: 1});
      const ratio = canvas.width / viewport.width;
      const scaledViewport = page.getViewport({scale: ratio});
      canvas.height = scaledViewport.height;

      if (!context) {
        console.error("No context");
        return;
      }

      page.render({
        canvasContext: context,
        viewport: scaledViewport
      });
    });
  }

  // Charge un fichier PDF et renvoie une Promise qui résout avec le PDFDocumentProxy si le chargement réussit
  private loadPdfFileAsync(file: File): Observable<PDFDocumentProxy> {
    if (!file) {
      throw new Error("Aucun fichier sélectionné.");
    }

    const {type} = file;
    const PDF_MIME_TYPE = "application/pdf";

    if (type !== PDF_MIME_TYPE) {
      throw new Error("Le fichier sélectionné n'est pas un PDF.");
    }

    try {
      return this.readFileAsArrayBuffer(file).pipe(
        switchMap((arrayBuffer) => {
          return from(pdfjsLib.getDocument(arrayBuffer).promise);
        })
      );
    } catch (error) {
      throw error;
    }
  }

  // Lit un fichier en tant qu'objet ArrayBuffer
  private readFileAsArrayBuffer(file: File): Observable<ArrayBuffer> {
    return new Observable((observer: Observer<ArrayBuffer>) => {
      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as ArrayBuffer);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Vérifie les permissions du PDF et génère une erreur si elles sont manquantes
  private checkPdfPermissions(pdf: PDFDocumentProxy) {
    pdf.getPermissions().then((permissions) => {
      if (!permissions) {
        return;
      }

      throw new Error("Attention, il y a des restrictions sur ce PDF.");
    });
  }

  // Mappe les erreurs PDFJS en types d'erreur personnalisés
  private mapPdfError(error: any): PdfError {
    const pdfError: PdfError = {
      type: PdfErrorType.Unknown,
      message: "Une erreur est survenue lors du traitement du fichier PDF.",
    };

    if (error.name === "PasswordException") {
      pdfError.type = PdfErrorType.PasswordProtected;
      pdfError.message = "Le PDF est protégé par un mot de passe.";
    } else if (error.name === "InvalidPDFException") {
      pdfError.type = PdfErrorType.InvalidFormat;
      pdfError.message = "Le fichier PDF est invalide.";
    }

    return pdfError;
  }
}
