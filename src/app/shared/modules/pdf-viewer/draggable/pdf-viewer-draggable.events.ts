export interface DraggableDetail {
  /**
   * The source element of the drag event: the dragged element.
   */
  readonly source: Element;

  /**
   * The target element of the drag event (depends on the event type).
   */
  readonly target: Element | null;

  /**
   * The X position of the mouse event.
   */
  readonly clientX: number;

  /**
   * The Y position of the mouse event.
   */
  readonly clientY: number;
}

/**
 * The target is the original element (host)
 */
export interface DraggableStartDetail extends DraggableDetail {

  /**
   * The pointer X position, relative to the source element (from left)
   */
  readonly offsetX: number;

  /**
   * The pointer Y position, relative to the source element (from top)
   */
  readonly offsetY: number;
}

export class DraggableStartEvent extends CustomEvent<DraggableStartDetail> {

  constructor(detail: DraggableStartDetail) {
    super('draggable.start', { detail: detail, bubbles: true });
  }

}

export class DraggableInDragEvent extends CustomEvent<DraggableDetail> {

  constructor(detail: DraggableDetail) {
    super('draggable.dragin', { detail: detail, bubbles: true });
  }

}

export class DraggableDragEvent extends CustomEvent<DraggableDetail> {

  constructor(detail: DraggableDetail) {
    super('draggable.drag', { detail: detail, bubbles: true });
  }

}

export class DraggableOutDragEvent extends CustomEvent<DraggableDetail> {

  constructor(detail: DraggableDetail) {
    super('draggable.dragout', { detail: detail, bubbles: true });
  }

}

/**
 * The target is the drop element (on which the ghost has been dropped).
 */
export interface DraggableEndDetail extends DraggableDetail {
  /**
   * The event data to pass to the target
   */
  readonly data: any;
}

export class DraggableEndEvent extends CustomEvent<DraggableEndDetail> {

  constructor(detail: DraggableEndDetail) {
    super('draggable.end', { detail: detail, bubbles: true });
  }

}
