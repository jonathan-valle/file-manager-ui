import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { FileMergeRoutingModule } from "./file-merge-routing.module";
import { FileMergeHomeComponent } from "./file-merge-home/file-merge-home.component";
import { FileMergeView } from "./view/file-merge.view";
import { PdfPageComponent } from "./pdf-page/pdf-page.component";

@NgModule({
  declarations: [
    ...FileMergeModule.COMPONENTS_LIST,
    ...FileMergeModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    FileMergeRoutingModule,
  ]
})
export class FileMergeModule {

  /* Module components */
  static COMPONENTS_LIST = [
    FileMergeView,
    FileMergeHomeComponent,
    PdfPageComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
