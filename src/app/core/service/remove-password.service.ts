import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RemovePasswordRestService } from "./rest/remove-password.rest.service";

@Injectable({
  providedIn: "root"
})
export class RemovePasswordService {

  constructor(private removePasswordRestService: RemovePasswordRestService) {
  }

  removePassword(formData: FormData): Observable<Blob> {
    return this.removePasswordRestService.removePassword(formData);
  }
}
