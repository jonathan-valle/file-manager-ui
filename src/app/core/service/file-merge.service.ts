import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileMergeRestService } from "./rest/file-merge.rest.service";

@Injectable({
  providedIn: "root"
})
export class FileMergeService {

  constructor(private fileMergeRestService: FileMergeRestService) {
  }

  mergeFiles(formData: FormData): Observable<Blob> {
    return this.fileMergeRestService.mergeFiles(formData);
  }
}
