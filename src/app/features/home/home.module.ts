import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home/home.component";
import { HomeView } from "./view/home.view";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ...HomeModule.COMPONENTS_LIST,
    ...HomeModule.MODALS_LIST,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    TranslateModule,
  ]
})
export class HomeModule {

  /* Module components */
  static COMPONENTS_LIST = [
    HomeView,
    HomeComponent
  ];

  /* Module modals */
  static MODALS_LIST = [];

}
