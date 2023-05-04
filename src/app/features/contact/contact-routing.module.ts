import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactComponent } from "./contact/contact.component";
import { ContactView } from "./view/contact.view";

const routes: Routes = [
  {
    path: "",
    component: ContactView,
    children: [
      {
        path: "",
        component: ContactComponent,
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
export class ContactRoutingModule {
}
