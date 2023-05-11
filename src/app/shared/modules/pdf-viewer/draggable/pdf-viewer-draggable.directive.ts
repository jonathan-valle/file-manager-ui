import {
  ApplicationRef,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Host,
  HostListener,
  Input,
  OnInit,
  TemplateRef
} from "@angular/core";
import { Subject, throttleTime } from "rxjs";
import {
  DraggableDragEvent,
  DraggableEndEvent,
  DraggableInDragEvent,
  DraggableOutDragEvent,
  DraggableStartEvent
} from "./pdf-viewer-draggable.events";

type DragState = "IDLE" | "STARTED" | "ONGOING";

@Directive({
  selector: "[pdfViewerDraggable]",
})
export class PdfViewerDraggableDirective implements OnInit {

  @Input() data?: any;

  @ContentChild("pdfViewerDraggableGhost") ghostTemplate?: TemplateRef<any>;

  private state: DragState = "IDLE";

  private draggedElement?: HTMLElement;

  private hoveredElement?: Element;

  private draggedOptions?: {
    offsetX: number,
    offsetY: number
  };

  private ghostView?: EmbeddedViewRef<any>;

  private over$ = new Subject<DraggableDragEvent>();

  constructor(@Host() private host: ElementRef,
              private applicationRef: ApplicationRef) {
  }

  ngOnInit(): void {
    // Adding delay for move events to prevent too much processing
    this.over$.pipe(
      throttleTime(50)
    ).subscribe(event => {
      if (this.state === "ONGOING") {
        this.hoveredElement?.dispatchEvent(event);
      }
    })
  }

  @HostListener("dragstart", ["$event"])
  public swallowNative(event: MouseEvent) {
    // TODO: is this required ?
    //  - also, we should prevent 'click' events, base on 'state'
    //event.preventDefault();
  }

  @HostListener("mousedown", ["$event"])
  public dragStart(event: MouseEvent) {
    this.initDraggedOptions(event);
    this.state = "STARTED";
  }

  @HostListener("document:mousemove", ["$event"])
  public drag(event: MouseEvent) {
    // No 'dragStart' happened: ignoring
    if (this.state == "IDLE") {
      return;
    }
    event.preventDefault();

    // Retrieving current hovered element
    const target = document.elementFromPoint(event.clientX, event.clientY);

    // First move event: creating ghost and dispatching start event
    if (this.state == "STARTED") {
      this.setupDraggedElement();
      const startEvent = new DraggableStartEvent({
        source: this.draggedElement!,
        target: target,
        clientX: event.clientX,
        clientY: event.clientY,
        offsetX: this.draggedOptions!.offsetX,
        offsetY: this.draggedOptions!.offsetY
      });
      target?.dispatchEvent(startEvent);
      this.state = "ONGOING";
    }

    // Hovered element did change
    if (target !== this.hoveredElement) {
      // Previous element notified for 'out'
      if (this.hoveredElement) {
        const outEvent = new DraggableOutDragEvent({
          source: this.draggedElement!,
          target: this.hoveredElement,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        this.hoveredElement.dispatchEvent(outEvent);
      }

      // Overriding with new
      this.hoveredElement = target ? target : undefined;

      // New element notified for 'in'
      if (this.hoveredElement) {
        const inEvent = new DraggableInDragEvent({
          source: this.draggedElement!,
          target: this.hoveredElement,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        this.hoveredElement.dispatchEvent(inEvent);
      }
    }

    this.move(event);

    // Triggering event
    if (this.hoveredElement) {
      const dragEvent = new DraggableDragEvent({
        source: this.draggedElement!,
        target: this.hoveredElement,
        clientX: event.clientX,
        clientY: event.clientY,
      });
      this.over$.next(dragEvent);
    }
  }

  @HostListener("document:mouseup", ["$event"])
  public dragEnd(event: MouseEvent) {
    this.state = "IDLE";
    if (!this.draggedElement) {
      return;
    }

    // Triggering event
    if (this.hoveredElement) {
      const endEvent = new DraggableEndEvent({
        source: this.draggedElement!,
        target: this.hoveredElement,
        clientX: event.clientX - this.draggedElement.offsetWidth / 2,
        clientY: event.clientY - this.draggedElement.offsetHeight / 2,
        data: this.data
      });
      this.hoveredElement.dispatchEvent(endEvent);
    }

    // Cleanup
    this.destroyDraggedElement();
    this.draggedElement = undefined;
    this.hoveredElement = undefined;
    this.draggedOptions = undefined;
  }

  private initDraggedOptions(event: MouseEvent) {
    this.draggedOptions = {
      offsetX: event.clientX - this.host.nativeElement.getBoundingClientRect().left,
      offsetY: event.clientY - this.host.nativeElement.getBoundingClientRect().top,
    };
  }

  private setupDraggedElement() {
    // TODO: should the ghost be a wrapper around the Node ?
    //  - probably yes, so that ghost is always an embedded view managed by Angular (and destroyed on drop)
    //  - can it be a ng-container ? to ensure css rules inheritance
    if (this.ghostTemplate) {
      this.ghostView = this.ghostTemplate.createEmbeddedView({});
      this.applicationRef.attachView(this.ghostView);
      // TODO: do not limit to rootNodes[0] !
      this.draggedElement = this.ghostView.rootNodes[0] as HTMLElement;
    } else {
      this.draggedElement = this.host.nativeElement as HTMLElement;
      this.draggedElement.style.width = this.host.nativeElement.offsetWidth + "px";
      this.draggedElement.style.height = this.host.nativeElement.offsetHeight + "px";
    }
    this.draggedElement.style.position = "fixed";
    this.draggedElement.style.zIndex = "1000";
    this.draggedElement.style.pointerEvents = "none";
    // TODO: pointer events should probably re-enabled after
    this.host.nativeElement.parentNode.insertBefore(this.draggedElement, this.host.nativeElement.nextSibling);

    // Re-calculating offset if ghost element
    if (this.ghostView && this.draggedOptions) {
      this.draggedOptions.offsetX = this.draggedElement.getBoundingClientRect().width / 2;
      this.draggedOptions.offsetY = this.draggedElement.getBoundingClientRect().height / 2;
    }
  }

  private move(event: MouseEvent) {
    if (!this.draggedElement || !this.draggedOptions) {
      return;
    }

    // Repositioning element
    this.draggedElement.style.left = event.pageX - this.draggedOptions.offsetX + "px";
    this.draggedElement.style.top = event.pageY - this.draggedOptions.offsetY + "px";
  }

  private destroyDraggedElement() {
    // No 'ghost' element: nothing to do
    if (this.ghostView == null) {
      return;
    }

    // Removing element and destroying embedded view
    this.draggedElement?.remove();
    this.ghostView.destroy();
    this.ghostView = undefined;
  }

}
