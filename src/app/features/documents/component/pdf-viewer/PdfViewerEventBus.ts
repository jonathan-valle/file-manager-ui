import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer";
import { fromEvent, Observable, Observer, Subject, Subscribable, Unsubscribable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * The wrapper for PDF.js viewer events.
 * Contains the event name and the data.
 */
export interface PdfViewerEvent {
  eventName: string;
  data?: any;
}

/**
 * Observable Event Bus that allows subscribing to all PDF.js events.
 * Extends the base class provided by PDF.js to add the behavior for observables.
 */
export class PdfViewerEventBus extends PDFJSViewer.EventBus implements Subscribable<PdfViewerEvent> {

  private subject = new Subject<PdfViewerEvent>();

  private registrations: Map<string, Observable<PdfViewerEvent>> = new Map<string, Observable<PdfViewerEvent>>();

  /**
   * Overrides the dispatch method to register an event handler if it does not exist yet.
   *
   * @param eventName the event name
   * @param data the event data
   */
  override dispatch(eventName: string, data: Object): void {
    this.register(eventName);
    super.dispatch(eventName, data);
  }

  /**
   * Allows to subscribe to all events provided by PDF.js (and all additional custom events).
   *
   * @param observer the observer
   */
  subscribe(observer: Partial<Observer<PdfViewerEvent>>): Unsubscribable {
    return this.subject.asObservable().subscribe(observer);
  }

  /**
   * Registers a new event handler for the provided event name.
   * If a handler has already been registered, it is ignored.
   *
   * @param eventName the event name
   * @private
   */
  private register(eventName: string): Observable<PdfViewerEvent> {
    // Registration for event already exists: ignoring
    if (this.registrations.has(eventName)) {
      return this.registrations.get(eventName)!;
    }

    // Creating new observable
    const obs$ = fromEvent(this, eventName).pipe(
      map(data => {
        return {eventName, data};
      })
    );

    // Registering reference
    this.registrations.set(eventName, obs$);

    // Piping to subject
    obs$.subscribe(this.subject);

    // Returning observable
    return obs$;
  }

}
