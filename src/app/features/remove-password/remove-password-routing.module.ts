import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RemovePasswordComponent } from "./remove-password/remove-password.component";
import { RemovePasswordView } from "./view/remove-password.view";

const routes: Routes = [
  {
    path: "",
    component: RemovePasswordView,
    children: [
      {
        path: "",
        component: RemovePasswordComponent,
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
export class RemovePasswordRoutingModule {
}
