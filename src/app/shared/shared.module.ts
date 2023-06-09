import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PrimeNgModule } from "./modules/prime-ng.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FaIconsModule } from "./modules/fa-icons.module";
import { FileDropComponent } from "./component/file-drop/file-drop.component";
import { PdfPageContentComponent } from "./component/pdf-page-content/pdf-page-content.component";
import { FilePasswordModal } from "./modal/file-password/file-password.modal";
import { PdfViewerModule } from "./modules/pdf-viewer/pdf-viewer.module";

@NgModule({
  declarations: [
    ...SharedModule.COMPONENTS_LIST,
    ...SharedModule.DIRECTIVE_LIST,
    ...SharedModule.PIPES_LIST,
    ...SharedModule.MODALS_LIST
  ],
  imports: [
    ...SharedModule.MODULES_LIST
  ],
  exports: [
    ...SharedModule.COMPONENTS_LIST,
    ...SharedModule.DIRECTIVE_LIST,
    ...SharedModule.PIPES_LIST,
    ...SharedModule.MODULES_LIST
  ]
})
export class SharedModule {

  /* Shared components */
  static COMPONENTS_LIST = [
    FileDropComponent,
    PdfPageContentComponent
  ];

  /* Shared directive */
  static DIRECTIVE_LIST = [];

  /* Shared pipes */
  static PIPES_LIST = [];

  /* Shared modules */
  static MODULES_LIST = [
    /* Angular modules*/
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    /* App specific modules */
    PrimeNgModule,
    FaIconsModule,
    PdfViewerModule
  ];

  /* Module modals */
  static MODALS_LIST = [
    FilePasswordModal
  ];
}
