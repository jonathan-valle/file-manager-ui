import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RemovePagesComponent } from "./remove-pages/remove-pages.component";
import { RemovePagesView } from "./view/remove-pages.view";

const routes: Routes = [
  {
    path: "",
    component: RemovePagesView,
    children: [
      {
        path: "",
        component: RemovePagesComponent,
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RemovePagesRoutingModule {
}
