import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Topic } from "../../model/topic.model";

@Injectable({
  providedIn: "root"
})
export class TopicRestService {

  constructor(private http: HttpClient) {
  }

  createTopic(topic: Topic): Observable<void> {
    return this.http.post<void>("/api/topic", topic);
  }

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>("/api/topic");
  }

  getTopic(id: string): Observable<Topic> {
    return this.http.get<Topic>(`/api/topic/${id}`);
  }

}
