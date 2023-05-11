import { Component } from "@angular/core";
import { v4 } from "uuid";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { PdfViewerEvent } from "../../../../shared/modules/pdf-viewer/pdf-viewer-event-bus";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
})
export class BoardComponent {

  files: PdfFile[] = [];
  loadingFiles: string[] = [];

  constructor(private pdfManagerService: PdfManagerService) {
  }

  addFiles($event: File[]) {
    $event.forEach((file) => {
      const uuid = v4();
      this.loadingFiles.push(uuid);
      this.pdfManagerService.loadPdfFile(file, uuid).subscribe((pdfFile: PdfFile) => {
        this.files.push(pdfFile);
        this.pdfLoadFinished(uuid);
      });
    });
  }

  viewerEvents($event: PdfViewerEvent) {
    console.log($event);
  }

  pdfLoadFinished($event: string) {
    this.loadingFiles = this.loadingFiles.filter((uuid) => uuid !== $event);
  }
}
