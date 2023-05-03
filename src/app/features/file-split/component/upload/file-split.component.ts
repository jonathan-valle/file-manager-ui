import { Component } from "@angular/core";
import { FileUpload } from "../../../../core/model/file-upload.model";
import { v4 } from "uuid";
import { PagesPdf } from "../../../../core/model/pages-pdf.model";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";
import { FileSplitService } from "../../../../core/service/file-split.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-file-merge",
  templateUrl: "./file-split.component.html"
})
export class FileSplitComponent {

  file?: FileUpload;
  pagesPdf: PagesPdf[] = [];

  constructor(private pdfManagerService: PdfManagerService,
              private fileSplitService: FileSplitService) {
  }

  upload() {

  }

  addFile($event: File[]) {
    this.file = {
      uuid: v4(),
      file: $event[0],
    };

    this.pdfManagerService.loadPdfPages($event[0]).subscribe(pages => {
      this.pagesPdf = pages;
    });
  }

  splitFiles() {
    this.fileSplitService.splitFiles(this.file?.file!, this.pagesPdf).subscribe(response => {
      saveAs(response, "file-split" + Date.now() + ".zip");
    });
  }
}
