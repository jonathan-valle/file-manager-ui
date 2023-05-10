import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { from, Subject, Subscription, takeUntil, Unsubscribable } from "rxjs";
import * as PDFJS from "pdfjs-dist";
import { AnnotationMode, PDFDocumentProxy } from "pdfjs-dist";
import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer";
import { GenericL10n, PDFSinglePageViewer } from "pdfjs-dist/web/pdf_viewer";
import { take } from "rxjs/operators";
import { PdfViewerEvent, PdfViewerEventBus } from "./pdf-viewer-event-bus";

/**
 * Component that wraps the PDF.js viewer.
 * All viewer events are translated into Angular outputs.
 */
@Component({
  selector: "pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {

  @Input() blockViewer?: boolean = false;

  @Input() hideToolbar = false;

  @ContentChild("pdfViewerToolbar") toolbar?: TemplateRef<any>;

  /**
   * The EventEmitter used for PDFjs event bus and other types of events.
   */
  @Output() changes: EventEmitter<PdfViewerEvent> = new EventEmitter<PdfViewerEvent>();

  /**
   * PdfViewer Container div
   */
  @ViewChild("pdfViewerContainer", {static: true}) pdfViewerContainer?: ElementRef;

  public pdfViewer?: PDFJSViewer.PDFViewer | PDFSinglePageViewer;

  private _pdfSrc?: string | Blob | Uint8Array;

  private _eventBus?: PdfViewerEventBus;

  private _pdfLinkService?: PDFJSViewer.PDFLinkService;

  private _pdfFindController?: PDFJSViewer.PDFFindController;

  private _pdf?: PDFDocumentProxy;

  private _viewerInitialized = false;

  private _loadingTask?: Subscription;

  private _eventBusSubscription?: Unsubscribable;

  private destroy$ = new Subject<void>();

  private loading: boolean = false;

  constructor() {
    // Set the pdf worker from the assets folder
    PDFJS.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.js";
  }

  /**
   * AfterViewInit is used since we need the ViewChild to be initialized
   */
  ngAfterViewInit() {
    this.setupViewer();
  }

  /**
   * Sets the PDF src.
   *
   * @param pdfSrc the source of the PDF, can be a string or a Blob
   */
  @Input()
  set pdfSrc(pdfSrc: string | Blob | Uint8Array) {
    this.loading = true;
    this._pdfSrc = pdfSrc;

    // Prepare the URL based on the received Source
    const documentUrl = this.getDocumentUrl(this._pdfSrc);
    if (!documentUrl) {
      return;
    }
    this.setupViewer();

    // Start document loading
    if (this._loadingTask) {
      this._loadingTask.unsubscribe();
    }
    const loadingTask = PDFJS.getDocument(documentUrl);
    this._loadingTask = from(loadingTask.promise).pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe({
      next: (pdf: PDFDocumentProxy) => {
        this._pdf = pdf;
        this._pdfLinkService?.setDocument(this._pdf, null);
        this._pdfFindController?.setDocument(this._pdf);
        this.pdfViewer?.setDocument(this._pdf);
        this.loading = false;
        // TODO: should we reset other values too (e.g. page)
      },
      error: (error) => {
        this.changes.next({eventName: "loadingerror", data: error});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this._eventBusSubscription) {
      this._eventBusSubscription.unsubscribe();
    }
  }

  /**
   * Initialize the PDF Viewer, only if it has not been initialized yet.
   */
  private setupViewer() {
    // If viewer is already initialized, ignoring
    if (this._viewerInitialized) {
      return;
    }

    // Checking that viewer container exists
    if (!this.pdfViewerContainer) {
      console.warn("PDFViewer container not defined");
      return;
    }
    const container = this.pdfViewerContainer?.nativeElement;

    // Registering change listeners
    this.registerChangeListeners();

    // Creating Event Bus and piping to changes
    this._eventBus = new PdfViewerEventBus();
    this._eventBusSubscription = this._eventBus.subscribe(this.changes);

    // Creating PDF Link Service, handles URL links within document
    this._pdfLinkService = new PDFJSViewer.PDFLinkService({
      eventBus: this._eventBus,
      externalLinkTarget: PDFJSViewer.LinkTarget.BLANK
    });

    // Creating PDF Find Controller, handles searches within pdf
    this._pdfFindController = new PDFJSViewer.PDFFindController({
      eventBus: this._eventBus,
      linkService: this._pdfLinkService,
      updateMatchesCountOnProgress: true
    });

    // Creating PDF Viewer
    this.pdfViewer = new PDFJSViewer.PDFViewer({
      eventBus: this._eventBus,
      linkService: this._pdfLinkService,
      findController: this._pdfFindController,
      container: container,
      removePageBorders: undefined,
      textLayerMode: undefined,
      l10n: new GenericL10n("en"),
      imageResourcesPath: undefined,
      annotationMode: AnnotationMode.DISABLE,
    });

    // Defining Viewer on PDF Link Service
    this._pdfLinkService.setViewer(this.pdfViewer);
    this._viewerInitialized = true;
    this.changes.emit({eventName: "viewerinitialized"});
  }

  /**
   * Prepared the src to be displayed in case it isn't a URL
   */
  private getDocumentUrl(pdfSrc: string | Blob | Uint8Array): string | undefined {
    // If we received a string we can simply return the URL
    if (typeof pdfSrc === "string") {
      return pdfSrc as string;
    }

    // If we received a Blob we create a URL based on the received blob
    if (pdfSrc instanceof Blob) {
      return URL.createObjectURL(pdfSrc);
    }

    console.warn("Unknown type of pdfSrc", typeof pdfSrc);
    return undefined;
  }

  /**
   * Register any change listener handled by this component.
   */
  private registerChangeListeners() {
    const container = this.pdfViewerContainer?.nativeElement;

    // Creating additional event for bottom reached
    this.changes.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      if (event.eventName === "updateviewarea") {
        if (Math.round(container.scrollTop + container.offsetHeight + 1) >= container.scrollHeight) {
          this.changes.next({eventName: "bottomreached"});
        }
        if (container.scrollTop === 0) {
          this.changes.next({eventName: "topreached"});
        }
      }
    });
  }

  get isLoading() {
    return this.loading;
  }
}
