import { Component } from "@angular/core";
import { v4 } from "uuid";
import { FileUpload } from "../../../../core/model/file-upload.model";

@Component({
  selector: "app-file-merge",
  templateUrl: "./board.component.html"
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
}
