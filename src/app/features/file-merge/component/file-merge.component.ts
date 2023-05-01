import { Component } from "@angular/core";
import { saveAs } from "file-saver";
import { FileMergeService } from "../../../core/service/file-merge.service";
import { v4 } from "uuid";
import { FileUpload } from "../../../core/model/file-upload.model";
import { DialogService } from "primeng/dynamicdialog";
import { RemovePasswordModal } from "../remove-password/remove-password.modal";
import { RemovePasswordService } from "../../../core/service/remove-password.service";

@Component({
  selector: "app-file-merge",
  templateUrl: "./file-merge.component.html"
})
export class FileMergeComponent {

  constructor(private fileMergeService: FileMergeService,
              private dialogService: DialogService,
              private removePasswordService: RemovePasswordService) {
  }

  files: FileUpload[] = [];
  password: string = "";

  formatBytes(bytes: number | undefined, decimals = 2) {
    if (bytes === 0 || bytes === undefined) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  upload() {
    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files[i];
      formData.append("files", file.file);
    }

    this.fileMergeService.mergeFiles(formData).subscribe((response) => {
      saveAs(response, "test.pdf");
    });
  }

  addFiles($event: File[]) {
    $event.forEach((file) => {
      this.files.push({
        uuid: v4(),
        file: file
      });
    });
  }

  removeFile(uuid: string) {
    this.files = this.files.filter((file) => file.uuid !== uuid);
  }

  removeFilePassword(fileId: string) {
    this.dialogService.open(RemovePasswordModal, {
      header: "Unlock PDF",
      width: "30%",
    }).onClose.subscribe((password) => {
      if (password) {
        this.password = password;
        this.unlockPDF(fileId, password);
        return;
      }

      return;
    });
  }

  private unlockPDF(fileId: string, password?: string) {

    const oldFileIndex = this.files.findIndex((file) => file.uuid === fileId);
    const oldFile = this.files[oldFileIndex];

    if (!oldFile) {
      return;
    }

    this.removePasswordService.removeSecurity(oldFile.file, password).subscribe(response => {
      const oldFileProperties = oldFile.file;
      const oldUUID = oldFile.uuid;
      const newFile = new File([response], oldFileProperties.name, {
        type: oldFileProperties.type,
        lastModified: oldFileProperties.lastModified
      });

      this.files.splice(oldFileIndex, 1, {
        uuid: oldUUID,
        file: newFile
      });
    });
  }

  removeFilePermissions($event: string) {
    this.unlockPDF($event);
  }
}
