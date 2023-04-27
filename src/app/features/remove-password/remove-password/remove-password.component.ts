import { Component } from "@angular/core";

@Component({
  selector: "app-file-merge-home",
  templateUrl: "./remove-password.component.html"
})
export class RemovePasswordComponent {

  files: File[] = [];

  addFiles($event: File[]) {
    this.files.push(...$event);
  }

  upload() {
    
  }
}
