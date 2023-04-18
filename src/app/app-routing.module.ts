import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainView } from "./core/views/main/main.view";
import { FeaturesView } from "./features/features.view";

const routes: Routes = [
  {
    path: "",
    component: MainView,
    children: [{
      path: "",
      component: FeaturesView,
      children: [
        {
          path: "file-merge",
          loadChildren: () => import("./features/file-merge/file-merge.module").then(m => m.FileMergeModule),
        }
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
