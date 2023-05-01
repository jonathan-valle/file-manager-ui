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
          path: "",
          loadChildren: () => import("./features/home/home.module").then(m => m.HomeModule),
        },
        {
          path: "file-merge",
          loadChildren: () => import("./features/file-merge/file-merge.module").then(m => m.FileMergeModule),
        },
        {
          path: "remove-password",
          loadChildren: () => import("./features/remove-password/remove-password.module").then(m => m.RemovePasswordModule),
        },
        {
          path: "remove-pages",
          loadChildren: () => import("./features/remove-pages/remove-pages.module").then(m => m.RemovePagesModule),
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
