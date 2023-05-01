import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
import { catchError, from } from "rxjs";
import { FileUpload } from "../../../core/model/file-upload.model";

@Component({
  selector: "pdf-page",
  templateUrl: "./pdf-page.component.html"
})
export class PdfPageComponent implements OnChanges {

  @Input() file: FileUpload | undefined;

  @Output() removeFile = new EventEmitter<string>();
  @Output() removeFilePassword = new EventEmitter<string>();
  @Output() removeFilePermissions = new EventEmitter<string>();

  @ViewChild("firstPageCanvas", {static: true, read: ElementRef<HTMLCanvasElement>})
  private firstPageCanvas?: ElementRef<HTMLCanvasElement>;

  pdfError: "PASSWORD" | "INVALID" | "PERMISSIONS" | undefined;
  isHovered: boolean = false;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.file) {
      return;
    }

    const file = this.file.file;

    if (file.type !== "application/pdf") {
      console.error("Le fichier sélectionné n'est pas un PDF.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
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
        from(pdf.getPermissions()).subscribe(permissions => {
          if (!permissions) {
            return;
          }

          console.warn("PDF has permissions", permissions);
          this.pdfError = "PERMISSIONS";
          return;
        })

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

  removeDocument() {
    if (!this.file) {
      return;
    }

    this.removeFile.next(this.file.uuid);
  }

  onButtonHover() {
    this.isHovered = true;
  }

  onButtonLeave() {
    this.isHovered = false;
  }

  removePassword() {
    if (!this.file) {
      return;
    }

    this.removeFilePassword.next(this.file.uuid);
  }

  removePermissions() {
    if (!this.file) {
      return;
    }

    this.removeFilePermissions.next(this.file.uuid);
  }
}
