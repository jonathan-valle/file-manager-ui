import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "file-drop",
  templateUrl: "./file-drop.component.html"
})
export class FileDropComponent {

  @Output() filesEmit = new EventEmitter<File[]>();

  onFileChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.filesEmit.next(files);
    }
  }

  drop($event: DragEvent) {
    $event.preventDefault();
    console.log($event);
    let target = $event.dataTransfer as DataTransfer;
    if (target.files) {
      const files = Array.from(target.files);
      this.filesEmit.next(files);
    }
  }

  dragOver($event: DragEvent) {
    $event.preventDefault();
  }
}
