import { Component, OnInit } from "@angular/core";
import { filter, Subject, takeUntil } from "rxjs";
import { PdfViewerComponent } from "../pdf-viewer.component";

@Component({
  selector: "pdf-viewer-toolbar",
  templateUrl: "./pdf-viewer-toolbar.component.html",
  styleUrls: ["./pdf-viewer-toolbar.component.scss"]
})
export class PdfViewerToolbarComponent implements OnInit {

  selectedScale?: string;

  currentPage: number = 0;

  numPages: number = 1;

  blockToolbar = false; // TODO: how to handle that ?

  scales = [
    {name: "Automatic Zoom", value: "auto"},
    {name: "Actual Size", value: "page-actual"},
    {name: "Page Fit", value: "page-fit"},
    {name: "Page Width", value: "page-width"},
    {name: "50%", value: "0.5"},
    {name: "75%", value: "0.75"},
    {name: "100%", value: "1"},
    {name: "150%", value: "1.5"},
    {name: "200%", value: "2"},
    {name: "300%", value: "3"}
  ];

  /**
   * PdfViewerComponent is injected through constructor.
   * Component must be used as a content child of the viewer.
   *
   * @param pdfViewerComponent PdfViewerComponent
   */
  constructor(private pdfViewerComponent: PdfViewerComponent) {
  }

  private destroy$ = new Subject<void>();

  /**
   * Make viewer load the selected page
   * @param value the page to be displayed
   */
  updatePage(value: number) {
    if (!this.pdfViewerComponent || !this.pdfViewerComponent.pdfViewer || value == null) {
      return;
    }
    this.currentPage = this.getValidPageNumber(value);
    this.pdfViewerComponent.pdfViewer.currentPageNumber = this.currentPage;
  }

  /**
   * Update the viewer current page scale.
   * @param value the scale value to be used, can be a predefined string (specified set of string is allowed) or a number.
   */
  updateScale(value: string) {
    if (!this.pdfViewerComponent || !this.pdfViewerComponent.pdfViewer) {
      return;
    }
    this.selectedScale = "" + value;
    this.pdfViewerComponent.pdfViewer.currentScaleValue = this.selectedScale;
  }

  ngOnInit() {
    if (!this.pdfViewerComponent) {
      return;
    }

    // New document was displayed (we can update the different fields)
    this.pdfViewerComponent.changes.pipe(
      filter(event => event.eventName === "pagesinit"),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      // Set default page zoom to 'page-fit' for every document loaded
      this.updatePage(1);
      this.updateScale("1.10");

      if (this.pdfViewerComponent.pdfViewerContainer?.nativeElement?.scrollTop) {
        this.pdfViewerComponent.pdfViewerContainer.nativeElement.scrollTop = 0;
      }
      this.numPages = event.data.source.pdfDocument.numPages;
    });

    // New page is displayed (scroll) we update the input current page
    this.pdfViewerComponent.changes.pipe(
      filter(event => event.eventName === "pagechanging"),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.currentPage = event.data.pageNumber;
    });

    // TODO: handle 'scalechanging' events
  }

  /**
   * Ensures that the entered page number is in range of the displayed document
   * @param page the page number to be displayed
   */
  private getValidPageNumber(page: any): number {
    const pageNumber = parseInt(page);

    // Check for valid number
    if (isNaN(pageNumber)) {
      return 1;
    }

    // Check for lower bound
    if (pageNumber < 1) {
      return 1;
    }

    // Check for higher bound
    if (pageNumber > this.numPages) {
      return this.numPages;
    }

    // Valid value
    return pageNumber;
  }

}
