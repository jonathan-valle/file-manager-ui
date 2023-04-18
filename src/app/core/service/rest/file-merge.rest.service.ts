import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FileMergeRestService {

  constructor(private http: HttpClient) {
  }

  mergeFiles(formData: FormData): Observable<Blob> {
    return this.http.post('/api/file-merge', formData, {
      responseType: 'blob'
    });
  }
}
