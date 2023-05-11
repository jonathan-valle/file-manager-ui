import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileMergeRestService } from "./rest/file-merge.rest.service";
import { PdfFile } from "../model/pdf-file.model";

@Injectable({
  providedIn: "root"
})
export class FileMergeService {

  constructor(private fileMergeRestService: FileMergeRestService) {
  }

  mergeFiles(files: PdfFile[]): Observable<Blob> {
    return this.fileMergeRestService.mergeFiles(files);
  }
}
