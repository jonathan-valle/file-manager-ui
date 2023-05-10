import { Directive, HostListener } from "@angular/core";
import { PdfViewerComponent } from "../pdf-viewer.component";
import { DraggableEndEvent, DraggableInDragEvent } from "../draggable/pdf-viewer-draggable.events";

interface Coordinates {
  x: number;
  y: number;
}

interface DroppedPage {
  page: number;
  offsetX: number;
  offsetY: number;
}

@Directive({
  selector: "[pdfViewerDropzone]",
})
export class PdfViewerDropzoneDirective {

  /**
   * PdfViewerComponent is injected through constructor.
   * Directive must be used on a content child of the viewer, or on the viewer itself.
   *
   * @param pdfViewerComponent PdfViewerComponent
   */
  constructor(private pdfViewerComponent: PdfViewerComponent) {
  }

  @HostListener("draggable.dragin", ["$event"])
  public dragin(event: DraggableInDragEvent) {
    const source = event.detail.source as HTMLElement;
    source.style.transformOrigin = "top left";
    source.style.transform = "scale(" + this.pdfViewerComponent.pdfViewer?.currentScale + ")";
  }

  @HostListener("draggable.dragout", ["$event"])
  public dragout(event: DraggableInDragEvent) {
    const source = event.detail.source as HTMLElement;
    source.style.transformOrigin = "center";
    source.style.transform = "none";
  }

  /**
   * Listening for drop events.
   *
   * @param event the drop event is actually a drag event
   */
  @HostListener("draggable.end", ["$event"])
  public dropped(event: DraggableEndEvent) {
    // Page calculation
    const coordinates = this.getRelativeCoordinates(event, this.pdfViewerComponent.pdfViewerContainer?.nativeElement);
    const droppedPage = this.resolveDroppedPage(coordinates);

    // No page found: ignoring
    if (droppedPage == null) {
      return;
    }

    // Coordinates need to be translated into relative coordinates for page (by taking into account current scale)
    // TODO: we need to take into account the getBoundingClientRect() of the dropped element to have (x,y) aligned with (0,0) of the dropped
    const currentScale = this.pdfViewerComponent.pdfViewer?.currentScale || 1;
    const position = {
      x: (coordinates.x - droppedPage.offsetX) / currentScale,
      y: (coordinates.y - droppedPage.offsetY) / currentScale,
      page: droppedPage.page,
      scale: currentScale,
      detail: event.detail.data
    };

    // Emitting dropped event
    this.pdfViewerComponent.changes.next({eventName: "dropped", data: position});
  }

  /**
   * Retrieve the coordinates of the drop event relative to the provided DOM element.
   * Here we use the coordinates relative to the viewer container.
   *
   * @param event the drop event
   * @param referenceElement the reference element
   */
  private getRelativeCoordinates(event: DraggableEndEvent, referenceElement: HTMLElement): Coordinates {
    const rect = referenceElement.getBoundingClientRect();
    return {
      x: event.detail.clientX - rect.left,
      y: event.detail.clientY - rect.top,
    };
  }

  /**
   * Resolving the dropped page based on the drop coordinates.
   *
   * @param coordinates the drop coordinates
   */
  private resolveDroppedPage(coordinates: Coordinates): DroppedPage | undefined {
    // No viewer, no page
    if (this.pdfViewerComponent.pdfViewer == null) {
      return undefined;
    }

    // No location, no page
    const location = this.pdfViewerComponent.pdfViewer._location;
    if (location == null) {
      return undefined;
    }

    // Retrieving scale factor and page height of the top page (first displayed page)
    const topPageNumber = location.pageNumber as number;
    const topPageView = this.pdfViewerComponent.pdfViewer.getPageView(topPageNumber - 1);
    const topPageScaleFactor = topPageView.viewport.scale;
    const topPageHeight = topPageView.height; // scale factor already taken into account

    // Calculating start position (0, 0) of the top page
    const pageStartX = 0 - location.left * topPageScaleFactor;
    let pageStartY = location.top * topPageScaleFactor - topPageHeight;

    // Looping over pages
    const numPages = this.pdfViewerComponent.pdfViewer.pagesCount;
    for (let page = topPageNumber; page <= numPages; page++) {
      // Calculating end position (X, Y) of page
      const pageView = this.pdfViewerComponent.pdfViewer.getPageView(page - 1);
      const pageEndY = pageStartY + pageView.height;  // scale factor already taken into account

      // If coordinates lower than end of page, we found the page
      if (coordinates.y < pageEndY) {
        return {page, offsetX: pageStartX, offsetY: pageStartY};
      }

      // Adjusting start position for next page
      pageStartY = pageEndY;
    }

    // Not found
    return undefined;
  }

}
