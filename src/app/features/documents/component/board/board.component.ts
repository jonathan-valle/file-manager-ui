import { Component, OnInit, ViewChild } from "@angular/core";
import { v4 } from "uuid";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { PdfViewerEvent } from "../../../../shared/modules/pdf-viewer/pdf-viewer-event-bus";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";
import { PdfViewerComponent } from "../../../../shared/modules/pdf-viewer/pdf-viewer.component";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
})
export class BoardComponent implements OnInit {

  @ViewChild("fileInput") fileInput: any;
  @ViewChild("pdfViewer") pdfViewer?: PdfViewerComponent;

  files: PdfFile[] = [];

  loading = false;

  constructor(private pdfManagerService: PdfManagerService) {
  }

  ngOnInit(): void {
    this.pdfManagerService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  addFiles($event: File[]) {
    $event.forEach((file) => {
      const uuid = v4();
      const randomNumber = Math.floor(Math.random() * (4000 - 500 + 1)) + 2000;
      //const randomNumber = 0;
      console.log("temps de chargement", randomNumber, uuid);
      this.pdfManagerService.fileLoading(uuid);
      setTimeout(() => {
        this.pdfManagerService.loadPdfFile(file, uuid).subscribe((pdfFile: PdfFile) => {
          this.unselectAllFiles();
          pdfFile.selected = true;
          this.files.push(pdfFile);
          this.pdfManagerService.fileLoaded(pdfFile.uuid);
        });
      }, randomNumber);
    });
  }

  viewerEvents($event: PdfViewerEvent) {
    console.log($event);

    if ($event.eventName === "pagesloaded") {
      this.selectedFile.pagesProxy[0].selected = true;
    }

    if ($event.eventName === "pagechanging") {
      this.unselectAllPages();
      this.selectedFile.pagesProxy[$event.data.pageNumber - 1].selected = true;
    }

  }

  onFileChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.addFiles(files);
    }
    this.fileInput.nativeElement.value = "";
  }

  get isFileSelect() {
    return this.files.filter((file) => file.selected).length > 0;
  }

  get selectedFile() {
    return this.files.filter((file) => file.selected)[0];
  }

  private unselectAllFiles() {
    this.files.forEach((file) => file.selected = false);
  }

  private unselectAllPages() {
    this.selectedFile.pagesProxy.forEach((page) => page.selected = false);
  }

  changePage($event: number) {
    this.unselectAllPages();
    this.selectedFile.pagesProxy[$event - 1].selected = true;

    if (!this.pdfViewer?.pdfViewer) return;

    this.pdfViewer.pdfViewer.currentPageNumber = $event;
  }

  selectFile(uuid: string) {
    if (this.selectedFile.uuid !== uuid) {
      this.unselectAllPages();
      this.unselectAllFiles();
      this.files.filter((file) => file.uuid === uuid)[0].selected = true;
    }
  }
}
