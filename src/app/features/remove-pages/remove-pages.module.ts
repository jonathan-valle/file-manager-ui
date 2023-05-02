import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { RemovePagesRoutingModule } from "./remove-pages-routing.module";
import { RemovePagesComponent } from "./remove-pages/remove-pages.component";
import { RemovePagesView } from "./view/remove-pages.view";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ...RemovePagesModule.COMPONENTS_LIST,
    ...RemovePagesModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    RemovePagesRoutingModule,
    TranslateModule,
  ]
})
export class RemovePagesModule {

  /* Module components */
  static COMPONENTS_LIST = [
    RemovePagesView,
    RemovePagesComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
