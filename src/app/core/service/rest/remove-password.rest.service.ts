import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RemovePasswordRestService {

  constructor(private http: HttpClient) {
  }

  removeSecurity(file: File, password?: string): Observable<Blob> {
    const formData = new FormData();

    formData.append("file", file);

    if (password) {
      formData.append("password", password);
    }

    return this.http.post("/api/remove-security", formData, {
      responseType: "blob"
    });
  }
}
