import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { FileUpload } from "../../../../core/model/file-upload.model";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";
import { PagesPdf } from "../../../../core/model/pages-pdf.model";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-document-item",
  templateUrl: "./document-item.component.html",
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', position: 'sticky', top: '0' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class DocumentItemComponent implements OnChanges {

  @Input() file?: FileUpload;
  pagesPdf: PagesPdf[] = [];

  @ViewChild("barItemCollapse", {static: false}) barItemCollapse?: ElementRef;
  isCollapsed = true;

  constructor(private pdfManagerService: PdfManagerService) {
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.pdfManagerService.loadPdfPages(this.file?.file!).subscribe(pages => {
      this.pagesPdf = pages;
    });

  }


}
