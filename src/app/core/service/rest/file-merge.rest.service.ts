import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PdfFile } from "../../model/pdf-file.model";

@Injectable({
  providedIn: "root"
})
export class FileMergeRestService {

  constructor(private http: HttpClient) {
  }

  mergeFiles(files: PdfFile[]): Observable<Blob> {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("files", file.originalFile);
    }

    return this.http.post("/api/file-merge", formData, {
      responseType: "blob",
      withCredentials: true
    });
  }
}
