import { filter, Subject, takeUntil } from "rxjs";
import {
  AfterContentInit,
  ApplicationRef,
  ContentChildren,
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  QueryList
} from "@angular/core";
import { PdfViewerExtraLayerItemDirective } from "./pdf-viewer-extra-layer-item.directive";
import { PdfViewerComponent } from "../pdf-viewer.component";

@Directive({
  selector: "[pdfViewerExtraLayer]",
})
export class PdfViewerExtraLayerDirective implements OnDestroy, AfterContentInit {

  /**
   * The list of items to display in the extra layer
   */
  @ContentChildren(PdfViewerExtraLayerItemDirective) contentChildren?: QueryList<PdfViewerExtraLayerItemDirective>;

  /**
   * The map of displayed views.
   */
  private embeddedViews = new Map<string, EmbeddedViewRef<any>>;

  /**
   * Called on destroy.
   */
  private destroy$ = new Subject<void>();

  /**
   * PdfViewerComponent is injected through constructor.
   * Directive must be used on a content child of the viewer, or on the viewer itself.
   *
   * @param pdfViewerComponent PdfViewerComponent
   * @param applicationRef ApplicationRef
   */
  constructor(private pdfViewerComponent: PdfViewerComponent,
              private applicationRef: ApplicationRef
  ) {
  }

  /**
   * Once the content is ready, registering to all required events.
   */
  ngAfterContentInit(): void {
    // Displaying existing items
    this.displayItems();

    // Subscribing to content changes
    this.contentChildren?.changes.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.displayItems();
    });

    // Subscribing to page rendering events
    this.pdfViewerComponent.changes.pipe(
      filter(e => e.eventName === "pagerendered"),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.displayItems();
    });

    // Subscribing to pages reload events
    this.pdfViewerComponent.changes.pipe(
      filter(e => e.eventName === "pagesinit" || e.eventName === "scalechanging" || e.eventName === "pagesdestroy"),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.clearEmbeddedViews();
    });
  }

  /**
   * Everything needs to be cleared on destroy
   */
  ngOnDestroy(): void {
    this.clearEmbeddedViews();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Displays the list of items on the layer (if the referenced page exists).
   */
  private displayItems() {
    if (this.contentChildren == null) {
      return;
    }

    // Checking that viewer is ready
    const pdfViewer = this.pdfViewerComponent.pdfViewer;
    if (pdfViewer == null || pdfViewer.viewer == null) {
      return;
    }

    // Looping over all registered children to display them
    const displayedChildIds: string[] = [];
    for (let contentChild of this.contentChildren) {
      // Retrieving page from viewer
      // Attribute '[data-loaded="true"]' is required to ensure that page content has been loaded
      const page = pdfViewer.viewer.querySelector(`.page[data-page-number="${contentChild.page}"][data-loaded="true"]`);

      // No page found: skipping item
      if (page == null) {
        continue;
      }

      // Item should be displayed: adding to displayed list of ids
      displayedChildIds.push(contentChild.id);

      // Item already existing: nothing to do
      if (this.embeddedViews.has(contentChild.id)) {
        continue;
      }

      // Creating embedded view for item
      // Have a look at: https://github.com/angular/angular/issues/42621#issuecomment-894092663
      // TODO: use component factory instead ? This could prevent to set the style properties directly on the root nodes
      const embeddedViewRef = contentChild.templateRef.createEmbeddedView({});
      this.applicationRef.attachView(embeddedViewRef);

      // Adding to map of saved views
      this.embeddedViews.set(contentChild.id, embeddedViewRef);

      // Calculating position: taking into account scale of the viewer
      const left = (contentChild.x || 0) * pdfViewer.currentScale;
      const top = (contentChild.y || 0) * pdfViewer.currentScale;

      // Appending item to page
      for (const rootNode of embeddedViewRef.rootNodes) {
        rootNode.style["position"] = "absolute";
        rootNode.style["left"] = `calc(${left}px * 1)`;
        rootNode.style["top"] = `calc(${top}px * 1)`;
        rootNode.style["z-index"] = "100";
        rootNode.style["transform-origin"] = "top left";
        rootNode.style["transform"] = "scale(" + pdfViewer.currentScale + ")";
        page.appendChild(rootNode);
      }
    }

    // Clearing outdated views
    this.clearEmbeddedViews(displayedChildIds);
  }

  /**
   * Clears all views that are not in the provided list.
   * @param idsToKeep the list of view ids to keep
   */
  private clearEmbeddedViews(idsToKeep: string[] = []) {
    this.embeddedViews.forEach((value, key) => {
      // View still valid: nothing to do
      if (idsToKeep.includes(key)) {
        return;
      }

      // View no longer valid: destroying and removing
      value.destroy();
      this.embeddedViews.delete(key);
    });
  }

}
