import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { PDFPageProxy } from "pdfjs-dist";

@Component({
  selector: "pdf-page-content",
  templateUrl: "./pdf-page-content.component.html"
})
export class PdfPageContentComponent implements OnChanges {

  @Input() pagePdf?: PDFPageProxy;
  @Input() customWidth: number = 127;

  @ViewChild("pagePdfCanvas", {static: true, read: ElementRef<HTMLCanvasElement>})
  private pagePdfCanvas?: ElementRef<HTMLCanvasElement>;

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.pagePdf || !this.pagePdfCanvas) {
      return;
    }

    let page = this.pagePdf;

    const canvas = this.pagePdfCanvas.nativeElement;
    canvas.width = this.customWidth;
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


}
