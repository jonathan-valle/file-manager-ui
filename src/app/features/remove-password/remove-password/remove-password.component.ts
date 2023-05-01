import { Component, ViewChild } from "@angular/core";
import { RemovePasswordService } from "../../../core/service/remove-password.service";
import { FileUpload } from "../../../core/model/file-upload.model";
import { v4 } from "uuid";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
  selector: "app-file-merge-home",
  templateUrl: "./remove-password.component.html"
})
export class RemovePasswordComponent {

  @ViewChild(ConfirmDialog) confirmDialog?: ConfirmDialog;

  files: FileUpload[] = [];
  displayUnlockDialog: boolean = false;
  password: string = "";

  constructor(private removePasswordService: RemovePasswordService,
              private confirmationService: ConfirmationService) {
  }

  addFiles($event: File[]) {
    $event.forEach((file) => {
      this.files.push({
        uuid: v4(),
        file: file
      });
    });
  }

  upload() {
    const formData = new FormData();
    formData.append("file", this.files[0].file);
    formData.append("password", "azedrty");

    // this.removePasswordService.removeSecurity(formData).subscribe(response => {
    //   saveAs(response, "test.pdf");
    // });
  }

  removeFile(uuid: string) {
    this.files = this.files.filter(file => file.uuid !== uuid);
  }

  confirmUnlock() {
    this.confirmationService.confirm({
      header: "Unlock PDF",
      message: "Are you sure you want to remove the password from this PDF?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.displayUnlockDialog = true;
      }
    });
  }

  removeFilePassword($event: string) {
    this.confirmUnlock();
  }
}
