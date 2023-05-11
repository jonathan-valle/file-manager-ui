import { Component } from "@angular/core";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { v4 } from "uuid";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";
import { FileSplitService } from "../../../../core/service/file-split.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-file-merge",
  templateUrl: "./file-split.component.html"
})
export class FileSplitComponent {

  file?: PdfFile;

  constructor(private pdfManagerService: PdfManagerService,
              private fileSplitService: FileSplitService) {
  }

  addFile(file: File[]) {
    const uuid = v4();

    this.pdfManagerService.loadPdfFile(file[0], uuid).subscribe(pdfFile => {
      this.file = pdfFile;
    });
  }

  splitFiles() {
    if (!this.file?.pagesProxy) {
      return;
    }

    this.fileSplitService.splitFiles(this.file?.originalFile!, this.file?.pagesProxy).subscribe(response => {
      saveAs(response, "file-split" + Date.now() + ".zip");
    });
  }

  select(pageUuid: string) {
    if (!this.file?.pagesProxy) {
      return;
    }

    this.file?.pagesProxy.forEach(page => {
      if (page.uuid === pageUuid) {
        page.display = !page.display;
      }
    });
  }
}
