import { Component } from "@angular/core";
import { saveAs } from "file-saver";
import { FileMergeService } from "../../../../core/service/file-merge.service";
import { v4 } from "uuid";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { DialogService } from "primeng/dynamicdialog";
import { FilePasswordModal } from "../../../../shared/modal/file-password/file-password.modal";
import { RemovePasswordService } from "../../../../core/service/remove-password.service";
import { PdfErrorType } from "../../../../core/model/pdf-error.model";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";

@Component({
  selector: "app-file-merge",
  templateUrl: "./file-merge.component.html"
})
export class FileMergeComponent {

  files: PdfFile[] = [];
  loadingFiles: string[] = [];
  password: string = "";
  isHovered: boolean = false;
  protected readonly PdfErrorType = PdfErrorType;

  constructor(private fileMergeService: FileMergeService,
              private dialogService: DialogService,
              private removePasswordService: RemovePasswordService,
              private pdfManagerService: PdfManagerService) {
  }

  mergeFiles() {
    this.fileMergeService.mergeFiles(this.files).subscribe((response) => {
      saveAs(response, "merge-file-" + Date.now() + ".pdf");
    });
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

    this.removePasswordService.removeSecurity(oldFile.originalFile, password).subscribe(response => {
      const oldFileProperties = oldFile.originalFile;
      const oldUUID = oldFile.uuid;
      const newFile = new File([response], oldFileProperties.name, {
        type: oldFileProperties.type,
        lastModified: oldFileProperties.lastModified
      });

      this.pdfManagerService.loadPdfFile(newFile, oldUUID).subscribe((pdfFile: PdfFile) => {
        this.files.splice(oldFileIndex, 1, pdfFile);
      });
    });
  }

  onButtonHover() {
    this.isHovered = true;
  }

  onButtonLeave() {
    this.isHovered = false;
  }
}
