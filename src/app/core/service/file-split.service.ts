import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileSplitRestService } from "./rest/file-split.rest.service";
import { PdfPage } from "../model/pdf-page.model";

@Injectable({
  providedIn: "root"
})
export class FileSplitService {

  constructor(private fileSplitRestService: FileSplitRestService) {
  }

  splitFiles(file: File, pagesPdfs: PdfPage[]): Observable<Blob> {
    const pages: number[] = pagesPdfs.filter(pagesPdf => {
      return pagesPdf.display
    }).map(pagesPdf => {
      return pagesPdf.pageNumber;
    })
    return this.fileSplitRestService.splitFile(file, pages);
  }
}
