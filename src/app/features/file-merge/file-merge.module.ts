import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { FileMergeRoutingModule } from "./file-merge-routing.module";
import { FileMergeComponent } from "./component/file-merge.component";
import { FileMergeView } from "./view/file-merge.view";
import { DialogService } from "primeng/dynamicdialog";
import { RemovePasswordModal } from "./remove-password/remove-password.modal";

@NgModule({
  declarations: [
    ...FileMergeModule.COMPONENTS_LIST,
    ...FileMergeModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    FileMergeRoutingModule,
  ],
  providers: [DialogService],
})
export class FileMergeModule {

  /* Module components */
  static COMPONENTS_LIST = [
    FileMergeView,
    FileMergeComponent
  ];

  /* Module modals */
  static MODALS_LIST = [
    RemovePasswordModal
  ];

}
