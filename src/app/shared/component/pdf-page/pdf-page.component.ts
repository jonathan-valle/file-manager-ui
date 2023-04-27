import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
import { catchError, from } from "rxjs";
import { faCoffee, faLock } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "pdf-page",
  templateUrl: "./pdf-page.component.html"
})
export class PdfPageComponent implements OnChanges {

  @Input() file: File | undefined;


  @ViewChild("firstPageCanvas", {static: true, read: ElementRef<HTMLCanvasElement>})
  private firstPageCanvas?: ElementRef<HTMLCanvasElement>;

  pdfError: "PASSWORD" | "INVALID" | undefined;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.file) {
      return;
    }

    if (this.file.type !== "application/pdf") {
      console.error("Le fichier sélectionné n'est pas un PDF.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      from(pdfjsLib.getDocument(arrayBuffer).promise).pipe(
        catchError(err => {

          if (err.name === "PasswordException") {
            console.error("Password protected PDF");
            this.pdfError = "PASSWORD";
          }

          if (err.name === "InvalidPDFException") {
            console.error("Invalid PDF");
            this.pdfError = "INVALID";
          }

          return [];
        })
      ).subscribe(pdf => {
        const _pdf = pdf as PDFDocumentProxy;
        _pdf.getPage(1).then(page => {

          if (!this.firstPageCanvas) {
            console.error("No canvas ref");
            return;
          }

          const canvas = this.firstPageCanvas.nativeElement;
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
      });
    };
  }

  protected readonly faCoffee = faCoffee;
  protected readonly faLock = faLock;
}
