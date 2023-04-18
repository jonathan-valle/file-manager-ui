import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Question } from "../../model/question.model";
import { v4 } from "uuid";

@Injectable({
  providedIn: "root"
})
export class QuestionRestService {

  constructor(private http: HttpClient) {
  }

  createQuestion(question: Question): Observable<Question> {
    const t: Question = {
      id: v4(),
      questionText: "What is the meaning of life?",
      topic: [],
      answers: [],
      createdBy: "1",
      createdAt: new Date()
    }

    return this.http.post<Question>("/api/questions", t);
  }

}
