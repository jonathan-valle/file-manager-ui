import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-file-password",
  templateUrl: "./file-password.modal.html"
})
export class FilePasswordModal {

  constructor(public ref: DynamicDialogRef) {
  }

  password: string = "";

  unlockPDF() {
    this.ref.close(this.password);
  }

  cancelUnlock() {
    this.ref.close();
  }
}
