import { Injectable } from "@angular/core";
import { QuestionRestService } from "./rest/question-rest.service";

@Injectable({
  providedIn: "root"
})
export class QuestionService {

  constructor(private questionRestService: QuestionRestService) {
  }

}
