import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  Observer,
  of,
  range,
  switchMap,
  toArray
} from "rxjs";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfError, PdfErrorType } from "../model/pdf-error.model";
import { PdfPage } from "../model/pdf-page.model";
import { v4 } from "uuid";
import { PdfFile } from "../model/pdf-file.model";

@Injectable({
  providedIn: "root"
})
export class PdfManagerService {

  private _filesLoading: string[] = [];

  private _loading = new BehaviorSubject(false);
  loading$ = this._loading.asObservable();

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  fileLoaded(uuid: string) {
    const index = this._filesLoading.indexOf(uuid);
    if (index !== -1) {
      this._filesLoading.splice(index, 1);
      console.log("fileLoaded", uuid);
    }
    this._loading.next(this._filesLoading.length > 0)
  }

  fileLoading(uuid: string) {
    this._filesLoading.push(uuid);
    this._loading.next(this._filesLoading.length > 0)
  }

  // Charge un fichier PDF et renvoie un Observable qui émet le PDFDocumentProxy si le chargement réussit
  loadPdfFile(originalFile: File, fileId: string): Observable<PdfFile> {
    return from(this.loadPdfFileAsync(originalFile)).pipe(
      mergeMap((pdf) => {
        return this.checkPdfPermissions(pdf).pipe(
          map((pdfError) => {
            const file: PdfFile = {
              uuid: fileId,
              originalFile: originalFile,
              pdfError: pdfError,
              documentProxy: pdf,
              pagesProxy: [],
              selected: false,
            };
            return file;
          })
        );
      }),
      mergeMap((pdfFile: PdfFile) => {
        if (pdfFile.documentProxy === undefined) {
          return of(pdfFile);
        }

        return this.loadPdfPages(pdfFile.documentProxy).pipe(
          map((pages) => {
            pdfFile.pagesProxy = pages;
            return pdfFile;
          })
        )
      }),

      catchError((error) => {
        this.mapPdfError(error);
        const file: PdfFile = {
          uuid: fileId,
          originalFile: originalFile,
          pdfError: this.mapPdfError(error),
          documentProxy: undefined,
          pagesProxy: [],
          selected: false,
        };
        return of(file);
      })
    );
  }

  loadPdfPages(pdfDocumentProxy: PDFDocumentProxy): Observable<PdfPage[]> {
    return range(1, pdfDocumentProxy.numPages).pipe(
      concatMap((pageNumber) => {
        return from(pdfDocumentProxy.getPage(pageNumber)).pipe(
          map((page) => {
            const pagePdf: PdfPage = {
              uuid: v4(),
              pageNumber: pageNumber,
              pdfPage: page,
              display: true,
              selected: false,
            };
            return pagePdf;
          }),
        );
      }),
      toArray()
    );
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
    return from(pdf.getPermissions()).pipe(
      map((permissions) => {
        if (!permissions) {
          return undefined;
        }
        const pdfError: PdfError = {
          type: PdfErrorType.Unknown
        };
        return pdfError;
      })
    );
  }

  // Mappe les erreurs PDFJS en types d'erreur personnalisés
  private mapPdfError(error: any): PdfError {
    const pdfError: PdfError = {
      type: PdfErrorType.Unknown
    };

    if (error.name === "PasswordException") {
      pdfError.type = PdfErrorType.PasswordProtected;
    } else if (error.name === "InvalidPDFException") {
      pdfError.type = PdfErrorType.InvalidFormat;
    }

    return pdfError;
  }
}
