import { Component } from "@angular/core";
import { FileMergeService } from "../../../core/service/file-merge.service";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-file-merge-home',
  templateUrl: './file-merge-home.component.html'
})
export class FileMergeHomeComponent {

  constructor(private fileMergeService: FileMergeService) {
  }

  files: File[] = [];

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

  onFileChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    if(target.files) {
      const files = Array.from(target.files);
      this.files.push(...files);
    }
  }

  drop($event: DragEvent) {
    $event.preventDefault();
    console.log($event);
    let target = $event.dataTransfer as DataTransfer;
    if(target.files) {
      const files = Array.from(target.files);
      this.files.push(...files);
    }
  }

  dragOver($event: DragEvent) {
    $event.preventDefault();
  }

  upload() {
    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files[i];
      formData.append('files', file);
    }

    this.fileMergeService.mergeFiles(formData).subscribe((response) => {
      saveAs(response, 'test.pdf');
    });
  }
}
