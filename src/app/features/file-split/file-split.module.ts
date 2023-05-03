import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { FileSplitRoutingModule } from "./file-split-routing.module";
import { FileSplitComponent } from "./component/upload/file-split.component";
import { FileSplitView } from "./view/file-split.view";
import { DialogService } from "primeng/dynamicdialog";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ...FileSplitModule.COMPONENTS_LIST,
    ...FileSplitModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    FileSplitRoutingModule,
    TranslateModule,
  ],
  providers: [DialogService],
})
export class FileSplitModule {

  /* Module components */
  static COMPONENTS_LIST = [
    FileSplitView,
    FileSplitComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
