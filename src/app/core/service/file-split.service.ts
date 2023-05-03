import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileSplitRestService } from "./rest/file-split.rest.service";
import { PagesPdf } from "../model/pages-pdf.model";

@Injectable({
  providedIn: "root"
})
export class FileSplitService {

  constructor(private fileSplitRestService: FileSplitRestService) {
  }

  splitFiles(file: File, pagesPdfs: PagesPdf[]): Observable<Blob> {
    const pages: number[] = pagesPdfs.filter(pagesPdf => {
      return pagesPdf.display
    }).map(pagesPdf => {
      return pagesPdf.pageNumber;
    })
    return this.fileSplitRestService.splitFile(file, pages);
  }
}
