import { Component, OnInit } from "@angular/core";
import { saveAs } from "file-saver";
import { FileMergeRestService } from "../../../core/service/rest/file-merge.rest.service";

@Component({
  selector: 'app-file-merge-home',
  templateUrl: './file-merge-home.component.html'
})
export class FileMergeHomeComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private fileMergeRestService: FileMergeRestService) {
  }

  files: File[] = [];
  formData = new FormData();
  isLoading: boolean = false;

  UPLOAD_PREVIEW_CLASS = "hover";
  UPLOAD_DRAGOVER_CLASS = "modal-body file-upload";

  previewClass = this.UPLOAD_DRAGOVER_CLASS;

  async upload(): Promise<void> {
    this.setLoading(true);
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files[i];
      this.formData.append('files', file);
    }

    this.fileMergeRestService.mergeFiles(this.formData).subscribe((response) => {
      saveAs(response, 'test.pdf');
    });
    this.setLoading(false);

  }

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.previewClass = this.UPLOAD_PREVIEW_CLASS;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.previewClass = this.UPLOAD_DRAGOVER_CLASS;
  }

  onSelectFiles(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    let files1 = (event.target as HTMLInputElement).files;
    if (files1 !== null) {
      for (let i = 0; i < files1.length; i++) {
        this.files.push(files1[i]);
      }
    }
  }

  drop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let event1 = event as DragEvent;
    let files1 = event1.dataTransfer?.files;

    if (files1 !== undefined) {
      for (let i = 0; i < files1.length; i++) {
        this.files.push(files1[i]);
      }
    }
    this.previewClass = this.UPLOAD_DRAGOVER_CLASS;
  }

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

}
