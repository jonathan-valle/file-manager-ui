import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileMergeRestService } from "./rest/file-merge.rest.service";
import { FileUpload } from "../model/file-upload.model";

@Injectable({
  providedIn: "root"
})
export class FileMergeService {

  constructor(private fileMergeRestService: FileMergeRestService) {
  }

  mergeFiles(files: FileUpload[]): Observable<Blob> {
    return this.fileMergeRestService.mergeFiles(files);
  }
}
