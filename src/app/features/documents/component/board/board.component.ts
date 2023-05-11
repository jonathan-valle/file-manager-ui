import { Component } from "@angular/core";
import { v4 } from "uuid";
import { FileUpload } from "../../../../core/model/file-upload.model";
import { PdfViewerEvent } from "../../../../shared/modules/pdf-viewer/pdf-viewer-event-bus";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
})
export class BoardComponent {

  files: FileUpload[] = [];

  addFiles($event: File[]) {
    $event.forEach((file) => {
      const uuid = v4();
      this.files.push({
        uuid: uuid,
        file: file
      });
    });
  }

  viewerEvents($event: PdfViewerEvent) {
    console.log($event);
  }
}
