import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileMergeComponent } from "./component/merge-files/file-merge.component";
import { FileMergeView } from "./view/file-merge.view";

const routes: Routes = [
  {
    path: "",
    component: FileMergeView,
    children: [
      {
        path: "",
        component: FileMergeComponent,
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
export class FileMergeRoutingModule {
}
