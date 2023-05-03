import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FileUpload } from "../../../core/model/file-upload.model";
import { PdfManagerService } from "../../../core/service/pdf-manager.service";
import { PdfError, PdfErrorType } from "../../../core/model/pdf-error.model";

@Component({
  selector: "pdf-first-page",
  templateUrl: "./pdf-first-page.component.html"
})
export class PdfFirstPageComponent implements OnChanges {

  @Input() file: FileUpload | undefined;

  @Output() removeFile = new EventEmitter<string>();
  @Output() removeFilePassword = new EventEmitter<string>();
  @Output() removeFilePermissions = new EventEmitter<string>();

  @Output() pdfLoadFinished = new EventEmitter();

  @ViewChild("firstPageCanvas", {static: true, read: ElementRef<HTMLCanvasElement>})
  private firstPageCanvas?: ElementRef<HTMLCanvasElement>;

  readonly PdfErrorType = PdfErrorType;

  pdfError: PdfErrorType | undefined;
  isHovered: boolean = false;

  constructor(private pdfManagerService: PdfManagerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.file) {
      return;
    }

    const file = this.file.file;

    this.pdfManagerService.loadPdfFile(file).subscribe({
      next: (pdf) => {
        this.pdfError = undefined;
        this.pdfManagerService.buildFirstPageCanvas(pdf, this.firstPageCanvas!);
        this.pdfLoadFinished.next(this.file?.uuid);
      },
      error: (error: PdfError) => {
        this.pdfError = error.type;
        console.error(error);
        this.pdfLoadFinished.next(this.file?.uuid);
      },
    });
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
