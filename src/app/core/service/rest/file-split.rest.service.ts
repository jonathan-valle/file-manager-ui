import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FileSplitRestService {

  constructor(private http: HttpClient) {
  }

  splitFile(file: File, pages: number[]): Observable<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    for (let i = 0; i < pages.length; i++) {
      formData.append("pageNumbers", pages[i].toString());
    }

    return this.http.post("/api/file-split", formData, {
      responseType: "blob",
      withCredentials: true
    });
  }
}
