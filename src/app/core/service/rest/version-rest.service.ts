import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class VersionRestService {

  constructor(private http: HttpClient) {
  }

  version(): Observable<string> {
    return this.http.get("/api/version",{ responseType: 'text' });
  }

}
