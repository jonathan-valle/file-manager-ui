import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FileUpload } from "../../model/file-upload.model";

@Injectable({
  providedIn: "root"
})
export class FileMergeRestService {

  constructor(private http: HttpClient) {
  }

  mergeFiles(files: FileUpload[]): Observable<Blob> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("files", file.file);
    }

    return this.http.post("/api/file-merge", formData, {
      responseType: "blob"
    });
  }
}
