import { Component, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
  selector: "file-drop",
  templateUrl: "./file-drop.component.html"
})
export class FileDropComponent {

  @Output() addFiles = new EventEmitter<File[]>();

  @ViewChild("fileInput") fileInput: any;

  onFileChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.addFiles.next(files);
    }
    this.fileInput.nativeElement.value = "";
  }

  drop($event: DragEvent) {
    $event.preventDefault();
    console.log($event);
    let target = $event.dataTransfer as DataTransfer;
    if (target.files) {
      const files = Array.from(target.files);
      this.addFiles.next(files);
    }
  }

  dragOver($event: DragEvent) {
    $event.preventDefault();
  }
}
