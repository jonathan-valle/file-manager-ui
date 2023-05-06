import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { FileUpload } from "../../../../core/model/file-upload.model";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";
import { PagesPdf } from "../../../../core/model/pages-pdf.model";

@Component({
  selector: "app-document-item",
  templateUrl: "./document-item.component.html"
})
export class DocumentItemComponent implements OnChanges {

  @Input() file?: FileUpload;
  pagesPdf: PagesPdf[] = [];

  @ViewChild("barItemCollapse", {static: false}) barItemCollapse?: ElementRef;
  isCollapsed = false;

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
