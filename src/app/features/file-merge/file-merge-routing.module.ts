import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileMergeHomeComponent } from "./file-merge-home/file-merge-home.component";
import { FileMergeView } from "./view/file-merge.view";

const routes: Routes = [
  {
    path: '',
    component: FileMergeView,
    children: [
      {
        path: '',
        component: FileMergeHomeComponent,
        pathMatch: 'full'
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
