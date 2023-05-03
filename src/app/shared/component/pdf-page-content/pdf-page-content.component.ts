import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import * as pdfjsLib from "pdfjs-dist";
import { PagesPdf } from "../../../core/model/pages-pdf.model";

@Component({
  selector: "pdf-page-content",
  templateUrl: "./pdf-page-content.component.html"
})
export class PdfPageContentComponent implements OnChanges {

  @Input() pagePdf: PagesPdf | undefined;

  @ViewChild("pagePdfCanvas", {static: true, read: ElementRef<HTMLCanvasElement>})
  private pagePdfCanvas?: ElementRef<HTMLCanvasElement>;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.pagePdfCanvas || !this.pagePdf?.pdfPage) {
      return;
    }

    let page = this.pagePdf?.pdfPage;

    const canvas = this.pagePdfCanvas.nativeElement;
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
  }

  select() {
    if (!this.pagePdf) {
      return;
    }

    this.pagePdf.display = !this.pagePdf.display;
  }
}
