import { Directive, Input, TemplateRef } from '@angular/core';
import { v4 as uuidV4 } from 'uuid';

@Directive({
  selector: '[pdfViewerExtraLayerItem]',
})
export class PdfViewerExtraLayerItemDirective {

  @Input() id: string = uuidV4();

  @Input() page?: number;

  @Input() x?: number;

  @Input() y?: number;

  constructor(public templateRef: TemplateRef<any>) {
  }

}
