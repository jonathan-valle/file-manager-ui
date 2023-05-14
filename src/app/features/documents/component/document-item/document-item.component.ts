import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PdfFile } from "../../../../core/model/pdf-file.model";
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
        overflow: "auto",
        padding: "0 20px 20px 20px"
      })),
      transition("expanded <=> collapsed", animate("300ms linear"))
    ])
  ]
})
export class DocumentItemComponent {

  @Input() file?: PdfFile;
  @Input() index?: number;

  @Output() changePage = new EventEmitter<number>();
  @Output() selectFileUuid = new EventEmitter<string>();

  isCollapsed = true;

  selectPage(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }

  selectFile() {
    // we want to select the file
    if (this.isCollapsed) {
      this.selectFileUuid.emit(this.file?.uuid);
    }

    this.isCollapsed = !this.isCollapsed;
  }
}
