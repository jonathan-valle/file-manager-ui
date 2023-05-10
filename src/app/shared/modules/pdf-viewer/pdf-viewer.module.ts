import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PdfViewerComponent } from "./pdf-viewer.component";
import { PdfViewerToolbarComponent } from "./toolbar/pdf-viewer-toolbar.component";
import { PdfViewerDropzoneDirective } from "./dropzone/pdf-viewer-dropzone.directive";
import { PdfViewerDraggableDirective } from "./draggable/pdf-viewer-draggable.directive";
import { PdfViewerExtraLayerDirective } from "./extra-layer/pdf-viewer-extra-layer.directive";
import { PdfViewerExtraLayerItemDirective } from "./extra-layer/pdf-viewer-extra-layer-item.directive";

@NgModule({
  declarations: [
    ...PdfViewerModule.COMPONENTS_LIST,
    ...PdfViewerModule.DIRECTIVE_LIST,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ...PdfViewerModule.COMPONENTS_LIST,
    ...PdfViewerModule.DIRECTIVE_LIST
  ]
})
export class PdfViewerModule {

  /* List of declared components */
  static COMPONENTS_LIST = [
    PdfViewerComponent,
    PdfViewerToolbarComponent,
  ]

  /* List of related directive */
  static DIRECTIVE_LIST = [
    PdfViewerDropzoneDirective,
    PdfViewerDraggableDirective,
    PdfViewerExtraLayerDirective,
    PdfViewerExtraLayerItemDirective
  ];

}
