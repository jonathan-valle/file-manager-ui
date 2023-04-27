import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { RemovePasswordRoutingModule } from "./remove-password-routing.module";
import { RemovePasswordComponent } from "./remove-password/remove-password.component";
import { RemovePasswordView } from "./view/remove-password.view";

@NgModule({
  declarations: [
    ...RemovePasswordModule.COMPONENTS_LIST,
    ...RemovePasswordModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    RemovePasswordRoutingModule,
  ]
})
export class RemovePasswordModule {

  /* Module components */
  static COMPONENTS_LIST = [
    RemovePasswordView,
    RemovePasswordComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
