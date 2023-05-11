import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { PdfPage } from "../../../../core/model/pdf-page.model";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-document-item",
  templateUrl: "./document-item.component.html",
  animations: [
    trigger("expandCollapse", [
      state("collapsed", style({
        height: "0px",
        minHeight: "0",
        display: "none",
        overflow: "hidden"
      })),
      state("expanded", style({
        height: "*",
        overflow: "auto"
      })),
      transition("expanded <=> collapsed", animate("300ms linear"))
    ])
  ]
})
export class DocumentItemComponent {

  @Input() file?: PdfFile;
  pagesPdf: PdfPage[] = [];

  @ViewChild("barItemCollapse", {static: false}) barItemCollapse?: ElementRef;
  isCollapsed = true;

}
