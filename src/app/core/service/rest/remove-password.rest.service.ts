import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RemovePasswordRestService {

  constructor(private http: HttpClient) {
  }

  removePassword(formData: FormData): Observable<Blob> {
    return this.http.post("/api/remove-password", formData, {
      responseType: "blob"
    });
  }
}
