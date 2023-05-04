import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ContactRoutingModule } from "./contact-routing.module";
import { ContactComponent } from "./contact/contact.component";
import { ContactView } from "./view/contact.view";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ...ContactModule.COMPONENTS_LIST,
    ...ContactModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    ContactRoutingModule,
    TranslateModule,
  ]
})
export class ContactModule {

  /* Module components */
  static COMPONENTS_LIST = [
    ContactView,
    ContactComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
