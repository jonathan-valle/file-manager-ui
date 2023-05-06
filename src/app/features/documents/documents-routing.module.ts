import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardComponent } from "./component/board/board.component";
import { DocumentsView } from "./view/documents.view";

const routes: Routes = [
  {
    path: "",
    component: DocumentsView,
    children: [
      {
        path: "",
        component: BoardComponent,
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
export class DocumentsRoutingModule {
}
