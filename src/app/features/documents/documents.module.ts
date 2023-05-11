import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { DocumentsRoutingModule } from "./documents-routing.module";
import { BoardComponent } from "./component/board/board.component";
import { DocumentsView } from "./view/documents.view";
import { DialogService } from "primeng/dynamicdialog";
import { TranslateModule } from "@ngx-translate/core";
import { DocumentItemComponent } from "./component/document-item/document-item.component";

@NgModule({
  declarations: [
    ...DocumentsModule.COMPONENTS_LIST,
    ...DocumentsModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    DocumentsRoutingModule,
    TranslateModule,
  ],
  providers: [DialogService],
})
export class DocumentsModule {

  /* Module components */
  static COMPONENTS_LIST = [
    DocumentsView,
    BoardComponent,
    DocumentItemComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
