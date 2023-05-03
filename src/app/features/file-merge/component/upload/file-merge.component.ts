import { Component } from "@angular/core";
import { saveAs } from "file-saver";
import { FileMergeService } from "../../../../core/service/file-merge.service";
import { v4 } from "uuid";
import { FileUpload } from "../../../../core/model/file-upload.model";
import { DialogService } from "primeng/dynamicdialog";
import { FilePasswordModal } from "../../../../shared/component/file-password/file-password.modal";
import { RemovePasswordService } from "../../../../core/service/remove-password.service";

@Component({
  selector: "app-file-merge",
  templateUrl: "./file-merge.component.html"
})
export class FileMergeComponent {

  files: FileUpload[] = [];
  loadingFiles: string[] = [];
  password: string = "";

  constructor(private fileMergeService: FileMergeService,
              private dialogService: DialogService,
              private removePasswordService: RemovePasswordService) {
  }

  upload() {
    this.fileMergeService.mergeFiles(this.files).subscribe((response) => {
      saveAs(response, "merge-file-" + Date.now() + ".pdf");
    });
  }

  addFiles($event: File[]) {
    $event.forEach((file) => {
      const uuid = v4();
      this.loadingFiles.push(uuid);
      this.files.push({
        uuid: uuid,
        file: file
      });
    });
  }

  removeFile(uuid: string) {
    this.files = this.files.filter((file) => file.uuid !== uuid);
  }

  removeFilePassword(fileId: string) {
    this.dialogService.open(FilePasswordModal, {
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

  removeFilePermissions($event: string) {
    this.unlockPDF($event);
  }


  pdfLoadFinished($event: string) {
    this.loadingFiles = this.loadingFiles.filter((uuid) => uuid !== $event);
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
}
