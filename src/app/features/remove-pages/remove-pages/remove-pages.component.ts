import { Component } from "@angular/core";
import { FileUpload } from "../../../core/model/file-upload.model";
import { v4 } from "uuid";
import { PagesPdf } from "../../../core/model/pages-pdf.model";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
import { catchError, from } from "rxjs";

@Component({
  selector: "app-remove-pages",
  templateUrl: "./remove-pages.component.html"
})
export class RemovePagesComponent {

  files: FileUpload[] = [];
  pagesPdf: PagesPdf[] = [];
  pdfError: "PASSWORD" | "INVALID" | "PERMISSIONS" | undefined;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  saveFile() {

  }

  addFiles($event: File[]) {
    $event.forEach(file => {
      this.files.push({
        uuid: v4(),
        file: file,
      });

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
          });

          const _pdf = pdf as PDFDocumentProxy;
          let numPages = pdf._pdfInfo.numPages;
          for (let i = 1; i <= numPages; i++) {
            _pdf.getPage(i).then(page => {
              this.pagesPdf.push({
                uuid: v4(),
                pageNumber: i,
                pdfPage: page,
                display: true,
              });
            });
          }
        });
      };
    });
  }

  saveNewPdf() {

  }
}
