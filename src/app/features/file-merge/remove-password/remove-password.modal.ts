import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-file-merge",
  templateUrl: "./remove-password.modal.html"
})
export class RemovePasswordModal {

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
