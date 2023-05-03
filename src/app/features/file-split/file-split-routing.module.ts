import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileSplitComponent } from "./component/upload/file-split.component";
import { FileSplitView } from "./view/file-split.view";

const routes: Routes = [
  {
    path: "",
    component: FileSplitView,
    children: [
      {
        path: "",
        component: FileSplitComponent,
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
export class FileSplitRoutingModule {
}
