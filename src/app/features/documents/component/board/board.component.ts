import { Component, OnInit, ViewChild } from "@angular/core";
import { v4 } from "uuid";
import { PdfFile } from "../../../../core/model/pdf-file.model";
import { PdfViewerEvent } from "../../../../shared/modules/pdf-viewer/pdf-viewer-event-bus";
import { PdfManagerService } from "../../../../core/service/pdf-manager.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
})
export class BoardComponent implements OnInit {

  @ViewChild("fileInput") fileInput: any;

  files: PdfFile[] = [];
  selectedFile?: PdfFile;

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
          this.files.push(pdfFile);
          this.selectedFile = pdfFile;
          this.pdfManagerService.fileLoaded(pdfFile.uuid);
        });
      }, randomNumber);
    });
  }

  viewerEvents($event: PdfViewerEvent) {
    console.log($event);

    if ($event.eventName === "pagerender") {
      console.log("pagerender");
    }

    if ($event.eventName === "pagechanging") {
      console.log("pagechanging");
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
}
