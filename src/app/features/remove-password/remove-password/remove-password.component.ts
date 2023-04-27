import { Component } from "@angular/core";
import { RemovePasswordService } from "../../../core/service/remove-password.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-file-merge-home",
  templateUrl: "./remove-password.component.html"
})
export class RemovePasswordComponent {

  files: File[] = [];

  constructor(private removePasswordService: RemovePasswordService) {
  }

  addFiles($event: File[]) {
    this.files.push(...$event);
  }

  upload() {

    console.log("ok")

    const formData = new FormData();
    formData.append("file", this.files[0]);
    formData.append("password", "azedrty");

    this.removePasswordService.removePassword(formData).subscribe(response => {
      saveAs(response, "test.pdf");
    });
  }
}
