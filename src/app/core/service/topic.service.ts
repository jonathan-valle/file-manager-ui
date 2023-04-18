import { Injectable } from "@angular/core";
import { TopicRestService } from "./rest/topic-rest.service";
import { Observable } from "rxjs";
import { Topic } from "../model/topic.model";

@Injectable({
  providedIn: "root"
})
export class TopicService {

  constructor(private topicRestService: TopicRestService) {
  }

  getTopics(): Observable<Topic[]> {
    return this.topicRestService.getTopics();
  }

}
