import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RemovePasswordRestService } from "./rest/remove-password.rest.service";

@Injectable({
  providedIn: "root"
})
export class RemovePasswordService {

  constructor(private removePasswordRestService: RemovePasswordRestService) {
  }

  removeSecurity(file: File, password?: string): Observable<Blob> {
    return this.removePasswordRestService.removeSecurity(file, password);
  }
}
